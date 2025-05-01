
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate } from "react-router-dom";
import { Mail, ExternalLink } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { AuthLayout } from "@/components/AuthLayout";
import { AuthButton } from "@/components/AuthButton";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const signupSchema = loginSchema.extend({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

type AuthView = "login" | "signup" | "forgotPassword" | "emailSent";

export default function Auth() {
  const [authView, setAuthView] = useState<AuthView>("login");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading, signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // If user is logged in, redirect to the main app
  if (user && !loading) {
    return <Navigate to="/app" />;
  }

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      await signIn(values.email, values.password);
      // Redirect is handled automatically when user state changes
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      await signUp(values.email, values.password);
      setAuthView("login");
      toast({
        title: "Account created",
        description: "Please check your email to verify your account",
      });
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      await resetPassword(values.email);
      setAuthView("emailSent");
    } catch (error) {
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Redirect is handled by Supabase OAuth
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <AuthLayout>
      {authView === "login" && (
        <div className="animate-fade-in">
          <h2 className="mb-6 text-xl font-semibold text-center">Sign in to your account</h2>
          
          <div className="space-y-4">
            <AuthButton 
              variant="outline" 
              onClick={handleGoogleSignIn}
              isLoading={isLoading}
              loadingText="Signing in with Google..."
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Continue with Google
            </AuthButton>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">or continue with email</span>
              </div>
            </div>
            
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          className="auth-input" 
                          placeholder="name@example.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <button
                          type="button"
                          onClick={() => setAuthView("forgotPassword")}
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <FormControl>
                        <Input 
                          className="auth-input" 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <AuthButton 
                  type="submit" 
                  isLoading={isLoading}
                  loadingText="Signing in..."
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Sign in with Email
                </AuthButton>
              </form>
            </Form>
            
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthView("signup")}
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      )}

      {authView === "signup" && (
        <div className="animate-fade-in">
          <h2 className="mb-6 text-xl font-semibold text-center">Create your account</h2>
          
          <div className="space-y-4">
            <AuthButton 
              variant="outline" 
              onClick={handleGoogleSignIn}
              isLoading={isLoading}
              loadingText="Signing up with Google..."
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Continue with Google
            </AuthButton>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">or sign up with email</span>
              </div>
            </div>
            
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          className="auth-input" 
                          placeholder="name@example.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          className="auth-input" 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          className="auth-input" 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <AuthButton 
                  type="submit" 
                  isLoading={isLoading}
                  loadingText="Creating account..."
                >
                  Sign up with Email
                </AuthButton>
              </form>
            </Form>
            
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setAuthView("login")}
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      )}

      {authView === "forgotPassword" && (
        <div className="animate-fade-in">
          <h2 className="mb-6 text-xl font-semibold text-center">Reset your password</h2>
          <p className="mb-4 text-sm text-muted-foreground text-center">
            Enter your email address and we'll send you a link to reset your password
          </p>
          
          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPasswordSubmit)} className="space-y-4">
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        className="auth-input" 
                        placeholder="name@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <AuthButton 
                type="submit" 
                isLoading={isLoading}
                loadingText="Sending reset link..."
              >
                Send reset link
              </AuthButton>
            </form>
          </Form>
          
          <button
            type="button"
            onClick={() => setAuthView("login")}
            className="mt-6 block w-full text-center text-sm text-primary hover:underline"
          >
            Back to sign in
          </button>
        </div>
      )}

      {authView === "emailSent" && (
        <div className="animate-fade-in text-center">
          <h2 className="mb-4 text-xl font-semibold">Check your email</h2>
          <p className="mb-6 text-muted-foreground">
            We've sent a password reset link to your email address
          </p>
          <AuthButton onClick={() => setAuthView("login")}>
            Back to sign in
          </AuthButton>
        </div>
      )}
    </AuthLayout>
  );
}
