import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import z from "zod";

export default function Register() {
  const [isLoading, setisLoading] = useState(false);
  const [ErrMsg, setErrMsg] = useState(null);
  const navigate = useNavigate();

  // 1. Zod Validation Schema
  const schema = z.object({
    name: z.string().min(1, "!At least 1 character").max(14, "!Max Characters is 14"),
    email: z.string().email("Invalid Email"),
    password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "EX.Abc@1234"),
    rePassword: z.string(),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((date) => {
      const userDate = new Date(date);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      return userDate < todayDate;
    }, "!Invalid Date"),
    gender: z.enum(["male", "female"], { errorMap: () => ({ message: "!Gender Required" }) })
  }).refine((data) => data.password === data.rePassword, {
    message: "Password & Repassword Not Matched",
    path: ["rePassword"]
  });

  // 2. React Hook Form Initialization
  const { register, handleSubmit, formState, watch } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: ""
    },
    resolver: zodResolver(schema)
  });

  // 3. Clear Backend Error when user types (Fixes Anti-Spam Lock)
  const watchedEmail = watch("email");
  useEffect(() => {
    if (ErrMsg) {
      setErrMsg(null);
    }
  }, [watchedEmail]); // Remove ErrMsg from dependencies to prevent infinite loop

  // 4. API Submission Function
  function handleSignUp(values) {
    setisLoading(true);
    setErrMsg(null);

    axios.post(`https://linked-posts.routemisr.com/users/signup`, values)
      .then((res) => {
        setisLoading(false);
        if (res.data.message === "success") {
          navigate("/login");
        }
      })
      .catch((err) => {
        setisLoading(false);
        // Extracts error from backend (e.g., "User already exists")
        setErrMsg(err.response?.data?.error || "An unexpected error occurred");
      });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form 
        onSubmit={handleSubmit(handleSignUp)} 
        className="max-w-md w-full space-y-6 bg-gray-50 border border-gray-200 rounded-xl p-8 shadow-md"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Register</h2>
          <p className="mt-2 text-sm text-gray-600">Join our community today</p>
        </div>

        {/* Server-side Error Alert */}
        {ErrMsg && (
          <div className="flex items-center bg-red-600 text-white text-sm font-bold px-4 py-3 rounded-lg" role="alert">
            <i className="fa-solid fa-triangle-exclamation me-3"></i>
            <p>{ErrMsg}</p>
          </div>
        )}

        {/* Input Groups */}
        <div className="space-y-5">
          {/* Name */}
          <div className="relative z-0 w-full group">
            <input 
              type="text" 
              {...register("name")} 
              id="floating_name" 
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
              placeholder=" " 
            />
            <label 
              htmlFor="floating_name" 
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Name
            </label>
            {formState.errors.name && (
              <span className="text-red-600 text-xs font-semibold">
                {formState.errors.name.message}
              </span>
            )}
          </div>

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
            {formState.errors.email && (
              <span className="text-red-600 text-xs font-semibold">
                {formState.errors.email.message}
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
            {formState.errors.password && (
              <span className="text-red-600 text-xs font-semibold">
                {formState.errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative z-0 w-full group">
            <input 
              type="password" 
              {...register("rePassword")} 
              id="floating_rePassword" 
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
              placeholder=" " 
            />
            <label 
              htmlFor="floating_rePassword" 
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Confirm Password
            </label>
            {formState.errors.rePassword && (
              <span className="text-red-600 text-xs font-semibold">
                {formState.errors.rePassword.message}
              </span>
            )}
          </div>

          {/* Date of Birth */}
          <div className="relative z-0 w-full group">
            <input 
              type="date" 
              {...register("dateOfBirth")} 
              id="floating_dob" 
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
            />
            <label 
              htmlFor="floating_dob" 
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600"
            >
              Date of Birth
            </label>
            {formState.errors.dateOfBirth && (
              <span className="text-red-600 text-xs font-semibold">
                {formState.errors.dateOfBirth.message}
              </span>
            )}
          </div>

          {/* Gender */}
          <div className="flex gap-10 items-center pt-2">
            <div className="flex items-center">
              <input 
                id="male" 
                {...register("gender")} 
                type="radio" 
                value="male" 
                className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
              />
              <label htmlFor="male" className="ms-2 text-sm font-medium text-gray-700">
                Male
              </label>
            </div>
            <div className="flex items-center">
              <input 
                id="female" 
                {...register("gender")} 
                type="radio" 
                value="female" 
                className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
              />
              <label htmlFor="female" className="ms-2 text-sm font-medium text-gray-700">
                Female
              </label>
            </div>
          </div>
          {formState.errors.gender && (
            <p className="text-red-600 text-xs font-semibold">
              {formState.errors.gender.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button 
          disabled={isLoading} 
          type="submit" 
          className={`w-full text-white font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-300 flex items-center justify-center
            ${isLoading ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/30'}`}
        >
          {isLoading ? (
            <>
              <i className='fa-solid fa-spinner fa-spin me-2'></i> 
              Processing...
            </>
          ) : (
            <>
              <i className="fa-solid fa-user-plus me-2"></i>
              Create Account
            </>
          )}
        </button>
      </form>
    </div>
  );
}