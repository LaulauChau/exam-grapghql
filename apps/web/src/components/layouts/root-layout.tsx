import { ClerkProvider } from "@clerk/clerk-react";
import "@fontsource-variable/inter";
import { Outlet, useNavigate } from "react-router-dom";

import "~/assets/css/globals.css";
import { ApolloProvider } from "~/libs/apollo";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export function RootLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <ApolloProvider>
        <Outlet />
      </ApolloProvider>
    </ClerkProvider>
  );
}
