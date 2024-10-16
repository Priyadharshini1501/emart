import { createClient } from "@commercetools/sdk-client";
import { createAuthMiddlewareForClientCredentialsFlow } from "@commercetools/sdk-middleware-auth";
import { createHttpMiddleware } from "@commercetools/sdk-middleware-http";

import apiclient from "./apiClient";

const TOKEN = localStorage.getItem("token");
const clientId = "IVEdzXUawMnh8-OqOhUvJd8S";
const clientSecret = "dUW4oYPMaTLdN4EvOCPq4u2DQwrlXdF0";
const PROJECT_KEY = "priya-test";
const API_URL = "https://api.eastus.azure.commercetools.com";
const AUTH_URL = "https://auth.eastus.azure.commercetools.com";

const client = createClient({
  middlewares: [
    createAuthMiddlewareForClientCredentialsFlow({
      host: AUTH_URL,
      projectKey: PROJECT_KEY,
      credentials: {
        clientId: clientId,
        clientSecret: clientSecret,
      },
      fetch,
    }),
    createHttpMiddleware({ host: API_URL, fetch }),
  ],
});

export const getProductBySku = async (sku) => {
  try {
    const response = await client.execute({
      uri: `/priya-test/product-projections?where=masterVariant(sku="${sku}")`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (response && response.body && response.body.results.length > 0) {
      return response.body.results[0]; 
    } else {
      throw new Error(`No product found with SKU: ${sku}`);
    }
  } catch (error) {
    console.error("Failed to get product by SKU:", error);
    throw error;
  }
};

export const createCart = async (currency) => {
  try {
    const response = await client.execute({
      uri: `/priya-test/carts`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: {
        currency,
      },
    });
    localStorage.setItem('cartId', response.body.id);
    return response.body;
  } catch (error) {
    console.error("Failed to create cart:", error);
  }
};

export const addItemToCart = async (cartId, sku, quantity) => {
  try {
    const response = await client.execute({
      uri: `/priya-test/carts/${cartId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: {
        version: 1, 
        actions: [
          {
            action: "addLineItem",
            sku, 
            quantity,
          },
        ],
      },
    });

    return response.body;
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    throw error;
  }
};


export const getCart = async (cartId) => {
  try {
    const response = await apiclient.execute({
      uri: `/priya-test/carts/${cartId}`,  
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TOKEN}`, 
      },
    });

    return response.body;  
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const setCartShippingAddress = async (cartId, shippingDetails, cartVersion) => {
  try {
    const response = await client.execute({
      uri: `/priya-test/carts/${cartId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        version: cartVersion,
        actions: [
          {
            action: "setShippingAddress",
            address: {
              firstName: shippingDetails.name.split(" ")[0] || "",
              lastName: shippingDetails.name.split(" ")[1] || "",
              streetName: shippingDetails.address,
              city: shippingDetails.city,
              region: shippingDetails.state,
              postalCode: shippingDetails.postalCode,
              country: shippingDetails.country.slice(0, 2).toUpperCase(),
              email: shippingDetails.email,
              phone: shippingDetails.phone,
            },
          },
        ],
      }),
    });

    return response.body;
  } catch (error) {
    console.error("Failed to set shipping address on cart:", error);
    throw error;
  }
};


export const placeOrder = async (cartId, shippingDetails, cartVersion) => {
  try {
    const response = await client.execute({
      uri: `/priya-test/orders`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        cart: { id: cartId },
        version: cartVersion, 
        orderNumber: `${Date.now()}`, 
        shippingAddress: {
          firstName: shippingDetails.name.split(" ")[0] || "", 
          lastName: shippingDetails.name.split(" ")[1] || "", 
          streetName: shippingDetails.address, 
          city: shippingDetails.city, 
          state: shippingDetails.state, 
          postalCode: shippingDetails.postalCode, 
          country: shippingDetails.country.slice(0, 2).toUpperCase(), 
          email: shippingDetails.email, 
          phone: shippingDetails.phone, 
        },
      }),
    });
    console.log(response);
    return response.body;
  } catch (error) {
    console.error("Failed to place order:", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await client.execute({
      uri: `/priya-test/orders`,  
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    return response.body.results;  
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await apiclient.execute({
      uri: `/priya-test/orders/${orderId}`,  
      method: 'GET',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    return response.body;  
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};