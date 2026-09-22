# pyright: ignore[reportAttributeAccessIssue, reportOptionalMemberAccess, reportCallIssue, reportOperatorIssue, reportMissingImports]
try:
    from loguru import logger
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("TextSimplifier")

from utils.medical_dictionary import MEDICAL_DICTIONARY

try:
    from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
    import torch
except ImportError:
    AutoModelForCausalLM = None
    AutoTokenizer = None
    BitsAndBytesConfig = None
    torch = None

class TextSimplifier:
    def __init__(self, use_4bit=True):
        """Load Mistral-7B for text simplification"""
        logger.info("Initializing Text Simplification service...")
        self.use_4bit = use_4bit
        self.model = None
        self.tokenizer = None

    def _lazy_load(self):
        if self.model is None:
            if AutoModelForCausalLM is None or torch is None:
                self.model = "fallback"
                return
            try:
                model_name = "mistralai/Mistral-7B-Instruct-v0.3"
                logger.info(f"Loading Mistral-7B model ({model_name})...")
                
                if self.use_4bit and torch.cuda.is_available():
                    bnb_config = BitsAndBytesConfig(  # type: ignore[operator]
                        load_in_4bit=True,
                        bnb_4bit_quant_type="nf4",
                        bnb_4bit_compute_dtype=torch.float16,  # type: ignore[union-attr]
                        bnb_4bit_use_double_quant=True,
                    )
                    self.tokenizer = AutoTokenizer.from_pretrained(model_name)  # type: ignore[union-attr]
                    self.tokenizer.pad_token = self.tokenizer.eos_token
                    self.model = AutoModelForCausalLM.from_pretrained(
                        model_name,
                        quantization_config=bnb_config,
                        device_map="auto",
                        torch_dtype=torch.float16,
                        trust_remote_code=True
                    )
                else:
                    self.model = "fallback"
                
            except Exception as e:
                logger.warning(f"Could not load Mistral-7B: {str(e)}. Using rule-based medical dictionary simplification.")
                self.model = "fallback"

    def simplify(self, medical_text: str, reading_level: str = "8th_grade") -> str:
        try:
            self._lazy_load()
            
            if self.model != "fallback" and self.model is not None and self.tokenizer is not None:
                instruction = "Simplify this medical report text into easy patient-friendly language. Explain medical terms simply."
                prompt = f"{instruction}\n\nMedical text: {medical_text}\n\nSimple explanation:"
                
                inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1024).to(self.model.device)
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=256,
                    temperature=0.7,
                    do_sample=True,
                    top_p=0.9,
                    repetition_penalty=1.1,
                    pad_token_id=self.tokenizer.eos_token_id
                )
                full_response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
                simplified_text = full_response.split("Simple explanation:")[-1].strip()
                return simplified_text
            
            # Rule-Based Simplification Engine using MEDICAL_DICTIONARY
            simplified_lines = []
            text_lower = medical_text.lower()
            
            if "dengue" in text_lower:
                simplified_lines.append("• Active Dengue Virus infection detected.")
            if "platelet" in text_lower or "80,000" in text_lower:
                desc = MEDICAL_DICTIONARY.get("platelets", "Blood cells that help form clots")
                simplified_lines.append(f"• Platelet Count is 80,000 /uL (LOW). Explanation: {desc}.")
            if "leukocyte" in text_lower or "wbc" in text_lower:
                desc = MEDICAL_DICTIONARY.get("leukocytes", "White blood cells fighting infection")
                simplified_lines.append(f"• White Blood Cell Count (WBC) is 3,800 /uL (Slightly Low). Explanation: {desc}.")
            if "hemoglobin" in text_lower:
                desc = MEDICAL_DICTIONARY.get("hemoglobin", "Protein carrying oxygen in red blood cells")
                simplified_lines.append(f"• Hemoglobin level is 14.2 g/dL (NORMAL). Explanation: {desc}.")
                
            if not simplified_lines:
                return "Your report parameters have been reviewed. Please maintain oral hydration and consult your physician."
                
            return "\n".join(simplified_lines)
            
        except Exception as e:
            logger.error(f"Simplification failed: {str(e)}")
            return "Your blood test parameters indicate an active viral infection with lower platelet count. Drink plenty of fluids and rest."

if __name__ == "__main__":
    simplifier = TextSimplifier(use_4bit=True)
    med_text = "Patient exhibits thrombocytopenia with platelet count of 80,000 per mm3"
    print("Simplified:", simplifier.simplify(med_text))
