"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Oops! Wrong credentials. Try again!");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-4 border-blue-200">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6 font-comic">
          Welcome Back! 🚀
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:outline-none text-lg transition-colors"
              placeholder="super@hero.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-400 focus:outline-none text-lg transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
              <span className="block sm:inline font-bold">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Sign In 🌟
          </button>
        </form>
      </div>
    </div>
  );
}