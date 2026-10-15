
import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats
    } = useContext(MyContext);

    // Get JWT token
    const getToken = () => localStorage.getItem("token");

    // Fetch all threads belonging to the logged-in user
    const getAllThreads = async () => {
        const token = getToken();

        if (!token) return;

        try {
            const response = await fetch(
                "http://localhost:8080/api/thread",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
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
                throw new Error(res.error || "Failed to fetch threads");
            }

            if (!Array.isArray(res)) {
                throw new Error("Invalid threads response from server");
            }

            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));

            setAllThreads(filteredData);
        } catch (err) {
            console.error("Error fetching threads:", err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    // Create a new chat
    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    // Open an existing thread
    const changeThread = async (newThreadId) => {
        const token = getToken();

        if (!token) return;

        try {
            const response = await fetch(
                `http://localhost:8080/api/thread/${newThreadId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
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
                throw new Error(res.error || "Failed to load chat");
            }

            if (!Array.isArray(res)) {
                throw new Error("Invalid chat history response");
            }

            setCurrThreadId(newThreadId);
            setPrevChats(res);
            setNewChat(false);
            setPrompt("");
            setReply(null);
        } catch (err) {
            console.error("Error opening thread:", err);
        }
    };

    // Delete a thread
    const deleteThread = async (threadId) => {
        const token = getToken();

        if (!token) return;

        try {
            const response = await fetch(
                `http://localhost:8080/api/thread/${threadId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
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
                throw new Error(res.error || "Failed to delete thread");
            }

            setAllThreads(prev =>
                prev.filter(thread => thread.threadId !== threadId)
            );

            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.error("Error deleting thread:", err);
        }
    };

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img
                    src="src/assets/blacklogo.png"
                    alt="gpt logo"
                    className="logo"
                />
                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>

            <ul className="history">
                {allThreads?.map((thread) => (
                    <li
                        key={thread.threadId}
                        onClick={() => changeThread(thread.threadId)}
                        className={
                            thread.threadId === currThreadId
                                ? "highlighted"
                                : ""
                        }
                    >
                        {thread.title}

                        <i
                            className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>

            <div className="sign">
                <p>By Himanshu Bhardwaj &hearts;</p>
            </div>
        </section>
    );
}

export default Sidebar;
