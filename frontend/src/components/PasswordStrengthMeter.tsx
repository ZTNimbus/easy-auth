function PasswordCriteria(password: string) {
  const criteria = [
    { label: "At Least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A_Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    {
      label: "Contains a special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];
}

function PasswordStrengthMeter() {
  return <div>PasswordStrengthMeter</div>;
}

export default PasswordStrengthMeter;
