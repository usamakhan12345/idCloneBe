import { Router } from "express";
import { authMiddleware } from "../middleware/index.js";
import { accessChat ,sendMessage ,getMessages  } from "../controllers/chatController.js";

export const chatRouter = Router()


chatRouter.post("/api/chat", authMiddleware, accessChat);
chatRouter.post("/api/message", authMiddleware, sendMessage);
chatRouter.get("/api/message/:chatId", authMiddleware, getMessages);

