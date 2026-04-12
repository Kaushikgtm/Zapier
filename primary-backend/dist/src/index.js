"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./routes/user");
const zap_1 = require("./routes/zap");
const trigger_1 = require("./routes/trigger");
const action_1 = require("./routes/action");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/user", user_1.userRoute);
app.use("/api/v1/zap", zap_1.zapRoute);
app.use("/api/v1/trigger", trigger_1.triggerRoute);
app.use("/api/v1/action", action_1.actionRoute);
const startServer = (port) => {
    app.listen(port, () => {
        console.log(`server is listen on ${port}`);
    }).on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.log(`Port ${port} is busy, trying port ${port + 1}`);
            if (port < 3010) {
                startServer(port + 1);
            }
            else {
                console.error("No available ports found between 3000-3010");
            }
        }
    });
};
startServer(3000);
