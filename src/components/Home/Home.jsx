import React, { useState } from "react";
import style from "./Home.module.css";
import { PostContext } from "../../Context/PostContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
// import loader from "../../assets/loading screen.png";
import FacebookLoader from "../FacbookLoader/FacbookLoader";

export default function Home() {
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);

  function getAllPosts() {
    return axios.get(`https://linked-posts.routemisr.com/posts?limit=50`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
  }

  let { error, data, isError, isLoading } = useQuery({
    queryKey: ["getPosts"],
    queryFn: getAllPosts,
    // staleTime: 3000,
    // retry: 3,
    // retryDelay: 3000,
    // refetchInterval: 4000,
    // refetchIntervalInBackground: true,
    select: (data) => data?.data?.posts,
  });
  console.log(data);
  const toggleComments = (postId) => {
    setOpenCommentsPostId(openCommentsPostId === postId ? null : postId);
  };

  // console.log(data?.data?.posts);

  if (isLoading) {
    return <FacebookLoader />;
    // <div className="fixed inset-0 z-[9999]">
    //   <img src={loader} alt="Loading" className="w-full h-full object-cover" />
    // </div>
    //   <div className="loader-wrapper">
    //     <div className="sk-chase">
    //   <div className="sk-chase-dot"></div>
    //   <div className="sk-chase-dot"></div>
    //   <div className="sk-chase-dot"></div>
    //   <div className="sk-chase-dot"></div>
    //   <div className="sk-chase-dot"></div>
    //   <div className="sk-chase-dot"></div>
    // </div>
    // </div>
  }

  if (isError) {
    return <h3>{error}</h3>;
  }

  return (
    <>
      <>
        <div className="max-w-2xl mx-auto py-4 px-2 sm:px-4 min-h-screen">
          {data.map((post) => {
            const commentsCount = post?.comments?.length || 0;
            const showComments = openCommentsPostId === post.id;

            return (
              <div
                key={post.id}
                className="bg-[#242526] rounded-lg shadow-lg mb-4 overflow-hidden"
              >
                {/* Clickable Post Content */}
                <Link to={`/postdetails/${post.id}`}>
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
                      <button className="text-gray-400 hover:bg-gray-700 p-2 rounded-full transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>

                    {/* Post Body */}
                    <p className="text-gray-200 text-sm mb-3 whitespace-pre-wrap">
                      {post.body}
                    </p>
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="w-full bg-black">
                      <img
                        src={post.image}
                        alt="Post content"
                        className="w-full object-cover"
                      />
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
      </>
    </>
  );
}
