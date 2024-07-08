import { SignIn, SignUp } from "@clerk/clerk-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { ProtectedLayout } from "~/components/layouts/protected-layout";
import { RootLayout } from "~/components/layouts/root-layout";
import { ChatLayout } from "./features/chat";

const root = document.getElementById("root");
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/sign-in/*",
        element: <SignIn path="/sign-in" />,
      },
      {
        path: "/sign-up/*",
        element: <SignUp path="/sign-up" />,
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/:roomId?",
            element: (
              <ChatLayout defaultLayout={undefined} navCollapsedSize={8} />
            ),
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

if (root && !root.innerHTML) {
  const rootElement = createRoot(root);

  rootElement.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
