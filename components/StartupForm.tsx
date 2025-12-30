"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

import { formSchema } from "@/lib/validation";

import { createStartup } from "@/lib/actions/startup.actions";

export type FormState = {
    error: string;
    errors: Record<string, string>;
    success: boolean;
}

const StartupForm = () => {
    const router = useRouter();

    const initialState = {
        error: "",
        errors: {},
        success: false
    };

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        pitch: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [state, formAction, isPending] = useActionState(handleFormSubmit, initialState);

    useEffect(() => {
        // Update errors from state
        if (state.errors) {
            setTimeout(() => {
                setErrors(state.errors);
            }, 0);
        }

        // Show success toast and navigate
        if (state.success) {

            // Navigate
            router.push('/');
        }
    }, [state, router]);

    async function handleFormSubmit(prevState: FormState, formData: FormData) {
        try {
            const formValues = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                image: formData.get("image") as File,
                pitch: formData.get("pitch") as string,
            }

            const validation = await formSchema.safeParseAsync(formValues);

            if (!validation.success) {
                const fieldErrors = validation.error.flatten().fieldErrors;

                // Convert to Record<string, string>
                const errors: Record<string, string> = {};
                Object.keys(fieldErrors).forEach((key) => {
                    const errorArray = fieldErrors[key as keyof typeof fieldErrors];
                    if (errorArray && errorArray.length > 0) {
                        errors[key] = errorArray[0];
                    }
                });

                return {
                    error: "Validation failed",
                    errors: errors,
                    success: false
                };
            } else {
                //Save the data to the database
                const response = await createStartup(validation.data);

                if (!response.success) {
                    return {
                        error: response.error,
                        errors: response.errors,
                        success: false
                    }
                }

                return {
                    error: "",
                    errors: {},
                    success: true
                }
            }
        } catch (error) {
            console.error("Form submission error:", error);

            return {
                error: "Something went wrong",
                errors: {},
                success: false
            };
        }
    }

    return (
        <form action={formAction} className="startup-form">
            <div>
                <label htmlFor="title" className="startup-form_label">Title</label>
                <Input
                    id="title"
                    name="title"
                    className="startup-form_input"
                    required
                    placeholder="Startup Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />

                {errors.title && <p className="startup-form_error">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="startup-form_label">Description</label>
                <Textarea
                    id="description"
                    name="description"
                    className="startup-form_textarea"
                    required
                    placeholder="Startup Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                {errors.description && <p className="startup-form_error">{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="category" className="startup-form_label">Category</label>
                <Input
                    id="category"
                    name="category"
                    className="startup-form_input"
                    required
                    placeholder="Startup Category (Tech, Health, Education, ...)"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />

                {errors.category && <p className="startup-form_error">{errors.category}</p>}
            </div>

            <div>
                <label htmlFor="image" className="startup-form_label">Upload an image</label>
                <Input id="image" name="image" className="startup-form_input" required type="file" accept="image/*" />

                {errors.image && <p className="startup-form_error">{errors.image}</p>}
            </div>

            <div data-color-mode="light">
                <label htmlFor="pitch" className="startup-form_label">Pitch</label>
                <Input id="pitch" name="pitch" className="startup-form_input hidden" required value={formData.pitch} onChange={(e) => setFormData({ ...formData, pitch: e.target.value })} />
                <MDEditor value={formData.pitch} onChange={(value) => setFormData({ ...formData, pitch: value as string })} id="pitch" preview="edit" height={300} style={{ borderRadius: 20, overflow: "hidden" }} textareaProps={{
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