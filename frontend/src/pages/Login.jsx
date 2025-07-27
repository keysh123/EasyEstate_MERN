import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
 
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      }
    );

    const data = await response.json();
    if (data.success) {
      toast.success("Login successful");
      
      navigate("/");
    } else {
      setError(data.message || "Login failed");
      // console.error("Registration error:", data);
      toast.error(data.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 -mt-15">
      <div className="rounded-xl w-full max-w-md p-8 lg:max-w-lg">
        <h1 className="text-3xl font-bold text-center text-black mb-8">
          Login Here
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
       
          <input
            type="email"
            name="email"
            className="p-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            className="p-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="Password"
            onChange={handleChange}
          />
     
          <button
            type="submit"
            className="bg-slate-700 hover:bg-slate-500 transition text-white py-2 rounded-md font-medium mt-5"
            disabled={loading}
          >
            {loading ? "Loading" : "Login"}
          </button>

          <button
            type="button"
            disabled={loading}
            className="bg-red-700 hover:bg-red-800 transition text-white py-2 rounded-md font-medium"
          >
            {loading ? "Loading" : "Continue with Google"}
          </button>

          {error && (
            <p className="text-center text-red-500 text-sm font-medium mt-1">
              {error}
            </p>
          )}

          <p className="text-center text-sm text-gray-700 mt-2">
            Don't have an account?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register Here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
