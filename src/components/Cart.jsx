// src/components/Cart.js
import React, { useEffect, useState } from "react";
import { getCart } from "../services/cartService";
import { NavLink } from 'react-router-dom'

const Cart = () => {
  // State to store cart items and cart details
  const [cart, setCart] = useState(null);
  const cartId = localStorage.getItem('cartId');
  // Fetch the cart details when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
        try {
          const cartData = await getCart(cartId);
  
          if (cartData) {
            setCart(cartData);
          }
        } catch (error) {
          console.error('Failed to fetch cart data:', error);
        }
      };
  
      fetchCart();
  }, []);

  // Render a loading message while the cart is being fetched
  if (!cart) {
    return <div>Loading Cart...</div>;
  }

  // If cart has no line items, display a message indicating that
  if (cart.lineItems.length === 0) {
    return <div>Your cart is empty!</div>;
  }

  // Helper function to calculate the total amount
  const calculateTotal = () => {
    return cart.lineItems.reduce((acc, item) => {
      return acc + item.totalPrice.centAmount / 100;
    }, 0);
  };
  return (

    <div className="px-4 my-5 bg-light rounded-3">
        <div className="container py-4">
            <h2 className="my-4">Your Shopping Cart</h2>
            <div className="cart-items">
                {cart.lineItems.length > 0 ? 
                    <div className="row justify-content-center">
                        {cart.lineItems.map((item) => (
                        <div key={item.id} className="card mb-3">
                            <div className="row g-0">
                            <div className="col-md-4">
                                <img
                                src={
                                    item.variant.images[0]?.url ||
                                    "https://via.placeholder.com/150"
                                }
                                className="img-fluid rounded-start"
                                alt={item.name.en || "Product Image"}
                                />
                            </div>
                            <div className="col-md-4">
                                <div className="card-body">
                                <h5 className="card-title">{item.name["en-US"]}</h5>
                                <p className="card-text">
                                    Price: ${item.price.value.centAmount / 100}
                                </p>
                                <p className="card-text">Quantity: {item.quantity}</p>
                                <p className="card-text">
                                    Total: ${item.totalPrice.centAmount / 100}
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                :
                <h3>Your Cart is Empty</h3>
                }
            </div>
            <div className="cart-total mt-3">
                <h4>Total Amount: ${calculateTotal()}</h4>
            </div>
        </div>
        <div className="container">
                <div className="row">
                    <NavLink to="/checkout" className="btn btn-outline-primary mb-5 w-25 mx-auto">Proceed To checkout</NavLink>
                </div>
            </div>
    </div>
  );
};

export default Cart;
