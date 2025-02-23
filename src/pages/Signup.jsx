import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded bg-gray-100"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded bg-gray-100"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-black text-white py-2 rounded hover:bg-blue-600 cursor-pointer">Signup</button>
          </form>
        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/signin" className="text-blue-500">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;