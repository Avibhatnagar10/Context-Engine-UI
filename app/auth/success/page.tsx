import { Suspense } from "react";
import AuthSuccessClient from "./AuthSuccessClient";

export default function AuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-black text-white">
          Completing authentication...
        </div>
      }
    >
      <AuthSuccessClient />
    </Suspense>
  );
}