import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { addItemToCart, createCart } from "../services/cartService";


const ProductDetail = () => {
  const [cartBtn, setCartBtn] = useState("Add to Cart");
  const [product, setProduct] = useState(null);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [cart, setCart] = useState(null);
  // eslint-disable-next-line
  const [cartVersion, setCartVersion] = useState(1);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (id && token) {
        try {
          const response = await fetch(
            `https://api.eastus.azure.commercetools.com/priya-test/products/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Ensure the response is OK
          if (!response.ok) {
            throw new Error("Failed to fetch product");
          }

          const data = await response.json();

          // Check if data is not empty or undefined
          if (data) {
            setProduct(data);
          } else {
            console.log("No product found.");
          }
        } catch (error) {
          console.log("Failed to fetch product:", error);
        }
      }
    };

    fetchProductDetail();
  }, [id, token]);

  useEffect(() => {
    const initCart = async () => {
      try {
        const currency = "USD";
        const createdCart = await createCart(currency);

        if (createdCart && createdCart.id) {
          setCart(createdCart);
          setCartVersion(createdCart.version);
        } else {
          console.error("Invalid cart data:", createdCart);
        }
      } catch (error) {
        console.error("Failed to create or retrieve cart:", error);
      }
    };

    initCart();
  }, []);

  const handleCart = async () => {
    console.log(cart.id);
    console.log(product.masterData.current.masterVariant.sku);
    console.log(quantity);
    if (!product || !cart) return;
    try {
      const updatedCart = await addItemToCart(
        cart.id,
        product.masterData.current.masterVariant.sku,
        quantity
      );
      if (updatedCart) {
        setCartVersion(updatedCart.version); // Update version after adding item
        setCartBtn("Remove from Cart");
        console.log("Cart updated successfully:", updatedCart);
      }
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    setQuantity(isNaN(value) ? 1 : value); // Ensure quantity is a number
  };

  // Return a loader or a message if product data is not loaded yet
  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <>
      <div className="container my-5 py-3">
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center mx-auto product">
            {/* Make sure to use product fields correctly */}
            <img
              src={
                product.masterData.current.masterVariant &&
                product.masterData.current.masterVariant.images &&
                product.masterData.current.masterVariant.images.length > 0
                  ? product.masterData.current.masterVariant.images[0].url
                  : "https://via.placeholder.com/150"
              }
              alt={product.masterData.current.name.en || "Product Image"}
              height="400px"
            />
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h1 className="display-5 fw-bold">
              {product.masterData.current.name["en-US"]}
            </h1>
            <hr />
            <h2 className="my-4">Price: 
              $
              {product.masterData.current.masterVariant.prices[0].value
                .centAmount / 100}{" "}
            </h2>
            <p className="lead">
              {product.masterData.current.description["en-US"]}
            </p>
            <div className="input-group mb-3">
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </button>
              <input
                type="number"
                className="form-control"
                value={quantity}
                min="1"
                onChange={handleQuantityChange}
              />
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => setQuantity(quantity + 1)}>
                +
              </button>
            </div>

            <button
              onClick={handleCart}
              className="btn btn-outline-primary my-2"
            >
              {cartBtn}
            </button>
            <a
              href="/cart"
              className="btn btn-outline-primary my-2"
            >
              Go to Cart
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;