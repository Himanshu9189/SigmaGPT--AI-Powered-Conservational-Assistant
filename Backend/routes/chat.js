import express from "express";
import Thread from "../models/Thread.js";
import getOllamaAPIResponse from "../utils/ollama.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


// Test
router.post("/test", authMiddleware, async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            userId: req.user.userId,
            title: "Testing New Thread2"
        });

        const response = await thread.save();
        res.send(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Failed to save in DB"
        });
    }
});


// Get all threads
router.get("/thread", authMiddleware, async (req, res) => {
    try {

        const threads = await Thread.find({
            userId: req.user.userId
        }).sort({
            updatedAt: -1
        });

        res.json(threads);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Failed to fetch threads"
        });
    }
});


// Get a particular thread
router.get("/thread/:threadId", authMiddleware, async (req, res) => {

    const { threadId } = req.params;

    try {

        const thread = await Thread.findOne({
            threadId,
            userId: req.user.userId
        });

        if (!thread) {
            return res.status(404).json({
                error: "Thread not found"
            });
        }

        res.json(thread.messages);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Failed to fetch chat"
        });
    }
});


// Delete a thread
router.delete("/thread/:threadId", authMiddleware, async (req, res) => {

    const { threadId } = req.params;

    try {

        const deletedThread = await Thread.findOneAndDelete({
            threadId,
            userId: req.user.userId
        });

        if (!deletedThread) {
            return res.status(404).json({
                error: "Thread not found"
            });
        }

        res.status(200).json({
            success: "Thread deleted successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Failed to delete thread"
        });
    }
});


// Chat with Ollama
router.post("/chat", authMiddleware, async (req, res) => {

    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({
            error: "Missing required fields"
        });
    }

    try {

        // Find existing thread belonging to logged-in user
        let thread = await Thread.findOne({
            threadId,
            userId: req.user.userId
        });


        // Create new thread
        if (!thread) {

            thread = new Thread({
                threadId,

                // Important
                userId: req.user.userId,

                title: message,

                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            });

        } else {

            // Add user message
            thread.messages.push({
                role: "user",
                content: message
            });
        }


        // Get response from Ollama
        const assistantReply =
            await getOllamaAPIResponse(message);


        // Save assistant response
        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });


        // Update time
        thread.updatedAt = new Date();


        // Save thread
        await thread.save();


        // Send response
        res.json({
            reply: assistantReply
        });

    } catch (err) {

        console.log("Ollama Error:", err);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});


export default router;