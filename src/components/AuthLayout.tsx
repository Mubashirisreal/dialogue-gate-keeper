
import React from "react";
import { Card } from "@/components/ui/card";
interface AuthLayoutProps {
  children: React.ReactNode;
  logoSrc?: string;
  appName?: string;
}
export function AuthLayout({
  children,
  logoSrc,
  appName = "Tara from Goodmind"
}: AuthLayoutProps) {
  return <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-accent to-background p-4 sm:p-8 bg-[#e6f7e6]">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          {logoSrc ? <img src={logoSrc} alt={`${appName} logo`} className="mx-auto h-12 w-auto mb-2" /> : <div className="mx-auto h-12 w-12 rounded-full bg-[#1a5e1a] flex items-center justify-center mb-2">
              <span className="text-lg font-bold text-primary-foreground">TG</span>
            </div>}
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{appName}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started
          </p>
        </div>
        <Card className="auth-card overflow-hidden border-none p-6 sm:p-8">
          {children}
        </Card>
      </div>
    </div>;
}
