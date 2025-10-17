import { Input } from "./input";
import { Label } from "./label";
import PropTypes from "prop-types";

export const FormField = ({
  label,
  id,
  error,
  className = "",
  children,
  ...props
}) => {
  const isCustomInput = Boolean(children);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
      )}
      {isCustomInput ? children : <Input id={id} {...props} />}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};
