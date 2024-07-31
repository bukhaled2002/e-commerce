import { v4 } from "uuid";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (image, path) => {
  const imageRef = ref(storage, `${path}/${v4()}`);
  await uploadBytes(imageRef, image);
  const url = await getDownloadURL(imageRef);
  return url;
};
