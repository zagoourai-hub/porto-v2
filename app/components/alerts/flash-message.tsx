// frontend/app/components/alerts/flash-dialog.tsx
"use client";

import { useFlash } from "@/libs/store/messages";
import { useEffect, useRef } from "react";

export default function FlashDialog() {
  const message = useFlash((s) => s.message);
  const clear = useFlash((s) => s.clear);
  const ref = useRef<HTMLDialogElement>(null);

  // open the dialog when a message exists
  useEffect(() => {
    const dialog = ref.current;
    if (message && dialog && !dialog.open) dialog.showModal();
  }, [message]);

  return (
    <dialog ref={ref} className="modal" onClose={clear}>
      <div className="modal-box" role="alertdialog">
        <h3 className="text-lg font-bold">Berhasil</h3>
        <p className="py-4 text-sm text-base-content/70">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-primary">OK</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}