"use client";

import { motion } from "framer-motion";
import { Upload, Target, Sparkles, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const features = [
  {
    Icon: Upload,
    title: "Instant Resume Parsing",
    description:
      "Drop your PDF or Word doc. Our parser extracts every skill, role, and qualification in seconds — no manual form-filling, ever.",
    tag: "PARSING",
    className: "bg-foreground text-background",
  },
  {
    Icon: Target,
    title: "Selection Probability",
    description:
      "A precise percentage score for every job you consider. Know your odds before you spend time on an application.",
    tag: "INTELLIGENCE",
    className: "bg-primary text-primary-foreground",
  },
  {
    Icon: Sparkles,
    title: "Per-Role Resume Tips",
    description:
      "Specific, actionable edits for each job description — not vague advice. We tell you exactly what to add, move, or reword.",
    tag: "AI WRITING",
    className: "bg-foreground text-background",
  },
  {
    Icon: Briefcase,
    title: "Smart Job Matching",
    description:
      "We surface roles that match your actual depth, not just keywords. Surface roles others miss, skip the ones that would reject you.",
    tag: "MATCHING",
    className: "bg-primary text-primary-foreground",
  },
];

const stats = [
  { value: "10k+", label: "Active users" },
  { value: "85%", label: "Placement rate" },
  { value: "3.2×", label: "More interviews" },
  { value: "< 2m", label: "Setup time" },
];

export function Features() {
  return (
    <section id="features" className="w-full py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-border to-transparent" />
      
      <div className="page-wrapper">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16 sm:mb-20">
          <div className="max-w-2xl space-y-4">
            <Badge variant="outline" className="px-3 py-1 bg-primary/5 border-primary/20 text-primary font-bold tracking-widest uppercase text-[0.65rem]">
               Platform Features
            </Badge>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]">
              Built for the way
              <br />
              <span className="text-muted-foreground">hiring actually works</span>
            </h2>
          </div>
          <p className="text-lg leading-relaxed max-w-sm text-muted-foreground lg:text-right font-medium">
            A focused set of tools built around one goal — helping you land the right role, faster.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {features.map(({ Icon, title, description, tag, className }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="group relative border-none bg-card shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-[2rem] overflow-hidden p-2 sm:p-4">
                <CardHeader className="flex flex-row items-start justify-between pb-6 space-y-0">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-300", className)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="bg-muted/50 border-none text-[0.6rem] font-bold tracking-widest uppercase py-1 px-3">
                    {tag}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground font-medium">
                    {description}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm font-bold pt-4 text-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 cursor-pointer">
                    Explore feature <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-20 sm:mt-32 pt-16 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-8">
          {stats.map(({ value, label }, idx) => (
            <motion.div 
              key={label} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
              className="text-center space-y-2"
            >
              <p className="font-display text-4xl sm:text-5xl font-bold tracking-tighter text-foreground">
                {value}
              </p>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}