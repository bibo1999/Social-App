import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import FacebookLoader from "../FacbookLoader/FacbookLoader";
import { TiDeleteOutline } from "react-icons/ti";
import { UserData } from "../../Context/UserData";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Home() {
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  
 
  const {Token} = useContext(UserData);
  
  const {register, handleSubmit, reset} = useForm({
    defaultValues: {
      body: '',
      image: null,
    },
  });

  async function onSubmitForm(values){
    const form = new FormData();

    form.append('body', values.body);
    if (values?.image?.length>= 0) form.append('image', values.image[0]);

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
      if (data.message === 'success') {
        toast.success('Post Added ...')
        refetch(); 
      }
    } catch (error) {
      toast.error('The Post is not Added!')
      console.log(error);
    } finally {
      reset();
    }
  }

  function getAllPosts() {
    return axios.get(`https://linked-posts.routemisr.com/posts?limit=50&sort=-createdAt`, {
      headers: {
        token: Token, 
      },
    });
  }

  async function deletePost(postId) {
    try {
      const {data} = await axios.delete(
        `https://linked-posts.routemisr.com/posts/${postId}`,
        {
          headers: {
            token: Token, 
          },
        },
      );

      if (data.message === 'success'){
        console.log(data);
        refetch(); 
      }
    } catch (error){
      console.log(error);
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

  if (isLoading) {
    return <FacebookLoader />;
  }

  if (isError) {
    return <h3>{error}</h3>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="flex flex-col items-center gap-4 mt-5 bg-gray-200">
          <input
            {...register('body')} 
            className="bg-white rounded-md py-2 px-4 w-8/12"
            type="text" 
            placeholder="Enter Caption..."
          />
          <input
            {...register('image')} 
            className="bg-white rounded-md py-2 px-4 w-8/12 cursor-pointer"
            type="file" 
          />
          <button className="bg-white rounded-md py-2 px-4 w-8/12 cursor-pointer">
            Post
          </button>
        </div>
      </form>

      <div className="mt-5">
        <div className="max-w-2xl mx-auto py-4 px-2 sm:px-4 min-h-screen">
          {data.map((post) => {
            const commentsCount = post?.comments?.length || 0;
            const showComments = openCommentsPostId === post.id;

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
      </div>
    </>
  );
}