import type z from "zod";

export type GetValidationErrorProps = {value: unknown, dataFormat: z.ZodTypeAny }

export default function getValidationError({ value, dataFormat }: GetValidationErrorProps): string[] | null {
    const parsed = dataFormat.safeParse(value);
    return parsed.error?.issues.map(issue => issue.message) || null;
}