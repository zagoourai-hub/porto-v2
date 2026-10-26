import { create } from "zustand";

interface FlashMessage {
    message: string;
    setMessage: (message: string) => void;
    clear: () => void;
}

export const useFlash = create<FlashMessage>((set) => ({
     message: "",
  setMessage: (message) => set({ message }),
  clear: () => set({ message: "" }),
}))