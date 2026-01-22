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

export default function MyPosts() {
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editingComment, setEditingComment] = useState(null);

  const { user, Token } = useContext(UserData);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      body: "",
      image: null,
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
  } = useForm();

  const {
    register: registerComment,
    handleSubmit: handleSubmitComment,
    reset: resetComment,
  } = useForm();

  async function onSubmitForm(values) {
    const form = new FormData();
    form.append("body", values.body);
    if (values?.image?.length >= 0) form.append("image", values.image[0]);

    try {
      const { data } = await axios.post(
        `https://linked-posts.routemisr.com/posts`,
        form,
        {
          headers: { token: Token },
        }
      );
      if (data.message === "success") {
        toast.success("Post Added!");
        refetch();
      }
    } catch (error) {
      toast.error("The Post is not Added!");
      console.log(error);
    } finally {
      reset();
      setImagePreview(null);
    }
  }

  function getMyPosts() {
    return axios.get(
      `https://linked-posts.routemisr.com/users/${user._id}/posts?limit=50`,
      {
        headers: { token: Token },
      }
    );
  }

  async function updatePost(postId, values) {
    const form = new FormData();
    form.append("body", values.body);
    if (values?.image?.length > 0) form.append("image", values.image[0]);

    try {
      const { data } = await axios.put(
        `https://linked-posts.routemisr.com/posts/${postId}`,
        form,
        {
          headers: { token: Token },
        }
      );
      if (data.message === "success") {
        toast.success("Post updated successfully!");
        setEditingPost(null);
        refetch();
      }
    } catch (error) {
      toast.error("Failed to update post!");
      console.log(error);
    }
  }

  async function deletePost(postId) {
    try {
      const { data } = await axios.delete(
        `https://linked-posts.routemisr.com/posts/${postId}`,
        {
          headers: { token: Token },
        }
      );

      if (data.message === "success") {
        toast.success("Post deleted successfully!");
        refetch();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete post!");
    }
  }

  async function createComment(postId, content) {
    try {
      const { data } = await axios.post(
        `https://linked-posts.routemisr.com/comments`,
        {
          content: content,
          post: postId,
        },
        {
          headers: { token: Token },
        }
      );
      if (data.message === "success") {
        toast.success("Comment added!");
        refetch();
        resetComment();
      }
    } catch (error) {
      toast.error("Failed to add comment!");
      console.log(error);
    }
  }

  async function updateComment(commentId, content) {
    try {
      const { data } = await axios.put(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        { content },
        {
          headers: { token: Token },
        }
      );
      if (data.message === "success") {
        toast.success("Comment updated!");
        setEditingComment(null);
        refetch();
      }
    } catch (error) {
      toast.error("Failed to update comment!");
      console.log(error);
    }
  }

  async function deleteComment(commentId) {
    try {
      const { data } = await axios.delete(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        {
          headers: { token: Token },
        }
      );
      if (data.message === "success") {
        toast.success("Comment deleted!");
        refetch();
      }
    } catch (error) {
      toast.error("Failed to delete comment!");
      console.log(error);
    }
  }

  let { error, data, isError, isLoading, refetch } = useQuery({
    queryKey: ["getMyPosts"],
    queryFn: getMyPosts,
    select: (data) => data?.data?.posts,
    
    
  });

  const toggleComments = (postId) => {
    setOpenCommentsPostId(openCommentsPostId === postId ? null : postId);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setValue("image", null);
  };

  const handleImageLoad = (postId) => {
    setLoadedImages((prev) => ({ ...prev, [postId]: true }));
  };

  const startEditingPost = (post) => {
    setEditingPost(post._id);
    setValueEdit("body", post.body);
  };

  const startEditingComment = (comment) => {
    setEditingComment(comment._id);
    setValueEdit("commentContent", comment.content);
  };

  if (isLoading) {
    return <FacebookLoader />;
  }

  if (isError) {
    return (
      <h3 className="text-red-500 text-center mt-10">
        {error.message || "Something went wrong"}
      </h3>
    );
  }

  return (
    <>
      <main className="p-4 max-w-4xl mx-auto pb-24 md:pb-20">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="mx-4 bg-white rounded-lg shadow max-w-2xl">
              <p className="border-b border-zinc-200 font-bold p-4">
                Post Something
              </p>

              <div className="flex flex-col">
                <div className="flex gap-2 p-4">
                  <div className="bg-gray-200 w-10 h-10 rounded-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        user?.photo ||
                        "https://linked-posts.routemisr.com/uploads/default-profile.png"
                      }
                      alt="profile"
                    />
                  </div>

                  <div className="flex gap-2 grow items-center">
                    <div className="relative w-full">
                      <input
                        {...register("body")}
                        type="text"
                        placeholder="What's on your mind?"
                        className="block w-full p-2.5 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>

                    <label className="cursor-pointer">
                      <input
                        {...register("image")}
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
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="mx-4 mb-4 h-10 px-5 flex items-center justify-center gap-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  Create Post
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <div className="max-w-2xl mx-auto py-4 px-2 sm:px-4 min-h-screen">
              {data?.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <p>You haven't created any posts yet!</p>
                </div>
              ) : (
                data?.map((post) => {
                  const commentsCount = post?.comments?.length || 0;
                  const showComments = openCommentsPostId === post.id;
                  const isImageLoaded = loadedImages[post.id];
                  const isEditing = editingPost === post._id;

                  return (
                    <div
                      key={post.id}
                      className="bg-[#242526] rounded-lg shadow-lg mb-4 overflow-hidden"
                    >
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditingPost(post)}
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              <i className="fa-solid fa-pen-to-square text-xl"></i>
                            </button>
                            <TiDeleteOutline
                              className="text-2xl text-white cursor-pointer hover:text-red-400"
                              onClick={() => deletePost(post._id)}
                            />
                          </div>
                        </div>

                        {isEditing ? (
                          <form
                            onSubmit={handleSubmitEdit((values) =>
                              updatePost(post._id, values)
                            )}
                            className="space-y-2"
                          >
                            <textarea
                              {...registerEdit("body")}
                              className="w-full p-2 rounded bg-[#3a3b3c] text-white text-sm border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              rows="3"
                            />
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPost(null)}
                                className="px-4 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <p className="text-gray-200 text-sm mb-3 whitespace-pre-wrap">
                            {post.body}
                          </p>
                        )}
                      </div>

                      <Link to={`/postdetails/${post.id}`}>
                        {post.image && (
                          <div className="w-full bg-black relative">
                            {!isImageLoaded && (
                              <Skeleton
                                height={400}
                                baseColor="#1a1a1a"
                                highlightColor="#2a2a2a"
                                className="absolute inset-0"
                              />
                            )}
                            <img
                              src={post.image}
                              alt="Post content"
                              className={`w-full object-cover transition-opacity duration-300 ${
                                isImageLoaded ? "opacity-100" : "opacity-0"
                              }`}
                              onLoad={() => handleImageLoad(post.id)}
                              loading="lazy"
                            />
                          </div>
                        )}
                      </Link>

                      <div className="px-4 py-3 border-t border-gray-700">
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="text-gray-400 hover:underline text-sm transition-colors hover:text-gray-300"
                        >
                          {commentsCount}{" "}
                          {commentsCount === 1 ? "comment" : "comments"}
                        </button>
                      </div>

                      {showComments && (
                        <div className="px-4 pb-4 border-t border-gray-700">
                          {/* Add Comment Form */}
                          <form
                            onSubmit={handleSubmitComment((values) => {
                              createComment(post._id, values.newComment);
                            })}
                            className="mt-3 flex gap-2"
                          >
                            <input
                              {...registerComment("newComment")}
                              type="text"
                              placeholder="Write a comment..."
                              className="flex-1 p-2 rounded bg-[#3a3b3c] text-white text-sm border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                            >
                              Post
                            </button>
                          </form>

                          {/* Comments List */}
                          {post?.comments?.map((comment) => {
                            const isEditingThisComment =
                              editingComment === comment._id;

                            return (
                              <div
                                key={comment._id}
                                className="mt-3 bg-[#3a3b3c] rounded-lg p-3"
                              >
                                <div className="flex items-start gap-2">
                                  <img
                                    src={comment.commentCreator?.photo}
                                    alt={comment.commentCreator?.name}
                                    className="w-8 h-8 rounded-full object-cover shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    {isEditingThisComment ? (
                                      <form
                                        onSubmit={handleSubmitEdit((values) =>
                                          updateComment(
                                            comment._id,
                                            values.commentContent
                                          )
                                        )}
                                        className="space-y-2"
                                      >
                                        <input
                                          {...registerEdit("commentContent")}
                                          className="w-full p-2 rounded bg-[#4a4b4c] text-white text-sm border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <div className="flex gap-2">
                                          <button
                                            type="submit"
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                          >
                                            Save
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setEditingComment(null)
                                            }
                                            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <>
                                        <div className="bg-[#3a3b3c] rounded-2xl px-3 py-2 inline-block">
                                          <p className="font-semibold text-sm text-white">
                                            {comment.commentCreator?.name}
                                          </p>
                                          <p className="text-sm text-gray-200 wrap-break-word">
                                            {comment.content}
                                          </p>
                                        </div>
                                        <div className="mt-1 px-3 flex items-center gap-3">
                                          <span className="text-xs text-gray-400">
                                            {comment.createdAt.slice(0, 10)}
                                          </span>
                                          {comment.commentCreator?._id ===
                                            user._id && (
                                            <>
                                              <button
                                                onClick={() =>
                                                  startEditingComment(comment)
                                                }
                                                className="text-xs text-blue-400 hover:underline"
                                              >
                                                Edit
                                              </button>
                                              <button
                                                onClick={() =>
                                                  deleteComment(comment._id)
                                                }
                                                className="text-xs text-red-400 hover:underline"
                                              >
                                                Delete
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}