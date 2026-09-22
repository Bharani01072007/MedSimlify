"""
Rule-based Medical Term Simplification Dictionary
Used for fast lookup and fallback simplification.
"""

MEDICAL_DICTIONARY = {
    "platelets": "Blood cells that help your body form clots to stop bleeding",
    "platelet count": "Number of blood clotting cells in your body",
    "thrombocytopenia": "Low platelet count, which increases bleeding risk",
    "leukocytes": "White blood cells that fight infections",
    "leukocytosis": "Elevated white blood cells indicating active infection or inflammation",
    "leukopenia": "Low white blood cells, reducing ability to fight infections",
    "hemoglobin": "Protein in red blood cells that carries oxygen throughout your body",
    "anemia": "Low red blood cells or hemoglobin, leading to fatigue and weakness",
    "dengue ns1 antigen": "Test parameter checking for active Dengue virus infection",
    "sgpt": "Liver enzyme test (ALT) checking liver cell health",
    "sgot": "Liver enzyme test (AST) checking liver cell health",
    "creatinine": "Waste product filtered by kidneys; elevated levels signal kidney stress",
    "hba1c": "Average blood sugar level over the past 2 to 3 months",
    "hyperglycemia": "High blood sugar level",
    "hypoglycemia": "Low blood sugar level",
    "hypertension": "High blood pressure",
    "tsh": "Thyroid Stimulating Hormone regulating body metabolism",
    "erythrocytes": "Red blood cells that deliver oxygen to your body tissues",
    "hematocrit": "Percentage of red blood cells in your bloodstream",
    "pcv": "Packed Cell Volume measuring red blood cell density",
    "blood urea nitrogen": "Waste product from protein breakdown filtered by kidneys",
    "bun": "Blood Urea Nitrogen checking kidney function",
    "triglycerides": "Type of fat (lipid) found in your blood"
}

HINDI_DICTIONARY = {
    "Dengue Test: POSITIVE": "डेंगी टेस्ट: पॉजिटिव (सक्रिय संक्रमण)",
    "Platelet Count": "प्लेटलेट काउंट (रक्त का थक्का जमाने वाली कोशिकाएं)",
    "Low": "कम (चिंताजनक)",
    "Normal": "सामान्य",
    "High": "अधिक",
    "Critical": "गंभीर स्थिति",
    "Action Checklist": "सावधानी और आवश्यक कदम",
    "Drink plenty of fluids (ORSL, coconut water, water).": "प्रचुर मात्रा में तरल पदार्थ (ओआरएस, नारियल पानी, पानी) पिएं।",
    "Take complete bed rest.": "पूर्ण बिस्तर विश्राम करें।",
    "Monitor platelet count daily.": "दैनिक आधार पर प्लेटलेट काउंट की निगरानी करें।",
    "Avoid NSAIDs like Ibuprofen/Aspirin. Only take Paracetamol if prescribed.": "इबुप्रोफेन/एस्पिरिन जैसी दवाओं से बचें। केवल डॉक्टर द्वारा बताई गई पैरासिटामोल लें।",
    "Warning Signs": "आपातकालीन चेतावनी के लक्षण"
}

TAMIL_DICTIONARY = {
    "Dengue Test: POSITIVE": "டெங்கு சோதனை: பாசிட்டிவ் (பாதிப்பு உள்ளது)",
    "Platelet Count": "பிளேட்லெட் எண்ணிக்கை (இரத்தம் உறைதல் செல்கள்)",
    "Low": "குறைவு (கவனம் தேவை)",
    "Normal": "சாதாரண நிலை",
    "High": "அதிகம்",
    "Critical": "அவசர நிலை",
    "Action Checklist": "செய்ய வேண்டிய நடவடிக்கைகள்",
    "Drink plenty of fluids (ORSL, coconut water, water).": "அதிகளவு திரவ உணவுகளை (ORS, இளநீர், தண்ணீர்) அருந்தவும்.",
    "Take complete bed rest.": "முழுமையான ஓய்வு எடுக்கவும்.",
    "Monitor platelet count daily.": "தினமும் பிளேட்லெட் எண்ணிக்கையைக் கண்காணிக்கவும்."
}

TELUGU_DICTIONARY = {
    "Dengue Test: POSITIVE": "డెంగ్యూ టెస్ట్: పాజిటివ్ (ఇన్ఫెక్షన్ ఉంది)",
    "Platelet Count": "ప్లేట్‌లెట్స్ సంఖ్య (రక్తం గడ్డకట్టే కణాలు)",
    "Low": "తక్కువ (జాగ్రత్త అవసరం)",
    "Normal": "సాధారణం",
    "High": "ఎక్కువ",
    "Critical": "తీవ్రమైనది",
    "Action Checklist": "చేయవలసిన జాగ్రత్తలు",
    "Drink plenty of fluids (ORSL, coconut water, water).": "సరిపడా ద్రవాలు (ORS, కొబ్బరి నీళ్ళు, మంచి నీళ్ళు) తీసుకోండి."
}
