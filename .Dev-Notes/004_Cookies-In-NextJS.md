# Handling Cookies in Next.js App Router (with `next/headers`)

## Overview

Next.js 13 introduced the **App Router**, changing how server-side code works, including API routes and middleware. A big change is the new cookie API via `next/headers`, which is now **async** and needs to be `await`ed before use.

This README explains:

- How to **read and set cookies** in Next.js App Router API routes.
- Why `cookies()` is async and how to correctly use it.
- Common pitfalls and how to avoid them.

---

## The `cookies()` API in Next.js App Router

In the App Router (`app/api/route.js`), Next.js provides access to request cookies via:

```js
import { cookies } from "next/headers";

const cookieStore = await cookies(); // ⚠️ Must await!
```

Unlike the older `next-cookies` or Node `req.cookies` which were sync, this new `cookies()` method **returns a Promise**. This is because the new App Router is designed for React Server Components and can handle streaming and async data fetching more seamlessly.

### Reading Cookies

```js
const cookieStore = await cookies();
const accessToken = cookieStore.get("accessToken")?.value;
```

### Setting Cookies

To set cookies in the response inside API routes or route handlers, you can use the same `cookieStore.set()` method:

```js
cookieStore.set("accessToken", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
});
```

---

## Important: Always Await `cookies()`

Trying to call `cookies()` **without `await`** and immediately using `.set()` or `.get()` will cause this error:

```
Error: Route "/api/signup" used `cookies().set(...)`. `cookies()` should be awaited before using its value.
```

This means:

- You **must** do: `const cookieStore = await cookies();`
- Then call `cookieStore.get(...)` or `cookieStore.set(...)`

---

## Example: Setting Cookies in an API Route (POST /api/signup)

```js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  // Your signup logic here...

  // Generate tokens (example)
  const accessToken = "abc123";
  const refreshToken = "xyz789";

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };

  // Correct usage: await cookies() before set()
  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, cookieOptions);
  cookieStore.set("refreshToken", refreshToken, cookieOptions);

  return NextResponse.json({
    success: true,
    message: "Signup successful",
  });
}
```

---

## Summary

| Step               | Code example                                 | Notes                                                         |
| ------------------ | -------------------------------------------- | ------------------------------------------------------------- |
| Import cookies API | `import { cookies } from "next/headers";`    | Available only in App Router API routes and server components |
| Await cookies()    | `const cookieStore = await cookies();`       | Always await before using                                     |
| Get cookie         | `cookieStore.get("accessToken")?.value;`     | Returns the cookie value                                      |
| Set cookie         | `cookieStore.set("name", "value", options);` | Options include `httpOnly`, `secure`, `sameSite`, `maxAge`    |

---

## Common Mistakes

- Calling `cookies()` **without** `await`.
- Trying to set cookies on the client side using this API (only for server).
- Forgetting `httpOnly` or `secure` options in production for security.

---

## Additional Resources

- Official Next.js Docs: [Dynamic Cookies API](https://nextjs.org/docs/app/building-your-application/routing/router-handlers#cookies)
- RFC discussion about async cookies: [GitHub Issue](https://github.com/vercel/next.js/discussions/49200)
