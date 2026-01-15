import React, { useEffect, useState } from "react";

let pushToast;
export function notify(message, type = "info") {
  if (pushToast) pushToast({ message, type });
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    pushToast = (t) => {
      const id = Date.now() + Math.random();
      setToasts((s) => [...s, { ...t, id }]);
      setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 3500);
    };
    return () => (pushToast = null);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <div key={t.id} className="px-4 py-2 rounded shadow text-sm bg-white border">
          {t.message}
        </div>
      ))}
    </div>
  );
}
