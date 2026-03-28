import Link from "next/link";
import { Briefcase } from "lucide-react";

// This layout wraps ALL auth pages (login, register)
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      
      {/* Header */}
      <header className="py-8 px-6">
        <div className="page-wrapper">
          <Link
            href="/"
            className="inline-flex items-center gap-3 group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center transition-transform duration-200 group-hover:scale-95 shadow-lg shadow-black/5">
              <Briefcase size={16} className="text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Job<span className="text-primary">AI</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main content - centers the form */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 sm:py-20">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border/50 bg-background/50">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
          © {new Date().getFullYear()} JobAI, Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}