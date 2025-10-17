import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export const CountdownTimer = ({
  seconds,
  onComplete,
  className = "",
  format = (s) => `${s}s`,
}) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  return <span className={className}>{format(timeLeft)}</span>;
};

CountdownTimer.propTypes = {
  seconds: PropTypes.number.isRequired,
  onComplete: PropTypes.func,
  className: PropTypes.string,
  format: PropTypes.func,
};
