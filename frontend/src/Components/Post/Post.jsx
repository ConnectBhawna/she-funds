import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Deso from "deso-protocol";
import { DateTime } from "luxon";
import Loader from "../Loader";
import NavBar from "../Navbar";

const Post = () => {
  const { hash } = useParams();

  const [isLoading, setIsLoading] = useState(true);

  const [postTitle, setPostTitle] = useState(null);
  const [posterKey, setPosterKey] = useState(null);
  const [postUsername, setPostUserName] = useState(null);
  const [postDate, setPostDate] = useState(null);
  const [postCover, setPostCover] = useState(null);
  const [postBody, setPostBody] = useState(null);
  const [postStats, setPostStats] = useState([]); // [diamonds, likes, comments]

  const commentElement = useRef();

  useEffect(async () => {
    const deso = new Deso();

    const response = await deso.posts.getSinglePost({ PostHashHex: hash });
    if (!response.PostFound) {
      console.log("An Error Occured!");
      return;
    }

    const postData = response.PostFound;
    setPosterKey(postData.PosterPublicKeyBase58Check);
    setPostBody(postData.Body);
    let imgURL = "";
    try {
      imgURL = postData.ImageURLs[0];
    } catch (e) {
      imgURL = "";
    }
    setPostCover(imgURL);
    setPostUserName(postData.ProfileEntryResponse.Username);
    setPostTitle(postData.PostExtraData.Title || "Post Title");
    setPostStats([
      postData.DiamondCount,
      postData.LikeCount,
      postData.CommentCount,
    ]);

    const timestamp = postData.TimestampNanos;
    setPostDate(
      DateTime.fromMillis(timestamp / 1e6).toLocaleString(DateTime.DATE_FULL)
    );

    setIsLoading(false);
  }, [hash]);

  return (
    <>
      <NavBar pitchDesk={false} create={false} />

      <div className='pt-24 mx-auto md:w-3/4 px-4 md:px-16'>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <div className='post-head'>
              <div className='flex'>
                <div className='p-2'>
                  <img
                    src={`https://node.deso.org/api/v0/get-single-profile-picture/${posterKey}?fallback=https://node.deso.org/assets/img/default_profile_pic.png`}
                    alt={`${postUsername}'s Avatar`}
                    className='rounded-full h-12 w-12'
                  />
                </div>
                <div className='user-text flex flex-col justify-center p-2 text-gray-800'>
                  <Link
                    to={`/u/${postUsername}`}
                    className='username font-bold hover:underline'>
                    {postUsername}
                  </Link>
                  <div className='post-date text-sm'>{postDate}</div>
                </div>
              </div>
              <div className='text-4xl font-bold break-words my-5 mx-3'>
                {postTitle}
              </div>
            </div>

            <div className='cover-img py-4'>
              <img
                src={postCover}
                alt=''
                className='rounded-lg md:max-w-4xl w-full mx-auto'
              />
            </div>

            <ReactMarkdown
              className='post-content text-lg font  break-words unreset'
              rehypePlugins={[rehypeHighlight]}
              remarkPlugins={[remarkGfm]}>
              {postBody}
            </ReactMarkdown>

            {/* 
              <div className='tag-bar py-2 flex gap-2'>
                {postTags.map((tag, idx) => {
                  return (
                    <Link
                      key={idx}
                      to={`/tag/${tag.replace(" ", "-")}`}
                      className='tag-capsule p-2 border border-gray-600 rounded-full hover:bg-gray-600 hover:text-white duration-300'>
                      # {tag}
                    </Link>
                  );
                })}
              </div> 
            */}

            <div className='comments mt-4' ref={commentElement}>
              <div className='title text-2xl font-bold separator'>Comments</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Post;
