import { createClient } from "@commercetools/sdk-client";
import { createAuthMiddlewareForClientCredentialsFlow } from "@commercetools/sdk-auth";
import { createHttpMiddleware } from "@commercetools/sdk-middleware-http";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

const projectKey = process.env.CT_PROJECT_KEY!;
const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: process.env.CT_AUTH_URL!,
  projectKey,
  credentials: {
    clientId: process.env.CT_CLIENT_ID!,
    clientSecret: process.env.CT_CLIENT_SECRET!,
  },
});

const httpMiddleware = createHttpMiddleware({
  host: process.env.CT_API_URL!,
});

const client = createClient({
  middlewares: [authMiddleware, httpMiddleware],
});

export const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
  projectKey,
});
