"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, User, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupRole, setSignupRole] = useState<"user" | "driver">("user");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(loginEmail, loginPassword);

    if (error) {
      toast.error(error.message || "Failed to sign in");
    } else {
      toast.success("Welcome back!");
    }

    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signUp(
      signupEmail,
      signupPassword,
      signupName,
      signupRole,
    );

    if (error) {
      toast.error(error.message || "Failed to sign up");
    } else {
      toast.success("Account created successfully!");
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* App Logo - iOS Style */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#fdb927] to-[#f59e0b] rounded-[22.5%] shadow-lg shadow-[#fdb927]/30 mb-4">
          <Car className="w-11 h-11 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Ride App
        </h1>
        <p className="text-[15px] text-gray-600 mt-1">
          Your journey starts here
        </p>
      </div>

      {/* iOS Card Style */}
      <Card className="ios-card border-gray-200 bg-white overflow-hidden">
        <CardContent className="p-0">
          <Tabs defaultValue="login" className="w-full">
            {/* iOS Segment Control */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="ios-segment">
                <TabsList className="w-full grid grid-cols-2 bg-transparent p-0 h-auto">
                  <TabsTrigger
                    value="login"
                    className="ios-segment-item data-[state=active]:ios-segment-item-active text-[15px]"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="ios-segment-item data-[state=active]:ios-segment-item-active text-[15px]"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Login Tab */}
            <TabsContent value="login" className="p-6 space-y-5 mt-0 bg-white">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="login-email"
                    className="text-[15px] text-gray-700 font-normal"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="ios-input pl-11 text-[17px]"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="login-password"
                    className="text-[15px] text-gray-700 font-normal"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="ios-input pl-11 text-[17px]"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* iOS Primary Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full ios-button-primary text-[17px] font-semibold mt-6"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="p-6 space-y-5 mt-0 bg-white">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="signup-name"
                    className="text-[15px] text-gray-700 font-normal"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      className="ios-input pl-11 text-[17px]"
                      autoComplete="name"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="signup-email"
                    className="text-[15px] text-gray-700 font-normal"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="ios-input pl-11 text-[17px]"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="signup-password"
                    className="text-[15px] text-gray-700 font-normal"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      className="ios-input pl-11 text-[17px]"
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* iOS List Style Role Selection */}
                <div className="space-y-2">
                  <Label className="text-[15px] text-gray-700 font-normal">
                    Account Type
                  </Label>
                  <div className="ios-list rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setSignupRole("user")}
                      disabled={isLoading}
                      className={`ios-list-item w-full flex items-center justify-between ${
                        signupRole === "user" ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            signupRole === "user"
                              ? "bg-[#007AFF]"
                              : "bg-gray-200"
                          }`}
                        >
                          <User
                            className={`w-5 h-5 ${
                              signupRole === "user"
                                ? "text-white"
                                : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-[17px] font-medium text-gray-900">
                            Rider
                          </p>
                          <p className="text-[13px] text-gray-500">
                            Book rides and travel
                          </p>
                        </div>
                      </div>
                      {signupRole === "user" && (
                        <div className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupRole("driver")}
                      disabled={isLoading}
                      className={`ios-list-item w-full flex items-center justify-between ${
                        signupRole === "driver" ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            signupRole === "driver"
                              ? "bg-[#007AFF]"
                              : "bg-gray-200"
                          }`}
                        >
                          <Car
                            className={`w-5 h-5 ${
                              signupRole === "driver"
                                ? "text-white"
                                : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-[17px] font-medium text-gray-900">
                            Driver
                          </p>
                          <p className="text-[13px] text-gray-500">
                            Drive and earn money
                          </p>
                        </div>
                      </div>
                      {signupRole === "driver" && (
                        <div className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* iOS Primary Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full ios-button-primary text-[17px] font-semibold mt-6"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-[13px] text-gray-500">
          Secure and encrypted connection
        </p>
      </div>
    </div>
  );
}
