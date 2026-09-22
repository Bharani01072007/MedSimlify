# pyright: ignore[reportAttributeAccessIssue, reportOptionalMemberAccess, reportCallIssue, reportMissingImports]
try:
    from loguru import logger
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("MedicalTranslator")

from utils.medical_dictionary import HINDI_DICTIONARY, TAMIL_DICTIONARY, TELUGU_DICTIONARY

try:
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
    import torch
except ImportError:
    AutoTokenizer = None
    AutoModelForSeq2SeqLM = None
    torch = None

class MedicalTranslator:
    def __init__(self, target_language="hi"):
        """Load translation model for Hindi/regional languages"""
        logger.info(f"Initializing translation service for target language: {target_language}...")
        self.target_language = target_language
        self.tokenizer = None
        self.model = None

    def _lazy_load(self):
        if self.model is None:
            if AutoTokenizer is None or torch is None:
                self.model = "fallback"
                return
            try:
                language_models = {
                    "hi": "Helsinki-NLP/opus-mt-en-hi",
                    "ta": "Helsinki-NLP/opus-mt-en-ta",
                    "te": "Helsinki-NLP/opus-mt-en-te"
                }
                model_name = language_models.get(self.target_language, "Helsinki-NLP/opus-mt-en-hi")
                logger.info(f"Loading translation model ({model_name})...")
                self.tokenizer = AutoTokenizer.from_pretrained(model_name)  # type: ignore[union-attr]
                self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)  # type: ignore[union-attr]
                logger.info(f"✅ Translation model loaded for {self.target_language}!")
            except Exception as e:
                logger.warning(f"Could not load Hugging Face translation model: {str(e)}. Using medical dictionary translation fallback.")
                self.model = "fallback"

    def translate(self, text: str) -> str:
        try:
            self._lazy_load()
            
            if self.model != "fallback" and self.model is not None and self.tokenizer is not None:
                inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
                outputs = self.model.generate(**inputs, max_length=200, num_beams=4, early_stopping=True)
                translated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
                return translated_text

            # Dictionary Translation Fallback
            if self.target_language == "hi":
                dict_map = HINDI_DICTIONARY
            elif self.target_language == "ta":
                dict_map = TAMIL_DICTIONARY
            elif self.target_language == "te":
                dict_map = TELUGU_DICTIONARY
            else:
                return text

            translated_lines = []
            for line in text.split("\n"):
                line_str = line.strip()
                if not line_str:
                    continue
                matched = False
                for k, v in dict_map.items():
                    if k.lower() in line_str.lower():
                        translated_lines.append(v)
                        matched = True
                        break
                if not matched:
                    translated_lines.append(f"[{self.target_language.upper()}]: {line_str}")
                    
            return "\n".join(translated_lines)

        except Exception as e:
            logger.error(f"Translation failed: {str(e)}")
            return text

if __name__ == "__main__":
    translator = MedicalTranslator(target_language="hi")
    eng_text = "Dengue Test: POSITIVE\nPlatelet Count: Low"
    print("Hindi:", translator.translate(eng_text))
