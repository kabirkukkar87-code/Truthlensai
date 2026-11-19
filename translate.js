/**
 * TruthLens AI - Netlify Serverless Function: POST /api/translate
 * Multilingual dossier translation (Hindi, Spanish, French, Arabic)
 * Zero external dependencies (uses standard Node 18+ global fetch)
 */

const FALLBACK_MODELS = [
  process.env.GEMINI_MODEL || "gemini-3.1-flash-lite-preview",
  "gemini-3.1-flash-lite-preview",
  "gemini-3-flash-preview",
  "gemini-flash-latest",
  "gemini-2.5-flash"
];

async function executeGeminiTranslation(geminiKey, promptText) {
  const requestBody = {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2
    }
  };

  const models = [...new Set(FALLBACK_MODELS.filter(Boolean))];
  let lastErrorMsg = "Unknown error";

  for (const model of models) {
    const endpoints = [
      {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        headers: { "Content-Type": "application/json" }
      },
      {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${geminiKey}`
        }
      }
    ];

    for (const ep of endpoints) {
      try {
        const resp = await fetch(ep.url, {
          method: "POST",
          headers: ep.headers,
          body: JSON.stringify(requestBody)
        });

        if (resp.ok) {
          const data = await resp.json();
          let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";
          if (rawText.startsWith("```")) {
            rawText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
          }
          return JSON.parse(rawText);
        } else if (resp.status === 401) {
          lastErrorMsg = "Invalid GEMINI_API_KEY.";
        } else {
          lastErrorMsg = `HTTP ${resp.status}`;
        }
      } catch (err) {
        lastErrorMsg = err.message || "Network error";
      }
    }
  }

  throw new Error(`AI Translation Error: ${lastErrorMsg}`);
}

exports.handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ detail: "Method not allowed. Use POST." })
    };
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return {
      statusCode: 503,
      headers: corsHeaders,
      body: JSON.stringify({
        detail: "GEMINI_API_KEY is not configured in Netlify Environment Variables."
      })
    };
  }

  let req;
  try {
    req = JSON.parse(event.body || "{}");
  } catch (e) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ detail: "Invalid JSON in request body." })
    };
  }

  const report = req.report;
  const targetLang = (req.target_language || "en").toLowerCase();

  if (!report || typeof report !== "object") {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ detail: "Invalid report object provided." })
    };
  }

  if (targetLang === "en") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(report)
    };
  }

  const langNames = {
    hi: "Hindi (हिन्दी)",
    es: "Spanish (Español)",
    fr: "French (Français)",
    ar: "Arabic (العربية)"
  };
  const langName = langNames[targetLang] || targetLang;

  const translationPrompt = `
You are a professional journalistic translator for TruthLens AI.
Translate the following fact-checking dossier into ${langName}.

CRITICAL RULES:
1. Maintain journalistic neutrality, precision, and formal tone.
2. DO NOT translate publisher names (e.g. BBC, Reuters, WHO, NASA, CNBC), source URLs, original dates, or acronyms.
3. Keep direct quotes in their original words where applicable, accompanied by a translated explanation.
4. Return strict JSON matching the schema below.

JSON SCHEMA TO RETURN:
{
  "summary": "Translated executive summary",
  "full_explanation": "Translated full explanation",
  "explanation": "Translated reasoning for verdict",
  "limitations": "Translated methodology and limitations",
  "claims": [
    {
      "claim": "Translated claim",
      "verdict": "Translated verdict",
      "explanation": "Translated explanation",
      "supporting_evidence": ["Translated supporting points"],
      "contradicting_evidence": ["Translated contradicting points"],
      "unanswered_questions": ["Translated unanswered questions"]
    }
  ],
  "bias_analysis": {
    "bias_category": "Translated orientation category",
    "indicators": ["Translated indicators"],
    "flagged_segments": [
      {
        "issue": "Translated issue description",
        "neutral_rewrite": "Translated neutral rewrite"
      }
    ]
  },
  "source_credibility": {
    "publisher_identity": "Translated publisher identity assessment",
    "author_evaluation": "Translated author evaluation",
    "institutional_backing": "Translated institutional backing description",
    "verifiable_assertions": ["Translated verifiable assertions"],
    "unverified_assertions": ["Translated unverified assertions"]
  },
  "old_news_analysis": {
    "current_relevance": "Translated relevance description"
  },
  "missing_context": {
    "omitted_background": "Translated omitted background",
    "incomplete_statistics": "Translated incomplete statistics",
    "unmentioned_timeframes": "Translated unmentioned timeframes",
    "impact_assessment": "Translated impact on public perception"
  },
  "headline_analysis": {
    "recommended_neutral_headline": "Translated neutral headline recommendation",
    "sensationalist_exaggerations": ["Translated exaggerations"]
  },
  "manipulation_analysis": {
    "psychological_impact": "Translated psychological impact description",
    "objective_interpretation": "Translated objective interpretation"
  }
}

DATA TO TRANSLATE:
${JSON.stringify({
  summary: report.summary || "",
  full_explanation: report.full_explanation || report.explanation || "",
  explanation: report.explanation || "",
  limitations: report.limitations || "",
  claims: report.claims || [],
  bias_analysis: report.bias_analysis || {},
  source_credibility: report.source_credibility || {},
  old_news_analysis: { current_relevance: report?.old_news_analysis?.current_relevance || "" },
  missing_context: report.missing_context || {},
  headline_analysis: report.headline_analysis || {},
  manipulation_analysis: report.manipulation_analysis || {}
})}
`;

  try {
    const translatedData = await executeGeminiTranslation(geminiKey, translationPrompt);

    // Deep clone and merge
    const merged = JSON.parse(JSON.stringify(report));
    if (translatedData.summary) merged.summary = translatedData.summary;
    if (translatedData.full_explanation) merged.full_explanation = translatedData.full_explanation;
    if (translatedData.explanation) merged.explanation = translatedData.explanation;
    if (translatedData.limitations) merged.limitations = translatedData.limitations;

    if (Array.isArray(translatedData.claims) && Array.isArray(merged.claims)) {
      translatedData.claims.forEach((tc, idx) => {
        if (merged.claims[idx]) {
          Object.assign(merged.claims[idx], tc);
        }
      });
    }

    if (translatedData.bias_analysis && merged.bias_analysis) {
      Object.assign(merged.bias_analysis, translatedData.bias_analysis);
    }
    if (translatedData.source_credibility && merged.source_credibility) {
      Object.assign(merged.source_credibility, translatedData.source_credibility);
    }
    if (translatedData.old_news_analysis && merged.old_news_analysis) {
      Object.assign(merged.old_news_analysis, translatedData.old_news_analysis);
    }
    if (translatedData.missing_context && merged.missing_context) {
      Object.assign(merged.missing_context, translatedData.missing_context);
    }
    if (translatedData.headline_analysis && merged.headline_analysis) {
      Object.assign(merged.headline_analysis, translatedData.headline_analysis);
    }
    if (translatedData.manipulation_analysis && merged.manipulation_analysis) {
      Object.assign(merged.manipulation_analysis, translatedData.manipulation_analysis);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(merged)
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({
        detail: `Translation failed: ${err.message || "Upstream AI provider error"}`
      })
    };
  }
};
