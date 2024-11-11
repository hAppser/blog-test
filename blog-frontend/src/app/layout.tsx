"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import "@/shared/styles/globals.css";
import { Header } from "@/shared/ui/Header";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <title>My Blog</title>
        </head>
        <body>
          <Header />
          {children}
        </body>
      </html>
    </QueryClientProvider>
  );
}
