import type { Metadata } from "next";
import MessagesView from "./MessagesView";

export const metadata: Metadata = { title: "Pesan Masuk" };

export default function MessagesPage() {
  return <MessagesView />;
}
