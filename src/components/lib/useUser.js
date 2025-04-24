// lib/useUser.js
"use client";

import { useState, useEffect } from "react";

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de login automático
    setTimeout(() => {
      setUser({ name: "Nico", role: "admin" }); // Cambia a "user" si quieres probar
      setLoading(false);
    }, 200);
  }, []);

  return { user, loading };
}
