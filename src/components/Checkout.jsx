// src/components/Checkout.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { createCart, addItemToCart, getCart, setCartShippingAddress, placeOrder } from "../services/cartService";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    email: "",
    phone: ""
  });
  const [orderTotal, setOrderTotal] = useState(0);
  const cartId = localStorage.getItem('cartId');
  const [cartVersion, setCartVersion] = useState(null); 
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch cart details when component mounts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await getCart(cartId);
        if (cartData) {
          setCart(cartData);
          setCartVersion(cartData.version); // Set the cart version
          const total = cartData.lineItems.reduce((acc, item) => acc + item.totalPrice.centAmount / 100, 0);
          setOrderTotal(total);
        }
      } catch (error) {
        console.error("Failed to fetch cart data:", error);
      }
    };

    fetchCart();
  }, [cartId]);

  // Handle input change for shipping details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, address, city, state, postalCode, country, email, phone } = shippingDetails;
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!address) newErrors.address = "Address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (!postalCode) newErrors.postalCode = "Postal Code is required";
    if (!country) newErrors.country = "Country is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    console.log(shippingDetails);
    if(shippingDetails) {
        validateForm();
    }
  }, [shippingDetails]);

  // Handle order placement
  const handlePlaceOrder = async () => {
    try {
        // Retrieve the cart again to check its status
        const fetchedCart = await getCart(cartId);
    
        if (fetchedCart && fetchedCart.cartState !== "Active") {
          // If the cart is not active, create a new one
          console.log("Cart is not active. Creating a new cart...");
          const newCart = await createCart("USD");
    
          if (newCart && newCart.id) {
            setCart(newCart); // Update the cart state
            setCartVersion(newCart.version);
            localStorage.setItem("cartId", newCart.id);
    
            // Transfer items to the new cart if needed
            for (const item of fetchedCart.lineItems) {
              await addItemToCart(newCart.id, item.sku, item.quantity);
            }
    
            // Set the shipping address for the new cart
            const updatedNewCart = await setCartShippingAddress(
              newCart.id,
              shippingDetails,
              newCart.version
            );
    
            // Now place the order with the new cart ID and version
            const order = await placeOrder(newCart.id, shippingDetails, updatedNewCart.version);
            if (order) {
              console.log("Order placed successfully:", order);
              alert("Order placed successfully!");
              navigate("/order-confirmation", { state: { order } });
              return;
            }
          } else {
            console.error("Failed to create a new cart.");
          }
        }
    
        // If the cart is still active, proceed with the existing cart
        const updatedCart = await setCartShippingAddress(cartId, shippingDetails, cartVersion);
        if (updatedCart) {
          console.log("Shipping address set successfully on cart:", updatedCart);
    
          // Place the order with the updated cart version
          const order = await placeOrder(cartId, shippingDetails, updatedCart.version);
          if (order) {
            console.log("Order placed successfully:", order);
            alert("Order placed successfully!");
            navigate("/order-confirmation", { state: { order } });
          }
        }
      } catch (error) {
        console.error("Failed to place order:", error);
      }
  };

  if (!cart) {
    return <div>Loading cart details...</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Checkout</h2>
      {/* Cart Summary */}
      <div className="mb-5">
        <h3>Your Cart</h3>
        <ul className="list-group">
          {cart.lineItems.map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{item.name["en-US"]}</span>
              <span>{item.quantity} x ${item.price.value.centAmount / 100}</span>
            </li>
          ))}
        </ul>
        <h4 className="mt-3">Total: ${orderTotal}</h4>
      </div>

      {/* Shipping Information */}
      <div className="mb-5">
        <h3>Shipping Information</h3>
        <form>
          {[
            { label: "Full Name", name: "name" },
            { label: "Address", name: "address" },
            { label: "City", name: "city" },
            { label: "State", name: "state" },
            { label: "Postal Code", name: "postalCode" },
            { label: "Country", name: "country" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone Number", name: "phone", type: "tel" }
          ].map((field) => (
            <div key={field.name} className="mb-3">
              <label htmlFor={field.name} className="form-label">{field.label}</label>
              <input
                type={field.type || "text"}
                className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                id={field.name}
                name={field.name}
                value={shippingDetails[field.name]}
                onChange={handleInputChange}
                required
              />
              {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
            </div>
          ))}
        </form>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        className="btn btn-primary"
        disabled={Object.keys(errors).length > 0}
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;