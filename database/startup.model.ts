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
        trim: true,
        unique: true
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
        required: true,
        default: 0
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

StartupSchema.index({ slug: 1 }, { unique: true });

const Startup = models.StartupSchema || model<IStartup>("Startup", StartupSchema);

export default Startup;