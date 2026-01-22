import axios from "axios";
import { useContext, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../Context/UserData";
import FacebookLoader from "../FacbookLoader/FacbookLoader";
import { Upload, X } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { Token, user, setUser } = useContext(UserData);
  const [isUploading, setIsUploading] = useState(false);
  const [ErrMsg, setErrMsg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!user) return <FacebookLoader />;

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setIsUploading(true);
    setErrMsg(null);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await axios.put(
        "https://linked-posts.routemisr.com/users/upload-photo",
        formData,
        { headers: { token: Token } }
      );

      if (res.data.message === "success") {
        const photoURL = URL.createObjectURL(file);
        setUser((prev) => ({ ...prev, photo: photoURL }));

        toast.success("Profile photo updated successfully!");
        setTimeout(() => {
          navigate("/"); // redirect to homepage 
        }, 1000);
      }
    } catch (err) {
      setErrMsg(err.response?.data?.error || "Photo upload failed");
      toast.error(err.response?.data?.error || "Photo upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-xl mx-4 sm:mx-auto mt-10 sm:mt-10 bg-white rounded-lg p-4 sm:p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Your Profile</h2>

      {ErrMsg && (
        <p className="text-red-600 text-sm mb-4 text-center">{ErrMsg}</p>
      )}

      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <img
          src={user.photo || "https://linked-posts.routemisr.com/uploads/default-profile.png"}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <p className="font-semibold text-center px-2">{user.name}</p>
        <p className="text-gray-500 text-center px-2">{user.email}</p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-2 sm:px-0">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handlePhotoUpload}
            disabled={isUploading}
            className="hidden"
            id="profile-photo-input"
            accept="image/*"
          />
          
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
  {/* File input label */}
  <label
    htmlFor="profile-photo-input"
    className={`
      flex items-center justify-center gap-2 px-6 py-2.5 rounded-full
      border-2 font-medium text-sm cursor-pointer transition-all w-full sm:w-auto
      ${isUploading
        ? 'border-blue-300 bg-blue-50 text-blue-600 cursor-wait'
        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600'
      }
    `}
  >
    <Upload className="w-4 h-4" />
    <span className="truncate flex items-center gap-2">
      {isUploading ? (
        <>
          <i className="fa-solid fa-spinner fa-spin"></i>
          Uploading...
        </>
      ) : (
        selectedFile ? selectedFile.name : 'Choose Photo'
      )}
    </span>
  </label>

  {/* Clear button */}
  {selectedFile && !isUploading && (
    <button
      onClick={clearFile}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0"
      type="button"
    >
      <X className="w-4 h-4 text-gray-500" />
    </button>
  )}
</div>



          {/* {isUploading && <p className="text-sm text-gray-500">Uploading...</p>} */}
        </div>

        {/* Forget Password Button */}
        <button
          type="button"
          onClick={() => navigate("/forgetpassword")}
          className={`w-full sm:w-auto flex items-center justify-center text-white font-medium rounded-full text-sm px-5 py-3 transition-all duration-300
            bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/30 mx-2 sm:mx-0`}
        >
          <i className="fa-solid fa-key me-2"></i>
          Forget Password
        </button>
      </div>
    </div>
  );
}