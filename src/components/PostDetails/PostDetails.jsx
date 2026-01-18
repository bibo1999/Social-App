import React, { useState } from "react";
import style from "./PostDetails.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FacebookLoader from "../FacbookLoader/FacbookLoader";
import { IoIosArrowBack } from "react-icons/io";


export default function PostDetails() {
  const [visibleComments, setVisibleComments] = useState(10); // Created state to store the visiblity of the comments
  const navigate = useNavigate();

  let { id } = useParams();
  console.log(id);

  function getSinglePost() {
    return axios.get(`https://linked-posts.routemisr.com/posts/${id}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
  }

  let { data, isError, error, isLoading } = useQuery({
    queryKey: ["singlePost"],
    queryFn: getSinglePost,
    select: (data) => data?.data?.post,
  });

  console.log(data);

// Function to show more comments
  const loadMoreComments = () => {
     // Increase the number of visible comments by 10
    setVisibleComments((prev) => prev + 10);
  };

  if (isLoading) {
    return <FacebookLoader />;
  }

  if (isError) {
    return <h3>{error}</h3>;
  }

  const displayedComments = data.comments.slice(0, visibleComments); // Take only the first "visibleComments" number of comments from all comments
  const hasMoreComments = visibleComments < data.comments.length; // Check if there are more comments left to show

  return (
    <div className="min-h-screen bg-[#18191a] py-4 px-4 pb-20">
      <div className="max-w-7xl mx-auto bg-[#242526] rounded-lg overflow-hidden">
        {/* Main Content - Image Left, Details Right */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)]">
          {/* Left Side - Image */}
          <div className="lg:w-3/5 bg-black flex items-center justify-center">
          <IoIosArrowBack className="text-2xl cursor-pointer text-white"
          onClick={() => {
            navigate('/');
          }}
          />
            <img src={data.image} alt="Post" className="w-full h-full object-contain"/>
          </div>

          {/* Right Side - Post Details and Comments */}
          <div className="lg:w-2/5 flex flex-col h-full">
            {/* Post Header - Fixed */}
            <div className="p-4 border-b border-gray-700 shrink-0">
              <div className="flex items-center gap-3">
                <img src={data.user.photo} alt={data.user.name} className="w-10 h-10 rounded-full object-cover"/>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {data.user.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {data.createdAt.slice(0, 10)}
                  </p>
                </div>
              </div>

              {/* Post Body */}
              <p className="text-gray-200 text-sm mt-3">{data.body}</p>
            </div>

            {/* Comments Section - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 pb-6">
                <h4 className="text-white font-semibold mb-3 sticky top-0 bg-[#242526] pb-2 z-10">
                  {data.comments.length} Comments 
                  {/* display the comment length */}
                </h4>

                {/* Display Comments */}
                <div className="space-y-4">
                  {displayedComments.map((comment) => (
                    <div key={comment._id} className="flex items-start gap-2">
                      <img src={comment.commentCreator?.photo} alt={comment.commentCreator?.name} className="w-8 h-8 rounded-full object-cover shrink-0"/>
                      <div className="flex-1 min-w-0">
                        <div className="bg-[#3a3b3c] rounded-2xl px-3 py-2 inline-block">
                          <p className="font-semibold text-sm text-white">
                            {comment.commentCreator?.name}
                          </p>
                          <p className="text-sm text-gray-200 wrap-break-word">
                            {comment.content}
                          </p>
                        </div>
                        <div className="mt-1 px-3">
                          <span className="text-xs text-gray-400">
                            {comment.createdAt.slice(0, 10)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View More Button */}
                {hasMoreComments && (
                  // Button that loads more comments when clicked
                  <button onClick={loadMoreComments} className="w-full mt-4 py-2 px-4 bg-[#3a3b3c] hover:bg-[#4e4f50] text-white rounded-lg transition-colors text-sm font-medium">
                    View more comments ({data.comments.length - visibleComments}{" "} remaining)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
