"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const checkItems = [
  "Resume parsed instantly",
  "Match score for every role",
  "AI resume suggestions",
  "One-click tailored apply",
];

export function CTA() {
  return (
    <section className="w-full py-20 bg-background relative overflow-hidden">
      <div className="page-wrapper">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[3rem] px-8 py-16 lg:px-16 lg:py-24 bg-foreground text-background shadow-2xl shadow-foreground/20"
        >
          {/* Decorative glows */}
          <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 max-w-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Get Started Today
                </div>

                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]">
                  Ready to find
                  <br />
                  <span className="text-primary">your next role?</span>
                </h2>

                <p className="text-lg leading-relaxed text-background/70 font-medium">
                  Join over 10,000 job seekers who use JobAI to apply smarter, target better, and hear back faster.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="h-14 px-8 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95 group">
                    Start for free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="ghost" size="lg" className="h-14 px-6 rounded-2xl text-base font-semibold text-background/80 hover:text-background hover:bg-white/10">
                    How it works
                  </Button>
                </Link>
              </div>

              <p className="text-xs font-bold text-background/40 uppercase tracking-widest italic translate-y-2">
                No credit card required · Cancel anytime
              </p>
            </div>

            {/* Checklist */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-8 sm:p-10 space-y-6 lg:ml-auto w-full lg:max-w-md">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Platform Promise</p>
                <div className="grid gap-6">
                  {checkItems.map((item) => (
                    <div key={item} className="flex items-center gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                        <CheckCircle2 className="h-4 w-4 text-primary group-hover:text-foreground transition-colors" />
                      </div>
                      <span className="text-base font-bold text-background/90">{item}</span>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}