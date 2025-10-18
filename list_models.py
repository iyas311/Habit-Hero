import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env if present
load_dotenv()

# Configure the API key from environment variable
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError(
        "GEMINI_API_KEY not found. Set it in your environment or .env file."
    )

genai.configure(api_key=api_key)

try:
    # List all available models
    print("Available models:")
    for model in genai.list_models():
        if 'generateContent' in getattr(model, 'supported_generation_methods', []):
            print(f"- {model.name}")
except Exception as e:
    print(f"Error listing models: {e}")
