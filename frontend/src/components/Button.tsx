import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

interface ButtonProps extends PropsWithChildren {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  hoverScale?: number;
  tapScale?: number;
  className?: string;
  onClick?: VoidFunction;
}

function Button({
  disabled = false,
  hoverScale = 1.05,
  tapScale = 0.95,
  type = "button",
  className,
  children,
  onClick,
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={() => {
        if (!onClick) return;

        onClick();
      }}
      disabled={disabled}
      className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 hover:cursor-pointer disabled:opacity-50${
        className && " " + className
      }`}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
    >
      {children}
    </motion.button>
  );
}

export default Button;
