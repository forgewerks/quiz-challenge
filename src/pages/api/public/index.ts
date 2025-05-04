import type { APIRoute } from "astro";
import { getSecret } from 'astro:env/server';
import { createMistral } from '@ai-sdk/mistral';
import { generateObject } from "ai";
import { z } from 'zod'

const mistral = createMistral({ apiKey: getSecret("MISTRAL_API_KEY") });
const model = mistral('ministral-3b-latest', {
    safePrompt: true,
});

export const POST: APIRoute = async ({ request }) => {
    const { state } = await request.json();
    const dialogsCount = Math.floor(Math.random() * (8 - 5 + 1)) + 5;
    const dialogsQuery = await generateDialogs(state, dialogsCount);
    const { object } = dialogsQuery;

    const dialogs = object.dialogs;
    return new Response(JSON.stringify(dialogs), { status: 200 });
}

const generateDialogs = async (state: string, count: number)=> {
    const dialogSchema = z.object({
        dialogs: z.array(z.string()).describe("").length(count),
    })
    let prompt;
    switch (state) {
        case 'support':
            prompt = `
                Generate ${count} short phrases (maximum 10 words each) that a live audience might shout or say to encourage a participant who is thinking or struggling. The tone should be cheerful, supportive, and varied.
                Examples: 
                - "You got this!"
                - "Take your time!"
                - "We believe in you!"
                Only return the list of phrases.`;
            break;
        case 'emotion':
            prompt = `
                Generate ${count} short phrases (maximum 10 words each) that a hyped live audience might shout in excitement when a participant gives a correct answer. Use energetic, spontaneous, playful language.
                Examples:
                - "Yeah! Nailed it!"
                - "That's what I'm talking about!"
                - "Boom! Right on!"
                Only return the list of phrases.`;
                            break;
        case 'incorrect':
            prompt = `
                    Generate ${count} short phrases (maximum 10 words each) that a live audience might shout or say when a participant gets a wrong answer. The tone should be humorous, surprised, or slightly mocking, but not mean-spirited.
                    Examples:
                    - "Oof, close one!"
                    - "Better luck next time!"
                    - "Nooo! You had it!"
                    Only return the list of phrases.`;
                                break;
        default:
            throw new Error(`Invalid state: ${state}`);
    }

    const response = await generateObject({
        model: model,
        prompt: prompt,
        schema: dialogSchema
    });

    return response;
};