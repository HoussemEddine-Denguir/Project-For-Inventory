export async function onRequestPost(context) {
  try {
    // Lire le corps JSON envoyé par ton frontend
    const { userQuery, systemPrompt } = await context.request.json();

    // Préparer le prompt pour ton LLM (ici exemple avec Gemini / Google API)
    const apiKey = context.env.GEMINI_API_KEY; // à définir dans Cloudflare Dashboard
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n${userQuery}` }]
        }]
      })
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "API request failed", status: response.status }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();

    // Extraire le texte généré
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response text";

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
