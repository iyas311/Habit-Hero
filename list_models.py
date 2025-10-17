import google.generativeai as genai

# Configure the API key
genai.configure(api_key="AIzaSyAaJZ4TXuU67KKR9AO7ncupRqffRzBBuhU")

try:
    # List all available models
    print("Available models:")
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"- {model.name}")
except Exception as e:
    print(f"Error listing models: {e}")
