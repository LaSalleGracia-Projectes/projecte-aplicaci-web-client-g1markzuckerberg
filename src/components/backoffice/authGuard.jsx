// src/components/backoffice/authGuard.jsx
"use client"; // Necesario en componentes cliente dentro de app/

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // CORRECTO en App Router
// import { useUser } from "@/lib/useUser";

export default function AuthGuard({ children }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return children;
}
