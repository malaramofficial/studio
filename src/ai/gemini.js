import fetch from "node-fetch";

const MODEL = "gemini-1.5-flash";
const BASE = "https://generativelanguage.googleapis.com/v1/models";

function safeExtractText(json) {
  try {
    return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch {
    return "";
  }
}

export async function generateText(prompt, apiKey = process.env.GEMINI_KEY) {
  if (!apiKey) return { ok: false, text: "API key missing", raw: null };

  const url = `${BASE}/${MODEL}:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        temperature: 0.2,
        maxOutputTokens: 1200,
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    if (!res.ok) return { ok: false, raw: await res.text() };

    const json = await res.json();
    const text = safeExtractText(json);

    return { ok: true, text, raw: json };
  } catch (err) {
    return { ok: false, raw: String(err) };
  }
}
