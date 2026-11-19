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

  const geminiKey = process.env.AQ.Ab8RN6ILx7V0G2pWGKAau1WPoAt6M205RoKHIoi0A0-uLYFb9AAQ.Ab8RN6ILx7V0G2pWGKAau1WPoAt6M205RoKHIoi0A0-uLYFb9A;
  const tavilyKey = process.env.tvly-1lF0LT-XRAyUdpif506vMDR4kmtv8PncyJJWlsKDQIvYcGBLR

  

  ;
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
