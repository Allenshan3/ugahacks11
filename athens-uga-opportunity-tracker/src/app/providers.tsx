"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { JobsProvider } from "./JobsContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <JobsProvider>{children}</JobsProvider>
    </SessionProvider>
  );
}

