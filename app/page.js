"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UrlService from "@/services/UrlService.js";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const response = await UrlService.checkLogin();
        console.log("Auth check response:", response);

        if (!response?.success) {
          router.replace("/login");
        } else {
          router.replace("/home");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return null; // Optionally show a loader here
}
