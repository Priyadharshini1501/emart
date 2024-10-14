const Login = () => {        
    localStorage.removeItem("user");
    window.location.href = "/login";
};

export default Login;