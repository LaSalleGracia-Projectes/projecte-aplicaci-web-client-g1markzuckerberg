"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("webToken");

    if (!token) {
      router.push("/components/login");
    } else {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return <p className="text-center mt-20 text-lg">Verificando sesión...</p>;
  }

  return isAuthenticated ? children : null;
}
