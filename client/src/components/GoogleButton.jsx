import React, { useContext, useState } from "react";
import { Alert } from "react-bootstrap";
import GoogleLogin from "react-google-login";
import { generatePath, useNavigate } from "react-router-dom";
import { UserContext } from "../context/ReferenceDataContext";
import AuthService from "../services/auth";
const { setWithExpiry } = AuthService;


const GoogleButton = ({text}) => {
  let navigate = useNavigate();

  //Error state
  const [errorState, setErrorState] = useState(false)
  const [error, setError] = useState('');

  //Use the useContext hook, get the setFirstname and setProfile picture from it for Google Signup
  const { setFirstName } = useContext(UserContext).value1;
  const { setProfilePicture } = useContext(UserContext).value2;

  const handleClick = async (response) => {
    console.log("The Google data ", response);
    const res = await fetch("/api/google-login", {
      method: "POST",
      body: JSON.stringify({
        token: response.tokenId,
        googleId: response.googleId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("The data from Google button - ", data);

    if (data.status === "OK") {
      if (
        data.redirectToContinueSignup === false &&
        data.user.matricNumber !== undefined &&
        data.user.graduationYear !== undefined
      ) {
        console.log("WOW from Google Component ");
        setFirstName(data.user.firstname);
        setProfilePicture(data.user.profilePicture);
        setWithExpiry("user", data.user);
        //Redirect User to Home Page
        navigate("/");
      } else {
        console.log("User has not been signed up before");
        //Redirect User to the Continue Signup page
        let id = data.user._id;

        setFirstName(data.user.firstname);
        setProfilePicture(data.user.profilePicture);
        setWithExpiry("user", data.user);

        const path = generatePath("/continueSignup/:id", { id: id });
        console.log("The path ", path);

        navigate(path, { replace: true });
      }
    } else {
    //   dispatch({ type: "error", payload: data.error });
      setError(data.error);
    }
  };

  return (
    <div className="mt-2">
        {
            errorState===true ? 
            <Alert variant="danger" onClick={(evt) => setErrorState(false)}>
                {error}
            </Alert> : null
        }

      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText={text}
        onSuccess={handleClick}
        onFailure={handleClick}
        // onFailure={handleGoogleFailure}
        cookiePolicy={"single_host_origin"}
      ></GoogleLogin>
    </div>
  );
};

export default GoogleButton;
