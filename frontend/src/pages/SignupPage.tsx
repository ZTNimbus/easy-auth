import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import Input from "../components/Input";
import { User, Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/useAuthStore";
import Button from "../components/Button";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      await signup(email, password, name);

      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            icon={User}
            name="name"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            icon={Mail}
            name="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={Lock}
            name="password"
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <PasswordStrengthMeter password={password} />

          <Button
            type="submit"
            disabled={isLoading}
            hoverScale={1.02}
            tapScale={0.9}
          >
            {!isLoading ? (
              "Create Account"
            ) : (
              <Loader className="animate-spin mx-auto" size={24} />
            )}
          </Button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900/50 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default SignupPage;
