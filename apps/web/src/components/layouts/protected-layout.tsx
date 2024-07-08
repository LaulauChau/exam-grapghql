import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function ProtectedLayout() {
  const { isLoaded, userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, navigate, userId]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
}
