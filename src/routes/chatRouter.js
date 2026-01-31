import { Router } from "express";
import { authMiddleware } from "../middleware/index.js";
import { accessChat ,sendMessage ,getMessages  } from "../controllers/chatController.js";

export const chatRouter = Router()


chatRouter.post("/api/create-chat", authMiddleware, accessChat);
chatRouter.post("/api/send-message", authMiddleware, sendMessage);
chatRouter.get("/api/get-messages/:chatId", authMiddleware, getMessages);

