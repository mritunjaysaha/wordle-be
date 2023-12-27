import { model, Schema, Model, Document } from "mongoose";
import crypto from "crypto";
import { v1 as uuidV1 } from "uuid";

// export interface IUser extends Document {
//     firstName: string;
//     lastName: string;
//     email: string;
//     encryptedPassword: string;
//     salt: string;
//     todos: string[];
//     labels: string[];
// }

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            maxlength: 32,
            trim: true,
        },
        lastName: {
            type: String,
            maxlength: 32,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        encryptedPassword: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
        },
        todos: [{ type: Schema.Types.ObjectId, ref: "todos" }],
        labels: [{ type: Schema.Types.ObjectId, ref: "labels" }],
    },
    { timestamps: true }
);

UserSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuidV1();
        this.encryptedPassword = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.methods = {
    authenticate: function (plainPassword) {
        return this.securePassword(plainPassword) === this.encryptedPassword;
    },
    securePassword: function (plainPassword) {
        if (!plainPassword) return "";

        try {
            return crypto
                .createHmac("sha256", this.salt)
                .update(plainPassword)
                .digest("hex");
        } catch (err) {
            return "";
        }
    },
};

export const UserModel: Model<IUser> = model < IUser > ("users", UserSchema);
