"use client";

import { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z, ZodError } from "zod";
import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { createPitch } from "@/lib/actions";

type FormValues = z.infer<typeof formSchema>;
type FieldErrors = z.ZodFormattedError<FormValues>;

const StartupForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState("");

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            setErrors({});

            const formValues = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                image: formData.get("image") as File,
                pitch
            }

            const result = await formSchema.safeParseAsync(formValues);

            if (!result.success) {
                const fieldErrors = result.error.flatten().fieldErrors as FieldErrors;
                console.log(result.error.flatten())

                setErrors({
                    title: fieldErrors.title?.[0] ?? "",
                    description: fieldErrors.description?.[0] ?? "",
                    category: fieldErrors.category?.[0] ?? "",
                    pitch: fieldErrors.pitch?.[0] ?? "",
                });

                return { ...prevState, status: "ERROR" };
            }

            toast.success("Form is valid");

            // const result = await createIdea(prevState, formData, pitch);
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors = error.flatten().fieldErrors as FieldErrors;

                setErrors({
                    title: fieldErrors.title?.[0] ?? "",
                    description: fieldErrors.description?.[0] ?? "",
                    category: fieldErrors.category?.[0] ?? "",
                    pitch: fieldErrors.pitch?.[0] ?? "",
                });

                toast.error("Please check your inputs and try again");
                return { ...prevState, error: "Validation failed", status: "ERROR" };
            }

            toast.error("An unexpected error has occurred");

            return {
                ...prevState,
                error: "An unexpected error has occurred",
                status: "ERROR",
            };
        }
    }

    const [state, formAction, isPending] = useActionState(handleFormSubmit, {
        error: "",
        status: "INITIAL",
    });

    return (
        <form action={formAction} className="startup-form">
            <div>
                <label htmlFor="title" className="startup-form_label">Title</label>
                <Input id="title" name="title" className="startup-form_input" required placeholder="Startup Title" />

                {errors.title && <p className="startup-form_error">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="startup-form_label">Description</label>
                <Textarea id="description" name="description" className="startup-form_textarea" required placeholder="Startup Description" />

                {errors.description && <p className="startup-form_error">{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="category" className="startup-form_label">Category</label>
                <Input id="category" name="category" className="startup-form_input" required placeholder="Startup Category (Tech, Health, Education, ...)" />

                {errors.category && <p className="startup-form_error">{errors.category}</p>}
            </div>

            <div>
                <label htmlFor="image" className="startup-form_label">Upload an image</label>
                <Input id="image" name="image" className="startup-form_input" required type="file" accept="image/*" />

                {errors.image && <p className="startup-form_error">{errors.image}</p>}
            </div>

            <div data-color-mode="light">
                <label htmlFor="pitch" className="startup-form_label">Pitch</label>
                <MDEditor value={pitch} onChange={(value) => setPitch(value as string)} id="pitch" preview="edit" height={300} style={{ borderRadius: 20, overflow: "hidden" }} textareaProps={{
                    placeholder:
                        "Briefly describe your idea and what problem it solves",
                }}
                    previewOptions={{
                        disallowedElements: ["style"]
                    }}
                />

                {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
            </div>

            <Button type='submit' className="startup-form_btn text-white" disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit Your Pitch'}
                <Send className="size-6 ml-2" />
            </Button>
        </form>
    )
}

export default StartupForm