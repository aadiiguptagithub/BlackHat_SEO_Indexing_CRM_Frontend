import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Mail, Lock, User, EyeOff, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data);
    } catch (error) {
      // Error handling is managed in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Black Hat SEO
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                {...register("name")}
                type="text"
                placeholder="Full name"
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#013763]"
              />
              {errors.name && (
                <span className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                {...register("email")}
                type="email"
                placeholder="Email address"
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#013763]"
              />
              {errors.email && (
                <span className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pl-10 pr-12 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#013763]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {errors.password && (
                <span className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#013763] hover:bg-[#001f3f] text-white py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[#013763] hover:text-[#001f3f]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}