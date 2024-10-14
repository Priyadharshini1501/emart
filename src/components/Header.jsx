import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {
    function handleLogout() {
        localStorage.removeItem('user');
        window.location.href = "/login";
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid py-2">
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/products">Product</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/about">About</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/contact">Contact</NavLink>
                            </li>
                            
                            
                        </ul>
                    <NavLink className="navbar-brand mx-auto fw-bold" to="/">E-Commerce Site</NavLink>
                    <button type="button" className="btn btn-outline-primary ms-auto" data-bs-toggle="modal" data-bs-target="#loginModal">
                        {localStorage.getItem('user') ? 
                        <a className="fa fa-sign-in me-1" href='/' onClick={handleLogout}>Logout</a>
                        :
                        <NavLink className="fa fa-sign-in me-1" to="/login">Login</NavLink>
                        }
                    </button>
                    <NavLink to="/cart" className="btn btn-outline-primary ms-2">
                        <span className="fa fa-shopping-cart me-1"></span> Go to Cart
                    </NavLink>
                    <NavLink to="/my-orders" className="btn btn-outline-primary ms-2">
                        <span className="fa fa-truck me-1"></span> My Orders
                    </NavLink>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header
