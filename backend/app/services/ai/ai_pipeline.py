import re
import os
import json
from typing import Dict, Any, List, Optional
from services.ai_pipeline import ai_pipeline as core_ai_pipeline

class AIPipeline:
    def __init__(self):
        self.medical_dictionary = core_ai_pipeline.medical_dictionary if hasattr(core_ai_pipeline, 'medical_dictionary') else {}

    def process_document(self, raw_text: str = '', file_path: Optional[str] = None, filename: Optional[str] = None, language: str = 'en', **kwargs) -> Dict[str, Any]:
        doc_type = self._classify_document(raw_text) if raw_text else 'lab_report'
        extracted_entities = core_ai_pipeline.extract_medical_entities(raw_text) if raw_text else []
        simplified = core_ai_pipeline.simplify_report(raw_text) if raw_text else {}

        test_tables = []
        abnormal_findings = []
        for e in extracted_entities:
            ent = e.get('entity', 'Test')
            val = e.get('value', 'N/A')
            ref = e.get('reference', 'Standard')
            st = e.get('status', 'Normal')
            
            test_tables.append({
                'parameter': ent,
                'value': val,
                'range': ref,
                'flag': f'{st}' if st in ['High', 'Low', 'Critical'] else f'{st}'
            })
            if st in ['High', 'Low', 'Critical']:
                abnormal_findings.append({
                    'test': ent,
                    'value': val,
                    'normal_range': ref,
                    'status': f'{st.upper()}',
                    'explanation': f'{ent} is {st.lower()} compared to reference range {ref}.'
                })

        extracted_data = {
            'all_entities': extracted_entities,
            'entities': extracted_entities,
            'abnormal_findings': abnormal_findings,
            'test_tables': test_tables
        }

        return {
            'doc_type': doc_type,
            'raw_text': raw_text,
            'extracted_data': extracted_data,
            'simplified_summary': simplified
        }

    def _classify_document(self, text: str) -> str:
        text_lower = text.lower()
        if 'prescription' in text_lower or 'tds' in text_lower or 'rx' in text_lower:
            return 'prescription'
        elif 'discharge summary' in text_lower or 'hospital admission' in text_lower:
            return 'discharge_summary'
        elif 'x-ray' in text_lower or 'ct scan' in text_lower or 'mri' in text_lower or 'radiology' in text_lower:
            return 'radiology_report'
        else:
            return 'lab_report'

    def _extract_entities(self, text: str, doc_type: str) -> Dict[str, Any]:
        res = self.process_document(raw_text=text)
        return res['extracted_data']

    def _generate_simplified_summary(self, text: str, doc_type: str, extracted_data: Dict[str, Any]) -> Dict[str, Any]:
        return core_ai_pipeline.simplify_report(text)

    def translate_text(self, text: str, target_lang: str = 'hi') -> str:
        return core_ai_pipeline.translate_text(text, target_lang=target_lang)

ai_pipeline = AIPipeline()
