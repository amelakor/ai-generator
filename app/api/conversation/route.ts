import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { Configuration, OpenAIApi } from "openai";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
    try {
        const { userId } = auth();

        const body = await request.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!configuration.apiKey) {
            return new NextResponse("Open AI Api key not configurated", {
                status: 500,
            });
        }

        if (!messages) {
            return new NextResponse("Messages not provided", { status: 400 });
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("You have reached the free trial limit", {
                status: 403,
            });
        }

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages,
        });

        if (!isPro) await increaseApiLimit();

        return NextResponse.json(response.data.choices[0].message);
    } catch (e) {
        console.log(e, "Conversation API Error");
        return new NextResponse("Internal Error", { status: 500 });
    }
}
