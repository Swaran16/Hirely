"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Sparkles, User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { strength: score, label: "Weak", color: "bg-destructive" };
    if (score <= 3) return { strength: score, label: "Fair", color: "bg-warning" };
    if (score <= 4) return { strength: score, label: "Good", color: "bg-primary/60" };
    return { strength: score, label: "Strong", color: "bg-success" };
  };

  const passwordStrength = getPasswordStrength(passwordValue || "");

  const onSubmit = async (data: RegisterSchema) => {
    try {
      console.log("Register data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Register successful! (API not connected yet)");
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
    <Card className="border-none shadow-2xl shadow-foreground/5 rounded-[2.5rem] overflow-hidden bg-card p-2 sm:p-4">
      <CardHeader className="text-center space-y-4 pb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight">Create account</CardTitle>
          <CardDescription className="text-base font-medium">
            Start your AI-powered job search today
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Full name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className={cn(
                  "h-12 pl-12 rounded-2xl bg-muted/50 border-none transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background text-base font-medium",
                  errors.name && "ring-2 ring-destructive/20"
                )}
              />
            </div>
            {errors.name && (
              <p className="text-xs font-bold text-destructive px-1 flex items-center gap-1.5">
                <AlertCircle className="h-3 w-3" /> {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Email address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                {...register("email")}
                type="email"
                placeholder="name@company.com"
                className={cn(
                  "h-12 pl-12 rounded-2xl bg-muted/50 border-none transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background text-base font-medium",
                  errors.email && "ring-2 ring-destructive/20"
                )}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-bold text-destructive px-1 flex items-center gap-1.5">
                <AlertCircle className="h-3 w-3" /> {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className={cn(
                  "h-12 pl-12 pr-12 rounded-2xl bg-muted/50 border-none transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background text-base font-medium",
                  errors.password && "ring-2 ring-destructive/20"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {passwordValue && (
              <div className="mt-3 px-1 space-y-2">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-all duration-500",
                        level <= passwordStrength.strength ? passwordStrength.color : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center">
                   <p className="text-[0.65rem] font-black uppercase tracking-widest text-muted-foreground">
                      Strength: <span className={cn("ml-1", passwordStrength.color.replace('bg-', 'text-'))}>{passwordStrength.label}</span>
                   </p>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-xs font-bold text-destructive px-1 flex items-center gap-1.5">
                <AlertCircle className="h-3 w-3" /> {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Confirm password
            </label>
            <div className="relative group">
              <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className={cn(
                  "h-12 pl-12 pr-12 rounded-2xl bg-muted/50 border-none transition-all focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background text-base font-medium",
                  errors.confirmPassword && "ring-2 ring-destructive/20"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-bold text-destructive px-1 flex items-center gap-1.5">
                <AlertCircle className="h-3 w-3" /> {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-start gap-3 px-1 py-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
            />
            <label htmlFor="terms" className="text-xs font-medium text-muted-foreground leading-relaxed">
              I agree to the <Link href="/terms" className="text-primary font-bold hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
            </label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/10 hover:shadow-2xl transition-all group mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center pt-4 pb-8">
        <p className="text-sm font-medium text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-bold hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}