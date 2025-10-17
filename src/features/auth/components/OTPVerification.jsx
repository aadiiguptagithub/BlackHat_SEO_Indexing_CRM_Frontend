import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import OtpInput from "react-otp-input";

export const OTPVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, verifyOTP, resendOTP } = useAuth();
  const [otp, setOtp] = useState("");

  // Verify session on component mount
  useEffect(() => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "Please login first",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

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

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;

    setIsLoading(true);
    try {
      await verifyOTP(otp);
      toast({
        title: "Success",
        description: "OTP verified successfully! Redirecting...",
        variant: "success",
      });
    } catch (error) {
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;

    setResendDisabled(true);
    try {
      await resendOTP();
      setCountdown(15);
      setOtp("");
    } catch (error) {
      setResendDisabled(false);
    }
  };

  // Auto-submit when all digits are filled
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOTP();
    }
  }, [otp]);

  if (!user?.email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
            Verify OTP
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter the verification code sent to
          </p>
          <p className="mt-1 font-medium text-gray-800">{user.email}</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center items-center">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="w-2"></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    className="w-12 h-12 text-2xl border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    style={{ width: "3rem", height: "3rem" }}
                  />
                )}
                containerStyle="flex justify-center gap-2"
                inputType="tel"
                shouldAutoFocus
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-500 hover:from-blue-700 hover:to-violet-600 text-white py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
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
                "Verify OTP"
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                disabled={resendDisabled}
                onClick={handleResendOTP}
                className="text-blue-600 hover:text-blue-700"
              >
                {resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
