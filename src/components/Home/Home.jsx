import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import FacebookLoader from "../FacbookLoader/FacbookLoader";
import { TiDeleteOutline } from "react-icons/ti";
import { UserData } from "../../Context/UserData";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Home() {
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const { user } = useContext(UserData);
  const { Token } = useContext(UserData);

  const [imageErrors, setImageErrors] = useState({});

const handleImageError = (postId) => {
  setImageErrors((prev) => ({ ...prev, [postId]: true }));
};

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      body: "",
    },
  });

  async function onSubmitForm(values) {
    const form = new FormData();

    form.append("body", values.body);
    
    // Use selectedFile state instead
    if (selectedFile) {
      form.append("image", selectedFile);
    }

    try {
      const { data } = await axios.post(
        `https://linked-posts.routemisr.com/posts`,
        form,
        {
          headers: {
            token: Token,
          },
        },
      );
      if (data.message === "success") {
        toast.success("Post Added ...");
        refetch();
      }
    } catch (error) {
      toast.error("The Post is not Added!");
      console.log(error);
    } finally {
      reset();
      setImagePreview(null);
      setSelectedFile(null);
    }
  }

  function getAllPosts() {
    return axios.get(
      `https://linked-posts.routemisr.com/posts?limit=50&sort=-createdAt`,
      {
        headers: {
          token: Token,
        },
      },
    );
  }

  async function deletePost(postId) {
    try {
      const { data } = await axios.delete(
        `https://linked-posts.routemisr.com/posts/${postId}`,
        {
          headers: {
            token: Token,
          },
        },
      );

      if (data.message === "success") {
        console.log(data);
        toast.success("Post deleted successfully!");
        refetch();
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 404) {
        toast.error("You can't delete someone else's post!");
      }
    }
  }

  let { error, data, isError, isLoading, refetch } = useQuery({
    queryKey: ["getPosts"],
    queryFn: getAllPosts,
    select: (data) => data?.data?.posts,
  });

  const toggleComments = (postId) => {
    setOpenCommentsPostId(openCommentsPostId === postId ? null : postId);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleImageLoad = (postId) => {
    setLoadedImages((prev) => ({ ...prev, [postId]: true }));
  };

  if (isLoading) {
    return <FacebookLoader />;
  }

  if (isError) {
    return <h3 className="text-red-500 text-center mt-10">{error.message || 'Something went wrong'}</h3>;
  }

  return (
    <>
      <main className="p-4 max-w-4xl mx-auto">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="mx-4 bg-white rounded-lg shadow max-w-2xl">
              {/* Header */}
              <p className="border-b border-zinc-200 font-bold p-4">
                Post Something
              </p>

              {/* Body */}
              <div className="flex flex-col">
                <div className="flex gap-2 p-4">
                  {/* Avatar */}
                  <div className="bg-gray-200 w-10 h-10 rounded-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={user?.photo || "https://linked-posts.routemisr.com/uploads/default-profile.png"}
                      alt="profile"
                    />
                  </div>

                  {/* Input + Image Icon */}
                  <div className="flex gap-2 grow items-center">
                    {/* Text Input */}
                    <div className="relative w-full">
                      <input
                        {...register("body")}
                        type="text"
                        placeholder="What's on your mind?"
                        className="
                block w-full p-2.5 text-sm rounded-lg
                border border-gray-300 bg-gray-50
                text-gray-900 placeholder-gray-500
                focus:outline-none focus:ring-1 focus:ring-gray-400
              "
                      />
                    </div>

                    {/* Hidden File Input */}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <svg
                        className="cursor-pointer text-zinc-400 hover:text-zinc-500 transition-colors"
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM9 2l4.95 20M11.53 12.22 2 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </label>
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="px-4 pb-2 relative">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full p-1.5 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="
          mx-4 mb-4 h-10 px-5
          flex items-center justify-center gap-2
          rounded-lg text-sm font-medium
          bg-gray-800 text-white
          hover:bg-gray-900
          focus:outline-none focus:ring-4 focus:ring-gray-300
        "
                >
                  Create Post
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <div className="max-w-2xl mx-auto py-4 px-2 sm:px-4 min-h-screen">
              {data.map((post) => {
                const commentsCount = post?.comments?.length || 0;
                const showComments = openCommentsPostId === post.id;
                const isImageLoaded = loadedImages[post.id];

                return (
                  <div
                    key={post.id}
                    className="bg-[#242526] rounded-lg shadow-lg mb-4 overflow-hidden"
                  >
                    {/* Post Header */}
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={post.user.photo}
                          alt={post.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm">
                            {post.user.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {post.createdAt.slice(0, 10)}
                          </p>
                        </div>
                        <TiDeleteOutline
                          className="text-2xl text-white cursor-pointer"
                          onClick={() => {
                            deletePost(post._id);
                          }}
                        />
                      </div>

                      {/* Post Body */}
                      <p className="text-gray-200 text-sm mb-3 whitespace-pre-wrap">
                        {post.body}
                      </p>
                    </div>

                    {/* Clickable Post Content */}
                    <Link to={`/postdetails/${post.id}`}>
                      {/* Post Image */}
                      {post.image && (
  <div className="w-full bg-black relative">
    {!isImageLoaded && !imageErrors[post.id] && (
      <Skeleton
        height={400}
        baseColor="#1a1a1a"
        highlightColor="#2a2a2a"
        className="absolute inset-0"
      />
    )}
    
    {imageErrors[post.id] ? (
      <div className="w-full h-64 flex items-center justify-center bg-gray-800">
        <p className="text-gray-400 text-sm">
          <i className="fa-solid fa-image-slash mr-2"></i>
          Image failed to load
        </p>
      </div>
    ) : (
      <img
        src={post.image}
        alt="Post content"
        className={`w-full object-cover transition-opacity duration-300 ${
          isImageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => handleImageLoad(post.id)}
        onError={() => handleImageError(post.id)}
        loading="lazy"
      />
    )}
  </div>
)}
                    </Link>

                    {/* Post Stats */}
                    <div className="px-4 py-3 border-t border-gray-700">
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="text-gray-400 hover:underline text-sm transition-colors hover:text-gray-300"
                      >
                        {commentsCount}{" "}
                        {commentsCount === 1 ? "comment" : "comments"}
                      </button>
                    </div>

                    {/* Post Comment - Only show first comment when toggled */}
                    {showComments && post?.comments?.length > 0 && (
                      <div className="px-4 pb-4 border-t border-gray-700">
                        <div className="mt-3 bg-[#3a3b3c] rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <img
                              src={post.comments[0].commentCreator?.photo}
                              alt={post.comments[0].commentCreator?.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="bg-[#3a3b3c] rounded-2xl px-3 py-2 inline-block">
                                <p className="font-semibold text-sm text-white">
                                  {post.comments[0].commentCreator?.name}
                                </p>
                                <p className="text-sm text-gray-200 wrap-break-word">
                                  {post.comments[0].content}
                                </p>
                              </div>
                              <div className="mt-1 px-3">
                                <span className="text-xs text-gray-400">
                                  {post.comments[0].createdAt.slice(0, 10)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {commentsCount > 1 && (
                          <p className="text-sm text-gray-400 mt-2 px-3">
                            + {commentsCount - 1} more{" "}
                            {commentsCount - 1 === 1 ? "comment" : "comments"}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}