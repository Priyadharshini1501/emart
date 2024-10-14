import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';

const Product = () => {
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [groupedProducts, setGroupedProducts] = useState({});

    useEffect(() => {
        const getToken = async () => {
            const clientId = "IVEdzXUawMnh8-OqOhUvJd8S";
            const clientSecret = "dUW4oYPMaTLdN4EvOCPq4u2DQwrlXdF0";
            const authUrl = "https://auth.eastus.azure.commercetools.com/oauth/token";
            const scope =
                "view_product_selections:priya-test view_shipping_methods:priya-test view_categories:priya-test view_discount_codes:priya-test view_project_settings:priya-test manage_order_edits:priya-test manage_shopping_lists:priya-test view_published_products:priya-test view_cart_discounts:priya-test view_products:priya-test view_tax_categories:priya-test view_standalone_prices:priya-test manage_orders:priya-test manage_sessions:priya-test view_sessions:priya-test view_types:priya-test create_anonymous_token:priya-test manage_customers:priya-test";

            const formData = new URLSearchParams();
            formData.append("grant_type", "client_credentials");
            formData.append("scope", scope);

            const base64Credentials = btoa(`${clientId}:${clientSecret}`);

            try {
                const response = await fetch(authUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Basic ${base64Credentials}`,
                    },
                    body: formData.toString(),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch token");
                }

                const data = await response.json();
                setToken(data.access_token);
                localStorage.setItem('token', data.access_token);
            } catch (error) {
                setError(error.message);
            }
        };

        getToken();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const fetchProducts = async (token) => {
            if (token) {
                console.log(token);
                try {
                    const response = await fetch(
                        "https://api.eastus.azure.commercetools.com/priya-test/products",
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const data = await response.json();

                    if (data.results) {
                        setProducts(data.results);
                    } else {
                        console.log("No products found.");
                    }
                } catch (error) {
                    setError("Failed to fetch products");
                }
            }
        };

        if (token) {
            fetchProducts(token);
        }
    }, [token]);

    useEffect(() => {
        const grouped = products.reduce((acc, product) => {
          console.log(product.productType);
          const productType = product.productType.name || 'Unknown Type';
          if (!acc[productType]) {
            acc[productType] = [];
          }
          acc[productType].push(product);
          return acc;
        }, {});
        setGroupedProducts(grouped);
        // eslint-disable-next-line
      }, [products]);
    return (
        <div>
            <div className="container py-5">
                <div className="row">
                    <div className="col-12 text-center">
                        <h1>Products</h1>
                        <hr />
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row justify-content-around">
                    {console.log(products)}
                    {error && <p className="alert alert-danger">{error}</p>}
                    {Object.keys(groupedProducts).length > 0 ? (
                        Object.keys(groupedProducts).map((type) => (
                            <div className="row justify-content-around">
                                {groupedProducts[type].map((product) => (
                                    <div class="card my-5 py-4" key={product.id} style={{ width: "18rem" }}>
                                        <img src={
                                            product.masterData.current.masterVariant &&
                                            product.masterData.current.masterVariant.images &&
                                            product.masterData.current.masterVariant.images.length > 0
                                                ? product.masterData.current.masterVariant.images[0].url
                                                : 'https://via.placeholder.com/150'
                                            }
                                            alt={product.masterData.current.name.en || 'Product Image'}  class="card-img-top" />
                                        <div class="card-body text-center">
                                            <h5 class="card-title">{product.masterData.current.name['en-US']}</h5>
                                            <p className="lead">${product.masterData.current.masterVariant.prices[0].value.centAmount / 100}{' '}</p>
                                            <NavLink to={`/products/${product.id}`} class="btn btn-outline-primary">Buy Now</NavLink>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p className="text-center">Loading products...</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Product
