import * as React from "react";
import { OTPInput } from "input-otp";
import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef(({ className, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef(
  ({ char, hasFocus, isActive, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative w-10 h-12 text-center text-2xl font-medium transition-all border rounded-lg",
        "outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        "border-gray-200 focus-within:border-blue-500",
        hasFocus && "border-blue-500 ring-2 ring-blue-500 ring-offset-2",
        className
      )}
      {...props}
    >
      {char}
      {!char && isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-6 bg-gray-400 animate-blink" />
        </div>
      )}
    </div>
  )
);
InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSlot };
