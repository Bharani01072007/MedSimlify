from transformers import AutoModel, AutoTokenizer

try:
    from loguru import logger
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("download_models")  # type: ignore[assignment]

models = [
    "facebook/bart-large-mnli",
    "genzeonplatform/healthcare-brain-clinical-findings-ner",
    "mistralai/Mistral-7B-Instruct-v0.3",
    "Helsinki-NLP/opus-mt-en-hi",
    "Helsinki-NLP/opus-mt-en-ta"
]

print("Downloading Hugging Face AI models... This may take 10-15 minutes on first run.")

for model_name in models:
    try:
        print(f"Downloading {model_name}...")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModel.from_pretrained(model_name)
        print(f"✅ {model_name} downloaded successfully!")
    except Exception as e:
        print(f"⚠️ Notice: {model_name} download step skipped or deferred ({str(e)})")

print("\n✅ Model initialization step complete!")
