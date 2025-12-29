import { z } from "zod";

export const formSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(100, { message: "Title must be 100 characters or fewer" }),

    description: z
        .string()
        .min(20, {
            message: "Description must be at least 20 characters so others understand your idea",
        })
        .max(500, {
            message: "Description must be 500 characters or fewer",
        }),

    category: z
        .string()
        .min(3, { message: "Category must be at least 3 characters" })
        .max(20, { message: "Category must be 20 characters or fewer" }),

    image: z
        .instanceof(File, { message: "Please upload an image file" })
        .refine(
            (file) => file.type.startsWith("image/"),
            { message: "File must be an image (PNG, JPG, WEBP, ...)" }
        ),

    pitch: z
        .string()
        .min(10, {
            message: "Pitch must be at least 10 characters. Add a bit more detail.",
        }),
});