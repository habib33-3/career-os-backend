"use client";

import { type PropsWithChildren, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";

import { setAuthFailureHandler } from "@/lib/axios/private";

import { useAuthStore } from "@/stores/useAuthStore";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  useAuthBootstrap();

  useEffect(() => {
    setAuthFailureHandler(() => {
      useAuthStore.getState().clearUser();
      router.push("/sign-in");
    });
  }, [router]);

  return <>{children}</>;
};

export default AuthProvider;
