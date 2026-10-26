import type { Metadata } from "next";
import ChatApp from "./ChatApp";

export const metadata: Metadata = { title: "Ask AI" };

export default function ChatPage() {
  return <ChatApp />;
}
