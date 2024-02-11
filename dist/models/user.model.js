"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const UserSchema = new mongoose_1.Schema({
    googleId: {
        type: String,
    },
    username: {
        type: String,
    },
    firstName: {
        type: String,
        maxlength: 32,
        trim: true,
    },
    lastName: {
        type: String,
        maxlength: 32,
        trim: true,
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
    solvedWords: [],
    solvedWordsCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
UserSchema.virtual("password")
    .set(function (password) {
    this._password = password;
    this.salt = (0, uuid_1.v1)();
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
        if (!plainPassword)
            return "";
        try {
            return crypto_1.default
                .createHmac("sha256", this.salt)
                .update(plainPassword)
                .digest("hex");
        }
        catch (err) {
            return "";
        }
    },
};
exports.UserModel = (0, mongoose_1.model)("users", UserSchema);
//# sourceMappingURL=user.model.js.map