 import React, { useRef, useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, updateProfilePic, selectUser } from "../Feature/Userslice";
import {AdvancedImage} from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { thumbnail, scale } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { Link } from "react-router-dom";

import axios from "axios";

function Profile() {
  
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const [uploadedImg, setUpload] = useState("");
   const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const inputRef = useRef(null);

  
   useEffect(() => {
  const fetchUserData = async () => {
    if (user && user._id) {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${user._id}`); // Corrected template literal
        const userData = await response.json();
        dispatch(setUser(userData)); // Update Redux state with the latest user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  fetchUserData();
}, [dispatch, user]);




  function previewFiles(file) {
    const reader = new FileReader();
     reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    }
    console.log(image);
  }
  const handleChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setFile(file);
    previewFiles(file);
  }
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await axios.post("http://localhost:5000", {
      image: image,
    });

    if (result.data.public_id) {
      const uploadedImg = result.data.public_id;
      setUpload(uploadedImg);
      console.log("Image uploaded successfully:", uploadedImg);
    } else {
      console.error("Error: No public_id received from server.");
    }
  } catch (err) {
    console.error("Upload failed:", err);
  } finally {
    setFile(""); // Clear the file input
    setImage(""); // Clear the preview image
  }
};


   const cld = new Cloudinary({
    cloud: {
      cloudName: 'duppsnkhp'
    }
   });
  const myImage = cld.image(uploadedImg);
  myImage.resize(thumbnail().width(100).height(100).gravity(focusOn(FocusOn.face())));

  const handleImageClick = () => {
    inputRef.current.click();
  };

  

  return (
    <div className="flex items-center mt-9 mb-4 justify-center">
      <div className="max-w-xs w-full">
        <div className="bg-white shadow-lg rounded-lg py-3">
          <div className="photo-wrapper p-2 flex flex-col items-center">
            <AdvancedImage 
              cldImg={myImage} 
              className="w-32 h-32 rounded-full cursor-pointer" 
              onClick={handleImageClick} 
            />
            <form onSubmit={e => handleSubmit(e)} className="w-full">
              <input 
                type="file" 
                id="fileInput" 
                ref={inputRef}  
                onChange={e => handleChange(e)} 
                required 
                accept="image/png, image/jpeg, image/jpg, image/jfif" 
                className="hidden"
              />
              <button className="btn btn-primary mx-4 mt-2 px-4 py-2 bg-blue-600 text-white rounded w-full">Upload</button>
            </form>
          </div>

          <div className="p-2">
            <h3 className="text-center text-xl text-gray-900 font-bold">{user.name}</h3>
          </div>

          <div className="text-xs my-3 px-4">
            <h3 className="text-xl font-bold">UID</h3>
            <h3 className="text-center text-lg text-gray-900">{user.uid}</h3>
          </div>

          <div className="px-4">
            <h3 className="text-xl font-bold">Email</h3>
            <h3 className="text-center text-xl text-gray-900">{user.email}</h3>
          </div>

          {/* View Applications Button */}
          <div className="flex justify-center mt-3">
            <Link
              to="/userapplication"
              className="relative items-center justify-start inline-block px-5 py-3 overflow-hidden font-medium transition-all bg-blue-600 rounded-full hover:bg-white group"
            >
              <span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
              <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-blue-600">
                View Applications
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;    