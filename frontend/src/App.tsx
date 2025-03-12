import { Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-cyan-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-cyan-500"
        size="size-64"
        top="-5%"
        left="10%"
        delay={0}
      />

      <FloatingShape
        color="bg-blue-500"
        size="size-48"
        top="70%"
        left="80%"
        delay={5}
      />

      <FloatingShape
        color="bg-teal-500"
        size="size-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <Routes>
        <Route path="/" element={"Home"} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
