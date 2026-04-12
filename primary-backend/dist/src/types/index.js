"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapCreateSchema = exports.signupSchema = exports.signinSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signinSchema = zod_1.default.object({
    username: zod_1.default.string().min(6),
    password: zod_1.default.string().min(5),
    name: zod_1.default.string().min(3)
});
exports.signupSchema = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string(),
    name: zod_1.default.string()
});
exports.ZapCreateSchema = zod_1.default.object({
    avaliableTriggerId: zod_1.default.string(),
    triggerMetadata: zod_1.default.any().optional(),
    actions: zod_1.default.array(zod_1.default.object({
        avaliableActionID: zod_1.default.string(),
        actionMetadata: zod_1.default.any().optional()
    }))
});
