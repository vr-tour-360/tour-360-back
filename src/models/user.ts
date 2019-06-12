import mongoose, { Document } from 'mongoose';
const Schema = mongoose.Schema;
import languages from './languages';
import { UserDto } from "./interfaces/user";

interface User extends Document {
    readonly id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    language: 'Русский' | 'English';
    tours: any[];

    toClient: () => UserDto;
}

const UserSchema = new Schema<User>({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    language: { type: String, enum: languages, required: true, default: 'Русский' },
    tours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

UserSchema.virtual('fullname').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

UserSchema.methods.toClient = function () {
    return {
        id: this.id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        language: this.language,
    };
};

export default mongoose.model<User>('User', UserSchema);