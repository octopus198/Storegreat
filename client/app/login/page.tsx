"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { setToken } from "../utils/auth/token.js";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/AppProvider";
import { z } from "zod";
import { error } from "console";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8)
    .max(20, { message: "Password must be between 6 and 100 characters" }),
});

const LoginPage = () => {
  const { updateTokens } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginAvailable, setIsLoginAvailable] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoginAvailable(true);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      loginSchema.parse({ email, password });
      const userData = {
        email,
        password,
      };

      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Failed to login user");
      }

      const responseData = await response.json();

      console.log("Log in successfully:", responseData);

      updateTokens(responseData.refresh_token);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce(
          (acc: Record<string, string>, currentError) => {
            if (currentError.path.length > 0) {
              acc[currentError.path[0] as string] = currentError.message;
            }
            return acc;
          },
          {}
        );
        setErrors(fieldErrors);
      } else {
        setServerError(
          "Failed to login user. Please check your credentials and try again."
        );
      }
    }
  };

  return (
    <>
      {isLoginAvailable && (
        <div className="flex items-center justify-center h-screen bg-indigo-500 py-10">
          <form
            onSubmit={handleSubmit}
            className="shadow-2xl bg-white rounded-md px-20 py-14"
          >
            <div className="space-y-7">
              <h1 className="text-zinc-700 font-semibold text-2xl">
                Login your Storegreat account
              </h1>
              <>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                  >
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: 450 }}
                    className="block border-solid border-teal-600block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                    type="email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                  >
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block border-solid border-teal-600block w-full rounded-md py-1.5 pl-4 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                    type="password"
                  />
                </div>

                <div>
                  <button
                    className="mt-5 w-full bg-indigo-500 py-2.5 rounded text-white"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </>
              <p>
                Don't have Storegreat?{" "}
                <Link className="font-medium underline" href="/register">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default LoginPage;
