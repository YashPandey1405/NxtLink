"use client";
import React, { use } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UrlService from "@/services/UrlService.js";

export default function HomeById(paramsPromise) {
  const { id } = use(paramsPromise.params);

  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        try {
          const response = await UrlService.DeleteUrl(id);

          if (response.success === false) {
            router.push("/login");
            return;
          }
          router.push("/home");
        } catch (err) {
          console.error("Auth check failed", err);
          router.push("/login");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    checkAuthAndRedirect();
  }, []);

  return (
    <h1 className="text-center mt-5">
      Deleting The ShortURL With ObjectID : {id}{" "}
    </h1>
  );
}
