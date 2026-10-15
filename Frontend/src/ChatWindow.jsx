
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useTheme } from "./ThemeContent.jsx";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setPrevChats,
        setNewChat
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { darkMode, toggleTheme } = useTheme();
    
const [isListening, setIsListening] = useState(false);
const [voiceError, setVoiceError] = useState("");


    // Send message with JWT authentication
    const getReply = async () => {
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setNewChat(false);

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.reload();
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        message: prompt,
                        threadId: currThreadId
                    })
                }
            );

            const res = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.reload();
                return;
            }

            if (!response.ok) {
                throw new Error(res.error || "Failed to get response");
            }

            setReply(res.reply);
        } catch (err) {
            console.error("Chat error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Append messages to chat history
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => [
                ...prevChats,
                { role: "user", content: prompt },
                { role: "assistant", content: reply }
            ]);
        }

        setPrompt("");
    }, [reply]);

    // Profile dropdown
    const handleProfileClick = () => {
        setIsOpen(prev => !prev);
    };

    // Log out
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
    };

const handleVoiceInput = () => {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        setVoiceError("Voice input is not supported in this browser. Try Chrome.");
        return;
    }

    setVoiceError("");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
    };

    recognition.onerror = (event) => {
        setVoiceError(
            event.error === "not-allowed"
                ? "Please allow microphone access in your browser."
                : `Voice input failed: ${event.error}`
        );
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
};

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>
                    SigmaGPT <i className="fa-solid fa-chevron-down"></i>
                </span>

                <div
                    className="userIconDiv"
                    onClick={handleProfileClick}
                >
                    <span className="userIcon">
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>
            </div>

            {isOpen && (
                <div className="dropDown">
                    <div className="dropDownItem">
                        <i className="fa-solid fa-gear"></i> Settings
                    </div>

                    <div className="dropDownItem">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        Upgrade plan
                    </div>
                    
                 <div className="dropDownItem" onClick={toggleTheme}>
                     <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
                          {darkMode ? "Light Mode" : "Dark Mode"}
                 </div>

                    <div
                        className="dropDownItem"
                        onClick={handleLogout}
                    >
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        Log out
                    </div>
                </div>
            )}

            <Chat />

            <ScaleLoader color="#fff" loading={loading} />

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") getReply();
                        }}
                    />

<button
    type="button"
    className={`voiceButton ${isListening ? "listening" : ""}`}
    onClick={handleVoiceInput}
    title="Speak your question"
    aria-label="Speak your question"
>
    <i className="fa-solid fa-microphone"></i>
</button>

                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
{/* ADD THE VOICE ERROR MESSAGE HERE */}
    {voiceError && (
        <p className="voiceError">{voiceError}</p>
    )}

                <p className="info">
                    SigmaGPT can make mistakes. Check important info.
                    See Cookie Preferences.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;
