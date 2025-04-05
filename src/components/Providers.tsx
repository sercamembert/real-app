"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { EdgeStoreProvider } from "../lib/edgestore";
const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <EdgeStoreProvider>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </EdgeStoreProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;
