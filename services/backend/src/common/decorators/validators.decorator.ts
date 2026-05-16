import { Transform } from "class-transformer";

export function TrimValue() {
    return Transform(({ value }) => {
        if (typeof value === "string") {
            return value.trim();
        }
        return value;
    });
}
