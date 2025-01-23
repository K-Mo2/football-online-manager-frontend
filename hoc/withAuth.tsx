"use client";
import { useEffect, FC } from "react";
import { useAuthCtx } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function withAuth(WrappedComponent: FC) {
  return function NewComponent(props: any) {
    const { user, isAuthenticated } = useAuthCtx();
    const router = useRouter();

    useEffect(() => {
      const delay = setTimeout(() => {
        if (!user || !isAuthenticated) {
          router.push("/login");
        }
      }, 0);
      return () => clearTimeout(delay);
    }, [user, isAuthenticated, router]);

    if (!user || !isAuthenticated) return null;

    return <WrappedComponent {...props} />;
  };
}
