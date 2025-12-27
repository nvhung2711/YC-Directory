import { Schema, model, models, Document, SchemaTypes, Types } from 'mongoose';

export interface IStartup extends Document {
    slug: string;
    title: string;
    author: string;
    authorEmail: string;
    authorId: Types.ObjectId;
    views: number;
    description: string;
    category: string;
    image: string;
    pitch: string;
    createdAt: Date;
    updatedAt: Date;
}

const StartupSchema = new Schema<IStartup>({
    slug: {
        type: String,
        required: [true, "Slug generation failed"],
        trim: true
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    author: {
        type: String,
        required: [true, "Author name is required"],
        trim: true
    },
    authorEmail: {
        type: String,
        required: [true, "Author email is required"],
        trim: true,
        validate: {
            validator: function (email: string) {
                // RFC 5322 compliant email validation regex
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                return emailRegex.test(email);
            },
            message: 'Please provide a valid email address',
        },
        unique: true,
    },
    authorId: {
        type: SchemaTypes.ObjectId,
        ref: "Author"
    },
    views: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        min: 1,
        max: 20,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    pitch: {
        type: String
    }
}, {
    timestamps: true
});

StartupSchema.pre('validate', function () {
    const startup = this as IStartup;

    // Generate slug only if title changed or document is new
    if (startup.isModified('title') || startup.isNew) {
        startup.slug = generateSlug(startup.title);
    }
});

function generateSlug(title: string): string {
    const base = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    // 6 chars random suffix (letters+digits)
    const suffix = Math.random().toString(36).slice(2, 8);

    return `${base}-${suffix}`;
}

const Startup = models.StartupSchema || model<IStartup>("Startup", StartupSchema);

export default Startup;