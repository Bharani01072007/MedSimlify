import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Bell, CheckCircle2, Download, Globe, Phone, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader, PhoneFrame, Screen, SectionTitle } from "@/components/app-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fullReportRows, importantFindings, patient, warningSigns, whatToDo } from "@/lib/medsimplify-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your blood test, explained — MedSimplify" },
      { name: "description", content: "A plain-language summary of your blood test: key findings, what to do next and warning signs to watch for." },
      { property: "og:title", content: "Your blood test, explained — MedSimplify" },
      { property: "og:description", content: "Key findings, next steps and warning signs in simple words." },
    ],
  }),
  component: ResultsScreen,
});

const toneClass = {
  danger: "border-destructive/40 bg-destructive/5",
  warning: "border-warning/50 bg-warning/10",
  good: "border-success/40 bg-success/5",
};

const LANGUAGES = [
  { code: "en", label: "🇬🇧 English", langTag: "en-US" },
  { code: "tanglish", label: "🇮🇳 Tanglish (தமிழ்-English)", langTag: "ta-IN" },
  { code: "hi", label: "🇮🇳 हिन्दी (Hindi)", langTag: "hi-IN" },
  { code: "ta", label: "🇮🇳 தமிழ் (Tamil)", langTag: "ta-IN" },
  { code: "te", label: "🇮🇳 తెలుగు (Telugu)", langTag: "te-IN" },
  { code: "es", label: "🇪🇸 Español (Spanish)", langTag: "es-ES" },
];

const MULTILINGUAL_CATALOG: Record<string, Record<string, { title: string; eli5: string; actions: string[]; warnings: string[] }>> = {
  diabetes: {
    en: {
      title: "Metabolic & Diabetes Diagnostics Analysis",
      eli5: "🚗 Imagine your bloodstream as a busy city highway, and sugar molecules are cars. When blood sugar gets too high (HbA1c & Fasting Glucose), it causes a massive traffic jam that slows everything down and makes the roads sticky! Eating fresh green vegetables, high-fiber foods, and cutting out sweets clears out the extra sugar cars so traffic flows smoothly again.",
      actions: [
        "Adopt a diabetic-friendly low glycemic index diet rich in green vegetables, legumes, and whole grains.",
        "Avoid refined sugars, sweets, sugary beverages, and processed carbohydrates.",
        "Engage in 30 minutes of moderate daily exercise like brisk walking.",
        "Follow up with your physician for blood sugar management and regular HbA1c tracking."
      ],
      warnings: [
        "Confusion, extreme fatigue, or fruity-smelling breath (Ketoacidosis risk)",
        "Extreme unquenchable thirst and unusually frequent urination",
        "Severe dizziness, shakiness, or cold sweat (Hypoglycemia / Low Blood Sugar crisis)",
        "Blurry vision or severe persistent headache",
        "Shortness of breath or persistent chest tightness"
      ]
    },
    tanglish: {
      title: "Metabolic & Diabetes Analysis (Tanglish)",
      eli5: "🚗 Ungaloada rathathai oru busy city highway-ah nenachu paarungga, sugar molecules thaan adhulaporra cars. Sugar rathathula adhigama irukum podhu (HbA1c & Fasting Glucose), highway-la severe traffic jam aagi road full-ah sticky aagidum! Green leafy vegetables, fiber diet saapittu, sweets-a thavirthaa extra sugar cars ellaam kuraidhu ratham smooth-ah odum.",
      actions: [
        "Diabetic-friendly low glycemic index food saapdungga, green vegetables & legumes saapdungga.",
        "Sweets, cool drinks, refined sugars thavirkkanum.",
        "Daily 30 mins walking poganum.",
        "Doctor-a consult panni regular follow-up pannungga."
      ],
      warnings: [
        "Extreme tiredness, confusion, or unusual breath odor",
        "Adhigamaana thaagam matrum frequent urination",
        "Severe dizziness, shakiness, or cold sweat (Low Sugar crisis)",
        "Blurry vision or kaddumaana thalaivali",
        "Nenju vali or moochu vaangudhal"
      ]
    },
    hi: {
      title: "मधुमेह और मेटाबॉलिक रिपोर्ट विश्लेषण",
      eli5: "🚗 अपने रक्तप्रवाह को एक व्यस्त शहर के हाईवे की तरह समझें, और शुगर के कण गाड़ियां हैं। जब रक्त में शुगर ज्यादा हो जाती है (HbA1c और ग्लूकोज), तो हाईवे पर भारी ट्रैफिक जाम लग जाता है और सड़कें चिपचिपी हो जाती हैं! हरी पत्तेदार सब्जियां और कम चीनी वाला भोजन खाने से अतिरिक्त गाड़ियां हट जाती हैं और रक्त का बहाव फिर से सुचारू हो जाता है।",
      actions: [
        "मधुमेह अनुकूल कम ग्लाइसेमिक इंडेक्स वाला आहार (हरी सब्जियां, दालें) अपनाएं।",
        "मिठाई, चीनी युक्त पेय और परिष्कृत कार्बोहाइड्रेट से बचें।",
        "रोजाना 30 मिनट का मध्यम व्यायाम (तेज चाल) करें।",
        "ब्लड शुगर प्रबंधन के लिए अपने डॉक्टर से परामर्श लें।"
      ],
      warnings: [
        "अत्यधिक थकान, भ्रम, या सांस से अजीब गंध आना",
        "अत्यधिक प्यास लगना और बार-बार पेशाब आना",
        "गंभीर चक्कर आना, कपकपाहट या ठंडा पसीना आना (लो शुगर संकट)",
        "धुंधली दृष्टि या लगातार तेज सिरदर्द",
        "सांस लेने में तकलीफ या छाती में जकड़न"
      ]
    },
    ta: {
      title: "சர்க்கரை நோய் மற்றும் மெட்டாபாலிசிம் அறிக்கை பகுப்பாய்வு",
      eli5: "🚗 உங்கள் ரத்த ஓட்டத்தை ஒரு பரபரப்பான நகர நெடுஞ்சாலையாக நினைத்துப் பாருங்கள். சர்க்கரை மூலக்கூறுகள் தான் அதில் செல்லும் கார்கள். ரத்தத்தில் சர்க்கரை அளவு அதிகரிக்கும் போது (HbA1c & Fasting Glucose), நெடுஞ்சாலையில் பெரிய போக்குவரத்து நெரிசல் ஏற்பட்டு சாலைகள் ஒட்டும் தன்மையுடையதாக மாறிவிடும்! புதிய பச்சை காய்கறிகள் மற்றும் நார்சத்து உணவுகளை சாப்பிட்டு, இனிப்புகளை தவிர்த்தால் கூடுதல் கார்கள் விலகி ரத்த ஓட்டம் சீராகும்.",
      actions: [
        "சர்க்கரை நோயாளிகளுக்கு ஏற்ற குறைந்த கிளைசெமிக் உணவுகளை (கீரை, பருப்பு, காய்கறி) உண்ணுங்கள்.",
        "இனிப்புகள், கூல் ட்ரிங்க்ஸ் மற்றும் சுத்திகரிக்கப்பட்ட சர்க்கரையை தவிர்க்கவும்.",
        "தினமும் 30 நிமிடங்கள் நடைபயிற்சி செய்யவும்.",
        "ரத்த சர்க்கரை அளவை கண்காணிக்க மருத்துவரை அணுகவும்."
      ],
      warnings: [
        "கடும் சோர்வு, குழப்பம் அல்லது மூச்சில் விசித்திரமான வாசனை",
        "அதிகப்படியான தாகம் மற்றும் அடிக்கடி சிறுநீர் கழித்தல்",
        "கடுமையான தலைச்சுற்றல், நடுக்கம் அல்லது குளிர்ந்த வேர்வை (குறைந்த சர்க்கரை நிலை)",
        "மங்கலான பார்வை அல்லது கடுமையான தலைவலி",
        "மூச்சுத்திணறல் அல்லது நெஞ்சு இறுக்கம்"
      ]
    },
    te: {
      title: "మధుమేహం మరియు మెటబాలిక్ నివేదిక విశ్లేషణ",
      eli5: "🚗 మీ రక్త ప్రవాహాన్ని రద్దీగా ఉండే నగర రహదారిగా ఊహించుకోండి, మరియు చక్కెర అణువులు కార్లు. రక్తంలో చక్కెర పరిమాణం పెరిగినప్పుడు (HbA1c & ఫాస్టింగ్ గ్లూకోజ్), రహదారిపై భారీ ట్రాఫిక్ జామ్ ఏర్పడి రహదారులు జిగటగా మారతాయి! ఆకుకూరలు మరియు ఫైబర్ ఆహారం తీసుకోవడం ద్వారా అదనపు కార్లు తొలగిపోయి రక్త ప్రవాహం మళ్లీ సులభంగా మారుతుంది.",
      actions: [
        "డయాబెటిస్-అనుకూలమైన తక్కువ గ్లైసెమిక్ ఇండెక్స్ ఆహారాన్ని స్వీకరించండి.",
        "తీపి పదార్థాలు మరియు మైదా ఉత్పత్తులను నివారించండి.",
        "రోజూ 30 నిమిషాలు వేగంగా నడవండి.",
        "రక్తంలో చక్కెర స్థాయిల పర్యవేక్షణ కోసం మీ వైద్యుడిని సంప్రదించండి."
      ],
      warnings: [
        "అత్యధిక అలసట, అయోమయం లేదా శ్వాసలో వింత వాసన",
        "అధిక దాహం మరియు తరచుగా మూత్ర విసర్జన",
        "తీవ్రమైన మైకం, వణుకు లేదా చల్లని చెమట (తక్కువ చక్కెర అత్యవసర పరిస్థితి)",
        "సస్పష్టంగా కనిపించకపోవడం లేదా తీవ్రమైన తలనొప్పి",
        "శ్వాస తీసుకోవడంలో ఇబ్బంది లేదా ఛాతీలో ఒత్తిడి"
      ]
    },
    es: {
      title: "Análisis de Diagnóstico Metabólico y Diabetes",
      eli5: "🚗 Imagine su torrente sanguíneo como una carretera transitada y las moléculas de azúcar como automóviles. Cuando el azúcar aumenta (HbA1c y glucosa), se produce un gran embotellamiento que ralentiza todo. Comer verduras frescas y fibra ayuda a despejar los autos adicionales para que el tráfico fluya sin problemas.",
      actions: [
        "Adopte una dieta de bajo índice glucémico rica en verduras y legumbres.",
        "Evite azúcares refinados, dulces y bebidas azucaradas.",
        "Realice 30 minutos de ejercicio moderado diario.",
        "Consulte a su médico para el control de la glucosa en sangre."
      ],
      warnings: [
        "Fatiga extrema, confusión o aliento con olor a fruta",
        "Sed extrema e micción inusualmente frecuente",
        "Mareos severos, temblores o sudor frío (Crisis de azúcar baja)",
        "Visión borrosa o dolor de cabeza severo",
        "Falta de aire o presión en el pecho"
      ]
    }
  },
  anemia: {
    en: {
      title: "Complete Blood Count & Anemia Profile Analysis",
      eli5: "🚚 Imagine hemoglobin as tiny red oxygen delivery trucks inside your bloodstream, delivering energy to every room in your body house. Your test shows you are short on delivery trucks right now, which is why you feel tired and weak! Eating dark leafy greens (spinach/keerai), lentils, and Vitamin C acts like hiring a brand new fleet of delivery trucks for your body.",
      actions: [
        "Increase intake of iron-rich foods (dark leafy greens like spinach/keerai, lentils, chickpeas, pumpkin seeds).",
        "Pair iron-rich foods with Vitamin C (oranges, lemons, bell peppers) to boost iron absorption.",
        "Avoid drinking tea or coffee directly with meals, as they block iron absorption.",
        "Follow up with your physician for hemoglobin & iron level monitoring."
      ],
      warnings: [
        "Sudden fainting, severe lightheadedness, or loss of balance upon standing",
        "Shortness of breath with minimal exertion or while resting",
        "Chest pain, rapid irregular heartbeat, or heart palpitations",
        "Extreme physical weakness with pale or cold, clammy skin",
        "Persistent severe headache or confusion"
      ]
    },
    tanglish: {
      title: "Anemia & Hemoglobin Analysis (Tanglish)",
      eli5: "🚚 Hemoglobin-a unga rathathula irukra chinna red oxygen delivery trucks-ah nenachukonga. Idhu thaan unga udaloda ellaa paagathukum oxygen packages-a kondu pogum. Unga report-la delivery trucks kuraivaa irukku, adhanala thaan tired-ah feel panreengga! Keerai, paruppu, Vitamin C saapdradhu puthiya delivery trucks-a create panna udhavum.",
      actions: [
        "Keerai, spinach, paruppu, sundal adhigama saapdungga.",
        "Vitamin C foods (orange, lemon) kooda saapta iron nalla absorb aagum.",
        "Saapdorra podhu tea/coffee kudikka koodadhu.",
        "Regular-ah doctor-a paarthu Hemoglobin check pannungga."
      ],
      warnings: [
        "Sudden fainting or severe thalaichuttral",
        "Moochu vaangudhal or fatigue",
        "Nenju vali or rapid heartbeat",
        "Extreme physical weakness & pale skin",
        "Kaddumaana thalaivali or confusion"
      ]
    },
    hi: {
      title: "एनीमिया और हीमोग्लोबिन रिपोर्ट विश्लेषण",
      eli5: "🚚 हीमोग्लोबिन को अपने शरीर के अंदर लाल रंग के छोटे ऑक्सीजन डिलीवरी ट्रक समझें, जो आपके शरीर के हर हिस्से तक ऊर्जा पहुँचाते हैं। आपकी रिपोर्ट दिखाती है कि अभी इन ट्रकों की संख्या कम है, इसीलिए आप थकान महसूस करते हैं! हरी पत्तेदार सब्जियां (पालक), दालें और विटामिन सी युक्त भोजन खाने से शरीर में नए डिलीवरी ट्रक बनने लगते हैं।",
      actions: [
        "आयरन से भरपूर खाद्य पदार्थ (पालक, साग, दालें, अनार) का सेवन बढ़ाएं।",
        "आयरन के अवशोषण को बढ़ाने के लिए विटामिन सी (संतरा, नींबू) लें।",
        "खाने के तुरंत बाद चाय या कॉफी पीने से बचें।",
        "हीमोग्लोबिन स्तर की निगरानी के लिए डॉक्टर से संपर्क करें।"
      ],
      warnings: [
        "अचानक बेहोशी या बहुत तेज चक्कर आना",
        "कम मेहनत में भी सांस फूलना",
        "सीने में दर्द या दिल की धड़कन तेज होना",
        "त्वचा का पीला पड़ना और अत्यधिक कमजोरी",
        "लगातार तेज सिरदर्द या मानसिक भ्रम"
      ]
    },
    ta: {
      title: "ரத்தசோகை மற்றும் ஹீமோகுளோபின் அறிக்கை பகுப்பாய்வு",
      eli5: "🚚 ஹீமோகுளோபினை உங்கள் ரத்தத்தில் உள்ள சிறிய சிவப்பு ஆக்சிஜன் விநியோக லாரிகளாக நினைத்துக் கொள்ளுங்கள். இவை தான் உடலின் அனைத்து பகுதிகளுக்கும் ஆக்சிஜனை கொண்டு சேர்க்கின்றன. உங்கள் அறிக்கையில் இந்த லாரிகளின் எண்ணிக்கை குறைவாக உள்ளது, அதனால் தான் சோர்வாக உணர்கிறீர்கள்! கீரை, பருப்பு வகைகள் மற்றும் வைட்டமின் சி உணவுகளை சாப்பிடுவது புதிய விநியோக லாரிகளை உருவாக்க உதவும்.",
      actions: [
        "இரும்புச்சத்து நிறைந்த உணவுகளை (கீரை, முருங்கை, பருப்பு) அதிகளவில் உட்கொள்ளுங்கள்.",
        "இரும்புச்சத்து உறிஞ்சுதலை அதிகரிக்க வைட்டமின் சி (எலுமிச்சை, ஆரஞ்சு) உணவுகளை சேர்க்கவும்.",
        "உணவருந்தும்போது டீ அல்லது காபி குடிப்பதை தவிர்க்கவும்.",
        "ஹீமோகுளோபின் அளவை சரிபார்க்க மருத்துவரை அணுகவும்."
      ],
      warnings: [
        "திடீர் மயக்கம் அல்லது கடுமையான தலைச்சுற்றல்",
        "சிறிய வேலைக்கும் மூச்சுத்திணறல் ஏற்படுதல்",
        "நெஞ்சு வலி அல்லது வேகமான இதய துடிப்பு",
        "அதிகப்படியான உடல் தளர்ச்சி மற்றும் வெளிறிய தோற்றம்",
        "தொடர்ச்சியான தலைவலி அல்லது குழப்பம்"
      ]
    },
    te: {
      title: "రక్తహీనత మరియు హిమోగ్లోబిన్ నివేదిక విశ్లేషణ",
      eli5: "🚚 హిమోగ్లోబిన్‌ను మీ శరీరంలోని చిన్న ఎరుపు ఆక్సిజన్ డెలివరీ ట్రక్కులుగా ఊహించుకోండి. ఇవి మీ శరీరంలోని ప్రతి భాగానికి ఆక్సిజన్‌ను అందిస్తాయి. మీ నివేదికలో ఈ ట్రక్కుల సంఖ్య తక్కువగా ఉంది, అందుకే మీరు అలసటగా అనిపిస్తారు! ఆకుకూరలు, పప్పుధాన్యాలు మరియు విటమిన్ సి ఆహారం తీసుకోవడం కొత్త డెలివరీ ట్రక్కులను తయారు చేయడానికి సహాయపడుతుంది.",
      actions: [
        "ఐరన్ సమృద్ధిగా ఉండే ఆహారాలు (ఆకుకూరలు, పప్పులు) తీసుకోవడం పెంచండి.",
        "ఐరన్ గ్రహణశక్తిని పెంచడానికి విటమిన్ సి (నారింజ, నిమ్మ) తీసుకోండి.",
        "భోజనంతో పాటు టీ లేదా కాఫీ తాగడం నివారించండి.",
        "హిమోగ్లోబిన్ పరిశీలన కోసం వైద్యుడిని సంప్రదించండి."
      ],
      warnings: [
        "అకస్మాత్తుగా స్పృహ తప్పడం లేదా తీవ్రమైన మైకం",
        "కొద్దిపాటి నడకకే శ్వాస ఆడకపోవడం",
        "ఛాతీ నొప్పి లేదా గుండె వేగంగా కొట్టుకోవడం",
        "అత్యధిక బలహీనత మరియు పాలిపోయిన చర్మం",
        "నిరంతర తలనొప్పి లేదా అయోమయం"
      ]
    },
    es: {
      title: "Análisis de Hemograma y Perfil de Anemia",
      eli5: "🚚 Imagine la hemoglobina como pequeños camiones rojos de entrega de oxígeno en su sangre. Su informe muestra que actualmente le faltan camiones de entrega, por eso se siente cansado. Comer verduras de hoja verde, lentejas y vitamina C ayuda a construir nuevos camiones para su cuerpo.",
      actions: [
        "Aumente el consumo de alimentos ricos en hierro (espinacas, lentejas).",
        "Combine alimentos con hierro y vitamina C (naranjas, limones) para mejorar la absorción.",
        "Evite tomar té o café directamente con las comidas.",
        "Consulte a su médico para monitorear los niveles de hemoglobina."
      ],
      warnings: [
        "Desmayos repentinos o mareos severos",
        "Falta de aire con mínimo esfuerzo",
        "Dolor en el pecho o palpitaciones cardíacas",
        "Debilidad física extrema y piel pálida",
        "Dolor de cabeza persistente o confusión"
      ]
    }
  },
  dengue: {
    en: {
      title: "Complete Blood Count & Dengue Profile Analysis",
      eli5: "👷 Imagine your platelets as tiny emergency repair workers equipped with bandage tape inside your blood. When there is a tiny scratch, they rush over to patch it up. The Dengue virus sends some workers home temporarily. Resting in bed, drinking ORS fluids and fresh coconut water gives your body the strength to build a fresh crew of repair workers quickly!",
      actions: [
        "Drink 3 to 4 liters of oral fluids (ORSL, coconut water, fresh soups) daily.",
        "Take complete bed rest to allow your body to recover.",
        "Monitor platelet count daily with your healthcare provider.",
        "Avoid NSAIDs like Ibuprofen or Aspirin; use Paracetamol for fever management."
      ],
      warnings: [
        "Bleeding from nose or gums, or unexplained skin bruising",
        "Black or bloody stools, or vomiting blood",
        "Severe stomach pain or continuous vomiting",
        "Cold, clammy skin or feeling faint / dizzy",
        "Very little urine output for 6 hours or more"
      ]
    },
    tanglish: {
      title: "Dengue Profile Analysis (Tanglish)",
      eli5: "👷 Unga platelets-a ratha kuzhaaikulla irukra chinna construction repair workers-ah nenachukonga. Dengue virus indha workers-a kuraichiduchu. Nalla rest eduthu, ORS & elaneer kudichaa body udane pudhu repair workers-a tayaar pannidum!",
      actions: [
        "Daily 3 to 4 liters ORSL water, elaneer, fresh soup kudikkanum.",
        "Bed rest kandaipaa edukka ventum.",
        "Daily platelet count monitor pannungga.",
        "Ibuprofen/Aspirin thavirthu Paracetamol mattum edungga."
      ],
      warnings: [
        "Mooku/eeru-la ratham varudhal or skin bruise",
        "Karuppu ratha malam or ratha vaandhi",
        "Severe vayiru vali or thodarchiyaana vaandhi",
        "Kulirndha udal & thalaichuttral",
        "6 hours-ku mela siruneer varaamal iruppadhu"
      ]
    },
    hi: {
      title: "डेंगू और प्लेटलेट रिपोर्ट विश्लेषण",
      eli5: "👷 प्लेटलेट्स को अपने खून की नसों के अंदर छोटे मरम्मत करने वाले कारीगर समझें। डेंगू वायरस ने इन कारीगरों की संख्या कम कर दी है। पूरा आराम करने, ओआरएस घोल और नारियल पानी पीने से आपका शरीर जल्दी ही नए कारीगर बना लेता है!",
      actions: [
        "रोजाना 3 से 4 लीटर तरल पदार्थ (ओआरएस, नारियल पानी, सूप) पीएं।",
        "शरीर को ठीक होने देने के लिए पूरा बेड रेस्ट लें।",
        "प्रतिदिन प्लेटलेट काउंट की निगरानी करें।",
        "बुखार के लिए केवल पैरासिटामोल लें, एस्पिरिन/आइबूप्रोफेन से बचें।"
      ],
      warnings: [
        "नाक या मसूड़ों से खून आना या त्वचा पर नीले निशान पड़ना",
        "काले रंग का मल आना या खून की उल्टी होना",
        "पेट में तेज दर्द या लगातार उल्टी होना",
        "त्वचा का ठंडा और चिपचिपा होना या चक्कर आना",
        "6 घंटे या अधिक समय तक पेशाब न आना"
      ]
    },
    ta: {
      title: "டெங்கு மற்றும் பிளேட்லெட் அறிக்கை பகுப்பாய்வு",
      eli5: "👷 பிளேட்லெட்டுகளை உங்கள் ரத்த நாளங்களுக்குள் இருக்கும் சிறிய அவசர பழுதுபார்க்கும் தொழிலாளர்களாக நினைத்துக் கொள்ளுங்கள். டெங்கு வைரஸ் இந்த தொழிலாளர்களின் எண்ணிக்கையை தற்காலிகமாகக் குறைத்துள்ளது. நன்றாக ஓய்வெடுத்து, ORS மற்றும் இளநீர் குடிப்பதால் உடல் புதிய தொழிலாளர்களை விரைவாக உருவாக்க உதவும்!",
      actions: [
        "தினமும் 3 முதல் 4 லிட்டர் ORS நீர், இளநீர் மற்றும் சூப் அருந்தவும்.",
        "உடல் குணமாக முழுமையான படுக்கை ஓய்வு எடுக்கவும்.",
        "தினமும் பிளேட்லெட் எண்ணிக்கையை கண்காணிக்கவும்.",
        "பாராசிட்டமால் மட்டும் பயன்படுத்தவும், ஆஸ்பிரின்/இப்யூப்ரோஃபெனை தவிர்க்கவும்."
      ],
      warnings: [
        "மூக்கு அல்லது ஈறுகளில் ரத்தம் வடிதல் அல்லது தோலில் தழும்புகள்",
        "கருப்பு ரத்த மலம் அல்லது ரத்த வாந்தி",
        "கடுமையான வயிற்று வலி அல்லது தொடர் வாந்தி",
        "குளிர்ந்த தோல் அல்லது மயக்கம் வருவது போன்ற உணர்வு",
        "6 மணி நேரத்திற்கு மேலாக சிறுநீர் கழிக்காமல் இருத்தல்"
      ]
    },
    te: {
      title: "డెంగ్యూ మరియు ప్లేట్‌లెట్ నివేదిక విశ్లేషణ",
      eli5: "👷 ప్లేట్‌లెట్లను మీ రక్తనాళాల లోపల ఉండే చిన్న అత్యవసర మరమ్మతు కార్మికులుగా ఊహించుకోండి. డెంగ్యూ వైరస్ ఈ కార్మికుల సంఖ్యను తగ్గించింది. రెస్ట్ తీసుకోవడం, ORS డ్రింక్స్ మరియు కొబ్బరి నీరు తాగడం ద్వారా మీ శరీరం త్వరగా కొత్త మరమ్మతు కార్మికులను తయారు చేసుకుంటుంది!",
      actions: [
        "రోజూ 3 నుండి 4 లీటర్ల ద్రవాలు (ORS, కొబ్బరి నీరు) తీసుకోండి.",
        "పూర్తి బెడ్ రెస్ట్ తీసుకోండి.",
        "రోజూ ప్లేట్‌లెట్ కౌంట్‌ను పరిశీలించండి.",
        "జ్వరం కోసం పారాసిటమాల్ మాత్రమే ఉపయోగించండి."
      ],
      warnings: [
        "ముక్కు లేదా చిగుళ్ళ నుండి రక్తం కారడం",
        "నల్లటి మలం లేదా రక్తంతో వాంతులు",
        "తీవ్రమైన కడుపు నొప్పి లేదా నిరంతర వాంతులు",
        "చల్లని చర్మం లేదా మైకం రావడం",
        "6 గంటల కంటే ఎక్కువ సమయం మూత్రం రాకపోవడం"
      ]
    },
    es: {
      title: "Análisis de Perfil de Dengue y Hemograma",
      eli5: "👷 Imagine sus plaquetas como pequeños trabajadores de reparación de emergencia dentro de sus vasos sanguíneos. El virus del dengue reduce temporalmente estos trabajadores. Descansar y beber líquidos como suero y agua de coco ayuda a su cuerpo a crear rápidamente un nuevo equipo de reparación.",
      actions: [
        "Beba de 3 a 4 litros de líquidos (suero oral, agua de coco) al día.",
        "Mantenga reposo absoluto en cama.",
        "Monitoree el recuento de plaquetas diariamente.",
        "Use solo paracetamol para la fiebre; evite la aspirina o el ibuprofeno."
      ],
      warnings: [
        "Sangrado de nariz o encías o moretones inusuales",
        "Heces negras o con sangre o vómitos con sangre",
        "Dolor de estómago severo o vómitos continuos",
        "Piel fría y sudorosa o sensación de desmayo",
        "Muy poca orina durante 6 horas o más"
      ]
    }
  },
  ige: {
    en: {
      title: "Serum IgE Allergy Test Analysis",
      eli5: "🔔 Imagine your immune system as a home burglar alarm system. High IgE means your alarm sensitivity is set too high, so it rings loudly even for harmless things like tiny dust specks or pollen! Identifying your allergy triggers and following medical advice keeps your alarm system calm and peaceful.",
      actions: [
        "Consult an allergist or general physician for comprehensive allergen-specific testing.",
        "Identify and minimize exposure to potential triggers (dust mites, pollen, pet dander, or specific foods).",
        "Discuss antihistamines or anti-allergy medications if you have active symptoms."
      ],
      warnings: [
        "Swelling of lips, tongue, face, or throat (Anaphylaxis emergency)",
        "Difficulty breathing, shortness of breath, or severe wheezing",
        "Widespread intense hives, skin redness, or severe body itching",
        "Sudden dizziness, lightheadedness, or sudden drop in blood pressure",
        "Nausea, abdominal cramps, or sudden vomiting following allergen exposure"
      ]
    },
    tanglish: {
      title: "Serum IgE Allergy Analysis (Tanglish)",
      eli5: "🔔 Unga immune system-a veettu burglar alarm system-ah nenachukonga. High IgE irundhaa alarm romba sensitive-ah aagidum, dust pollen vandhaa jor-ah bell adikkum! Allergy triggers-a kandupidichu thavirthal alarm அமைதியா irukum.",
      actions: [
        "Allergist doctor-a consult panni specific allergy test edungga.",
        "Dust, pollen, pet dander matrum allergic foods-a thavirkkanum.",
        "Symptom irundhaa anti-allergy medicine gavanamaa edungga."
      ],
      warnings: [
        "Udhadu, naakku, mukam-la vekkam (Anaphylaxis emergency)",
        "Moochu vaangudhal or severe wheezing",
        "Udal full-ah dhadhipu or intense body itching",
        "Sudden thalaichuttral or blood pressure kuraidhal",
        "Vaandhi or vayiru vali after allergy exposure"
      ]
    },
    hi: {
      title: "सीरम IgE एलर्जी रिपोर्ट विश्लेषण",
      eli5: "🔔 अपने प्रतिरक्षा तंत्र को घर के अलार्म सिस्टम की तरह समझें। उच्च IgE का मतलब है कि अलार्म की संवेदनशीलता बहुत ज्यादा है, इसलिए धूल या पराग जैसे छोटे कणों पर भी अलार्म बजने लगता है! एलर्जी के कारणों से बचकर रहने से आपका अलार्म शांत रहता है।",
      actions: [
        "एलर्जी विशेषज्ञ से परामर्श लें और एलर्जन टेस्ट करवाएं।",
        "धूल, पराग, पालतू जानवरों की रूसी और संभावित एलर्जी वाले खाद्य पदार्थों से बचें।",
        "लक्षण होने पर एंटीहिस्टामिन दवाओं पर डॉक्टर से चर्चा करें।"
      ],
      warnings: [
        "होंठ, जीभ, चेहरे या गले में सूजन होना (एनाफिलेक्सिस आपातकाल)",
        "सांस लेने में भारी तकलीफ या घरघराहट होना",
        "पूरे शरीर पर चकत्ते पड़ना या तेज खुजली होना",
        "अचानक चक्कर आना या रक्तचाप में गिरावट",
        "एलर्जी के संपर्क में आने के बाद पेट दर्द या उल्टी"
      ]
    },
    ta: {
      title: "சீரம் IgE ஒவ்வாமை அறிக்கை பகுப்பாய்வு",
      eli5: "🔔 உங்கள் நோய் எதிர்ப்பு மண்டலத்தை ஒரு வீட்டு பாதுகாப்பு அலாரமாக நினைத்துக் கொள்ளுங்கள். அதிக IgE என்பது அலாரத்தின் உணர்திறன் மிகவும் அதிகமாக உள்ளது என்பதாகும், எனவே தூசி அல்லது மகரந்தம் போன்ற சிறிய விஷயங்களுக்கும் உரக்க ஒலிக்கும்! ஒவ்வாமை தூண்டிகளை தவிர்ப்பதன் மூலம் அலாரம் அமைதியாக இருக்கும்.",
      actions: [
        "ஒவ்வாமை மருத்துவரை அணுகி குறிப்பிட்ட ஒவ்வாமை பரிசோதனை செய்யுங்கள்.",
        "தூசி, மகரந்தம் மற்றும் ஒவ்வாமை உணவுகளிலிருந்து விலகி இருக்கவும்.",
        "அறிகுறிகள் இருந்தால் ஒவ்வாமை எதிர்ப்பு மருந்துகளை பயன்படுத்தவும்."
      ],
      warnings: [
        "உதடு, நாக்கு, முகம் அல்லது தொண்டையில் வீக்கம்",
        "மூச்சு விடுவதில் சிரமம் அல்லது கடுமையான இரைப்பு",
        "உடல் முழுவதும் தடிப்புகள் அல்லது அரிப்பு",
        "திடீர் தலைச்சுற்றல் அல்லது ரத்த அழுத்தக் குறைவு",
        "ஒவ்வாமைக்கு பின் வயிற்று வலி அல்லது வாந்தி"
      ]
    },
    te: {
      title: "సీరమ్ IgE అలెర్జీ నివేదిక విశ్లేషణ",
      eli5: "🔔 మీ రోగనిరోధక వ్యవస్థను ఇంటి దొంగల అలారం వ్యవస్థగా ఊహించుకోండి. అధిక IgE అంటే మీ అలారం సున్నితత్వం చాలా ఎక్కువగా ఉందని అర్థం! అలెర్జీ ప్రేరేపకాలను నివారించడం ద్వారా అలారం ప్రశాంతంగా ఉంటుంది.",
      actions: [
        "అలెర్జీ నిపుణుడిని సంప్రదించి అలెర్జీ రకం పరీక్ష చేయించుకోండి.",
        "ధుమ్ము, పరాగరేణువులు మరియు అలెర్జీ కలిగించే ఆహారాలను నివారించండి.",
        "లక్షణాలు ఉన్నప్పుడు అలెర్జీ మందులను వాడండి."
      ],
      warnings: [
        "పెదవులు, నాలుక లేదా గొంతు వాపు",
        "శ్వాస తీసుకోవడంలో తీవ్రమైన ఇబ్బంది",
        "శరీరమంతా దద్దుర్లు లేదా తీవ్రమైన దురద",
        "అకస్మాత్తుగా మైకం రావడం లేదా బిపి తగ్గడం",
        "అలెర్జీ వస్తువు తాకిన తర్వాత వాంతులు లేదా కడుపు నొప్పి"
      ]
    },
    es: {
      title: "Análisis de Prueba de Alergia IgE Sérica",
      eli5: "🔔 Imagine su sistema inmunológico como una alarma de seguridad. Un IgE alto significa que la alarma está demasiado sensible y suena incluso con polvo o polen. Evitar los desencadenantes mantiene la alarma en calma.",
      actions: [
        "Consulte a un alergólogo para realizar pruebas de alergia específicas.",
        "Identifique y minimice la exposición al polvo, polen y alimentos alérgenos.",
        "Discuta el uso de antihistamínicos si tiene síntomas activos."
      ],
      warnings: [
        "Hinchazón de labios, lengua, cara o garganta (Emergencia de anafilaxia)",
        "Dificultad severa para respirar o sibilancias",
        "Hinchazón o picazón intensa en todo el cuerpo",
        "Mareos repentinos o caída brusca de la presión arterial",
        "Náuseas o vómitos tras la exposición a alérgenos"
      ]
    }
  },
  lipid: {
    en: {
      title: "Lipid Profile & Cardiovascular Health Analysis",
      eli5: "🚰 Imagine your blood vessels as clean garden water pipes. High cholesterol and fats are like thick oily residue sticking to the inside of the pipes, making it harder for water to pump through smoothly. Cutting down on deep-fried foods and going for a 30-minute daily walk acts like scrubbing the pipe walls clean so blood flows with ease!",
      actions: [
        "Adopt a heart-healthy diet low in saturated fats and trans fats.",
        "Replace fried foods with baked, steamed, or grilled options.",
        "Engage in 30 minutes of aerobic exercise (walking, swimming, cycling) daily.",
        "Consult your physician for periodic cholesterol evaluation."
      ],
      warnings: [
        "Severe chest pain, pressure, or squeezing sensation radiating to jaw, neck, or left arm",
        "Sudden shortness of breath or dizziness",
        "Sudden numbness or weakness in face, arm, or leg (Stroke warning)",
        "Sudden severe headache or visual disturbance",
        "Irregular heartbeat or palpitations accompanied by feeling faint"
      ]
    },
    tanglish: {
      title: "Lipid & Cholesterol Analysis (Tanglish)",
      eli5: "🚰 Unga ratha kuzhaai-ah oru suthamaana thanni pipe-ah nenachukonga. Adhigamaana cholesterol & fat irundhaa, pipe ullara ennai podhadhi படிஞ்சு thanni poradhu kashtam aagum. Deep fried food-a thavirthu, daily 30 mins walk ponaa, pipe clean aagi ratham easy-ah flow aagum!",
      actions: [
        "Oil foods & deep fried items-a thavirthu heart-healthy food saapdungga.",
        "Steamed or boiled foods adhigama edungga.",
        "Daily 30 mins walking poganum.",
        "Regular-ah doctor-a paarthu Cholesterol check pannungga."
      ],
      warnings: [
        "Nenju vali, idhadhu kai/kazhuthu shoulder vali",
        "Sudden moochu vaangudhal or thalaichuttral",
        "Mukam, kai, kaal-la sudden thimirvadhu (Stroke warning)",
        "Sudden severe thalaivali or vision problem",
        "Irregular heart beat or fainting"
      ]
    },
    hi: {
      title: "लिपिड प्रोफाइल और कोलेस्ट्रॉल रिपोर्ट विश्लेषण",
      eli5: "🚰 अपनी रक्त वाहिकाओं को पानी के साफ पाइप की तरह समझें। उच्च कोलेस्ट्रॉल और वसा पाइप की अंदरूनी दीवारों पर जमी हुई चिकनाई की तरह है, जिससे पानी बहने में रुकावट आती है। तली हुई चीजों से परहेज करने और रोजाना 30 मिनट टहलने से पाइप की दीवारें साफ होती हैं और खून आसानी से बहता है!",
      actions: [
        "कम वसा और हृदय के लिए स्वस्थ आहार अपनाएं।",
        "तली-भुनी चीजों की जगह उबला या ग्रिल्ड भोजन खाएं।",
        "रोजाना 30 मिनट टहलें या हल्का व्यायाम करें।",
        "कोलेस्ट्रॉल के नियमित परीक्षण के लिए डॉक्टर से संपर्क करें।"
      ],
      warnings: [
        "सीने में तेज दर्द, दबाव या जबड़े और बाएं हाथ में दर्द फैलना",
        "अचानक सांस फूलना या चक्कर आना",
        "चेहरे, हाथ या पैर में अचानक सुन्नता (स्ट्रोक का संकेत)",
        "अचानक तेज सिरदर्द या देखने में परेशानी",
        "अनियमित दिल की धड़कन और बेहोशी महसूस होना"
      ]
    },
    ta: {
      title: "கொலஸ்ட்ரால் மற்றும் லிபிட் அறிக்கை பகுப்பாய்வு",
      eli5: "🚰 உங்கள் ரத்த நாளங்களை சுத்தமான தண்ணீர் குழாயாக நினைத்துக் கொள்ளுங்கள். அதிக கொலஸ்ட்ரால் மற்றும் கொழுப்பு என்பது குழாயின் உட்புறத்தில் எண்ணெய் பிசுக்கு படிவது போன்றது, இதனால் ரத்தம் செல்வது கடினமாகிறது. பொரித்த உணவுகளை தவிர்த்து, தினமும் 30 நிமிடம் நடைபயிற்சி செய்தால் குழாய் சுவர்கள் சுத்தமாகி ரத்த ஓட்டம் சுலபமாகும்!",
      actions: [
        "இதயத்திற்கு ஆரோக்கியமான குறைந்த கொழுப்பு உணவுகளை உட்கொள்ளுங்கள்.",
        "பொரித்த உணவுகளுக்கு பதிலாக அவித்த உணவுகளை உண்ணுங்கள்.",
        "தினமும் 30 நிமிடங்கள் நடைபயிற்சி செய்யுங்கள்.",
        "கொலஸ்ட்ரால் அளவை கண்காணிக்க மருத்துவரை அணுகவும்."
      ],
      warnings: [
        "கடுமையான நெஞ்சு வலி, தாடை அல்லது இடது கையில் வலி பரவுதல்",
        "திடீர் மூச்சுத்திணறல் அல்லது தலைச்சுற்றல்",
        "முகம், கை அல்லது காலில் திடீர் மரத்துப்போதல் (பக்கவாத அறிகுறி)",
        "திடீர் கடுமையான தலைவலி அல்லது பார்வை மங்குதல்",
        "சீற்றமற்ற இதய துடிப்பு மற்றும் மயக்கம்"
      ]
    },
    te: {
      title: "లిపిడ్ ప్రొఫైల్ మరియు కొలెస్ట్రాల్ నివేదిక విశ్లేషణ",
      eli5: "🚰 మీ రక్తనాళాలను శుభ్రమైన నీటి పైపుగా ఊహించుకోండి. అధిక కొలెస్ట్రాల్ మరియు కొవ్వు పైపు లోపలి గోడలపై నూనె జిడ్డులా పేరుకుపోతుంది. వేయించిన ఆహారాలను తగ్గించి, రోజువారీ 30 నిమిషాలు నడవడం ద్వారా పైపు గోడలు శుభ్రపడి రక్త ప్రవాహం సులభమవుతుంది!",
      actions: [
        "గుండెకు మంచి చేసే తక్కువ కొవ్వు ఆహారాన్ని తీసుకోండి.",
        "వేయించిన ఆహారాలకు బదులుగా ఉడకబెట్టిన ఆహారం తీసుకోండి.",
        "రోజూ 30 నిమిషాలు వేగంగా నడవండి.",
        "కొలెస్ట్రాల్ పరిశీలన కోసం వైద్యుడిని సంప్రదించండి."
      ],
      warnings: [
        "తీవ్రమైన ఛాతీ నొప్పి, దవడ లేదా ఎడమ చేతికి నొప్పి పాకడం",
        "అకస్మాత్తుగా శ్వాస ఆడకపోవడం లేదా మైకం",
        "ముఖం, చేయి లేదా కాలు మొద్దుబారడం (పక్షవాతం హెచ్చరిక)",
        "అకస్మాత్తుగా తీవ్రమైన తలనొప్పి లేదా చూపు మందగించడం",
        "క్రమరహిత గుండె వేగం మరియు స్పృహ తప్పడం"
      ]
    },
    es: {
      title: "Análisis de Perfil Lipídico y Salud Cardiovascular",
      eli5: "🚰 Imagine sus vasos sanguíneos como tuberías de agua limpias. El alto nivel de colesterol es como una capa de aceite en las paredes de las tuberías. Reducir los alimentos fritos y caminar 30 minutos al día ayuda a limpiar las tuberías.",
      actions: [
        "Adopte una dieta saludable para el corazón baja en grasas saturadas.",
        "Reemplace alimentos fritos por opciones al vapor o a la plancha.",
        "Haga 30 minutos de ejercicio aeróbico diario.",
        "Consulte a su médico para evaluación periódica del colesterol."
      ],
      warnings: [
        "Dolor Severo en el pecho que se irradia al mandíbula o brazo izquierdo",
        "Falta de aire o mareos repentinos",
        "Entumecimiento repentino en la cara, brazo o pierna (Alerta de derrame)",
        "Dolor de cabeza severo e imprevisto",
        "Palpitaciones cardíacas irregulares acompañadas de mareo"
      ]
    }
  },
  lft: {
    en: {
      title: "Liver Function Test (LFT) Analysis",
      eli5: "💧 Imagine your liver as a heavy-duty home water filter. Elevated liver enzymes mean your filter is working overtime right now to clean out toxins. Drinking plenty of fresh water and skipping heavy or fried foods gives your filter a well-deserved break to self-repair!",
      actions: [
        "Maintain optimal hydration (2.5 to 3 liters of water daily).",
        "Avoid alcohol, deep-fried foods, and hepatotoxic medications.",
        "Follow up with your general physician or gastroenterologist for liver enzyme monitoring."
      ],
      warnings: [
        "Yellowing of the eyes or skin (Jaundice)",
        "Dark tea-colored urine or pale/clay-colored stools",
        "Severe pain or pressure in the upper right abdomen",
        "Persistent vomiting or inability to retain oral fluids",
        "Abdominal swelling or sudden mental confusion"
      ]
    },
    tanglish: {
      title: "Liver Function Analysis (Tanglish)",
      eli5: "💧 Unga liver-a oru heavy-duty water filter-ah nenachukonga. Liver enzymes adhigamnaa filter extra work pannudhu. Nalla thanni kudichu, oil foods-a thavirthal filter-ukku rest kidaichu dhaanaave repair aagidum!",
      actions: [
        "Daily 2.5 to 3 liters suthamaana thanni kudikkanum.",
        "Alcohol, fried food matrum unnecessary pills-a thavirkkanum.",
        "Doctor-a consult panni Liver test follow-up pannungga."
      ],
      warnings: [
        "Kan or skin manjal aavadhu (Jaundice)",
        "Mano-nira siruneer or vella malam",
        "Vayiru valadhu pakkam severe pain",
        "Thodarchiyaana vaandhi",
        "Vayiru vekkam or mental confusion"
      ]
    },
    hi: {
      title: "लिवर फंक्शन (LFT) रिपोर्ट विश्लेषण",
      eli5: "💧 अपने लिवर को पानी के भारी-भरकम फिल्टर की तरह समझें। बढ़े हुए लिवर एंजाइम का मतलब है कि आपका फिल्टर अभी ज्यादा काम कर रहा है। भरपूर पानी पीने और भारी भोजन से बचने से आपके फिल्टर को आराम मिलता है और वह खुद को ठीक कर लेता है!",
      actions: [
        "पर्याप्त पानी पीएं (रोजाना 2.5 से 3 लीटर)।",
        "शराब, तली-भुनी चीजों और बिना डॉक्टर की सलाह की दवाओं से बचें।",
        "लिवर एंजाइम की निगरानी के लिए डॉक्टर से परामर्श लें।"
      ],
      warnings: [
        "आंखों या त्वचा का पीला पड़ना (पीलिया)",
        "गहरे चाय के रंग का पेशाब या हल्के रंग का मल",
        "पेट के ऊपरी दाहिने हिस्से में तेज दर्द",
        "लगातार उल्टी होना या पानी न पचना",
        "पेट में सूजन या मानसिक भ्रम"
      ]
    },
    ta: {
      title: "கல்லீரல் செயல்பாடு (LFT) அறிக்கை பகுப்பாய்வு",
      eli5: "💧 உங்கள் கல்லீரலை ஒரு வாட்டர் ஃபில்டராக நினைத்துக் கொள்ளுங்கள். கல்லீரல் என்சைம்கள் அதிகமாக இருந்தால் ஃபில்டர் கடினமாக உழைக்கிறது என்று அர்த்தம். நிறைய தண்ணீர் குடித்து, எண்ணெய் உணவுகளை தவிர்த்தால் ஃபில்டருக்கு ஓய்வு கிடைத்து தானாகவே சரியாகும்!",
      actions: [
        "தினமும் 2.5 முதல் 3 லிட்டர் தண்ணீர் அருந்தவும்.",
        "மது, பொரித்த உணவுகள் மற்றும் தேவையற்ற மருந்துகளை தவிர்க்கவும்.",
        "கல்லீரல் என்சைம் அளவை கண்காணிக்க மருத்துவரை அணுகவும்."
      ],
      warnings: [
        "கண்கள் அல்லது தோலில் மஞ்சள் நிறம் (மஞ்சள் காமாலை)",
        "தேயிலை நிறத்தில் சிறுநீர் அல்லது களிமண் நிறத்தில் மலம்",
        "மேல் வலது வயிற்றில் கடுமையான வலி",
        "தொடர்ச்சியான வாந்தி",
        "வயிற்று வீக்கம் அல்லது திடீர் குழப்பம்"
      ]
    },
    te: {
      title: "కాలేయ పనితీరు (LFT) నివేదిక విశ్లేషణ",
      eli5: "💧 మీ కాలేయాన్ని నీటి ఫిల్టర్‌గా ఊహించుకోండి. అధిక కాలేయ ఎంజైమ్‌లు అంటే ఫిల్టర్ ఎక్కువగా పనిచేస్తోందని అర్థం. సమృద్ధిగా నీరు తాగడం మరియు జిడ్డుగల ఆహారాన్ని నివారించడం వల్ల ఫిల్టర్‌కు విశ్రాంతి లభిస్తుంది!",
      actions: [
        "రోజూ 2.5 నుండి 3 లీటర్ల నీరు తాగండి.",
        "మద్యం, వేయించిన ఆహారాలు మరియు అవసరం లేని మందులను నివారించండి.",
        "కాలేయ ఎంజైమ్‌ల పరిశీలన కోసం వైద్యుడిని సంప్రదించండి."
      ],
      warnings: [
        "కళ్ళు లేదా చర్మం పసుపు రంగులోకి మారడం (పచ్చకామెర్లు)",
        "ముదురు టీ రంగు మూత్రం లేదా తెల్లటి మలం",
        "కడుపు కుడి ఎగువ భాగంలో తీవ్రమైన నొప్పి",
        "నిరంతర వాంతులు",
        "కడుపు వాపు లేదా అయోమయం"
      ]
    },
    es: {
      title: "Análisis de Pruebas de Función Hepática (LFT)",
      eli5: "💧 Imagine su hígado como un filtro de agua doméstico. Las enzimas hepáticas elevadas significan que su filtro está trabajando tiempo extra. Beber mucha agua y evitar alimentos pesados le da descanso a su filtro.",
      actions: [
        "Mantenga una hidratación óptima (2.5 a 3 litros de agua al día).",
        "Evite el alcohol, alimentos fritos y medicamentos innecesarios.",
        "Consulte a su médico para el seguimiento de enzimas hepáticas."
      ],
      warnings: [
        "Coloración amarillenta en ojos o piel (Ictericia)",
        "Orina oscura como té o heces pálidas",
        "Dolor severo en la parte superior derecha del abdomen",
        "Vómitos persistentes",
        "Hinchazón abdominal o confusión repentina"
      ]
    }
  },
  general: {
    en: {
      title: "Laboratory Diagnostics Report Analysis",
      eli5: "🏎️ Think of your body like a sports car getting a routine health tune-up check. We checked under the hood to ensure all components are running in top condition!",
      actions: [
        "Consult your primary physician for a comprehensive report review.",
        "Maintain a balanced diet rich in vegetables, fruits, and adequate daily hydration.",
        "Follow up on any flagged parameters outside reference ranges."
      ],
      warnings: [
        "High persistent fever (above 102°F / 39°C) unresponsive to fever medication",
        "Sudden severe chest pain or difficulty breathing",
        "Severe dizziness, confusion, or fainting",
        "Persistent vomiting or inability to retain oral fluids",
        "Unusual bleeding, severe localized pain, or rapid symptom worsening"
      ]
    },
    tanglish: {
      title: "Health Diagnostics Analysis (Tanglish)",
      eli5: "🏎️ Unga udal-a oru sports car tune-up check-up ah nenachukonga. Hood-ku keela irukra components ellaam top condition-la irukka-nu check pannirukom!",
      actions: [
        "Doctor-a paarthu report details review pannungga.",
        "Green vegetables, fruits matrum nalla thanni kudikkanum.",
        "Flagged values irundhaa regular follow-up pannungga."
      ],
      warnings: [
        "Extreme persistent fever",
        "Nenju vali or moochu vaangudhal",
        "Severe thalaichuttral or fainting",
        "Thodarchiyaana vaandhi",
        "Ratha கசிவு or severe pain"
      ]
    },
    hi: {
      title: "सामान्य स्वास्थ्य जांच रिपोर्ट विश्लेषण",
      eli5: "🏎️ अपने शरीर को एक स्पोर्ट्स कार की तरह समझें जिसका नियमित ट्यून-अप चेकअप हो रहा है। हमने सभी घटकों की जांच की है ताकि वे बेहतरीन स्थिति में चलें!",
      actions: [
        "व्यापक रिपोर्ट समीक्षा के लिए अपने प्राथमिक चिकित्सक से परामर्श लें।",
        "सब्जियों, फलों और पर्याप्त पानी से भरपूर संतुलित आहार बनाए रखें।",
        "सामान्य सीमा से बाहर पाए गए मापदंडों पर डॉक्टर से सलाह लें।"
      ],
      warnings: [
        "दवा से ठीक न होने वाला तेज बुखार",
        "अचानक सीने में तेज दर्द या सांस लेने में तकलीफ",
        "गंभीर चक्कर आना, मानसिक भ्रम या बेहोशी",
        "लगातार उल्टी होना",
        "असामान्य रक्तस्राव या तेजी से बढ़ते लक्षण"
      ]
    },
    ta: {
      title: "பொது சுகாதார பரிசோதனை அறிக்கை பகுப்பாய்வு",
      eli5: "🏎️ உங்கள் உடலை ஒரு ஸ்போர்ட்ஸ் காரின் வழக்கமான டியூன்-அப் சோதனையாக நினைத்துக் கொள்ளுங்கள். அனைத்து கூறுகளும் சிறந்த முறையில் இயங்குவதை உறுதிசெய்ய நாங்கள் சோதித்துள்ளோம்!",
      actions: [
        "முழுமையான அறிக்கை ஆய்வுக்கு உங்கள் மருத்துவரை அணுகவும்.",
        "காய்கறிகள், பழங்கள் மற்றும் போதுமான தண்ணீருடன் சீரான உணவை பராமரிக்கவும்.",
        "மாறுபட்ட அளவுகளுக்கு மருத்துவ ஆலோசனையை பெறவும்."
      ],
      warnings: [
        "மருந்திற்கு கட்டுப்படாத அதிக காய்ச்சல்",
        "திடீர் நெஞ்சு வலி அல்லது மூச்சுத்திணறல்",
        "கடுமையான தலைச்சுற்றல் அல்லது மயக்கம்",
        "தொடர்ச்சியான வாந்தி",
        "அசாப்படை ரத்தப்போக்கு அல்லது வேகமான அறிகுறி"
      ]
    },
    te: {
      title: "సాధారణ ఆరోగ్య పరీక్ష నివేదిక విశ్లేషణ",
      eli5: "🏎️ మీ శరీరాన్ని ఒక స్పోర్ట్స్ కార్ యొక్క సాధారణ ట్యూన్-అప్ తనిఖీగా అనుకోండి. అన్ని భాగాలు అగ్రస్థానంలో నడుస్తున్నాయని నిర్ధారించుకోవడానికి మేము పరిశీలించాము!",
      actions: [
        "సమగ్ర నివేదిక సమీక్ష కోసం మీ వైద్యుడిని సంప్రదించండి.",
        "కూరగాయలు, పండ్లతో కూడిన సమతుల్య ఆహారాన్ని తీసుకోండి.",
        "తేడాలు ఉన్న పరీక్షలకు వైద్య సలహా తీసుకోండి."
      ],
      warnings: [
        "మందులకు తగ్గని తీవ్రమైన జ్వరం",
        "అకస్మాత్తుగా ఛాతీ నొప్పి లేదా శ్వాస ఇబ్బంది",
        "తీవ్రమైన మైకం లేదా స్పృహ తప్పడం",
        "నిరంతర వాంతులు",
        "అసాధారణ రక్తస్రావం లేదా తీవ్రమైన నొప్పి"
      ]
    },
    es: {
      title: "Análisis de Informe de Diagnóstico General",
      eli5: "🏎️ Piense en su cuerpo como un automóvil deportivo que recibe una revisión de rutina. ¡Revisamos debajo del capó para asegurarnos de que todo funcione en óptimas condiciones!",
      actions: [
        "Consulte a su médico para una revisión completa del informe.",
        "Mantenga una dieta equilibrada rica en verduras y frutas.",
        "Haga seguimiento a cualquier parámetro fuera de rango."
      ],
      warnings: [
        "Fiebre alta persistente que no cede con medicamentos",
        "Dolor repentino en el pecho o dificultad para respirar",
        "Mareos severos, confusión o desmayos",
        "Vómitos persistentes",
        "Sangrado inusual o dolor severo"
      ]
    }
  }
};

function detectConditionKey(title: string, rawText: string, entities: any[]): string {
  const tLower = (title || "").toLowerCase();
  
  if (tLower.includes("ige") || tLower.includes("allergy") || tLower.includes("rast")) return "ige";
  if (tLower.includes("dengue")) return "dengue";
  if (tLower.includes("metabolic") || tLower.includes("glucose") || tLower.includes("diabetes") || tLower.includes("hba1c")) return "diabetes";
  if (tLower.includes("anemia") || tLower.includes("hemoglobin") || tLower.includes("iron")) return "anemia";
  if (tLower.includes("lipid") || tLower.includes("cholesterol")) return "lipid";
  if (tLower.includes("lft") || tLower.includes("liver")) return "lft";

  const combined = (title + " " + rawText + " " + JSON.stringify(entities || [])).toLowerCase();
  
  if (combined.includes("ige") || combined.includes("allergy") || combined.includes("rast") || combined.includes("immunoglobulin")) return "ige";
  if (combined.includes("dengue") || combined.includes("ns1") || (combined.includes("platelet") && (combined.includes("positive") || combined.includes("critical")))) return "dengue";
  if (combined.includes("hba1c") || combined.includes("glucose") || combined.includes("diabetes") || combined.includes("fasting blood sugar") || combined.includes("ppbs") || combined.includes("metabolic")) return "diabetes";
  if (combined.includes("hemoglobin") || combined.includes("hgb") || combined.includes("anemia") || combined.includes("ferritin")) return "anemia";
  if (combined.includes("cholesterol") || combined.includes("lipid") || combined.includes("triglyceride") || combined.includes("hdl") || combined.includes("ldl")) return "lipid";
  if (combined.includes("lft") || combined.includes("sgpt") || combined.includes("sgot") || combined.includes("bilirubin") || combined.includes("liver")) return "lft";

  return "general";
}

function ResultsScreen() {
  const [liveData, setLiveData] = useState<any>(null);
  const [formattedDate, setFormattedDate] = useState("14 Sep 2026");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [eli5Mode, setEli5Mode] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [translatedCache, setTranslatedCache] = useState<Record<string, any>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setFormattedDate(new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }));
    try {
      const stored = sessionStorage.getItem("latest_analysis_result");
      if (stored) {
        setLiveData(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Dynamic AI Model Pipeline Translation Effect
  useEffect(() => {
    if (selectedLanguage === "en" || !liveData) return;

    const multiDict = liveData?.simplified_summary?.multilingual || {};
    if (multiDict[selectedLanguage] || translatedCache[selectedLanguage]) return;

    const baseTitle =
      liveData?.simplified_summary?.title ||
      liveData?.extracted_data?.test_name ||
      liveData?.report_title ||
      (liveData?.file_name ? `Summary: ${liveData.file_name}` : "Your Medical Report Summary");

    const baseEli5 =
      liveData?.simplified_summary?.eli5_summary ||
      "Think of your body like a car getting a routine health tune-up check. All metrics are evaluated against standard reference ranges.";

    const baseRecs = liveData?.simplified_summary?.recommendations || [
      "Consult your primary physician for a comprehensive report review.",
      "Follow up on any flagged parameters outside reference ranges."
    ];

    const baseWarns = liveData?.simplified_summary?.warning_signs || [
      "High persistent fever (above 102°F / 39°C) unresponsive to fever medication",
      "Sudden severe chest pain or difficulty breathing",
      "Severe dizziness, confusion, or fainting"
    ];

    setIsTranslating(true);
    fetch("http://localhost:8000/api/ai/translate_report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: baseTitle,
        eli5_summary: baseEli5,
        recommendations: baseRecs,
        warning_signs: baseWarns,
        target_lang: selectedLanguage
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && (data.eli5_summary || data.title)) {
          setTranslatedCache((prev) => ({
            ...prev,
            [selectedLanguage]: {
              title: data.title || baseTitle,
              eli5_summary: data.eli5_summary || baseEli5,
              recommendations: data.recommendations || baseRecs,
              warning_signs: data.warning_signs || baseWarns
            }
          }));
        }
      })
      .catch((err) => {
        console.error("AI translation API error:", err);
      })
      .finally(() => {
        setIsTranslating(false);
      });
  }, [selectedLanguage, liveData, translatedCache]);

  const rawText = liveData?.raw_text || "";

  const extractedPatientName =
    liveData?.simplified_summary?.patient_name ||
    liveData?.extracted_data?.patient_name ||
    (typeof liveData?.simplified_summary?.patient_info === "string" ? liveData.simplified_summary.patient_info.split("|")[0]?.trim() : liveData?.simplified_summary?.patient_info?.name) ||
    (rawText.match(/(?:Patient\s*Name|Patient|Name):\s*([^|\n]+)/i)?.[1]?.trim()) ||
    patient.name;

  const extractedAge =
    liveData?.simplified_summary?.age ||
    liveData?.extracted_data?.age ||
    liveData?.simplified_summary?.patient_info?.age ||
    (rawText.match(/(?:Age|Yrs|Years):\s*([^|\n]+)/i)?.[1]?.trim()) ||
    patient.age;

  const extractedGender =
    liveData?.simplified_summary?.gender ||
    liveData?.extracted_data?.gender ||
    liveData?.simplified_summary?.patient_info?.gender ||
    (rawText.match(/\b(Male|Female|Other|M|F)\b/i)?.[1]?.trim()) ||
    "";

  const entitiesList =
    liveData?.extracted_data?.entities ||
    liveData?.simplified_summary?.extracted_entities ||
    liveData?.findings ||
    null;

  const baseTitle =
    liveData?.simplified_summary?.title ||
    liveData?.extracted_data?.test_name ||
    liveData?.report_title ||
    (liveData?.file_name ? `Summary: ${liveData.file_name}` : "Your Medical Report Summary");

  const baseEli5 =
    liveData?.simplified_summary?.eli5_summary ||
    "Think of your body like a car getting a routine health tune-up check. All metrics are evaluated against standard reference ranges.";

  const baseRecs = liveData?.simplified_summary?.recommendations || [
    "Consult your primary physician for a comprehensive report review.",
    "Follow up on any flagged parameters outside reference ranges."
  ];

  const baseWarns = liveData?.simplified_summary?.warning_signs || [
    "High persistent fever (above 102°F / 39°C) unresponsive to fever medication",
    "Sudden severe chest pain or difficulty breathing",
    "Severe dizziness, confusion, or fainting"
  ];

  // Resolve backend response multilingual dictionary or live AI model translated cache
  const multiDict = liveData?.simplified_summary?.multilingual || {};
  const activeLangData = multiDict[selectedLanguage] || translatedCache[selectedLanguage] || {};

  // Resolve title, ELI5 explanation, actions, and warnings dynamically from AI model output
  const reportTitle = selectedLanguage === "en" ? baseTitle : (activeLangData.title || baseTitle);
  const eli5Text = selectedLanguage === "en" ? baseEli5 : (activeLangData.eli5_summary || baseEli5);
  const actions = selectedLanguage === "en" ? baseRecs : (activeLangData.recommendations || baseRecs);
  const warnings = selectedLanguage === "en" ? baseWarns : (activeLangData.warning_signs || baseWarns);

  const findings = entitiesList && Array.isArray(entitiesList) && entitiesList.length > 0
    ? entitiesList.map((f: any) => {
        const param = f.entity || f.parameter || f.title || "Parameter";
        const val = f.value || "";
        const ref = f.reference || f.range || "Standard";
        const statusStr = (f.status || f.flag || "").toString().toUpperCase();
        const isDanger = statusStr.includes("HIGH") || statusStr.includes("CRITICAL") || statusStr.includes("ELEVATED") || statusStr.includes("VERY HIGH");
        const isWarning = statusStr.includes("LOW");

        return {
          title: val ? `${param}: ${val}` : param,
          tone: isDanger ? "danger" : isWarning ? "warning" : "good",
          lines: [
            `Reference Range: ${ref}`,
            `Status / Flag: ${f.status || f.flag || "Normal"}`,
          ],
        };
      })
    : importantFindings;

  const tableRows = entitiesList && Array.isArray(entitiesList) && entitiesList.length > 0
    ? entitiesList.map((e: any) => ({
        test: e.entity || e.parameter || "Test",
        value: e.value || "-",
        range: e.reference || e.range || "-",
        flag: e.status || e.flag || "Normal",
      }))
    : fullReportRows;


  const toggleVoiceSummary = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported on this browser.");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      toast("Stopped audio playback");
    } else {
      const activeLangObj = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];
      const targetLangTag = activeLangObj.langTag;

      let speechText = "";
      if (eli5Mode) {
        speechText = `${reportTitle}. ${eli5Text}`;
      } else {
        const findingsText = findings.map((f: any) => `${f.title}. ${f.lines.join(". ")}`).join(". ");
        const actionsText = actions.join(". ");
        speechText = `${reportTitle}. Findings: ${findingsText}. What to do: ${actionsText}`;
      }

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = targetLangTag;
      utterance.rate = 0.92; // slightly slower for clean clear pronunciation

      // Load native matching voice if available in browser
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const matchingVoice = voices.find(
          (v) => v.lang === targetLangTag || v.lang.startsWith(targetLangTag.split("-")[0])
        );
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
      toast.success(`Reading aloud in ${activeLangObj.label.split(" ")[1] || "selected language"} 🔊`);
    }
  };

  return (
    <PhoneFrame>
      <PageHeader title="Analysis Complete" subtitle="✅ Your report is ready" back="/home" />
      <Screen>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-[20px] font-bold">📊 {reportTitle}</h1>
                <p className="caption-text mt-1">
                  {extractedPatientName} · {extractedAge} {extractedGender ? `(${extractedGender})` : ""} · {formattedDate}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1 text-[12px] font-semibold shrink-0"
                onClick={toggleVoiceSummary}
              >
                {speaking ? "⏹️ Stop" : "🔊 Listen"}
              </Button>
            </div>

            {/* Multilingual Selector Bar */}
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
                <Globe className="size-3.5 text-primary" /> Language / மொழி:
              </span>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  if (speaking) {
                    window.speechSynthesis.cancel();
                    setSpeaking(false);
                  }
                  toast.success(`Language set to ${e.target.options[e.target.selectedIndex].text}`);
                }}
                className="h-8 rounded-lg border border-primary/30 bg-primary/5 px-2 text-[12px] font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Toggle Button */}
            <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2.5">
              <span className="text-[12px] font-medium text-muted-foreground">
                {eli5Mode ? "🐣 Mode: Everyday Analogy (ELI5)" : "📋 Mode: Clinical Summary"}
              </span>
              <Button
                variant={eli5Mode ? "default" : "outline"}
                size="sm"
                className="h-8 text-[12px] font-semibold"
                onClick={() => setEli5Mode(!eli5Mode)}
              >
                {eli5Mode ? "Standard Mode" : "👶 ELI5 Mode"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {eli5Mode ? (
          <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-[15px] leading-relaxed shadow-sm">
            <p className="font-bold text-primary flex items-center gap-1.5 text-[15px]">
              🐣 Super-Simple Explanation (Everyday Analogy):
            </p>
            <p className="mt-2 text-[15px] font-medium text-foreground/90">{eli5Text}</p>
          </div>
        ) : null}

        <SectionTitle>🔴 Important findings</SectionTitle>
        <div className="flex flex-col gap-3">
          {findings.map((f: any, idx: number) => (
            <div key={idx} className={cn("rounded-xl border-2 p-4", toneClass[f.tone as keyof typeof toneClass] || toneClass.warning)}>
              <p className="text-[16px] font-bold">{f.title}</p>
              {(f?.lines || []).map((l: string, lIdx: number) => (
                <p key={lIdx} className="mt-1 text-[15px]">
                  → {l}
                </p>
              ))}
            </div>
          ))}
        </div>

        <SectionTitle>✅ What to do</SectionTitle>
        <Card className="border-success/40 shadow-card">
          <CardContent className="flex flex-col gap-3 pt-6">
            {actions.map((item: string, idx: number) => (
              <div key={idx} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                <p className="text-[15px] font-medium">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <SectionTitle>⚠️ Warning signs — go to hospital</SectionTitle>
        <Card className="border-destructive/40 shadow-card">
          <CardContent className="flex flex-col gap-3 pt-6">
            {warnings.map((item: string, idx: number) => (
              <div key={idx} className="flex gap-3">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
                <p className="text-[15px] font-medium">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button asChild variant="destructive" className="h-12 text-[14px]">
            <Link to="/emergency">
              <Phone className="size-4" /> Emergency
            </Link>
          </Button>
          <Button variant="outline" className="h-12 text-[14px]" onClick={() => toast.success("Saved as PDF")}>
            <Download className="size-4" /> Save as PDF
          </Button>
          <Button variant="outline" className="h-12 text-[14px]" onClick={() => toast.success("Shared with family")}>
            <Share2 className="size-4" /> Share
          </Button>
          <Button asChild variant="outline" className="h-12 text-[14px]">
            <Link to="/medicines">
              <Bell className="size-4" /> Set reminders
            </Link>
          </Button>
        </div>

        <Accordion type="single" collapsible className="mt-6 rounded-xl bg-card px-4 shadow-card">
          <AccordionItem value="full" className="border-none">
            <AccordionTrigger className="text-[16px] font-semibold">View full report</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Normal</TableHead>
                    <TableHead>Flag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableRows.map((r: any, idx: number) => (
                    <TableRow key={r.test || idx}>
                      <TableCell className="text-[14px] font-medium">{r.test}</TableCell>
                      <TableCell className="text-[14px]">{r.value}</TableCell>
                      <TableCell className="caption-text">{r.range}</TableCell>
                      <TableCell
                        className={cn(
                          "text-[14px] font-semibold",
                          r.flag === "Normal" ? "text-success" : "text-destructive",
                        )}
                      >
                        {r.flag}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Screen>
    </PhoneFrame>
  );
}

