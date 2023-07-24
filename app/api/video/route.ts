import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(request: Request) {
    try {
        const { userId } = auth();

        const body = await request.json();
        const { prompt } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }

        const response = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
                input: {
                    prompt,
                },
            }
        );

        return NextResponse.json(response);
    } catch (e) {
        console.log(e, "Video API Error");
        return new NextResponse("Internal Error", { status: 500 });
    }
}
