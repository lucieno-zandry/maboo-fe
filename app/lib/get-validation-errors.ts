import z from "zod";

export default function<T>(error: z.ZodError<T>){
    return z.flattenError(error).fieldErrors;
}