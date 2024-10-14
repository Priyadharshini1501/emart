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

        // Reset previous errors
        setError("");
        setLoading(true);

        try {
            // Replace with your API endpoint
            const response = await axios.post("http://localhost:4000/login", {
                username,
                password,
            });

            // Save the token to localStorage or handle successful login
            localStorage.setItem("user", response.data.token);
            alert("Login successful!");

            // Redirect or navigate to the home page or dashboard
            window.location.href = "/product";
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