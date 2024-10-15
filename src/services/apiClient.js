import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';

const projectKey = 'your-project-key';
const authUrl = 'https://auth.eastus.azure.commercetools.com';
const apiUrl = 'https://api.eastus.azure.commercetools.com';

const clientId = 'your-client-id';
const clientSecret = 'your-client-secret';

const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: authUrl,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
});

const httpMiddleware = createHttpMiddleware({
  host: apiUrl,
});

const apiclient = createClient({
  middlewares: [authMiddleware, httpMiddleware],
});

export default apiclient;
