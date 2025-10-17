# 🔄 AI Retry Logic Documentation

This document explains the retry mechanism implemented for AI API calls to handle failures gracefully.

## Overview

The AI service includes intelligent retry logic with exponential backoff to handle:
- **503 Service Unavailable** - API temporarily down
- **429 Rate Limit Exceeded** - Too many requests
- **Timeout Errors** - Request took too long
- **Network Issues** - Connection problems

## Configuration

### Default Settings

```python
self.max_retries = 3        # Maximum number of retry attempts
self.retry_delay = 2        # Initial delay in seconds
```

### Exponential Backoff

The retry delay increases exponentially:
- **Attempt 1**: 2 seconds
- **Attempt 2**: 4 seconds (2 × 2^1)
- **Attempt 3**: 8 seconds (2 × 2^2)

## How It Works

### Retry Flow

```
┌─────────────────────────────────────────┐
│   AI Request (Attempt 1)                │
└─────────────────┬───────────────────────┘
                  │
                  ├─── Success ──→ Return Response
                  │
                  └─── Failure
                        │
                        ├─── 503/429/Timeout?
                        │    │
                        │    ├─── Yes ──→ Wait 2s ──→ Retry (Attempt 2)
                        │    │                              │
                        │    │                              ├─── Success ──→ Return
                        │    │                              │
                        │    │                              └─── Failure
                        │    │                                    │
                        │    │                                    └─── Wait 4s ──→ Retry (Attempt 3)
                        │    │                                              │
                        │    │                                              ├─── Success ──→ Return
                        │    │                                              │
                        │    │                                              └─── Failure ──→ Fallback
                        │    │
                        │    └─── No ──→ Raise Exception
                        │
                        └─── Other Error ──→ Raise Exception
```

## Implementation

### Core Retry Method

```python
def _generate_with_retry(self, prompt: str, retries: int = None, delay: int = None):
    """
    Generate content with retry logic for handling API failures
    
    Args:
        prompt: The prompt to send to Gemini
        retries: Number of retry attempts (default: self.max_retries)
        delay: Delay between retries in seconds (default: self.retry_delay)
        
    Returns:
        Response from Gemini API
        
    Raises:
        Exception: If all retries fail
    """
    retries = retries or self.max_retries
    delay = delay or self.retry_delay
    
    for attempt in range(retries):
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            return response
            
        except httpx.HTTPStatusError as e:
            # Handle HTTP errors with retry
            if e.response.status_code in [503, 429]:
                if attempt < retries - 1:
                    wait_time = delay * (2 ** attempt)  # Exponential backoff
                    time.sleep(wait_time)
                    continue
            raise e
            
        except httpx.TimeoutException as e:
            # Handle timeouts with retry
            if attempt < retries - 1:
                wait_time = delay * (2 ** attempt)
                time.sleep(wait_time)
                continue
            raise e
```

### Usage in Methods

All AI generation methods use the retry logic:

```python
# Habit suggestions
response = self._generate_with_retry(prompt)

# Habit analysis
response = self._generate_with_retry(prompt)

# Category suggestions
response = ai_service._generate_with_retry(prompt)
```

## Error Handling

### HTTP Status Codes

| Code | Description | Action |
|------|-------------|--------|
| 503 | Service Unavailable | Retry with exponential backoff |
| 429 | Rate Limit Exceeded | Retry with exponential backoff |
| 4xx | Client Error | Raise immediately (no retry) |
| 5xx | Server Error | Retry with exponential backoff |

### Timeout Errors

```python
except httpx.TimeoutException as e:
    # Retry with exponential backoff
    if attempt < retries - 1:
        wait_time = delay * (2 ** attempt)
        time.sleep(wait_time)
        continue
```

### Fallback Mechanism

If all retries fail, the service returns fallback data:

```python
except Exception as e:
    self.logger.error(f"Error generating habit suggestions: {str(e)}")
    return self._get_fallback_suggestions()
```

## Logging

### Log Messages

The retry logic provides detailed logging:

```
INFO: AI request attempt 1/3
WARNING: Service unavailable (503) on attempt 1/3
INFO: Retrying in 2 seconds...
INFO: AI request attempt 2/3
INFO: AI request successful on attempt 2
INFO: Generated 1 habit suggestions
```

### Log Levels

- **INFO**: Successful requests, retry attempts
- **WARNING**: Retryable errors (503, 429, timeout)
- **ERROR**: Non-retryable errors, all retries failed

## Configuration Options

### Custom Retry Settings

You can customize retry behavior per request:

```python
# Custom retries and delay
response = self._generate_with_retry(
    prompt=prompt,
    retries=5,      # Try 5 times instead of 3
    delay=1         # Start with 1 second delay
)
```

### Exponential Backoff Formula

```python
wait_time = delay * (2 ** attempt)
```

**Examples:**
- Attempt 0: 2 × 2^0 = 2 seconds
- Attempt 1: 2 × 2^1 = 4 seconds
- Attempt 2: 2 × 2^2 = 8 seconds
- Attempt 3: 2 × 2^3 = 16 seconds

## Best Practices

### ✅ DO

- Use retry logic for all external API calls
- Log retry attempts for debugging
- Implement exponential backoff to avoid overwhelming the API
- Provide fallback responses when all retries fail
- Handle different error types appropriately

### ❌ DON'T

- Retry indefinitely (always set a max)
- Use fixed delays (exponential backoff is better)
- Retry on client errors (4xx codes)
- Ignore timeout errors
- Skip logging retry attempts

## Testing Retry Logic

### Simulating Failures

```python
# Test with mock failures
def test_retry_on_503():
    # Mock API to return 503 twice, then succeed
    with patch('httpx.Client.post') as mock_post:
        mock_post.side_effect = [
            httpx.HTTPStatusError(response=Mock(status_code=503)),
            httpx.HTTPStatusError(response=Mock(status_code=503)),
            Mock(text='{"suggestions": []}')
        ]
        
        result = ai_service.generate_habit_suggestions([])
        assert len(result) > 0
        assert mock_post.call_count == 3
```

### Manual Testing

```bash
# Run the backend
python app.py

# Make a request
curl -X POST http://127.0.0.1:5000/ai/suggestions \
  -H "Content-Type: application/json" \
  -d '{"goals": "test"}'

# Check logs for retry messages
```

## Performance Impact

### Timing Examples

**Scenario 1: Success on first try**
- Total time: ~2 seconds (API response time)

**Scenario 2: Success on second try (503 error)**
- Attempt 1: Fail + 2s wait
- Attempt 2: Success
- Total time: ~4 seconds

**Scenario 3: Success on third try (503 errors)**
- Attempt 1: Fail + 2s wait
- Attempt 2: Fail + 4s wait
- Attempt 3: Success
- Total time: ~8 seconds

**Scenario 4: All retries fail**
- Attempt 1: Fail + 2s wait
- Attempt 2: Fail + 4s wait
- Attempt 3: Fail
- Fallback response returned
- Total time: ~8 seconds

## Monitoring

### Key Metrics to Track

1. **Retry Rate**: % of requests that needed retries
2. **Success Rate**: % of requests that eventually succeeded
3. **Fallback Rate**: % of requests that used fallback data
4. **Average Retry Count**: Average retries per request
5. **Total Request Time**: Including retry delays

### Example Monitoring Code

```python
class AIServiceWithMetrics(AIService):
    def __init__(self):
        super().__init__()
        self.metrics = {
            'total_requests': 0,
            'successful_requests': 0,
            'retried_requests': 0,
            'fallback_requests': 0
        }
    
    def _generate_with_retry(self, prompt, retries=None, delay=None):
        self.metrics['total_requests'] += 1
        
        try:
            response = super()._generate_with_retry(prompt, retries, delay)
            self.metrics['successful_requests'] += 1
            return response
        except Exception:
            self.metrics['fallback_requests'] += 1
            raise
```

## Troubleshooting

### High Retry Rate

**Possible causes:**
- API experiencing issues
- Rate limits too low
- Network connectivity problems
- Invalid API key

**Solutions:**
- Check API status page
- Increase retry delay
- Verify API key is valid
- Check network connection

### All Retries Failing

**Possible causes:**
- API completely down
- Invalid API key
- Firewall blocking requests
- Incorrect API endpoint

**Solutions:**
- Check [Google AI Studio](https://makersuite.google.com/app/apikey)
- Verify GEMINI_API_KEY in .env
- Check firewall settings
- Review error logs

## Future Improvements

Potential enhancements:

1. **Adaptive Retry Delays**: Adjust based on response headers
2. **Circuit Breaker**: Stop retrying if API is consistently down
3. **Request Queuing**: Queue requests during high load
4. **Caching**: Cache responses to reduce API calls
5. **Metrics Dashboard**: Real-time monitoring of retry statistics

## References

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [httpx Documentation](https://www.python-httpx.org/)
- [Exponential Backoff Algorithm](https://en.wikipedia.org/wiki/Exponential_backoff)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)

---

**Last Updated:** 2025-10-17  
**Version:** 1.0
