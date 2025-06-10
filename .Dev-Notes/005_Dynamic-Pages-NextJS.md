## 📄 Component: `HomeById.jsx`

This React component is designed for use within the **App Router** of a **Next.js** application. It dynamically renders content based on the `id` parameter extracted from the route URL, using modern React and Next.js conventions.

---

### ✅ Key Features

- **Client Component**: Explicitly marked with `"use client"` to enable hooks and interactivity in the browser.
- **Dynamic Route Handling**: Accepts and unwraps `params` passed via Next.js dynamic routing (`/home/[id]`).
- **Future-Proof**: Utilizes the `React.use()` hook to unwrap asynchronous route parameters, aligning with upcoming Next.js 15+ standards.

---

### 📦 Code Breakdown

```jsx
"use client";
```

Declares this file as a **Client Component**, required to use hooks like `use()`.

```js
import React, { use } from "react";
```

Imports the `use()` hook from React, which allows Suspense-based data loading and unwrapping of Promises during rendering.

```js
export default function HomeById(paramsPromise) {
  const { id } = use(paramsPromise.params);
```

- The function receives `paramsPromise`, an object where `params` is a **Promise**.
- `use(paramsPromise.params)` unwraps the promise to access the actual route parameters.
- This pattern is required in newer versions of Next.js where route parameters are asynchronous by default.

```jsx
return (
  <div>
    <h1>Welcome Home</h1>
    <p>User ID: {id}</p>
  </div>
);
```

Renders a simple UI displaying the `id` extracted from the URL.

---

### 🚀 Usage

In your `app/home/[id]/page.jsx` file:

```jsx
import HomeById from "./HomeById";

export default function Page(props) {
  return <HomeById {...props} />;
}
```

Then access the route:

```
http://localhost:3000/home/123
```

Will display:

```
Welcome Home
User ID: 123
```

---

### ⚠️ Notes

- **React 19+ / Next.js 15+** treats `params` as an async resource. Direct access (`params.id`) will soon be deprecated.
- **`use()`** is only allowed in client components and must be used carefully with resources that return Promises.

---

### 📚 References

- [Next.js App Router Documentation](https://nextjs.org/docs/app/building-your-application/routing)
- [React `use()` Proposal](https://react.dev/reference/react/use)
