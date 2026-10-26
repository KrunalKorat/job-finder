"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Personal deployment: Registration is disabled, redirecting to login
    router.replace("/auth/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8F7F3] flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-sm text-[#697586]">Redirecting to sign in...</p>
      </div>
    </div>
  );
}
