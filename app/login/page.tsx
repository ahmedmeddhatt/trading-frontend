"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useLogin, useRegister, useMe } from "@/hooks/api/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Error } from "@/components/ui/Error";
import { ErrorDetails } from "@/components/ui/ErrorDetails";
import { BackendStatus } from "@/components/ui/BackendStatus";
import { logger } from "@/lib/utils/logger";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: meData } = useMe();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const loading = loginMutation.isPending || registerMutation.isPending;
  const error = loginMutation.error || registerMutation.error;

  useEffect(() => {
    logger.page("Login", {
      pathname: window.location.pathname,
    });

    // If already logged in, redirect to dashboard
    if (user || meData) {
      router.push("/dashboard");
    }
  }, [user, meData, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrorDetails(false);

    try {
      if (isLogin) {
        await loginMutation.mutateAsync({ email, password });
        logger.info("Login successful", { email });
      } else {
        await registerMutation.mutateAsync({ name, email, password });
        logger.info("Registration successful", { email, name });
      }
    } catch (err) {
      const errorMessage =
        (err as Error)?.message || String(err) || "An error occurred";
      logger.error("Auth failed", {
        isLogin,
        email,
        error: errorMessage,
        fullError: err,
      });
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setName("");
    loginMutation.reset();
    registerMutation.reset();
    setShowErrorDetails(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-base p-4 md:p-8">
      <div className="absolute top-4 right-4">
        <BackendStatus />
      </div>
      <Card variant="elevated" padding="lg" className="w-full max-w-md">
        <Heading level={1} className="text-center mb-6">
          {isLogin ? "Login" : "Register"}
        </Heading>

        {error && (
          <div className="mb-4">
            <Error
              message={
                (error as Error)?.message ||
                String(error) ||
                "An error occurred"
              }
            />
            {(error as Error)?.message?.includes(
              "Cannot connect to backend server"
            ) && (
              <div className="mt-2 text-sm text-[#a3a3a3]">
                <p>To help debug this, please check:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Your backend server is running on
                    `https://aeb984f5-3583-4f23-a88f-25828e3ceac3-00-g337wi7drv6o.picard.replit.dev`
                  </li>
                  <li>Your backend terminal for error messages</li>
                  <li>Your browser console (F12) for full error details</li>
                </ul>
              </div>
            )}
            <button
              onClick={() => setShowErrorDetails(!showErrorDetails)}
              className="text-blue-400 hover:underline text-sm mt-2"
            >
              {showErrorDetails ? "Hide Error Details" : "Show Error Details"}
            </button>
            {showErrorDetails && <ErrorDetails error={error} />}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
                Name
              </label>
              <input
                type="text"
                required={!isLogin}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-dark-surface border border-dark-border text-text-primary focus:border-green-primary focus:outline-none transition-colors duration-normal"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-dark-surface border border-dark-border text-text-primary focus:border-green-primary focus:outline-none transition-colors duration-normal"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-dark-surface border border-dark-border text-text-primary focus:border-green-primary focus:outline-none transition-colors duration-normal"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
            loading={loading}
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleForm}
            className="text-[#00ff88] hover:text-[#00cc6f] text-sm transition-colors"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </Card>
    </div>
  );
}
