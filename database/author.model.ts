import { Schema, model, models, Document } from 'mongoose';

//TypeScript interface for Author document
export interface IAuthor extends Document {
    name: string;
    username: string;
    email: string;
    image: string;
    bio: string;
    createdAt: Date;
    updatedAt: Date;
}

const AuthorSchema = new Schema<IAuthor>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        username: {
            type: String,
            required: [true, "User name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            validate: {
                validator: function (email: string) {
                    // RFC 5322 compliant email validation regex
                    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                    return emailRegex.test(email);
                },
                message: 'Please provide a valid email address',
            }
        },
        image: String,
        bio: {
            type: String,
            trim: true
        },
    },
    {
        timestamps: true
    }
);

const Author = models.AuthorSchema || model<IAuthor>("Author", AuthorSchema);

export default Author;