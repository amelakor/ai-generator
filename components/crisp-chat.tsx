"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("ff482ef2-f443-4171-876c-c3476d1c52cb");
    }, []);

    return null;
};
