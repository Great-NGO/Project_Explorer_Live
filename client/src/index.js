import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { UserContextProvider } from "./context/ReferenceDataContext";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      {/* <GoogleOAuthProvider clientId="121526594633-khdbclgdg4vnr2pn4hr6u17vuce3h9it.apps.googleusercontent.com"> */}
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
