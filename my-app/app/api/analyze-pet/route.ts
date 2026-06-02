import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

function buildPrompt(sex: "male" | "female") {
  const pronoun = sex === "male" ? "he/him/his" : "she/her/her";
  return `You are helping staff at an animal shelter catalog a new animal. Look at this photo and provide your best estimates for the following fields. The animal is ${sex} — use ${pronoun} pronouns in the description. Return ONLY a JSON object with these exact keys:

{
  "name": "A sweet, fitting name for this animal (be creative but appropriate for a shelter)",
  "breed": "Your best estimate of the breed (e.g. 'Domestic Shorthair', 'Tabby Mix')",
  "age": "Your best estimate of the age in natural language (e.g. 'About 3 months', 'Approximately 2 years', 'Senior, 8-10 years')",
  "weight": "Your best estimate of the weight in natural language (e.g. 'About 5 lbs', 'Approximately 10 lbs')",
  "description": "A warm, engaging 2-3 sentence description of this animal suitable for an adoption listing. Highlight personality traits you can infer from the photo and any notable physical features."
}

If you cannot determine something from the photo, make a reasonable guess rather than leaving it blank. Return ONLY the JSON object, no other text.`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image") as File | null;
  const sex = (formData.get("sex") as string) === "female" ? "female" : "male";

  if (!image) {
    return Response.json({ error: "No image provided" }, { status: 400 });
  }

  const bytes = await image.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mediaType = (image.type || "image/jpeg") as
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "image/gif";

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: buildPrompt(sex),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          {
            type: "text",
            text: "Please analyze this animal photo and return the JSON.",
          },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const cleaned = text.replace(/^```json\s*|```\s*$/g, "").trim();
    const data = JSON.parse(cleaned);
    return Response.json(data);
  } catch {
    return Response.json({ error: "Failed to parse AI response" }, { status: 500 });
  }
}
