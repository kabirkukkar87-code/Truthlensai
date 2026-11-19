exports.handler = async (event, context) => {
  // CORS Preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: "",
    };
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const tavilyKey = process.env.TAVILY_API_KEY;
  const isOk = Boolean(geminiKey && geminiKey.length > 5);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      status: isOk ? "ok" : "degraded",
      service: isOk
        ? "AI Verification Service: Connected"
        : "AI Verification Service: Temporarily Unavailable (Check Netlify Environment Variables)",
      grounding_active: Boolean(tavilyKey && tavilyKey.length > 5),
    }),
  };
};
