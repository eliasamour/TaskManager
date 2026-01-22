type OllamaGenerateResponse = {
  response: string;
};

export async function askLLM(prompt: string) {
  const AI_URL = process.env.AI_URL ?? "http://localhost:11434";
  const AI_MODEL = process.env.AI_MODEL ?? "llama3.2:3b";

  const res = await fetch(`${AI_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: AI_MODEL,
      prompt,
      stream: false,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`AI service error: ${txt}`);
  }

  const data = (await res.json()) as OllamaGenerateResponse;
  return data.response.trim();
}
