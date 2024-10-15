import React, { useState, useEffect } from "react";
import { getOrders } from "../services/cartService"; 
// import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderData = await getOrders();
        setOrders(orderData); 
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">My Orders</h2>
      <ul className="list-group">
        {orders.map((order) => (
          <li key={order.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5>Order Number: {order.orderNumber}</h5>
                <p>
                  Total: ${order.totalPrice.centAmount / 100} <br />
                  Order Date: {new Date(order.createdAt).toLocaleDateString()} <br />
                  Status: {order.orderState}
                </p>
              </div>
              <a
                href={`/order/${order.id}`}
                className="btn btn-outline-primary"
              >
                View Details
              </a>
              {/* <Link to={`/order/${order.id}`}>View Order {order.orderNumber}</Link> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyOrders;
