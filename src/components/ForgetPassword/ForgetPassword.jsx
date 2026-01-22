import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import z from "zod";
import { UserData } from "../../Context/UserData";

export default function ForgetPassword() {
  const { Token } = useContext(UserData);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation schema
  const schema = z.object({
    password: z.string().min(1, "Current password required"),
    newPassword: z.string().min(6, "New password too short"),
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data) {
    try {
      setIsLoading(true);

      const res = await axios.patch(
        "https://linked-posts.routemisr.com/users/change-password",
        {
          password: data.password,
          newPassword: data.newPassword,
        },
        {
          headers: {
            token: Token,
          },
        }
      );

      if (res.data.message === "success") {
        toast.success("Password updated successfully!");
        setTimeout(() => navigate("/"), 1000); // redirect after toast
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full bg-gray-50 border border-gray-200 rounded-xl p-8 shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Change Password</h2>

        <div className="space-y-4">
          <div>
            <input
              type="password"
              {...register("password")}
              placeholder="Current Password"
              className="w-full border p-2 rounded-md"
            />
            {formState.errors.password && (
              <span className="text-red-600 text-sm">
                {formState.errors.password.message}
              </span>
            )}
          </div>

          <div>
            <input
              type="password"
              {...register("newPassword")}
              placeholder="New Password"
              className="w-full border p-2 rounded-md"
            />
            {formState.errors.newPassword && (
              <span className="text-red-600 text-sm">
                {formState.errors.newPassword.message}
              </span>
            )}
          </div>
        </div>

        {/* Submit Button with spinner */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center text-white font-medium rounded-lg text-sm px-5 py-3 mt-4 transition-all duration-300
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
              <i className="fa-solid fa-key me-2"></i>
              Change Password
            </>
          )}
        </button>
      </form>
    </div>
  );
}
