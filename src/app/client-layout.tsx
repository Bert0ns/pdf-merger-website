'use client';

import React from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ClientLayout({
  children,
  htmlAttrs = {},
  bodyAttrs = {},
}: {
  children: React.ReactNode;
  htmlAttrs?: Record<string, string>;
  bodyAttrs?: Record<string, string>;
}) {
  return (
    <html {...htmlAttrs}>
      <body {...bodyAttrs}>
        
        <TooltipProvider><QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider></TooltipProvider>
        <Toaster key="toaster" />
        <Sonner key="sonner" />
      </body>
    </html>
  );
}