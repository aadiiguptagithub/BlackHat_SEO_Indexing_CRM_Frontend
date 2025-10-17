// File: src/features/auth/components/ForgotPasswordOTP.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const ForgotPasswordOTP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verifyResetOTP, resendResetOTP } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  // Get email from localStorage on component mount
  useEffect(() => {
    const email = localStorage.getItem("resetEmail");
    if (!email) {
      navigate("/forgot-password");
      return;
    }
    setUserEmail(email);
  }, [navigate]);

  // Handle countdown for resend button
  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(15);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, countdown]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await verifyResetOTP(data.otp);
      toast({
        title: "Success",
        description: "Code verified successfully!",
        variant: "success",
      });
      navigate("/forgot-password/reset");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Invalid code. Please try again.",
        variant: "destructive",
      });
      reset({ otp: "" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendDisabled(true);
      await resendResetOTP();
      toast({
        title: "Success",
        description: "New code has been sent to your email",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
        variant: "destructive",
      });
      setResendDisabled(false);
    }
  };

  // Auto-submit when all digits are filled
  const watchOTP = watch("otp");
  useEffect(() => {
    if (watchOTP?.length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [watchOTP, handleSubmit]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Verify Reset Code
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter the verification code sent to
          </p>
          <p className="mt-1 font-medium text-gray-800">{userEmail}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <InputOTP
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup className="gap-2 flex justify-center">
                  {slots.map((slot, index) => (
                    <InputOTPSlot
                      key={index}
                      {...slot}
                      className="w-12 h-12 text-2xl border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </InputOTPGroup>
              )}
              {...register("otp")}
            />
            {errors.otp && (
              <p className="text-sm text-red-500 text-center mt-2">
                {errors.otp.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <div className="space-y-4 text-center">
              <Button
                type="button"
                variant="ghost"
                disabled={resendDisabled}
                onClick={handleResendCode}
                className="text-blue-600 hover:text-blue-700"
              >
                {resendDisabled
                  ? `Resend code in ${countdown}s`
                  : "Resend code"}
              </Button>

              <div>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Use different email
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordOTP;
