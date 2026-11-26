"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { installUnauthorizedRedirect } from "@/lib/auth-redirect";
import { queryKeys } from "@/lib/query-keys";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useEffect, useState, type ReactNode } from "react";

export type TProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: TProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  useEffect(
    () =>
      installUnauthorizedRedirect(() => {
        queryClient.setQueryData(queryKeys.auth.me(), null);
      }),
    [queryClient],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <NuqsAdapter>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </NuqsAdapter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
