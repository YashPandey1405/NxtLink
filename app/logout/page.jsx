"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UrlService from "@/services/UrlService.js";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const response = await UrlService.Logout();

        if (response.success) {
          router.push("/login"); // Redirect to /login if valid
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    checkAuthAndRedirect();
  }, []);

  return (
    <div>
      <h1 className="text-center mt-5">You are being logged out of NxtLink.</h1>
    </div>
  );
}
