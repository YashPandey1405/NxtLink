# AuthMiddleware Replica In NextJS

## What changes in Next.js?

No `req, res`, and next in the same way.

- In Next.js API routes or app route handlers, you get request object
- (the Fetch API Request) — no direct access to res or next().
- You return a response or throw errors.
- Cookies are accessed via request.cookies.get("name") or from headers.
- No built-in error middleware — handle errors inside your function or route.

---

## Code For Implementation 😊

```js
async function verifyJWT(request) {
  try {
    // 1. Get token from Authorization header or cookie
    const authHeader = request.headers.get("authorization");
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    const tokenFromCookie = request.cookies.get("accessToken")?.value;
    const token = tokenFromCookie || bearerToken;

    if (!token) {
      throw new Error("Unauthorized request: No token found");
    }

    // 2. Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Fetch user from DB by ID in token payload
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new Error("Invalid Access Token: User not found");
    }

    return user; // return user info if verified successfully
  } catch (error) {
    console.error("JWT verification error:", error);
    throw new Error("Authentication failed");
  }
}
```

### Purpose:

`verifyJWT` is an **async function** designed to verify a JSON Web Token (JWT) sent in an HTTP request, **authenticate the user**, and fetch user data from the database based on that token.

---

### Step-by-step breakdown:

```js
async function verifyJWT(request) {
```

- Declares an asynchronous function that accepts a `request` object.
- This `request` is the standard Fetch API `Request` object used in Next.js route handlers.

---

```js
const authHeader = request.headers.get("authorization");
```

- Reads the `Authorization` header from the HTTP request.
- Usually, JWTs sent via headers follow this pattern:
  `Authorization: Bearer <token>`

---

```js
const bearerToken =
  authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
```

- Checks if the `Authorization` header exists and starts with `"Bearer "`.
- If yes, it extracts the token part by slicing off the first 7 characters (`"Bearer "`).
- Otherwise, sets `bearerToken` to `null`.

---

```js
const tokenFromCookie = request.cookies.get("accessToken")?.value;
const token = tokenFromCookie || bearerToken;
```

- Tries to get the JWT from the `accessToken` cookie.
- If not found in cookies, uses the token from the Authorization header.
- This allows flexibility: token can come either from cookie or header.

---

```js
if (!token) {
  throw new Error("Unauthorized request: No token found");
}
```

- If no token is found from either cookie or header, throws an error.
- This means the request is unauthenticated — no valid token provided.

---

```js
const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
```

- Verifies the JWT using the secret key stored in environment variables (`ACCESS_TOKEN_SECRET`).
- If the token is invalid, expired, or tampered with, this line will throw an error.
- If valid, `decodedToken` contains the payload — usually includes user ID or other claims.

---

```js
const user = await User.findById(decodedToken._id).select(
  "-password -refreshToken",
);
```

- Looks up the user in your MongoDB database using Mongoose.
- Uses the `_id` from the decoded token payload to find the exact user.
- The `.select("-password -refreshToken")` excludes the password and refresh token fields from the result for security.

---

```js
if (!user) {
  throw new Error("Invalid Access Token: User not found");
}
```

- If no user is found matching the decoded token’s user ID, throws an error.
- Means token was valid, but user does not exist in your DB — likely revoked or deleted account.

---

```js
return user; // return user info if verified successfully
```

- If everything succeeds, returns the user object (without sensitive fields).
- The caller can use this user info for authorization or personalization.

---

```js
} catch (error) {
  console.error("JWT verification error:", error);
  throw new Error("Authentication failed");
}
```

- Catches any errors that happened during the process (no token, invalid token, DB errors).
- Logs the error on the server console for debugging.
- Throws a generic "Authentication failed" error which the caller can handle and respond with 401 Unauthorized or similar.

---

### Summary:

- This function **extracts a JWT from a request** (cookie or header).
- It **verifies the JWT’s validity**.
- It **fetches the authenticated user from the database**.
- It **throws errors if anything is wrong**.
- It **returns the user data if the token is valid and user exists**.

This is perfect for protecting API routes in Next.js by ensuring only authenticated users can access them.
