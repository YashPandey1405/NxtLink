"use client";

// This File To Update The URL And Type.....
import React, { use } from "react";

export default function HomeById(paramsPromise) {
  const { id } = use(paramsPromise.params);

  return (
    <div>
      <h1>Welcome Home</h1>
      <p>User ID: {id}</p>
    </div>
  );
}
