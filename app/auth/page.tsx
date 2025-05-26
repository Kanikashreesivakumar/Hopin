"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Car,
  Check,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Lock,
  LogIn,
  Mail,
  Shield,
  User,
  UserPlus,
} from "lucide-react";
import Logo from "@/components/logo";
import { useAuth } from "@/hooks/AuthContext";

type UserRole = "driver" | "passenger" | null;

export default function AuthPage() {
  const router = useRouter();
  const { signup, login } = useAuth();

  const [rememberMe, setRememberMe] = useState(false);

  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [vehicleInfo, setVehicleInfo] = useState({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    color: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate inputs
    if (!selectedRole || !name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength < 3) {
      setError("Please use a stronger password");
      return;
    }

    let signupBody: any = { name, email, password, role: selectedRole };
    if (selectedRole === "driver") {
      const { make, model, year, licensePlate, color } = vehicleInfo;
      if (!make || !model || !year || !licensePlate) {
        setError("Please fill in all vehicle information");
        return;
      }
      signupBody.vehicleInfo = { make, model, year, licensePlate, color };
    }

    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupBody),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Signup failed");
        setIsLoading(false);
        return;
      }
      setSuccess("Account created successfully! Redirecting...");
      signup(data.user, data.token);
      setTimeout(() => {
        router.push(`/dashboard/${selectedRole}`);
      }, 1500);
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleCards = [
    {
      role: "driver",
      title: "Driver",
      icon: <Car className="h-12 w-12 text-hopin-orange" />,
      description: "Offer rides to events and earn",
    },
    {
      role: "passenger",
      title: "Passenger",
      icon: <User className="h-12 w-12 text-hopin-orange" />,
      description: "Find and book rides to events",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }
      setSuccess("Login successful! Redirecting...");
      login(data.user, data.token); 
      setTimeout(() => {
        router.push(`/dashboard/${data.user.role}`); 
      }, 1500);
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative flex-col items-center justify-center min-h-screen grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-[url('/loclogo.jpg?height=1080&width=1920')] bg-cover "
        />

        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo size="medium" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-20 mt-auto"
        >
          <blockquote className="space-y-2">
            <p className="text-lg">
              "HOPIN has completely transformed how our students get to campus
              events. It's made ride-sharing simple, affordable, and fun!"
            </p>
            <footer className="text-sm">
              Sofia Davis, Student Council President
            </footer>
          </blockquote>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 z-10 h-full w-full "
        />
      </div>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] lg:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to HOPIN
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account or create a new one
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200">
                <Check className="h-4 w-4 mr-2" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <form onSubmit={handleLogin}>
                    <CardHeader>
                      <CardTitle>Login</CardTitle>
                      <CardDescription>
                        Enter your email and password to access your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-9"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link
                            href="/auth/forgot-password"
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-9"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-10 w-10"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(checked as boolean)
                          }
                        />
                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange to-emerald-600 hover:from-orange hover:to-emerald-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                          </>
                        )}
                      </Button>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <Button variant="outline" type="button">
                          <Mail className="mr-2 h-4 w-4" />
                          Google
                        </Button>
                      </div>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="signup">
                <Card>
                  <form onSubmit={handleSignup}>
                    <CardHeader>
                      <CardTitle>Sign Up</CardTitle>
                      <CardDescription>
                        Enter your information to create a new account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!selectedRole ? (
                        <>
                          <div className="text-center mb-2">
                            <h3 className="text-lg font-medium">
                              Select your role
                            </h3>
                          </div>
                          <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 gap-4"
                          >
                            {roleCards.map((card) => (
                              <motion.div
                                key={card.role}
                                variants={item}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm cursor-pointer border-2 transition-all duration-300 ${
                                  selectedRole === card.role
                                    ? "border-hopin-orange animate-glow"
                                    : "border-transparent hover:border-hopin-orange/50"
                                }`}
                                onClick={() =>
                                  setSelectedRole(card.role as UserRole)
                                }
                              >
                                <div className="flex items-center">
                                  <div className="bg-hopin-orange/10 p-3 rounded-full mr-4">
                                    {card.icon}
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold">
                                      {card.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                      {card.description}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center mb-4">
                            <button
                              type="button"
                              onClick={() => setSelectedRole(null)}
                              className="text-sm text-hopin-orange hover:underline flex items-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="m15 18-6-6 6-6" />
                              </svg>
                              Change role
                            </button>
                            <div className="ml-auto flex items-center">
                              <div className="bg-hopin-orange/10 text-hopin-orange rounded-md px-2 py-1 text-xs font-medium">
                                {selectedRole.charAt(0).toUpperCase() +
                                  selectedRole.slice(1)}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="name"
                                placeholder="John Doe"
                                className="pl-9"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signup-email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="signup-email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-9"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signup-password">Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="signup-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-9"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-10 w-10"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            {password && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs">
                                    Password strength:
                                  </span>
                                  <span className="text-xs font-medium">
                                    {passwordStrength === 0 && "Very weak"}
                                    {passwordStrength === 1 && "Weak"}
                                    {passwordStrength === 2 && "Medium"}
                                    {passwordStrength === 3 && "Strong"}
                                    {passwordStrength === 4 && "Very strong"}
                                  </span>
                                </div>
                                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      passwordStrength === 0
                                        ? "bg-red-500 w-1/5"
                                        : passwordStrength === 1
                                        ? "bg-orange-500 w-2/5"
                                        : passwordStrength === 2
                                        ? "bg-yellow-500 w-3/5"
                                        : passwordStrength === 3
                                        ? "bg-green-500 w-4/5"
                                        : "bg-emerald-500 w-full"
                                    }`}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">
                              Confirm Password
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-9"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-10 w-10"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            {confirmPassword &&
                              password !== confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">
                                  Passwords do not match
                                </p>
                              )}
                          </div>

                          {selectedRole === "driver" && (
                            <div className="space-y-2 rounded-lg border p-4 bg-muted/50">
                              <h4 className="font-semibold text-base mb-2 text-hopin-orange">
                                Vehicle Information
                              </h4>
                              <div className="grid grid-cols-1 gap-3">
                                <div>
                                  <Label htmlFor="vehicle-make">Make</Label>
                                  <Input
                                    id="vehicle-make"
                                    placeholder="e.g. Toyota"
                                    value={vehicleInfo.make}
                                    onChange={(e) =>
                                      setVehicleInfo({
                                        ...vehicleInfo,
                                        make: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="vehicle-model">Model</Label>
                                  <Input
                                    id="vehicle-model"
                                    placeholder="e.g. Corolla"
                                    value={vehicleInfo.model}
                                    onChange={(e) =>
                                      setVehicleInfo({
                                        ...vehicleInfo,
                                        model: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <Label htmlFor="vehicle-year">Year</Label>
                                    <Input
                                      id="vehicle-year"
                                      placeholder="e.g. 2020"
                                      type="number"
                                      min="1900"
                                      max={new Date().getFullYear()}
                                      value={vehicleInfo.year}
                                      onChange={(e) =>
                                        setVehicleInfo({
                                          ...vehicleInfo,
                                          year: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="vehicle-color">Color</Label>
                                    <Input
                                      id="vehicle-color"
                                      placeholder="e.g. Red"
                                      value={vehicleInfo.color}
                                      onChange={(e) =>
                                        setVehicleInfo({
                                          ...vehicleInfo,
                                          color: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="vehicle-license">
                                    License Plate
                                  </Label>
                                  <Input
                                    id="vehicle-license"
                                    placeholder="e.g. ABC-1234"
                                    value={vehicleInfo.licensePlate}
                                    onChange={(e) =>
                                      setVehicleInfo({
                                        ...vehicleInfo,
                                        licensePlate: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="terms"
                              checked={agreeToTerms}
                              onCheckedChange={(checked) =>
                                setAgreeToTerms(checked as boolean)
                              }
                              required
                            />
                            <label
                              htmlFor="terms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              I agree to the{" "}
                              <Link
                                href="/terms"
                                className="text-primary hover:underline"
                              >
                                terms and conditions
                              </Link>
                            </label>
                          </div>
                        </>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                      {selectedRole && (
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-orange to-emerald-600 hover:from-orange hover:to-emerald-700"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Create Account
                            </>
                          )}
                        </Button>
                      )}

                      {selectedRole && (
                        <>
                          <div className="relative flex flex-col items-center justify-center w-full">
                            <div className="relative w-full flex items-center justify-center">
                              <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                  Or continue with
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              type="button"
                              className="mt-4 w-full flex items-center justify-center"
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Google
                            </Button>
                          </div>
                        </>
                      )}

                      <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link
                          href="/auth"
                          className="text-hopin-orange hover:underline"
                        >
                          Sign in
                        </Link>
                      </div>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="h-4 w-4" />
              <span>Secure authentication</span>
            </div>
            <span className="mx-2">•</span>
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <Lock className="h-4 w-4" />
              <span>End-to-end encryption</span>
            </div>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
