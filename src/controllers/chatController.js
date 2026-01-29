import { Chat } from "../models/chatModel";
import { Message } from "../models/messageModel";



export const accessChat = async (req, res) => {
  const { userId } = req.body; // receiver
  const currentUserId = req.user._id; // logged-in user

  if (!userId) {
    return res.status(400).json({ message: "UserId required" });
  }

  let chat = await Chat.findOne({
    users: { $all: [currentUserId, userId] }
  }).populate("users", "name email");

  if (chat) {
    return res.status(200).json(chat);
  }

  const newChat = await Chat.create({
    users: [currentUserId, userId]
  });

  const fullChat = await Chat.findById(newChat._id)
    .populate("users", "name email");

  res.status(201).json(fullChat);
};


export const sendMessage = async (req, res) => {
  const { chatId, text } = req.body;
  const senderId = req.user._id;

  if (!chatId || !text) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const message = await Message.create({
    chat: chatId,
    sender: senderId,
    text
  });

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: message._id
  });

  const fullMessage = await Message.findById(message._id)
    .populate("sender", "name email");

  res.status(201).json(fullMessage);
};


export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });

  res.status(200).json(messages);
};
