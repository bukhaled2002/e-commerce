import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../utils/firebase";
import customFetch from "../utils/customFetch";
import Cookies from "js-cookie";
import { login } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

function GoogleAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider(app);
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      // Process the form data here
      const formDataObj = {
        email: result.user.email,
        name: result.user.displayName,
        password: result.user.refreshToken.slice(100, 120),
        passwordConfirm: result.user.refreshToken.slice(100, 120),
      };

      const response = await customFetch.post(
        "/user/googleAuth",
        JSON.stringify(formDataObj)
      );
      Cookies.set("jwt", response?.data?.token, {
        secure: true,
        // httpOnly: true,
      });
      dispatch(login(response?.data?.data?.user));
      return navigate("/");
    } catch (error) {
      console.log(error);
      return error?.response?.data || null;
    }
  };
  return (
    <button
      onClick={() => handleGoogleAuth()}
      type="button"
      className="btn bg-red-600 text-white"
    >
      GoogleAuth
    </button>
  );
}

export default GoogleAuth;
