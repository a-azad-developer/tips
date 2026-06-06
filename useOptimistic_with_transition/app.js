import { useState, useOptimistic, startTransition } from "react";

async function likeOnServer() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return 1; // یعنی سرور می‌گوید یک لایک اضافه شد
}

export default function App() {
  const [likes, setLikes] = useState(0);

  // optimistic فقط pending را نگه می‌دارد
  const [pending, addPending] = useOptimistic(
    0,
    (current, delta) => current + delta
  );

  const optimisticLikes = likes + pending;

  const handleClick = () => {
    startTransition(async () => {
      // 1) optimistic: فقط pending زیاد می‌شود
      addPending(1);

      // 2) درخواست به سرور
      const delta = await likeOnServer();

      // 3) مقدار واقعی زیاد می‌شود
      setLikes((l) => l + delta);

      // 4) یک pending کم می‌شود
      addPending(-1);
    });
  };

  return (
    <h1 onClick={handleClick}>
      opt: {optimisticLikes} | likes: {likes} | pending: {pending}
    </h1>
  );
}
