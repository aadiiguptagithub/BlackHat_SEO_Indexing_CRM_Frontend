import { useState } from "react";
import { Input } from "./input";
import { Eye, EyeOff } from "lucide-react";
import PropTypes from "prop-types";

export const PasswordInput = ({ id, error, className = "", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        className={`pr-10 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        tabIndex="-1"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};

PasswordInput.propTypes = {
  id: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};
