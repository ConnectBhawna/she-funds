import React, { useState, useEffect, useRef } from "react";
import DesoApi from "../../tools/desoAPI";
import Deso from "deso-protocol";
import NavBar from "../Navbar";
import TopBtnBar from "./TopBtnBar";
import TextEditor from "./TextEditor";
import { useNavigate } from "react-router-dom";
import desoLogo from "../../assets/desoLogo.png";
const da = new DesoApi();
const deso = new Deso();

export default function Create() {
  const navigate = useNavigate();
  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [postCover, setPostCover] = useState("");
  const [loggedInPublicKey, setLoggedInPublicKey] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [coverImageURL, setCoverImageURL] = useState("");
  const [fundraisingAmt, setFundraisingAmt] = useState(0);

  useEffect(async () => {
    const publicKey = localStorage.getItem("loggedInKey");
    if (publicKey === undefined || publicKey === null) {
      window.location.href = "/home";
    } else {
      //get public key from local storage

      setLoggedInPublicKey(publicKey);
    }
  }, []);

  // Event Listeners
  const onCoverInputChange = async (e) => {
    let rawImage = e.target.files[0];
    if (!rawImage) {
      setPostCover(null);
    }
    let url = URL.createObjectURL(rawImage);
    const response = await uploadImage(rawImage);
    if (response) {
      setCoverImageURL(response.ImageURL);
    }
    setPostCover(url);
    e.target.value = "";
  };

  const onPublishBtnClicked = async (e) => {
    // Publish
    if (isPosting) {
      return;
    }
    console.log(titleText);
    console.log(coverImageURL);
    let bannerList = [];
    if (coverImageURL != "") {
      bannerList.push(coverImageURL);
    }

    console.log(bodyText);
    setIsPosting(true);
    console.log("Publishing...");

    const reqeustPayload = {
      UpdaterPublicKeyBase58Check: loggedInPublicKey,
      BodyObj: {
        Body: titleText,
        VideoURLs: [],
        ImageURLs: bannerList,
      },
      PostExtraData: {
        body: bodyText,
        App: "SheFunds",
        FundraisingGoal: fundraisingAmt.toString(),
      },
    };

    const response = await deso.posts.submitPost(reqeustPayload);

    console.log("post doneee");
    console.log(response);
    if (response) {
      const createdPostHashHex = response.PostHashHex;
      const userJwt = await deso.identity.getJwt(undefined);
      const backendSubmitResponse = await da.submitBlog(
        loggedInPublicKey,
        titleText,
        createdPostHashHex,

        response.TstampNanos,
        userJwt
      );
      console.log(backendSubmitResponse);
      navigate(`/post/${createdPostHashHex}`);
      //will redirect to the published post
    }
    setIsPosting(false);
  };

  // Utilities
  const uploadImage = async (rawImage) => {
    const request = undefined;
    const JwtToken = await deso.identity.getJwt(request);
    const response = await da.uploadImage(
      rawImage,
      loggedInPublicKey,
      JwtToken
    );
    return response;
  };

  return (
    <>
      <NavBar pitchDesk={false} create={false} />
      <div className='pt-24'>
        <div className='mt-2 w-screen md:w-4/5 m-auto px-2 md:px-8 mb-6'>
          <TopBtnBar
            isPosting={isPosting}
            coverImgHandler={onCoverInputChange}
          />

          {/* Cover Image Preview */}

          <div
            className={`cover-preview bg-center rounded-lg bg-no-repeat w-2/3 mx-auto h-96 bg-cover relative ${
              !postCover && "hidden"
            }`}
            style={{ backgroundImage: `url(${postCover})`, zIndex: "-10" }}>
            <div className='cover-toolkit absolute top-0 right-0 m-5 flex items-center'>
              <button
                className='px-4 py-2 bg-red-600 text-white opacity-75 hover:opacity-100 duration-300 rounded-lg'
                onClick={() => setPostCover(null)}>
                <i className='fal fa-close'></i>
              </button>
            </div>
          </div>

          <TextEditor
            titleText={titleText}
            bodyText={bodyText}
            setTitleText={setTitleText}
            setBodyText={setBodyText}
            uploadImage={uploadImage}
          />
          <form>
            <div className=' mt-4'>
              <label className={` inline-block mb-2 text-sm font-medium `}>
                Fundraising Goal (in $DESO. 1 $DESO ~ 6$){" "}
                <img
                  src={desoLogo}
                  className='inline-block w-10 h-10 rounded-full'
                />
              </label>
              <input
                type='number'
                min={0}
                className={`  text-sm rounded-lg  block w-full p-2.5 mb-6  bg-white text-gray-800 focus:outline-none border`}
                placeholder='e.g 100Tez'
                value={(fundraisingAmt / 1e6).toString()}
                onChange={(e) => {
                  setFundraisingAmt(Math.abs(e.target.value * 1e6));
                  localStorage.setItem(
                    "fundraisingAmt",
                    Math.abs(e.target.value * 1e6)
                  );
                }}
                onKeyUp={(e) => {
                  e.target.value = Math.abs(e.target.value);
                }}
              />
            </div>
          </form>

          <div className='flex justify-center'>
            <button
              className={`p-2 hover:text-white border border-[#ef476f] hover:bg-[#d33e60] focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 `}
              onClick={onPublishBtnClicked}>
              Create Fund Raiser
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
