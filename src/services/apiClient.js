// src/services/apiClient.js
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';

// Replace these with your Commercetools project details
const projectKey = 'your-project-key';
const authUrl = 'https://auth.eastus.azure.commercetools.com';
const apiUrl = 'https://api.eastus.azure.commercetools.com';

const clientId = 'your-client-id';
const clientSecret = 'your-client-secret';

// Create the authentication middleware
const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: authUrl,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
});

// Create the HTTP middleware for making API requests
const httpMiddleware = createHttpMiddleware({
  host: apiUrl,
});

// Create the Commercetools client with the provided middlewares
const apiclient = createClient({
  middlewares: [authMiddleware, httpMiddleware],
});

export default apiclient;
