"use client";

import { motion } from "framer-motion";
import { Upload, Briefcase, Target, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Upload your resume",
    description:
      "PDF or Word — our parser handles both and pulls your skills, roles, and experience automatically.",
    Icon: Upload,
  },
  {
    number: "02",
    title: "Set your targets",
    description:
      "Tell us the roles and companies you're aiming for. We use that context to narrow down the sharpest matches.",
    Icon: Briefcase,
  },
  {
    number: "03",
    title: "Review your matches",
    description:
      "Each job shows a match score, strengths, and specific gaps — so you know exactly where you stand.",
    Icon: Target,
  },
  {
    number: "04",
    title: "Apply with an edge",
    description:
      "Tailor your resume per application with AI suggestions and go in with a measurably higher shot at the role.",
    Icon: CheckCircle2,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-24 sm:py-32 bg-foreground text-background relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2" />
      
      <div className="page-wrapper relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16 sm:mb-20">
          <div className="max-w-2xl space-y-4">
            <Badge variant="outline" className="px-3 py-1 bg-primary/10 border-primary/20 text-primary font-bold tracking-widest uppercase text-xs">
               How it works
            </Badge>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]">
              From resume to offer
              <br />
              <span className="text-background/60">in four simple steps</span>
            </h2>
          </div>
          <p className="text-lg leading-relaxed max-w-sm text-background/60 lg:text-right font-medium">
             No complex onboarding. Just a clean, focused flow that gets you to the right jobs faster.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-px bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/20">
          {steps.map(({ number, title, description, Icon }, idx) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative p-8 sm:p-10 hover:bg-white/[0.03] transition-colors duration-300"
            >
              <div className="flex flex-col h-full">
                {/* Step Number */}
                <div className="font-display text-6xl font-bold text-white/5 mb-8 group-hover:text-primary/10 transition-colors">
                  {number}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <Icon className="h-5 w-5 text-primary group-hover:text-foreground transition-colors" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold tracking-tight text-background">
                    {title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-background/60 font-medium">
                    {description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer strip */}
        <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 glass px-5 py-2.5 rounded-full border-white/5">
             <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
             <p className="text-sm font-bold text-background/80">
                Avg. time to first application: <span className="text-primary font-black ml-1">8 mins</span>
             </p>
          </div>

          {/* Pipeline labels */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {["Resume upload", "AI matching", "Score report", "Apply"].map((label, i, arr) => (
              <div key={label} className="flex items-center gap-3">
                <Badge variant="outline" className="bg-white/5 border-white/10 text-background/60 hover:text-primary hover:border-primary/30 transition-colors text-[0.65rem] font-bold px-3 py-1 uppercase tracking-widest">
                  {label}
                </Badge>
                {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-white/20" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}