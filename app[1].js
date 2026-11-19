/**
 * TruthLens AI - Universal Fact-Checking & Misinformation Detection Platform
 * Client Application Controller (SECURE BACKEND ARCHITECTURE)
 * 
 * SECURITY COMPLIANCE:
 * - ZERO API keys stored on client (no keys in code, localStorage, or requests).
 * - All external Gemini AI reasoning & Tavily live search requests are processed
 *   strictly by the server backend (backend/.env).
 * - Client communicates exclusively with backend endpoints: /api/verify, /api/translate, /api/health.
 */

// --- 1. CONFIGURATION ---
const BACKEND_BASE = (window.location.protocol === "http:" || window.location.protocol === "https:")
  ? ""
  : "http://localhost:8000";

const NEWS_CATEGORIES = [
  "Politics and Elections",
  "Geopolitics and International Relations",
  "Wars, Conflicts, and Diplomacy",
  "Sports and Tournaments",
  "Business and Finance",
  "Economics and Government Policies",
  "Science and Research",
  "Technology and Artificial Intelligence",
  "Health and Medicine",
  "Entertainment and Celebrities",
  "Education",
  "Crime and Law",
  "Environment and Climate",
  "History",
  "Social Issues",
  "Government Announcements",
  "International News",
  "Other and Miscellaneous Topics"
];

const CATEGORY_VERIFICATION_PROTOCOLS = {
  "Politics and Elections": "Verify election results against official electoral commissions; inspect full transcripts of speeches for out-of-context clips; cross-check official gazettes and voting rolls; remain non-partisan.",
  "Geopolitics and International Relations": "Verify diplomatic statements, treaties, and sanctions against official foreign ministry releases and multilateral bodies (UN, EU, NATO, ASEAN); distinguish formal ratifications from draft talks.",
  "Wars, Conflicts, and Diplomacy": "Treat conflict reports with extreme caution; cross-verify casualty and territorial claims with independent international monitors (ICRC, UN, neutral human rights agencies); verify footage is not recycled from past wars.",
  "Sports and Tournaments": "Check official match reports, federations (FIFA, IOC, ICC, NBA), authorized club announcements, and sports statistics databases.",
  "Business and Finance": "Verify corporate statements, earnings, acquisitions, and executive moves against official regulatory filings (SEC, MCA), stock exchange disclosures, and verified wire releases.",
  "Economics and Government Policies": "Cross-check macroeconomic metrics (GDP, inflation, CPI, interest rates) against central banks (RBI, Fed, ECB), national statistical offices, World Bank, and IMF datasets.",
  "Science and Research": "Verify claims in peer-reviewed scientific journals (Nature, Science, Lancet, PubMed); distinguish early preprints or laboratory trials from confirmed scientific consensus.",
  "Technology and Artificial Intelligence": "Verify model benchmarks, architecture specs, and cybersecurity reports against official engineering papers, model cards, CVE registers, and public code repositories.",
  "Health and Medicine": "Prioritize recognized public health authorities (WHO, CDC, ICMR, FDA, NHS); flag unverified miracle cures, pseudoscientific health advice, or misquoted clinical studies.",
  "Entertainment and Celebrities": "Verify celebrity news, health reports, awards, and casting rumors against official talent agencies, verified personal channels, and trade publications.",
  "Education": "Verify exam results, policy directives, scholarship announcements, and university rankings against official education ministry portals and accredited institutions.",
  "Crime and Law": "Verify arrests, legal filings, and judicial verdicts against official court dockets, police statements, and justice ministry releases; distinguish allegations from convictions.",
  "Environment and Climate": "Verify meteorological records, carbon data, and climate phenomena with WMO, NOAA, NASA, IPCC, and peer-reviewed climate literature.",
  "History": "Check historical events, archival records, and attributed quotations with academic historians, national archives, and primary source documents.",
  "Social Issues": "Verify demographic figures, social surveys, and census stats against official statistical bureaus and established polling methodology reports (Pew, Gallup).",
  "Government Announcements": "Confirm official subsidies, public alerts, holidays, and circulars directly on official government domains (.gov, .nic.in, official gazettes) to detect viral scam notices.",
  "International News": "Cross-examine international dispatches across major global wires (AP, Reuters, AFP, BBC, DW) and reliable local reporting; check translation integrity.",
  "Other and Miscellaneous Topics": "Apply universal multi-source cross-examination: isolate atomic claims, search primary sources, verify original timestamps, and separate rumors from established facts."
};

// --- 2. MULTI-LANGUAGE UI DICTIONARIES (EN, HI, ES, FR, AR) ---
const UI_TRANSLATIONS = {
  en: {
    reportTitle: "Verification Report",
    analysisCompletedIn: "Analysis completed in",
    groundedWithSearch: "Grounded with live web search",
    submittedContent: "Submitted Content Under Investigation",
    coreVerdict: "Core Verdict",
    credibilityScore: "Credibility Score",
    credibilityNote: "Reflects evidentiary strength and corroboration from independent sources—not a statistical probability of truth.",
    executiveSummary: "Executive Summary",
    readFullExplanation: "Read Full Explanation",
    showLess: "Show Less",
    claimVerification: "Claim Verification",
    supportingFacts: "Supporting Evidence",
    contradictingFacts: "Contradicting Evidence",
    noSupportingEvidence: "No supporting evidence found.",
    noContradictingEvidence: "No contradicting evidence found.",
    unansweredQuestions: "Unanswered Questions:",
    evidenceComparison: "Evidence Comparison",
    supportingSources: "Supporting Sources & Quotations",
    contradictingSources: "Contradicting Sources & Quotations",
    noSourcesFound: "No independent sources found for this stance.",
    crossConsensus: "Cross-Source Consensus",
    crossDivergences: "Cross-Source Divergences",
    sourceCredibility: "Source Credibility",
    transparencyScore: "Transparency Score",
    publisher: "Publisher:",
    author: "Author Evaluation:",
    institutional: "Institutional Oversight:",
    verifiableAssertions: "✓ Verifiable Assertions",
    unverifiedClaims: "✗ Unverified Claims",
    additionalAnalysis: "Additional Analysis",
    additionalAnalysisSubtitle: "Expand any section below for deep forensic breakdown",
    newsBias: "News Bias Analysis",
    biasOrientation: "Orientation:",
    flaggedSentences: "Flagged Sentences & Neutral Rewrites",
    originalText: "Original:",
    neutralRewrite: "Neutral Rewrite:",
    headlineAccuracy: "Headline Accuracy",
    clickbaitSeverity: "Clickbait Severity:",
    recommendedHeadline: "Recommended Neutral Headline:",
    sensationalExaggerations: "Sensationalist Exaggerations",
    newsTimeline: "News Timeline & Recycled News",
    timelineStatus: "Timeline Status",
    originalEventDate: "Original Event Date:",
    claimedPublicationDate: "Claimed Publication Date:",
    relevanceAssessment: "Relevance Assessment:",
    missingContext: "Missing Context",
    omittedBackground: "Omitted Background:",
    incompleteStatistics: "Incomplete Statistics:",
    unmentionedTimeframes: "Unmentioned Timeframes:",
    impactOnPerception: "Impact on Public Perception:",
    manipulation: "Manipulation Analysis",
    fearmongering: "Fearmongering:",
    urgencyFraming: "Urgency Framing:",
    artificialOutrage: "Artificial Outrage:",
    conspiracyFraming: "Conspiracy Framing:",
    psychologicalImpact: "Psychological Reader Impact:",
    objectiveInterpretation: "Objective Interpretation:",
    detectedTag: "Detected",
    noneTag: "None",
    finalAssessment: "Final Assessment",
    reasoningForVerdict: "Reasoning for Verdict",
    limitationsDisclosures: "Methodological Disclosures & Limitations:",
    searchQueriesExecuted: "Search Queries Executed:",
    verifiedCitations: "Clickable Live Citations:",
    translatingText: "Translating report...",
    verdictTerms: {
      "LIKELY TRUE": "LIKELY TRUE",
      "LIKELY FALSE": "LIKELY FALSE",
      "MISLEADING": "MISLEADING",
      "UNVERIFIED": "UNVERIFIED",
      "OUTDATED": "OUTDATED",
      "PARTIALLY TRUE": "PARTIALLY TRUE",
      "SATIRE / PARODY": "SATIRE / PARODY"
    }
  },
  hi: {
    reportTitle: "सत्यापन रिपोर्ट",
    analysisCompletedIn: "विश्लेषण पूर्ण हुआ",
    groundedWithSearch: "लाइव वेब खोज से सत्यापित",
    submittedContent: "जाँच हेतु प्रस्तुत सामग्री",
    coreVerdict: "मुख्य निष्कर्ष",
    credibilityScore: "विश्वसनीयता स्कोर",
    credibilityNote: "यह स्कोर स्वतंत्र स्रोतों से प्राप्त साक्ष्यों की पुष्टि को दर्शाता है—यह सत्य होने की सांख्यिकीय संभावना नहीं है।",
    executiveSummary: "कार्यकारी सारांश",
    readFullExplanation: "पूर्ण व्याख्या पढ़ें",
    showLess: "कम दिखाएं",
    claimVerification: "दावा-दर-दावा सत्यापन",
    supportingFacts: "समर्थक साक्ष्य",
    contradictingFacts: "खंडनकारी साक्ष्य",
    noSupportingEvidence: "कोई समर्थक साक्ष्य नहीं मिला।",
    noContradictingEvidence: "कोई खंडनकारी साक्ष्य नहीं मिला।",
    unansweredQuestions: "अनुत्तरित प्रश्न:",
    evidenceComparison: "साक्ष्य तुलना",
    supportingSources: "समर्थक स्रोत एवं उद्धरण",
    contradictingSources: "खंडनकारी स्रोत एवं उद्धरण",
    noSourcesFound: "इस पक्ष के लिए कोई स्वतंत्र स्रोत नहीं मिले।",
    crossConsensus: "स्रोतों के बीच सहमति",
    crossDivergences: "स्रोतों के बीच भिन्नताएं",
    sourceCredibility: "स्रोत विश्वसनीयता",
    transparencyScore: "पारदर्शिता स्कोर",
    publisher: "प्रकाशक:",
    author: "लेखक मूल्यांकन:",
    institutional: "संस्थागत निगरानी:",
    verifiableAssertions: "✓ सत्यापनीय तथ्य",
    unverifiedClaims: "✗ असत्यापित दावे",
    additionalAnalysis: "अतिरिक्त विश्लेषण",
    additionalAnalysisSubtitle: "विस्तृत फोरेंसिक विश्लेषण के लिए नीचे किसी भी अनुभाग का विस्तार करें",
    newsBias: "समाचार पूर्वाग्रह विश्लेषण",
    biasOrientation: "झुकाव:",
    flaggedSentences: "चिह्नित वाक्य एवं निष्पक्ष पुनर्लेखन",
    originalText: "मूल वाक्य:",
    neutralRewrite: "निष्पक्ष पुनर्लेखन:",
    headlineAccuracy: "शीर्षक सटीकता",
    clickbaitSeverity: "क्लिकबेट स्तर:",
    recommendedHeadline: "सुझाया गया निष्पक्ष शीर्षक:",
    sensationalExaggerations: "सनसनीखेज अतिशयोक्ति",
    newsTimeline: "समाचार समयरेखा एवं पुरानी खबर",
    timelineStatus: "समयरेखा स्थिति",
    originalEventDate: "मूल घटना की तिथि:",
    claimedPublicationDate: "प्रसारित प्रकाशन तिथि:",
    relevanceAssessment: "वर्तमान प्रासंगिकता:",
    missingContext: "अनुपस्थित संदर्भ",
    omittedBackground: "छोड़ा गया पृष्ठभूमि संदर्भ:",
    incompleteStatistics: "अपूर्ण आँकड़े:",
    unmentionedTimeframes: "अनुल्लेखित समय सीमा:",
    impactOnPerception: "जनमानस की धारणा पर प्रभाव:",
    manipulation: "मनोवैज्ञानिक जोड़-तोड़ विश्लेषण",
    fearmongering: "डर का माहौल बनाना:",
    urgencyFraming: "झूठी तात्कालिकता:",
    artificialOutrage: "कृत्रिम आक्रोश:",
    conspiracyFraming: "साज़िश का ढांचा:",
    psychologicalImpact: "पाठकों पर मनोवैज्ञानिक प्रभाव:",
    objectiveInterpretation: "वस्तुनिष्ठ व्याख्या:",
    detectedTag: "पाया गया",
    noneTag: "नहीं मिला",
    finalAssessment: "अंतिम मूल्यांकन",
    reasoningForVerdict: "निष्कर्ष का आधार एवं तर्क",
    limitationsDisclosures: "पद्धति संबंधी खुलासे एवं सीमाएं:",
    searchQueriesExecuted: "क्रियान्वित वेब खोज:",
    verifiedCitations: "सत्यापित लाइव संदर्भ:",
    translatingText: "रिपोर्ट का अनुवाद हो रहा है...",
    verdictTerms: {
      "LIKELY TRUE": "संभावित रूप से सत्य",
      "LIKELY FALSE": "संभावित रूप से असत्य",
      "MISLEADING": "भ्रामक",
      "UNVERIFIED": "असत्यापित",
      "OUTDATED": "पुरानी खबर",
      "PARTIALLY TRUE": "आंशिक रूप से सत्य",
      "SATIRE / PARODY": "व्यंग्य / पैरोडी"
    }
  },
  es: {
    reportTitle: "Informe de Verificación",
    analysisCompletedIn: "Análisis completado en",
    groundedWithSearch: "Fundamentado con búsqueda web en vivo",
    submittedContent: "Contenido presentado para investigación",
    coreVerdict: "Veredicto Principal",
    credibilityScore: "Puntuación de Credibilidad",
    credibilityNote: "Refleja la solidez y corroboración de las pruebas de fuentes independientes, no una probabilidad estadística.",
    executiveSummary: "Resumen Ejecutivo",
    readFullExplanation: "Leer Explicación Completa",
    showLess: "Mostrar Menos",
    claimVerification: "Verificación de Afirmaciones",
    supportingFacts: "Pruebas de Apoyo",
    contradictingFacts: "Pruebas Contradictorias",
    noSupportingEvidence: "No se encontraron pruebas de apoyo.",
    noContradictingEvidence: "No se encontraron pruebas contradictorias.",
    unansweredQuestions: "Preguntas sin Resolver:",
    evidenceComparison: "Comparación de Pruebas",
    supportingSources: "Fuentes de Apoyo y Citas",
    contradictingSources: "Fuentes Contradictorias y Citas",
    noSourcesFound: "No se encontraron fuentes independientes para esta postura.",
    crossConsensus: "Consenso entre Fuentes",
    crossDivergences: "Divergencias entre Fuentes",
    sourceCredibility: "Credibilidad de la Fuente",
    transparencyScore: "Puntuación de Transparencia",
    publisher: "Editorial:",
    author: "Evaluación del Autor:",
    institutional: "Supervisión Institucional:",
    verifiableAssertions: "✓ Afirmaciones Verificables",
    unverifiedClaims: "✗ Afirmaciones No Verificadas",
    additionalAnalysis: "Análisis Adicional",
    additionalAnalysisSubtitle: "Expanda cualquier sección para ver el análisis forense detallado",
    newsBias: "Análisis de Sesgo",
    biasOrientation: "Orientación:",
    flaggedSentences: "Frases Señaladas y Redacción Neutral",
    originalText: "Original:",
    neutralRewrite: "Redacción Neutral:",
    headlineAccuracy: "Exactitud del Titular",
    clickbaitSeverity: "Nivel de Clickbait:",
    recommendedHeadline: "Titular Neutral Recomendado:",
    sensationalExaggerations: "Exageraciones Sensacionalistas",
    newsTimeline: "Línea Temporal y Noticias Recicladas",
    timelineStatus: "Estado Temporal",
    originalEventDate: "Fecha Original del Suceso:",
    claimedPublicationDate: "Fecha de Publicación Declarada:",
    relevanceAssessment: "Evaluación de Relevancia:",
    missingContext: "Contexto Faltante",
    omittedBackground: "Antecedentes Omitidos:",
    incompleteStatistics: "Estadísticas Incompletas:",
    unmentionedTimeframes: "Plazos No Mencionados:",
    impactOnPerception: "Impacto en la Percepción Pública:",
    manipulation: "Análisis de Manipulación",
    fearmongering: "Inculcación de Miedo:",
    urgencyFraming: "Falsa Urgencia:",
    artificialOutrage: "Indignación Artificial:",
    conspiracyFraming: "Enfoque de Conspiración:",
    psychologicalImpact: "Impacto Psicológico en el Lector:",
    objectiveInterpretation: "Interpretación Objetiva:",
    detectedTag: "Detectado",
    noneTag: "Ninguno",
    finalAssessment: "Evaluación Final",
    reasoningForVerdict: "Razonamiento del Veredicto",
    limitationsDisclosures: "Divulgaciones Metodológicas y Limitaciones:",
    searchQueriesExecuted: "Consultas de Búsqueda Ejecutadas:",
    verifiedCitations: "Citas en Vivo Verificadas:",
    translatingText: "Traduciendo informe...",
    verdictTerms: {
      "LIKELY TRUE": "PROBABLEMENTE VERDADERO",
      "LIKELY FALSE": "PROBABLEMENTE FALSO",
      "MISLEADING": "ENGAÑOSO",
      "UNVERIFIED": "NO VERIFICADO",
      "OUTDATED": "DESACTUALIZADO",
      "PARTIALLY TRUE": "PARCIALMENTE VERDADERO",
      "SATIRE / PARODY": "SÁTIRA / PARODIA"
    }
  },
  fr: {
    reportTitle: "Rapport de Vérification",
    analysisCompletedIn: "Analyse terminée en",
    groundedWithSearch: "Fondé sur des recherches web en direct",
    submittedContent: "Contenu soumis à l'enquête",
    coreVerdict: "Verdict Principal",
    credibilityScore: "Score de Crédibilité",
    credibilityNote: "Reflète la solidité et la corroboration des preuves de sources indépendantes, et non une probabilité statistique.",
    executiveSummary: "Résumé Exécutif",
    readFullExplanation: "Lire l'Explication Complète",
    showLess: "Afficher Moins",
    claimVerification: "Vérification des Affirmations",
    supportingFacts: "Preuves à l'Appui",
    contradictingFacts: "Preuves Contradictoires",
    noSupportingEvidence: "Aucune preuve à l'appui trouvée.",
    noContradictingEvidence: "Aucune preuve contradictoire trouvée.",
    unansweredQuestions: "Questions sans Réponse :",
    evidenceComparison: "Comparaison des Preuves",
    supportingSources: "Sources et Citations à l'Appui",
    contradictingSources: "Sources et Citations Contradictoires",
    noSourcesFound: "Aucune source indépendante trouvée pour cette position.",
    crossConsensus: "Consensus entre les Sources",
    crossDivergences: "Divergences entre les Sources",
    sourceCredibility: "Crédibilité des Sources",
    transparencyScore: "Score de Transparence",
    publisher: "Éditeur :",
    author: "Évaluation de l'Auteur :",
    institutional: "Supervision Institutionnelle :",
    verifiableAssertions: "✓ Affirmations Vérifiables",
    unverifiedClaims: "✗ Affirmations Non Vérifiées",
    additionalAnalysis: "Analyses Complémentaires",
    additionalAnalysisSubtitle: "Développez chaque section pour consulter l'analyse approfondie",
    newsBias: "Analyse des Biais",
    biasOrientation: "Orientation :",
    flaggedSentences: "Phrases Signalées et Réécritures Neutres",
    originalText: "Original :",
    neutralRewrite: "Réécriture Neutre :",
    headlineAccuracy: "Exactitude du Titre",
    clickbaitSeverity: "Niveau de Piège à Clics :",
    recommendedHeadline: "Titre Neutre Recommandé :",
    sensationalExaggerations: "Exagérations Sensationnalistes",
    newsTimeline: "Chronologie et Actualité Recyclée",
    timelineStatus: "Statut Chronologique",
    originalEventDate: "Date d'Origine de l'Événement :",
    claimedPublicationDate: "Date de Publication Affirmée :",
    relevanceAssessment: "Évaluation de la Pertinence :",
    missingContext: "Contexte Manquant",
    omittedBackground: "Contexte Historique Omis :",
    incompleteStatistics: "Statistiques Incomplètes :",
    unmentionedTimeframes: "Périodes Non Précisées :",
    impactOnPerception: "Impact sur la Perception Publique :",
    manipulation: "Analyse de Manipulation",
    fearmongering: "Discours Alarmiste :",
    urgencyFraming: "Faux Sentiment d'Urgence :",
    artificialOutrage: "Indignation Artificielle :",
    conspiracyFraming: "Cadrage Complotiste :",
    psychologicalImpact: "Impact Psychologique sur le Lecteur :",
    objectiveInterpretation: "Interprétation Objective :",
    detectedTag: "Détecté",
    noneTag: "Aucun",
    finalAssessment: "Évaluation Finale",
    reasoningForVerdict: "Raisonnement du Verdict",
    limitationsDisclosures: "Divulgations Méthodologiques et Limites :",
    searchQueriesExecuted: "Requêtes de Recherche Exécutées :",
    verifiedCitations: "Citations Directes Vérifiées :",
    translatingText: "Traduction du rapport en cours...",
    verdictTerms: {
      "LIKELY TRUE": "PROBABLEMENT VRAI",
      "LIKELY FALSE": "PROBABLEMENT FAUX",
      "MISLEADING": "TROMPEUR",
      "UNVERIFIED": "NON VÉRIFIÉ",
      "OUTDATED": "PÉRIMÉ",
      "PARTIALLY TRUE": "PARTIELLEMENT VRAI",
      "SATIRE / PARODY": "SATIRE / PARODIE"
    }
  },
  ar: {
    reportTitle: "تقرير التحقق من صحة الأخبار",
    analysisCompletedIn: "اكتمل التحليل خلال",
    groundedWithSearch: "مدعوم بنتائج بحث حية على الإنترنت",
    submittedContent: "المحتوى المقدم للتحقيق",
    coreVerdict: "الحكم الرئيسي",
    credibilityScore: "مؤشر المصداقية",
    credibilityNote: "يعكس مدى قوة وتوافق الأدلة المأخوذة من مصادر مستقلة، وليس احتمالاً إحصائياً لصحة الخبر.",
    executiveSummary: "الملخص التنفيذي",
    readFullExplanation: "قراءة التفسير الكامل",
    showLess: "عرض أقل",
    claimVerification: "التحقق من الادعاءات",
    supportingFacts: "الأدلة الداعمة",
    contradictingFacts: "الأدلة المفندة",
    noSupportingEvidence: "لم يتم العثور على أدلة داعمة.",
    noContradictingEvidence: "لم يتم العثور على أدلة مفندة.",
    unansweredQuestions: "أسئلة معلقة:",
    evidenceComparison: "مقارنة الأدلة",
    supportingSources: "المصادر الداعمة والاقتباسات",
    contradictingSources: "المصادر المفندة والاقتباسات",
    noSourcesFound: "لم يتم العثور على مصادر مستقلة لهذا الموقف.",
    crossConsensus: "نقاط الاتفاق بين المصادر",
    crossDivergences: "نقاط الاختلاف بين المصادر",
    sourceCredibility: "موثوقية المصدر",
    transparencyScore: "مؤشر الشفافية",
    publisher: "الجهة الناشرة:",
    author: "تقييم الكاتب:",
    institutional: "الرقابة المؤسسية:",
    verifiableAssertions: "✓ تأكيدات قابلة للإثبات",
    unverifiedClaims: "✗ ادعاءات غير مثبتة",
    additionalAnalysis: "التحليلات الإضافية",
    additionalAnalysisSubtitle: "انقر على أي قسم أدناه للاطلاع على التحليل الجنائي المفصل",
    newsBias: "تحليل التحيز الإخباري",
    biasOrientation: "التوجه:",
    flaggedSentences: "العبارات المرصودة وإعادة الصياغة المحايدة",
    originalText: "النص الأصلي:",
    neutralRewrite: "إعادة الصياغة المحايدة:",
    headlineAccuracy: "دقة العنوان",
    clickbaitSeverity: "درجة الإثارة الصحفية (كليك بيت):",
    recommendedHeadline: "العنوان المحايد المقترح:",
    sensationalExaggerations: "المبالغات المثيرة",
    newsTimeline: "التسلسل الزمني والأخبار المعاد تدويرها",
    timelineStatus: "حالة التوقيت",
    originalEventDate: "تاريخ الحدث الأصلي:",
    claimedPublicationDate: "تاريخ النشر المزعوم:",
    relevanceAssessment: "تقييم الأهمية الحالية:",
    missingContext: "السياق الناقص",
    omittedBackground: "الخلفية المحذوفة:",
    incompleteStatistics: "إحصائيات منقوصة:",
    unmentionedTimeframes: "فترات زمنية غير محددة:",
    impactOnPerception: "التأثير على فهم الجمهور:",
    manipulation: "تحليل أساليب التلاعب",
    fearmongering: "بث الخوف والرعب:",
    urgencyFraming: "خلق شعور زائف بالإلحاح:",
    artificialOutrage: "إثارة الغضب المصطنع:",
    conspiracyFraming: "صياغة تآمرية:",
    psychologicalImpact: "التأثير النفسي على القارئ:",
    objectiveInterpretation: "التفسير الموضوعي:",
    detectedTag: "تم رصده",
    noneTag: "غير موجود",
    finalAssessment: "التقييم النهائي",
    reasoningForVerdict: "التعليل وأسباب الحكم",
    limitationsDisclosures: "الحدود المنهجية والإفصاحات:",
    searchQueriesExecuted: "عمليات البحث المنفذة:",
    verifiedCitations: "روابط المصادر الموثقة:",
    translatingText: "جارٍ ترجمة التقرير...",
    verdictTerms: {
      "LIKELY TRUE": "صحيح على الأرجح",
      "LIKELY FALSE": "زائف على الأرجح",
      "MISLEADING": "مضلل",
      "UNVERIFIED": "غير مؤكد",
      "OUTDATED": "قديم وخارج السياق",
      "PARTIALLY TRUE": "صحيح جزئياً",
      "SATIRE / PARODY": "ساخر / محاكاة تهكمية"
    }
  }
};

// --- 3. STATE MANAGEMENT ---
const State = {
  activeTab: "text",
  currentReport: null,
  isAnalyzing: false,
  isTranslating: false,
  currentLanguage: localStorage.getItem("truthlens_lang") || "en",
  uploadedFile: null,
  uploadedBase64: null,
  uploadedPdfText: null,

  getHistory() {
    try {
      return JSON.parse(localStorage.getItem("truthlens_history") || "[]");
    } catch {
      return [];
    }
  },
  saveToHistory(report) {
    try {
      const history = this.getHistory();
      const item = {
        id: report.id || "tl_" + Date.now(),
        date: new Date().toISOString(),
        category: report.category,
        verdict: report.verdict,
        credibility_score: report.credibility_score,
        primary_claim: report.primary_claim || (report.summary ? report.summary.substring(0, 100) : ""),
        report: report
      };
      const updated = [item, ...history.filter(h => h.id !== item.id)].slice(0, 50);
      localStorage.setItem("truthlens_history", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save to history:", e);
    }
  },
  getCache(key) {
    try {
      const cache = JSON.parse(localStorage.getItem("truthlens_cache") || "{}");
      return cache[key] || null;
    } catch {
      return null;
    }
  },
  setCache(key, report) {
    try {
      const cache = JSON.parse(localStorage.getItem("truthlens_cache") || "{}");
      cache[key] = { timestamp: Date.now(), report };
      const keys = Object.keys(cache);
      if (keys.length > 30) delete cache[keys[0]];
      localStorage.setItem("truthlens_cache", JSON.stringify(cache));
    } catch (e) {
      console.warn("Could not write cache:", e);
    }
  }
};

// --- 4. UTILITIES ---
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function computeHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "hash_" + Math.abs(hash).toString(36);
}

function getVerdictClass(verdict) {
  const v = (verdict || "").toUpperCase();
  if (v.includes("TRUE") && !v.includes("PARTIALLY")) return "likely-true";
  if (v.includes("FALSE")) return "likely-false";
  if (v.includes("MISLEADING")) return "misleading";
  if (v.includes("OUTDATED")) return "outdated";
  if (v.includes("PARTIALLY")) return "partially-true";
  if (v.includes("SATIRE")) return "satire";
  return "unverified";
}

function getVerdictBadgeColor(verdict) {
  const v = (verdict || "").toUpperCase();
  if (v.includes("TRUE") && !v.includes("PARTIALLY")) return "background: rgba(16, 185, 129, 0.18); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4);";
  if (v.includes("FALSE")) return "background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4);";
  if (v.includes("MISLEADING")) return "background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4);";
  if (v.includes("OUTDATED")) return "background: rgba(236, 72, 153, 0.18); color: #f472b6; border: 1px solid rgba(236, 72, 153, 0.4);";
  if (v.includes("PARTIALLY")) return "background: rgba(59, 130, 246, 0.18); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4);";
  if (v.includes("SATIRE")) return "background: rgba(20, 184, 166, 0.18); color: #2dd4bf; border: 1px solid rgba(20, 184, 166, 0.4);";
  return "background: rgba(148, 163, 184, 0.18); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.35);";
}

function getVerdictIcon(verdict) {
  const v = (verdict || "").toUpperCase();
  if (v.includes("TRUE") && !v.includes("PARTIALLY")) return "✓";
  if (v.includes("FALSE")) return "✗";
  if (v.includes("MISLEADING")) return "⚠";
  if (v.includes("OUTDATED")) return "⏱";
  if (v.includes("PARTIALLY")) return "◐";
  if (v.includes("SATIRE")) return "🎭";
  return "?";
}

// --- 5. SECURE BACKEND API CLIENT (NO CREDENTIALS ON CLIENT) ---
async function checkBackendHealth() {
  const statusPill = document.getElementById("backendStatusPill");
  const statusText = document.getElementById("backendStatusText");
  const statusDot = document.getElementById("backendStatusDot");

  try {
    const res = await fetch(`${BACKEND_BASE}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    if (statusText) statusText.textContent = data.service || "AI Verification Service: Connected";
    if (statusDot) statusDot.style.backgroundColor = "#10b981";
    if (statusPill) statusPill.style.borderColor = "rgba(16, 185, 129, 0.4)";
  } catch (err) {
    if (statusText) statusText.textContent = "AI Verification Service: Temporarily Unavailable";
    if (statusDot) statusDot.style.backgroundColor = "#f87171";
    if (statusPill) statusPill.style.borderColor = "rgba(239, 68, 68, 0.4)";
  }
}

async function apiVerify(payload, onProgress) {
  onProgress(1, "Submitting claim to secure verification service...");

  const timer = setInterval(() => {
    // Smooth progress simulation while backend investigates
    const curr = parseInt(document.getElementById("progressStatusText")?.dataset?.step || "1", 10);
    if (curr < 4) {
      const next = curr + 1;
      const msgs = {
        2: "Live web evidence gathering across authoritative sources...",
        3: "Deep forensic AI cross-examination & bias analysis...",
        4: "Formulating verdict and structured report..."
      };
      onProgress(next, msgs[next] || "Analyzing...");
      if (document.getElementById("progressStatusText")) {
        document.getElementById("progressStatusText").dataset.step = next;
      }
    }
  }, 1800);

  try {
    const response = await fetch(`${BACKEND_BASE}/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: payload.type || "text",
        text: payload.text,
        image_base64: payload.imageBase64,
        target_language: State.currentLanguage
      })
    });

    clearInterval(timer);

    if (!response.ok) {
      let errDetail = "Verification service request failed.";
      try {
        const errJson = await response.json();
        errDetail = errJson.detail || errDetail;
      } catch {}
      throw new Error(errDetail);
    }

    onProgress(5, "Verification complete!");
    const report = await response.json();
    report._translations = {};
    return report;
  } catch (err) {
    clearInterval(timer);
    throw err;
  }
}

async function apiTranslate(report, targetLang) {
  if (targetLang === "en") return report;
  if (report._translations && report._translations[targetLang]) {
    return report._translations[targetLang];
  }

  const response = await fetch(`${BACKEND_BASE}/api/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      report: report,
      target_language: targetLang
    })
  });

  if (!response.ok) {
    let errDetail = "Translation service failed.";
    try {
      const errJson = await response.json();
      errDetail = errJson.detail || errDetail;
    } catch {}
    throw new Error(errDetail);
  }

  const translatedReport = await response.json();
  if (!report._translations) report._translations = {};
  report._translations[targetLang] = translatedReport;
  return translatedReport;
}

// --- 6. UI LABELS CONTROLLER ---
function applyUiLanguage(lang) {
  const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  if (lang === "ar") {
    document.body.classList.add("rtl-mode");
    document.body.setAttribute("dir", "rtl");
  } else {
    document.body.classList.remove("rtl-mode");
    document.body.removeAttribute("dir");
  }

  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };

  setTxt("uiReportTitle", dict.reportTitle);
  setTxt("uiAnalysisCompletedIn", dict.analysisCompletedIn);
  setTxt("uiGroundedWithSearch", dict.groundedWithSearch);
  setTxt("uiCoreVerdictTitle", dict.coreVerdict);
  setTxt("uiSubmittedContentTitle", dict.submittedContent);
  setTxt("uiCredibilityScoreTitle", dict.credibilityScore);
  setTxt("credibilityNote", dict.credibilityNote);
  setTxt("uiExecutiveSummaryTitle", dict.executiveSummary);
  setTxt("toggleSummaryText", dict.readFullExplanation);
  setTxt("uiClaimVerificationTitle", dict.claimVerification);
  setTxt("uiEvidenceComparisonTitle", dict.evidenceComparison);
  setTxt("uiSupportingSourcesHeader", dict.supportingSources);
  setTxt("uiContradictingSourcesHeader", dict.contradictingSources);
  setTxt("uiCrossConsensusHeader", dict.crossConsensus);
  setTxt("uiCrossDivergencesHeader", dict.crossDivergences);
  setTxt("uiAdditionalAnalysisTitle", dict.additionalAnalysis);
  setTxt("uiAdditionalAnalysisSubtitle", dict.additionalAnalysisSubtitle);
  setTxt("uiNewsBiasTitle", dict.newsBias);
  setTxt("uiBiasOrientationLabel", dict.biasOrientation);
  setTxt("uiFlaggedSentencesHeader", dict.flaggedSentences);
  setTxt("uiHeadlineAccuracyTitle", dict.headlineAccuracy);
  setTxt("uiClickbaitSeverityLabel", dict.clickbaitSeverity);
  setTxt("uiRecommendedHeadlineLabel", dict.recommendedHeadline);
  setTxt("uiSensationalExaggerationsHeader", dict.sensationalExaggerations);
  setTxt("uiNewsTimelineTitle", dict.newsTimeline);
  setTxt("uiOriginalEventDateLabel", dict.originalEventDate);
  setTxt("uiClaimedPublicationDateLabel", dict.claimedPublicationDate);
  setTxt("uiRelevanceAssessmentLabel", dict.relevanceAssessment);
  setTxt("uiMissingContextTitle", dict.missingContext);
  setTxt("uiOmittedBackgroundLabel", dict.omittedBackground);
  setTxt("uiIncompleteStatisticsLabel", dict.incompleteStatistics);
  setTxt("uiUnmentionedTimeframesLabel", dict.unmentionedTimeframes);
  setTxt("uiImpactOnPerceptionLabel", dict.impactOnPerception);
  setTxt("uiManipulationTitle", dict.manipulation);
  setTxt("uiFearmongeringLabel", dict.fearmongering);
  setTxt("uiUrgencyFramingLabel", dict.urgencyFraming);
  setTxt("uiArtificialOutrageLabel", dict.artificialOutrage);
  setTxt("uiConspiracyFramingLabel", dict.conspiracyFraming);
  setTxt("uiPsychologicalImpactLabel", dict.psychologicalImpact);
  setTxt("uiObjectiveInterpretationLabel", dict.objectiveInterpretation);
  setTxt("uiSourceCredibilityTitle", dict.sourceCredibility);
  setTxt("uiPublisherLabel", dict.publisher);
  setTxt("uiAuthorLabel", dict.author);
  setTxt("uiInstitutionalLabel", dict.institutional);
  setTxt("uiVerifiableAssertionsHeader", dict.verifiableAssertions);
  setTxt("uiUnverifiedClaimsHeader", dict.unverifiedClaims);
  setTxt("uiFinalAssessmentTitle", dict.finalAssessment);
  setTxt("uiReasoningForVerdictHeader", dict.reasoningForVerdict);
  setTxt("uiLimitationsDisclosuresHeader", dict.limitationsDisclosures);
  setTxt("uiSearchQueriesExecutedHeader", dict.searchQueriesExecuted);
  setTxt("uiVerifiedCitationsHeader", dict.verifiedCitations);
  setTxt("uiTranslatingText", dict.translatingText);
}

// --- 7. EDITORIAL DASHBOARD RENDERER ---
function renderEditorialDashboard(report, lang = "en") {
  const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  applyUiLanguage(lang);

  const dashboard = document.getElementById("dashboardWrapper");
  dashboard.style.display = "block";

  // Date and Time
  document.getElementById("timeElapsed").textContent = `${report.elapsed_seconds || "2.1"}s`;
  const reportDate = report.created_at ? new Date(report.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Today";
  document.getElementById("reportDateFormatted").textContent = reportDate;

  // Core Verdict
  const verdictBanner = document.getElementById("verdictBanner");
  const verdictClass = getVerdictClass(report.verdict);
  verdictBanner.className = `verdict-banner ${verdictClass}`;
  document.getElementById("verdictIcon").textContent = getVerdictIcon(report.verdict);

  const translatedVerdict = dict.verdictTerms?.[report.verdict] || report.verdict;
  document.getElementById("verdictTitle").textContent = translatedVerdict;
  document.getElementById("verdictSummary").textContent = report.summary || "";
  document.getElementById("submittedClaimText").textContent = report.raw_input || report.primary_claim || "";

  // Confidence & Category
  document.getElementById("confidenceBadge").textContent = `Confidence: ${report.confidence_level || "High"}`;
  document.getElementById("categoryTitle").textContent = report.category || "General News";
  document.getElementById("categoryProtocol").textContent = CATEGORY_VERIFICATION_PROTOCOLS[report.category] || "Universal multi-source investigation.";

  // Credibility Score Radial Gauge
  const score = Math.max(0, Math.min(100, report.credibility_score || 0));
  document.getElementById("gaugeScore").textContent = score;
  const gaugeVal = document.getElementById("gaugeVal");
  const circumference = 2 * Math.PI * 50; // r=50 -> ~314.16
  const offset = circumference - (score / 100) * circumference;
  gaugeVal.style.strokeDasharray = circumference;
  gaugeVal.style.strokeDashoffset = offset;

  if (score >= 70) gaugeVal.style.stroke = "#10b981";
  else if (score >= 40) gaugeVal.style.stroke = "#f59e0b";
  else gaugeVal.style.stroke = "#ef4444";

  // Executive Summary & Full Details Toggle
  const summaryShort = document.getElementById("executiveSummaryShort");
  const summaryFull = document.getElementById("executiveSummaryFull");
  const toggleSummaryBtn = document.getElementById("toggleSummaryBtn");
  const toggleSummaryText = document.getElementById("toggleSummaryText");

  summaryShort.textContent = report.summary || "";
  summaryFull.textContent = report.full_explanation || report.explanation || "";
  summaryFull.style.display = "none";
  toggleSummaryText.textContent = dict.readFullExplanation;

  toggleSummaryBtn.onclick = () => {
    const isHidden = summaryFull.style.display === "none";
    summaryFull.style.display = isHidden ? "block" : "none";
    toggleSummaryText.textContent = isHidden ? dict.showLess : dict.readFullExplanation;
    toggleSummaryBtn.innerHTML = isHidden
      ? `<span>${dict.showLess}</span> ▲`
      : `<span>${dict.readFullExplanation}</span> ▼`;
  };

  // Claim-by-Claim Verification
  const claimsContainer = document.getElementById("claimsContainer");
  const claims = report.claims || [];
  document.getElementById("claimCountBadge").textContent = `${claims.length} Claim${claims.length === 1 ? "" : "s"} Analyzed`;

  if (claims.length === 0) {
    claimsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">No separate atomic claims extracted.</p>`;
  } else {
    claimsContainer.innerHTML = claims.map((c, i) => {
      const claimVerdict = c.verdict || "Unverified";
      const hasSupport = c.supporting_evidence && c.supporting_evidence.length > 0;
      const hasContradict = c.contradicting_evidence && c.contradicting_evidence.length > 0;

      return `
        <div class="claim-card">
          <div class="claim-card-top">
            <div class="claim-headline">"${escapeHtml(c.claim)}"</div>
            <span class="claim-badge" style="${getVerdictBadgeColor(claimVerdict)}">${escapeHtml(claimVerdict)}</span>
          </div>
          <div class="claim-explanation-text">${escapeHtml(c.explanation)}</div>
          
          <div class="claim-evidence-grid">
            <div class="claim-evidence-box support">
              <h5 style="color: #34d399;">${dict.supportingFacts}</h5>
              ${hasSupport
                ? c.supporting_evidence.map(e => `<div>• ${escapeHtml(e)}</div>`).join("")
                : `<div class="evidence-empty-msg">${dict.noSupportingEvidence}</div>`
              }
            </div>

            <div class="claim-evidence-box contradict">
              <h5 style="color: #f87171;">${dict.contradictingFacts}</h5>
              ${hasContradict
                ? c.contradicting_evidence.map(e => `<div>• ${escapeHtml(e)}</div>`).join("")
                : `<div class="evidence-empty-msg">${dict.noContradictingEvidence}</div>`
              }
            </div>
          </div>

          ${c.unanswered_questions && c.unanswered_questions.length > 0 ? `
            <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #a78bfa;">
              <strong>${dict.unansweredQuestions}</strong> ${c.unanswered_questions.map(q => escapeHtml(q)).join("; ")}
            </div>
          ` : ""}
        </div>
      `;
    }).join("");
  }

  // Evidence Comparison: Sources List
  const evComp = report.evidence_comparison || {};
  const supportingList = document.getElementById("supportingSourcesList");
  const contradictingList = document.getElementById("contradictingSourcesList");

  const renderSourceItems = (sources) => {
    if (!sources || sources.length === 0) {
      return `<p class="evidence-empty-msg" style="padding: 0.5rem 0;">${dict.noSourcesFound}</p>`;
    }
    return sources.map(s => `
      <div class="source-citation-card">
        <div class="source-citation-header">
          <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">${escapeHtml(s.source_name || "Authoritative Source")}</div>
          <span class="source-reliability-tag">${s.reliability_rating || "Medium"} Reliability</span>
        </div>
        ${s.url ? `
          <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="source-citation-title">
            ${escapeHtml(s.key_quote ? s.key_quote.substring(0, 75) + "..." : s.source_name)} ↗
          </a>
        ` : `<div style="font-size: 0.82rem; color: var(--text-secondary);">${escapeHtml(s.key_quote || "")}</div>`}
        ${s.key_quote ? `<div class="source-excerpt-quote">"${escapeHtml(s.key_quote)}"</div>` : ""}
      </div>
    `).join("");
  };

  supportingList.innerHTML = renderSourceItems(evComp.supporting_sources);
  contradictingList.innerHTML = renderSourceItems(evComp.contradicting_sources);

  // Cross-Source Consensus
  const consensusBox = document.getElementById("consensusContainer");
  const agreements = evComp.cross_source_agreements || [];
  const divergences = evComp.cross_source_divergences || [];

  if (agreements.length === 0 && divergences.length === 0) {
    consensusBox.style.display = "none";
  } else {
    consensusBox.style.display = "grid";
    document.getElementById("crossAgreements").innerHTML = agreements.map(a => `<li>${escapeHtml(a)}</li>`).join("") || `<li>${dict.noneTag}</li>`;
    document.getElementById("crossDivergences").innerHTML = divergences.map(d => `<li>${escapeHtml(d)}</li>`).join("") || `<li>${dict.noneTag}</li>`;
  }

  // Accordion 1: News Bias Analysis
  const bias = report.bias_analysis || {};
  document.getElementById("biasBadgeScore").textContent = `Score: ${bias.bias_score || 0}/100`;
  document.getElementById("biasCategoryText").textContent = bias.bias_category || "Neutral / Balanced";
  document.getElementById("biasIndicatorsContainer").innerHTML = (bias.indicators || ["Balanced"]).map(ind => `
    <span class="meta-pill" style="color: #fbbf24; border-color: rgba(245, 158, 11, 0.3);">${escapeHtml(ind)}</span>
  `).join("");

  const biasDiffs = document.getElementById("biasDiffsContainer");
  const flagged = bias.flagged_segments || [];
  if (flagged.length === 0) {
    biasDiffs.innerHTML = `<p style="color: #34d399; font-size: 0.82rem;">✓ No prominent partisan skew or emotionally manipulative rhetoric detected.</p>`;
  } else {
    biasDiffs.innerHTML = flagged.map(f => `
      <div class="bias-diff-item">
        <div style="font-size: 0.78rem; font-weight: 700; color: #f87171; margin-bottom: 0.25rem;">Issue: ${escapeHtml(f.issue)}</div>
        <div class="bias-diff-grid">
          <div class="diff-box original"><strong>${dict.originalText}</strong> "${escapeHtml(f.original_text)}"</div>
          <div class="diff-box rewrite"><strong>${dict.neutralRewrite}</strong> "${escapeHtml(f.neutral_rewrite)}"</div>
        </div>
      </div>
    `).join("");
  }

  // Accordion 2: Headline Accuracy
  const headline = report.headline_analysis || {};
  document.getElementById("headlineScoreBadge").textContent = `Score: ${headline.headline_accuracy_score || 0}/100`;
  document.getElementById("clickbaitRatingText").textContent = headline.clickbait_rating || "Low";
  document.getElementById("recommendedHeadlineToDisplay").textContent = headline.recommended_neutral_headline ? `"${headline.recommended_neutral_headline}"` : "Standard descriptive headline.";
  const exaggerations = headline.sensationalist_exaggerations || [];
  document.getElementById("headlineExaggerationsList").innerHTML = exaggerations.length > 0
    ? exaggerations.map(e => `<li>${escapeHtml(e)}</li>`).join("")
    : `<li>None detected.</li>`;

  // Accordion 3: News Timeline & Recycled News
  const oldNews = report.old_news_analysis || {};
  const isOld = oldNews.is_recycled_news;
  const timeBadge = document.getElementById("timelineStatusBadge");
  timeBadge.textContent = isOld ? "Recycled / Outdated" : "Current Event";
  timeBadge.style.cssText = isOld
    ? "background: rgba(236, 72, 153, 0.18); color: #f472b6; border-color: rgba(236, 72, 153, 0.4);"
    : "background: rgba(16, 185, 129, 0.18); color: #34d399; border-color: rgba(16, 185, 129, 0.4);";
  document.getElementById("originalEventDateText").textContent = oldNews.original_event_date || "Not applicable";
  document.getElementById("claimedDateText").textContent = oldNews.claimed_publication_date || "Recent";
  document.getElementById("currentRelevanceText").textContent = oldNews.current_relevance || "Current relevance verified.";

  // Accordion 4: Missing Context
  const missingCtx = report.missing_context || {};
  document.getElementById("omittedBackgroundText").textContent = missingCtx.omitted_background || "None identified.";
  document.getElementById("incompleteStatsText").textContent = missingCtx.incomplete_statistics || "None identified.";
  document.getElementById("unmentionedTimeframesText").textContent = missingCtx.unmentioned_timeframes || "None identified.";
  document.getElementById("contextImpactText").textContent = missingCtx.impact_assessment || "No material distortion from omissions.";

  // Accordion 5: Manipulation Analysis
  const manip = report.manipulation_analysis || {};
  const setStatus = (id, detected) => {
    const el = document.getElementById(id);
    el.innerHTML = detected
      ? `<span style="color: #f87171; font-weight: 700;">⚠ ${dict.detectedTag}</span>`
      : `<span style="color: #34d399;">✓ ${dict.noneTag}</span>`;
  };
  setStatus("fearmongeringStatus", manip.fearmongering_detected);
  setStatus("urgencyStatus", manip.urgency_framing_detected);
  setStatus("outrageStatus", manip.artificial_outrage_detected);
  setStatus("conspiracyStatus", manip.conspiracy_framing_detected);
  document.getElementById("psychologicalImpactText").textContent = manip.psychological_impact || "Standard informational presentation.";
  document.getElementById("objectiveInterpretationText").textContent = manip.objective_interpretation || "Objective, balanced presentation.";

  // Accordion 6: Source Credibility Details
  const srcCred = report.source_credibility || {};
  document.getElementById("sourceTransparencyBadge").textContent = `Score: ${srcCred.transparency_score || 0}/100`;
  document.getElementById("publisherIdentityText").textContent = srcCred.publisher_identity || "Direct submission";
  document.getElementById("authorEvaluationText").textContent = srcCred.author_evaluation || "Unspecified";
  document.getElementById("institutionalBackingText").textContent = srcCred.institutional_backing || "Independent / Unverified";
  document.getElementById("verifiableAssertionsList").innerHTML = (srcCred.verifiable_assertions || ["None confirmed"]).map(a => `<li>${escapeHtml(a)}</li>`).join("");
  document.getElementById("unverifiedClaimsList").innerHTML = (srcCred.unverified_assertions || ["None flagged"]).map(a => `<li>${escapeHtml(a)}</li>`).join("");

  // Final Assessment & Limitations
  document.getElementById("finalExplanationText").textContent = report.explanation || report.full_explanation || "";
  document.getElementById("transparencyLimitationsText").textContent = report.limitations || "Grounding restricted to retrieved web evidence and public records.";
  document.getElementById("executedQueriesContainer").innerHTML = (report.search_queries_executed || []).map(q => `
    <span class="meta-pill">🔍 ${escapeHtml(q)}</span>
  `).join("");

  // Verified Citations
  const citationsContainer = document.getElementById("citationsListContainer");
  const hits = report.verified_search_hits || [];
  if (hits.length === 0) {
    citationsContainer.innerHTML = `<p class="evidence-empty-msg">No live external links cited.</p>`;
  } else {
    citationsContainer.innerHTML = hits.map(h => `
      <div class="citation-row">
        <a href="${escapeHtml(h.url)}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(h.title || h.url)} ↗
        </a>
        <span style="font-size: 0.72rem; color: var(--text-muted);">${escapeHtml(h.published_date || "Live Web")}</span>
      </div>
    `).join("");
  }
}

// --- 8. INITIALIZATION & EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
  checkBackendHealth();
  initNavbarAndSettings();
  initTabs();
  initFileInputs();
  initSamples();
  initHistoryDrawer();
  initVerifyButton();
  initDashboardControls();
  initLanguageSelector();
});

// Navbar & Settings Modal
function initNavbarAndSettings() {
  const settingsModal = document.getElementById("settingsModal");
  const openSettingsBtn = document.getElementById("openSettingsBtn");
  const closeSettingsBtn = document.getElementById("closeSettingsBtn");
  const clearCacheBtn = document.getElementById("clearCacheBtn");

  openSettingsBtn.addEventListener("click", () => {
    checkBackendHealth();
    settingsModal.style.display = "flex";
  });

  closeSettingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "none";
  });

  if (clearCacheBtn) {
    clearCacheBtn.addEventListener("click", () => {
      localStorage.removeItem("truthlens_cache");
      showToast("Local analysis cache cleared!");
    });
  }
}

// Tab Switching
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      State.activeTab = target;

      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(`tab-${target}`).classList.add("active");
    });
  });
}

// File Inputs (Images and PDFs)
function initFileInputs() {
  // Image Upload
  const imageDropzone = document.getElementById("imageDropzone");
  const imageInput = document.getElementById("imageInput");
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");
  const imagePreviewThumb = document.getElementById("imagePreviewThumb");
  const imageName = document.getElementById("imageName");
  const removeImageBtn = document.getElementById("removeImageBtn");

  imageDropzone.addEventListener("click", () => imageInput.click());
  
  imageDropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    imageDropzone.classList.add("dragover");
  });

  imageDropzone.addEventListener("dragleave", () => {
    imageDropzone.classList.remove("dragover");
  });

  imageDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    imageDropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  imageInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  });

  function handleImageFile(file) {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }
    State.uploadedFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      State.uploadedBase64 = ev.target.result;
      imagePreviewThumb.src = State.uploadedBase64;
      imageName.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      imagePreviewContainer.style.display = "flex";
      imageDropzone.style.display = "none";
    };
    reader.readAsDataURL(file);
  }

  removeImageBtn.addEventListener("click", () => {
    State.uploadedFile = null;
    State.uploadedBase64 = null;
    imageInput.value = "";
    imagePreviewContainer.style.display = "none";
    imageDropzone.style.display = "block";
  });

  // PDF Upload
  const pdfDropzone = document.getElementById("pdfDropzone");
  const pdfInput = document.getElementById("pdfInput");
  const pdfPreviewContainer = document.getElementById("pdfPreviewContainer");
  const pdfName = document.getElementById("pdfName");
  const removePdfBtn = document.getElementById("removePdfBtn");

  pdfDropzone.addEventListener("click", () => pdfInput.click());

  pdfDropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    pdfDropzone.classList.add("dragover");
  });

  pdfDropzone.addEventListener("dragleave", () => {
    pdfDropzone.classList.remove("dragover");
  });

  pdfDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    pdfDropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePdfFile(e.dataTransfer.files[0]);
    }
  });

  pdfInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handlePdfFile(e.target.files[0]);
    }
  });

  async function handlePdfFile(file) {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      alert("Please upload a valid PDF document.");
      return;
    }
    State.uploadedFile = file;
    pdfName.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB) - Extracting text...`;
    pdfPreviewContainer.style.display = "flex";
    pdfDropzone.style.display = "none";

    try {
      const arrayBuffer = await file.arrayBuffer();
      if (window.pdfjsLib) {
        const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = "";
        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map(item => item.str).join(" ") + "\n\n";
        }
        State.uploadedPdfText = fullText.trim();
        pdfName.textContent = `${file.name} (${pdf.numPages} pages, ${State.uploadedPdfText.length} characters extracted)`;
      } else {
        pdfName.textContent = `${file.name} (Attached as document)`;
      }
    } catch (err) {
      console.warn("PDF parsing issue:", err);
      pdfName.textContent = `${file.name} (Attached as document)`;
    }
  }

  removePdfBtn.addEventListener("click", () => {
    State.uploadedFile = null;
    State.uploadedPdfText = null;
    pdfInput.value = "";
    pdfPreviewContainer.style.display = "none";
    pdfDropzone.style.display = "block";
  });
}

// Sample Chips
function initSamples() {
  const chips = document.querySelectorAll(".sample-chip");
  const newsTextInput = document.getElementById("newsTextInput");

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const text = chip.dataset.text;
      newsTextInput.value = text;
      document.querySelector('[data-tab="text"]').click();
      newsTextInput.focus();
    });
  });
}

// History Drawer
function initHistoryDrawer() {
  const historyDrawer = document.getElementById("historyDrawer");
  const openHistoryBtn = document.getElementById("openHistoryBtn");
  const closeHistoryBtn = document.getElementById("closeHistoryBtn");
  const historyList = document.getElementById("historyList");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");

  openHistoryBtn.addEventListener("click", () => {
    renderHistoryList();
    historyDrawer.classList.add("open");
  });

  closeHistoryBtn.addEventListener("click", () => {
    historyDrawer.classList.remove("open");
  });

  clearHistoryBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your verification history?")) {
      localStorage.removeItem("truthlens_history");
      renderHistoryList();
    }
  });

  function renderHistoryList() {
    const history = State.getHistory();
    if (history.length === 0) {
      historyList.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 2rem 0; font-size: 0.85rem;">
          No previous verification reports yet.
        </div>
      `;
      return;
    }

    historyList.innerHTML = history.map(item => `
      <div class="card" style="margin-bottom: 0.75rem; cursor: pointer; transition: transform 0.15s; padding: 0.85rem;" onclick="loadHistoryItem('${item.id}')">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <span class="claim-badge" style="${getVerdictBadgeColor(item.verdict)}">${escapeHtml(item.verdict)}</span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">${new Date(item.date).toLocaleDateString()}</span>
        </div>
        <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem; color: var(--text-main);">${escapeHtml(item.primary_claim)}</div>
        <div style="font-size: 0.75rem; color: var(--text-secondary);">Score: ${item.credibility_score}/100 • ${escapeHtml(item.category)}</div>
      </div>
    `).join("");
  }

  window.loadHistoryItem = function(id) {
    const history = State.getHistory();
    const match = history.find(h => h.id === id);
    if (match && match.report) {
      State.currentReport = match.report;
      renderEditorialDashboard(match.report, State.currentLanguage);
      historyDrawer.classList.remove("open");
      document.getElementById("dashboardWrapper").scrollIntoView({ behavior: "smooth" });
    }
  };
}

// Verify Button Execution
function initVerifyButton() {
  const verifyBtn = document.getElementById("verifyBtn");
  const progressCard = document.getElementById("progressCard");
  const dashboardWrapper = document.getElementById("dashboardWrapper");

  verifyBtn.addEventListener("click", async () => {
    if (State.isAnalyzing) return;

    const payload = { type: State.activeTab, text: "", imageBase64: null };

    if (State.activeTab === "text") {
      payload.text = document.getElementById("newsTextInput").value.trim();
      if (!payload.text) {
        alert("Please enter a news statement, claim, or article text.");
        return;
      }
    } else if (State.activeTab === "url") {
      const url = document.getElementById("newsUrlInput").value.trim();
      if (!url || !url.startsWith("http")) {
        alert("Please enter a valid webpage URL (starting with http:// or https://).");
        return;
      }
      payload.text = `Investigate this webpage URL and its claims: ${url}`;
    } else if (State.activeTab === "image") {
      if (!State.uploadedBase64) {
        alert("Please upload a news screenshot or image.");
        return;
      }
      payload.imageBase64 = State.uploadedBase64;
      payload.text = "Please inspect all text and claims in this attached news screenshot.";
    } else if (State.activeTab === "pdf") {
      if (!State.uploadedFile) {
        alert("Please upload a PDF document.");
        return;
      }
      payload.text = State.uploadedPdfText || "Analyze the claims in this PDF document.";
    }

    // Check Cache
    const cacheKey = computeHash(payload.text + (payload.imageBase64 ? "_img" : ""));
    const cached = State.getCache(cacheKey);
    if (cached) {
      State.currentReport = cached.report;
      renderEditorialDashboard(cached.report, State.currentLanguage);
      dashboardWrapper.scrollIntoView({ behavior: "smooth" });
      showToast("Loaded from local analysis cache!");
      return;
    }

    State.isAnalyzing = true;
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = "<span class='status-dot animate-pulse'></span> Investigating...";
    progressCard.style.display = "block";
    dashboardWrapper.style.display = "none";
    progressCard.scrollIntoView({ behavior: "smooth" });

    const updateProgress = (step, label) => {
      const progressEl = document.getElementById("progressStatusText");
      if (progressEl) {
        progressEl.textContent = label;
        progressEl.dataset.step = step;
      }
      for (let i = 1; i <= 5; i++) {
        const el = document.getElementById(`step-${i}`);
        if (!el) continue;
        el.classList.remove("active", "done");
        if (i < step) el.classList.add("done");
        else if (i === step) el.classList.add("active");
      }
    };

    try {
      const report = await apiVerify(payload, updateProgress);
      State.currentReport = report;
      State.saveToHistory(report);
      State.setCache(cacheKey, report);
      
      setTimeout(async () => {
        progressCard.style.display = "none";
        
        let reportToRender = report;
        if (State.currentLanguage !== "en") {
          try {
            reportToRender = await apiTranslate(report, State.currentLanguage);
          } catch (te) {
            console.warn("Translation fallback:", te);
          }
        }

        renderEditorialDashboard(reportToRender, State.currentLanguage);
        dashboardWrapper.scrollIntoView({ behavior: "smooth" });
        showToast("Fact-check report generated!");
      }, 400);

    } catch (err) {
      console.error(err);
      alert("Fact-check error: " + err.message);
      progressCard.style.display = "none";
    } finally {
      State.isAnalyzing = false;
      verifyBtn.disabled = false;
      verifyBtn.innerHTML = "🔍 Investigate & Verify with AI";
    }
  });
}

// --- 9. LANGUAGE SELECTOR CONTROLLER ---
function initLanguageSelector() {
  const langSelect = document.getElementById("reportLangSelect");
  const translationPill = document.getElementById("translationPill");

  langSelect.value = State.currentLanguage;

  langSelect.addEventListener("change", async (e) => {
    const targetLang = e.target.value;
    State.currentLanguage = targetLang;
    localStorage.setItem("truthlens_lang", targetLang);

    if (!State.currentReport) {
      applyUiLanguage(targetLang);
      return;
    }

    if (targetLang === "en") {
      renderEditorialDashboard(State.currentReport, "en");
      showToast("Language changed to English");
      return;
    }

    // Check if translation is cached
    if (State.currentReport._translations && State.currentReport._translations[targetLang]) {
      renderEditorialDashboard(State.currentReport._translations[targetLang], targetLang);
      showToast(`Loaded ${targetLang.toUpperCase()} translation`);
      return;
    }

    // Call server-side translate endpoint
    translationPill.style.display = "inline-flex";
    langSelect.disabled = true;

    try {
      const translated = await apiTranslate(State.currentReport, targetLang);
      renderEditorialDashboard(translated, targetLang);
      showToast(`Report translated successfully!`);
    } catch (err) {
      console.error("Translation error:", err);
      showToast("Translation error, displaying English report.");
      renderEditorialDashboard(State.currentReport, "en");
    } finally {
      translationPill.style.display = "none";
      langSelect.disabled = false;
    }
  });
}

// --- 10. DASHBOARD CONTROLS (EXPORTS & PRINT) ---
function initDashboardControls() {
  const exportMdBtn = document.getElementById("exportMdBtn");
  const exportJsonBtn = document.getElementById("exportJsonBtn");
  const printReportBtn = document.getElementById("printReportBtn");

  // Export Markdown
  exportMdBtn.addEventListener("click", () => {
    if (!State.currentReport) return;
    const lang = State.currentLanguage;
    const r = (lang !== "en" && State.currentReport._translations?.[lang])
      ? State.currentReport._translations[lang]
      : State.currentReport;

    const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

    const md = `
# ${dict.reportTitle}: ${r.primary_claim || r.category}
**${dict.coreVerdict}:** ${dict.verdictTerms?.[r.verdict] || r.verdict}
**${dict.credibilityScore}:** ${r.credibility_score}/100
**Category:** ${r.category}
**Date:** ${r.created_at}

---

## ${dict.executiveSummary}
${r.summary}

${r.full_explanation ? `### Full Explanation\n${r.full_explanation}\n` : ""}

## ${dict.claimVerification}
${(r.claims || []).map((c, i) => `
### Claim ${i+1}: ${c.claim}
- **Verdict:** ${c.verdict}
- **Analysis:** ${c.explanation}
- **${dict.supportingFacts}:** ${(c.supporting_evidence || []).join("; ") || dict.noSupportingEvidence}
- **${dict.contradictingFacts}:** ${(c.contradicting_evidence || []).join("; ") || dict.noContradictingEvidence}
`).join("\n")}

## ${dict.evidenceComparison}
### ${dict.supportingSources}
${(r.evidence_comparison?.supporting_sources || []).map(s => `- **${s.source_name}**: "${s.key_quote || ""}" [${s.url || "Verified"}]`).join("\n") || dict.noSourcesFound}

### ${dict.contradictingSources}
${(r.evidence_comparison?.contradicting_sources || []).map(s => `- **${s.source_name}**: "${s.key_quote || ""}" [${s.url || "Verified"}]`).join("\n") || dict.noSourcesFound}

## ${dict.newsBias}
- **${dict.biasOrientation}:** ${r.bias_analysis?.bias_category || "Neutral"}
- **Score:** ${r.bias_analysis?.bias_score || 0}/100
- **Indicators:** ${(r.bias_analysis?.indicators || []).join(", ")}

## ${dict.sourceCredibility}
- **${dict.transparencyScore}:** ${r.source_credibility?.transparency_score || 0}/100
- **Publisher Assessment:** ${r.source_credibility?.publisher_identity || "N/A"}
- **Author Evaluation:** ${r.source_credibility?.author_evaluation || "N/A"}

## ${dict.newsTimeline}
- **Recycled News:** ${r.old_news_analysis?.is_recycled_news ? "Yes" : "No"}
- **Original Event Date:** ${r.old_news_analysis?.original_event_date || "N/A"}
- **Relevance:** ${r.old_news_analysis?.current_relevance || "N/A"}

## ${dict.missingContext}
- **Omitted Background:** ${r.missing_context?.omitted_background || "None"}
- **Impact Assessment:** ${r.missing_context?.impact_assessment || "None"}

## ${dict.headlineAccuracy}
- **Score:** ${r.headline_analysis?.headline_accuracy_score || 0}/100
- **Clickbait Severity:** ${r.headline_analysis?.clickbait_rating || "Low"}
- **Recommended Neutral Headline:** ${r.headline_analysis?.recommended_neutral_headline || "N/A"}

## ${dict.manipulation}
- **Fearmongering:** ${r.manipulation_analysis?.fearmongering_detected ? dict.detectedTag : dict.noneTag}
- **Urgency Framing:** ${r.manipulation_analysis?.urgency_framing_detected ? dict.detectedTag : dict.noneTag}
- **Artificial Outrage:** ${r.manipulation_analysis?.artificial_outrage_detected ? dict.detectedTag : dict.noneTag}

## ${dict.finalAssessment}
${r.explanation}

### Search Queries Executed
${(r.search_queries_executed || []).map(q => `- ${q}`).join("\n")}
    `.trim();

    downloadFile(md, `TruthLens_Report_${r.id}_${lang}.md`, "text/markdown");
    showToast("Downloaded Markdown dossier!");
  });

  // Export JSON
  exportJsonBtn.addEventListener("click", () => {
    if (!State.currentReport) return;
    const jsonStr = JSON.stringify(State.currentReport, null, 2);
    downloadFile(jsonStr, `TruthLens_Report_${State.currentReport.id}.json`, "application/json");
    showToast("Downloaded JSON data!");
  });

  // Print Report / Save as PDF
  printReportBtn.addEventListener("click", () => {
    window.print();
  });
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #0f172a;
    border: 1px solid #3b82f6;
    color: #f8fafc;
    padding: 0.65rem 1.15rem;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    z-index: 999;
    font-size: 0.82rem;
    font-weight: 600;
    animation: fadeIn 0.2s ease-out;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
