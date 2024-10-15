import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:4000/login", {
                username,
                password,
            });
            localStorage.setItem("user", response.data.token);
            alert("Login successful!");
            window.location.href = "/products";
        } catch (err) {
            setError("Invalid username or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login Page</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className="form-control"
                    />
                </div>
                {loading ? (
                    <button type="submit" className="btn btn-primary" disabled>
                        Logging in...
                    </button>
                ) : (
                    <button type="submit" className="btn btn-primary">
                        Login
                    </button>
                )}
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};

export default Login;