// src/components/OrderConfirmation.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract order data from the navigation state if available
  useEffect(() => {
    const orderData = location.state?.order;
    if (orderData) {
      setOrder(orderData);
    } else {
      // If no order data is available, navigate back to home
      navigate("/");
    }
  }, [location, navigate]);

  // Return a loader if order data is not yet set
  if (!order) {
    return <div>Loading order details...</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Order Confirmation</h2>
      <div className="card p-4">
        <h4 className="mb-3">Thank you for your purchase!</h4>
        <p>
          Your order has been placed successfully. Below are your order details:
        </p>
        <hr />
        {/* Order Summary */}
        <div className="mb-3">
          <h5>Order Number: {order.orderNumber}</h5>
        </div>
        <div className="mb-3">
          <h5>Items Purchased:</h5>
          <ul className="list-group">
            {order.lineItems.map((item) => (
              <li key={item.id} className="list-group-item">
                <span>
                  {item.name["en-US"]} - {item.quantity} x $
                  {item.price.value.centAmount / 100}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-3">
          <h5>Order Total: ${order.totalPrice.centAmount / 100}</h5>
        </div>
        <div className="mb-3">
          <h5>Shipping Information:</h5>
          <p>
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            <br />
            {order.shippingAddress.streetName}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.region}
            <br />
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            <br />
            Email: {order.shippingAddress.email}
            <br />
            Phone: {order.shippingAddress.phone}
          </p>
        </div>
        {/* Back to Home or Shop Again Button */}
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
