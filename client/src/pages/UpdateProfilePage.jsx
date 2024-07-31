import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEdit } from "react-icons/ai";
import { Form } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { updateProfile } from "../features/user/userSlice";
import { useEffect, useRef, useState } from "react";
import { uploadImage } from "../utils/uploadImage";

function UpdateProfilePage() {
  const user = useSelector((state) => state.user.user);
  const [imagesUrls, setImagesUrls] = useState({
    profilePhoto: user.profilePhoto,
    coverPhoto: user.coverPhoto,
  });
  const dispatch = useDispatch();
  const handleUploadPhoto = (ref) => {
    ref.current.click();
  };
  const profileImageRef = useRef(null);
  const coverImageRef = useRef(null);
  const handleImageChange = async (images, type) => {
    const downloadURL = await uploadImage(images, "images");
    console.log("Download URL:", downloadURL);
    // now add downloadUrl to db
    setImagesUrls((prevImageUrls) => ({
      ...prevImageUrls,
      [type]: downloadURL,
    }));
  };
  useEffect(() => {
    const updateServer = async () => {
      try {
        await customFetch.post(
          "user/updateMe",
          JSON.stringify({ user, ...imagesUrls })
        );
        dispatch(updateProfile(imagesUrls));
      } catch (error) {
        console.error("Error updating server:", error);
      }
    };
    updateServer();
  }, [dispatch, imagesUrls, user]);

  return (
    <main>
      <section className="relative">
        {/* cover */}
        <div className="w-full h-48 md:h-60 relative">
          <img
            src={imagesUrls.coverPhoto}
            alt="coverimage"
            className="w-full h-full object-cover"
            onClick={() => handleUploadPhoto(coverImageRef)}
          />

          <input
            type="file"
            name="coverPhoto"
            id="coverPhoto"
            className="hidden"
            ref={coverImageRef}
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files[0], "coverPhoto")}
          />
        </div>
        {/* cover */}
        {/* profile */}
        <input
          type="file"
          name="profilePhoto"
          id="profilePhoto"
          className="hidden"
          ref={profileImageRef}
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files[0], "profilePhoto")}
        />
        <img
          src={imagesUrls.profilePhoto}
          className="rounded-full w-24 h-24 md:w-56 md:h-56 absolute bottom-[-25%] left-8 md:left-16 md:bottom-[-50%] border-2 object-cover"
          onClick={() => handleUploadPhoto(profileImageRef)}
        />

        {/* profile */}
      </section>
      <section className="ml-[35%] sm:ml-[25%] mt-4 font-semibold capitalize flex justify-between">
        <h1 className="flex items-end  text-lg  md:text-2xl">
          {user.name}
          <AiOutlineEdit className="mb-1" />
        </h1>
        <div className="mr-4 sm:mr-10 md:mr-20 cursor-pointer">. . .</div>
      </section>
      <section className="mt-8 sm:mt-12 md:mt-24 mx-4 md:mx-12 lg:mx-24">
        <h2 className="font-semibold capitalize text-lg sm:text-2xl">
          account setting
        </h2>
        <p className="text-slate-500  leading-10 text-base">
          Update your profile easy
        </p>
      </section>
      <Form
        className="grid grid-cols-1 md:grid-cols-2 mt-8 sm:mt-6 md:mt-12 gap-4 mx-4 max-w-screen-md sm:m-auto lg:max-w-screen-lg"
        method="POST"
      >
        <label className="input input-bordered flex items-center gap-2">
          Name
          <input
            type="text"
            className="grow"
            defaultValue={user.name}
            name="name"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          Email
          <input
            type="text"
            className="grow"
            defaultValue={user.email}
            name="email"
          />
        </label>
        <button
          type="submit"
          className="btn btn-primary capitalize text-slate-50"
        >
          update
        </button>
      </Form>
    </main>
  );
}
export const action =
  (store) =>
  async ({ request }) => {
    const formData = await request.formData();
    const formDataObj = Object.fromEntries(formData);
    const response = await customFetch.post(
      "user/updateMe",
      JSON.stringify({ ...store.getState(), ...formDataObj })
    );
    store.dispatch(updateProfile(formDataObj));
    console.log(response.data.data);
    return response.data.data;
  };

export default UpdateProfilePage;
