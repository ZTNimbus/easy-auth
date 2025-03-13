import { motion } from "framer-motion";
import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

function EmailVerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const { verifyEmail, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  function handleChange(idx: number, value: string) {
    if (!code.includes("")) return;

    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");

      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";

        setCode(newCode);

        const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");

        const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
        inputRefs.current[focusIndex].focus();
      }
    } else {
      newCode[idx] = value;
      setCode(newCode);

      if (value && idx < 5) inputRefs.current[idx + 1].focus();
    }
  }

  function handleKeyDown(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Backspace") return;

    if (idx === 5) {
      const newCode = [...code.slice(0, 5), ""];
      setCode(newCode);

      inputRefs.current[idx - 1].focus();
    } else if (!code[idx] && idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const verificationCode = code.join("");

    try {
      await verifyEmail(verificationCode);

      toast.success("Successfully verified email 🎉");

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="max-w-md w-full bg-gray-800/50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>

        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        {error && <p className="text-red-500 font-semibold mb-5">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between">
            {code.map((digit, idx) => {
              return (
                <input
                  type="text"
                  key={idx}
                  ref={(el) => {
                    if (el) inputRefs.current[idx] = el;
                  }}
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="size-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-800 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50"
          >
            {isLoading ? "Verifying" : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default EmailVerificationPage;
