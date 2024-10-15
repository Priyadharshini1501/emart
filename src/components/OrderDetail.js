import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getOrderDetails } from "../services/cartService";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = await getOrderDetails(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
    // eslint-disable-next-line
  }, [orderId]);

  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (!order) {
    return <div>No order found.</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Order Details</h2>

      <div className="order-summary mb-5">
        <h4>Order Number: {order.orderNumber}</h4>
        <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Status: {order.orderState}</p>
        <p>Total Amount: ${order.totalPrice.centAmount / 100}</p>
      </div>

      <h3 className="mb-4">Shipping Information</h3>
      <div className="shipping-info mb-5">
        <p>Name: {order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
        <p>Address: {order.shippingAddress.streetName}, {order.shippingAddress.city}, {order.shippingAddress.region}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
        <p>Email: {order.shippingAddress.email}</p>
        <p>Phone: {order.shippingAddress.phone}</p>
      </div>

      <h3 className="mb-4">Items Ordered</h3>
      <ul className="list-group">
        {order.lineItems.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{item.name["en-US"]}</span>
            <span>{item.quantity} x ${item.price.value.centAmount / 100}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetail;
