"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //@ts-ignore
    const body = req.body;
    const parsedData = types_1.signupSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "you enter wrong datatype"
        });
    }
    const userExist = yield db_1.prismaClient.user.findFirst({
        where: {
            email: (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.name
        }
    });
    if (userExist) {
        return res.status(403).json({
            message: "user with same name already exist"
        });
    }
    yield db_1.prismaClient.user.create({
        data: {
            email: parsedData.data.username,
            password: parsedData.data.password,
            name: parsedData.data.name
        }
    });
    res.json({
        message: "user account is created successfully"
    });
}));
router.post("/signin", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const body = req.body;
    const parsedData = types_1.signinSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "you send a wrong datatype"
        });
    }
    const userExist = yield db_1.prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    });
    if (!userExist) {
        return res.status(404).json({
            message: "you send a wrong id/ password"
        });
    }
    //sign using jwt
    const token = jsonwebtoken_1.default.sign({
        id: userExist.id
    }, config_1.JWT_PASSWORD);
    res.json({
        token: token
    });
}));
exports.userRoute = router;
