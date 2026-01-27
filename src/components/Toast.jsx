import { useEffect } from "react";

export default function Toast({ message, tone = "info", onClose, duration = 2600 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${tone}`}>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Fechar">
        x
      </button>
    </div>
  );
}
