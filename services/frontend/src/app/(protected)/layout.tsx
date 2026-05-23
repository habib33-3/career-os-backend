import { type PropsWithChildren } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getUser = async () => {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.API_URL}/auth/me`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();

  return data?.data ?? null;
};

const ProtectedLayout = async ({ children }: PropsWithChildren) => {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <div>{children}</div>;
};

export default ProtectedLayout;
