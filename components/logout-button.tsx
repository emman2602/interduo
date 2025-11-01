// components/LogoutButton.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button2"; // Tu botón grande
import { LogOut } from "lucide-react"; // Un icono

// 1. Define las props
type LogoutButtonProps = {
  className?: string;
  useBigButton?: boolean; // La nueva prop para decidir el estilo
};

export function LogoutButton({ className, useBigButton = false }: LogoutButtonProps) {
  const router = useRouter();

  // Tu función de logout (¡está perfecta!)
  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login"); // Redirige al login
  };

  // 2. Lógica para mostrar el botón grande
  if (useBigButton) {
    return (
      <Button onClick={logout} className={className}>
        Cerrar Sesión
      </Button>
    );
  }

  // 3. Lógica para mostrar el enlace de texto (para el menú)
  return (
    <button
      onClick={logout}
      className={`flex w-full items-center text-sm text-gray-700 ${className}`}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Cerrar Sesión
    </button>
  );
}