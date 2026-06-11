import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";

const client = new Anthropic();

function buildSystemPrompt(cats: {
  id: string;
  name: string;
  sex: string;
  breed: string | null;
  age: string | null;
  weight: string | null;
  description: string | null;
  notes: string | null;
  status: string;
}[]) {
  const catList =
    cats.length === 0
      ? "There are currently no cats available for adoption."
      : cats
          .map((cat) => {
            const details = [
              cat.sex !== "unknown" ? cat.sex : null,
              cat.breed,
              cat.age,
              cat.weight,
              cat.status === "pending adoption"
                ? "(pending adoption — may still be available)"
                : null,
            ]
              .filter(Boolean)
              .join(", ");

            return [
              `- **${cat.name}** (ID: ${cat.id})${details ? ` — ${details}` : ""}`,
              cat.description ? `  Description: ${cat.description}` : null,
              cat.notes ? `  Notes: ${cat.notes}` : null,
            ]
              .filter(Boolean)
              .join("\n");
          })
          .join("\n\n");

  return `You are a friendly cat adoption assistant for Fuzz Butts Cat Rescue, a nonprofit cat rescue organization. Your sole purpose is to help visitors find their perfect feline companion from our currently available cats.

AVAILABLE CATS:
${catList}

INSTRUCTIONS:
- Ask thoughtful questions to understand the visitor's lifestyle and preferences. Consider: other pets, children, living space (apartment vs house), activity level, cat experience, age preference.
- Ask one or two questions at a time — keep the conversation natural, not like a form.
- Based on their answers, recommend the most suitable cat(s) by name. When recommending a cat, always link to it using this exact markdown format: [Cat Name](/adopt#CAT_ID) — substituting the cat's actual ID from the list above.
- If no cat is a good match for their situation, warmly apologize and encourage them to check back soon as new cats arrive regularly.
- Keep responses warm, concise, and friendly.
- If asked about anything unrelated to cat adoption, politely redirect the conversation back to finding a cat.
- Never invent cats that are not in the list above.`;
}

export async function POST(request: Request) {
  const { messages } = await request.json();

  const adminClient = createAdminClient();
  const { data: cats } = await adminClient
    .from("pets")
    .select("id, name, sex, breed, age, weight, description, notes, status")
    .in("status", ["available for adoption", "pending adoption"]);

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: buildSystemPrompt(cats ?? []),
    messages,
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return Response.json({ message: text });
}
