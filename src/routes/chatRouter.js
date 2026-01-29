import { Router } from "express";
import { authMiddleware } from "../middleware/index.js";
import { accessChat ,sendMessage ,getMessages  } from "../controllers/chatController.js";

export const chatRouter = Router()


chatRouter.post("/chat", authMiddleware, accessChat);
chatRouter.post("/message", authMiddleware, sendMessage);
chatRouter.get("/message/:chatId", authMiddleware, getMessages);

