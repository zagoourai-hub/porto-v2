import type { Metadata } from "next";
import AuthScreen from "./AuthScreen";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return <AuthScreen />;
}
