"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

const links = {
  Product: ["Features", "How it Works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="page-wrapper py-20 sm:py-24">
        <div className="grid grid-cols-2 md:grid-cols-[1.8fr_1fr_1fr_1fr] gap-12 sm:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center transition-transform duration-200 group-hover:scale-95 shadow-lg shadow-black/5">
                <Icons.briefcase size={16} className="text-primary" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                Job<span className="text-primary">AI</span>
              </span>
            </Link>
            
            <p className="text-base leading-relaxed text-muted-foreground max-w-xs font-medium">
              AI-powered job matching that helps you apply smarter and land roles faster.
            </p>
            
            <div className="flex items-center gap-3">
              {[
                { Icon: Icons.linkedin, label: "LinkedIn" },
                { Icon: Icons.github, label: "GitHub" },
              ].map(({ Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-muted transition-all duration-300"
                >
                  <Icon className="h-4 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-xs font-bold tracking-widest uppercase text-foreground">
                {title}
              </h4>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-10 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-muted-foreground/60 tracking-tight">
            © 2026 JobAI, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border-border/50">
             <span className="text-xs font-bold text-muted-foreground">Made with</span>
             <Heart className="h-3 w-3 text-primary fill-primary animate-pulse" />
             <span className="text-xs font-bold text-muted-foreground">for job seekers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}