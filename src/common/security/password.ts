import argon2 from "argon2";

import { env } from "../env/env";

const PEPPER = env.PEPPER_SECRET;

export const hashPassword = async (password: string) => {
    return argon2.hash(password + PEPPER);
};

export const verifyPassword = async (password: string, hash: string) => {
    return argon2.verify(hash, password + PEPPER);
};
