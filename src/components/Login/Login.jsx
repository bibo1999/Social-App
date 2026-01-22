import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { UserData } from '../../Context/UserData';



export default function Login() {

  let {Token , setToken} = useContext (UserData)

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const navigate = useNavigate();

  // Zod Validation Schema
  const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must be like: Abc@1234"
      ),
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  // Clear error when user types in email or password
  const watchedEmail = watch("email");
  const watchedPassword = watch("password");
  
  useEffect(() => {
    if (errMsg) {
      setErrMsg(null);
    }
  }, [watchedEmail, watchedPassword]);

  // Submit Handler
  const onSubmit = async (values) => {
    setIsLoading(true);
    setErrMsg(null);

    try {
      const res = await axios.post(
        "https://linked-posts.routemisr.com/users/signin",
        values
      );

      setIsLoading(false);

      if (res.data.message === "success") {
        console.log(res);
        // Save token if returned
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          setToken(res.data.token)
        }

        // Redirect to homepage
        navigate("/")
      }
    } 
    catch (error) {
      setIsLoading(false);
      // Display error from backend (e.g., "Invalid credentials", "User not found")
      setErrMsg(error.response?.data?.error || error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full bg-gray-50 border border-gray-200 rounded-xl p-8 shadow-md space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Login</h2>
          <p className="mt-2 text-sm text-gray-600">Welcome back</p>
        </div>

        {/* Server Error */}
        {errMsg && (
          <div
            className="flex items-center bg-red-600 text-white text-sm font-bold px-4 py-3 rounded-lg"
            role="alert"
          >
            <i className="fa-solid fa-triangle-exclamation me-3"></i>
            <p>{errMsg}</p>
          </div>
        )}

        {/* Email */}
        <div className="relative z-0 w-full group">
          <input
            type="email"
            {...register("email")}
            id="floating_email"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_email"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email Address
          </label>
          {errors.email && (
            <span className="text-red-600 text-xs font-semibold">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="relative z-0 w-full group">
          <input
            type="password"
            {...register("password")}
            id="floating_password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_password"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
          {errors.password && (
            <span className="text-red-600 text-xs font-semibold">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center text-white font-medium rounded-lg text-sm px-5 py-3 transition-all duration-300
            ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed opacity-50"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/30"
            }`}
        >
          {isLoading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin me-2"></i>
              Processing...
            </>
          ) : (
            <>
              <i className="fa-solid fa-right-to-bracket me-2"></i>
              Login
            </>
          )}
        </button>

        {/* Optional: Link to Register */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}