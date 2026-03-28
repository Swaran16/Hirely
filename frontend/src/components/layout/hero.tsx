"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-hero">
      {/* Decorative radial glows */}
      <div className="pointer-events-none absolute -top-[10%] -right-[5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-[10%] -left-[5%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />

      {/* Content */}
      <div className="page-wrapper relative pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* LEFT — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8 max-w-2xl"
          >
            {/* Eyebrow pill */}
            <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/10 border-primary/20 text-primary hover:bg-primary/15 transition-colors gap-2 text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              AI-Powered Job Matching
            </Badge>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-foreground">
              Land your next
              <br />
              <span className="text-gradient">job with confidence</span>
            </h1>

            {/* Body */}
            <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-lg">
              Upload your resume, get matched to roles that fit your actual skills, and see your real selection
              probability before you even click apply.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 group">
                  Start for free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button variant="ghost" size="lg" className="h-14 px-6 rounded-2xl text-base font-semibold group">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3 border group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                  <Play className="ml-1 h-4 w-4 fill-foreground group-hover:fill-primary text-foreground group-hover:text-primary transition-colors" />
                </div>
                See how it works
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4 border-t border-border/50">
              {["10k+ active users", "85% placement rate", "No credit card"].map((label) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Match Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[420px]">
              {/* Floating Badge */}
              <div className="absolute -top-6 -left-4 z-20 glass rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2.5 animate-float border-primary/20">
                 <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                 <span className="text-sm font-bold">Live AI Analysis</span>
              </div>

              {/* Main Card */}
              <Card className="border-none shadow-2xl shadow-foreground/5 bg-card overflow-hidden rounded-[2.5rem]">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className="space-y-1">
                      <p className="text-[0.7rem] font-bold tracking-widest uppercase text-muted-foreground">Match Score</p>
                      <h3 className="text-xl font-bold">Senior Frontend Engineer</h3>
                      <p className="text-sm text-muted-foreground font-medium">Vercel · Remote · $180k–$220k</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-4xl font-bold text-success leading-none">85%</span>
                      <p className="text-[0.7rem] font-bold text-success mt-1 uppercase tracking-wider">Strong match</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="h-full bg-linear-to-r from-success/80 to-success rounded-full" 
                       />
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="space-y-6">
                    {[
                      { skill: "React", matched: true, level: "Expert" },
                      { skill: "TypeScript", matched: true, level: "Advanced" },
                      { skill: "Node.js", matched: false, level: "Not listed" },
                    ].map((s) => (
                      <div key={s.skill} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">{s.skill}</span>
                          <span className={cn(
                            "text-[0.65rem] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                            s.matched ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                          )}>
                            {s.level}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: s.matched ? "90%" : "30%" }}
                            transition={{ duration: 1, delay: 1.2 }}
                            className={cn("h-full rounded-full", s.matched ? "bg-success" : "bg-primary")} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Recommendation */}
                  <div className="mt-8 p-5 rounded-3xl bg-primary/10 border border-primary/20 space-y-2">
                    <div className="flex items-center gap-2">
                       <Sparkles className="h-4 w-4 text-primary" />
                       <span className="text-xs font-bold text-primary uppercase tracking-widest">AI Suggestion</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-primary/80">
                      Adding <span className="text-primary font-bold">Node.js experience</span> would boost your match score to <span className="text-primary font-bold">92%</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Floating Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="absolute -bottom-6 -right-6 hidden sm:block glass p-5 rounded-2xl shadow-xl border-primary/10"
              >
                <div className="space-y-1">
                   <p className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">Applications</p>
                   <p className="font-display text-2xl font-bold">12 <span className="text-sm font-sans text-success">↑ 4 replies</span></p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Haorline / Pattern */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}