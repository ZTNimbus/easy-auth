import { Check, X } from "lucide-react";

function PasswordCriteria({ password }: { password: string }) {
  const criteria = [
    { label: "At Least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    {
      label: "Contains a special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item) => {
        return (
          <div key={item.label} className="flex items-center text-xs">
            {item.met ? (
              <Check className="size-4 text-blue-500 mr-2" />
            ) : (
              <X className="size-4 text-gray-500 mr-2" />
            )}

            <span className={item.met ? "text-blue-500" : "text-gray-400"}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface PasswordStrengthMeterProps {
  password: string;
}

function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  function getStrength(pass: string) {
    let strength = 0;

    if (pass.length >= 6) strength++;

    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;

    if (pass.match(/\d/)) strength++;

    if (pass.match(/[^a-zA-Z\d]/)) strength++;

    return strength;
  }

  const strength = getStrength(password);

  function getColor(strength: number) {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-yellow-400";
    return "bg-blue-500";
  }

  function getStrengthText(strength: number) {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400 mr-1">Password Strength:</span>
        <span className="text-xs text-gray-400">
          {getStrengthText(strength)}
        </span>
      </div>

      <div className="flex space-x-1">
        {[...Array(4)].map((_, idx) => {
          return (
            <div
              key={idx}
              className={`h-1 w-1/4 rounded-full transition-colors duration-300 ${
                idx < strength ? getColor(strength) : "bg-gray-600"
              }`}
            />
          );
        })}
      </div>

      <PasswordCriteria password={password} />
    </div>
  );
}

export default PasswordStrengthMeter;
