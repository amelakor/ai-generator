import { auth } from "@clerk/nextjs";

import prismadb from "./prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLimit = async () => {
    const { userId } = auth();

    if (!userId) {
        return;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId,
        },
    });

    if (!userApiLimit) {
        return;
    }

    if (userApiLimit) {
        await prismadb.userApiLimit.update({
            where: {
                userId,
            },
            data: {
                count: userApiLimit.count + 1,
            },
        });
    } else {
        await prismadb.userApiLimit.create({
            data: {
                userId,
                count: 1,
            },
        });
    }
};

export const checkApiLimit = async () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId,
        },
    });

    if (!userApiLimit) {
        return false;
    }

    if (userApiLimit.count >= MAX_FREE_COUNTS) {
        return false;
    }

    return true;
};
