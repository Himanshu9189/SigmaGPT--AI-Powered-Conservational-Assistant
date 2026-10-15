
import { useState } from "react";
import "./Auth.css";

function Auth({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!isLogin && !name.trim()) {
            setError("Please enter your name.");
            return;
        }

        setLoading(true);

        try {
            const endpoint = isLogin ? "login" : "register";

            const response = await fetch(
                `http://localhost:8080/api/${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Something went wrong."
                );
            }

            if (isLogin) {
                if (!data.token) {
                    throw new Error("Login did not return a token.");
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                onAuthSuccess();
            } else {
                setSuccess("Registration successful! Please log in.");
                setIsLogin(true);
                setName("");
                setPassword("");
            }
        } catch (err) {
            setError(err.message || "Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authPage">
            <div className="authCard">
                <div className="authLogo">SigmaGPT</div>

                <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>

                <p className="authSubtitle">
                    {isLogin
                        ? "Log in to continue your conversations."
                        : "Sign up to start using SigmaGPT."}
                </p>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="authField">
                            <label htmlFor="name">Full name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="authField">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="authField">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete={
                                isLogin ? "current-password" : "new-password"
                            }
                            minLength={8}
                            required
                        />
                    </div>

                    {error && <p className="authError">{error}</p>}
                    {success && <p className="authSuccess">{success}</p>}

                    <button
                        className="authSubmit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Log In"
                                : "Create Account"}
                    </button>
                </form>

                <p className="authSwitch">
                    {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}

                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                            setSuccess("");
                        }}
                    >
                        {isLogin ? "Sign up" : "Log in"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Auth;
