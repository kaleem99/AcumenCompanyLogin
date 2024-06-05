// src/components/Login.js
import React, { useState } from "react";
import { userPool, client } from "./aws-exports";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
const authenticate = (Email, Password, newPassword) => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: Email,
      Pool: userPool,
    });
    const authDetails = new AuthenticationDetails({
      Username: Email,
      Password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: async (result) => {
        console.log("Login successful");
        console.log(result);

        // Update email as verified
        try {
          const command = new AdminUpdateUserAttributesCommand({
            UserPoolId: process.env.REACT_APP_API_POOLID,
            Username: Email,
            UserAttributes: [
              {
                Name: "email_verified",
                Value: "true",
              },
            ],
          });

          await client.send(command);
          console.log("Email verified");
          resolve(result);
        } catch (error) {
          console.error("Error verifying email: ", error);
          reject(error);
        }
      },
      onFailure: (err) => {
        console.log("Login failed", err);
        reject(err);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        // The API requires attributes to be returned, even if they are not used
        delete userAttributes.email_verified;
        delete userAttributes.phone_number_verified;
        resolve({ user, userAttributes, requiredAttributes });
      },
    });
  });
};
const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [cognitoUser, setCognitoUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await authenticate(username, password);
      if (result.user) {
        setCognitoUser(result.user);
        setShowNewPassword(true);
      } else {
        setError("");
        console.log("Logged in user:", result);
        window.location.reload();
        // Perform further actions after successful login, e.g., redirect
      }
    } catch (err) {
      console.error("Error logging in", err);
      setError("Error logging in. Please check your username and password.");
    }
  };
  const handleNewPassword = async () => {
    try {
      cognitoUser.completeNewPasswordChallenge(
        newPassword,
        {},
        {
          onSuccess: (result) => {
            console.log("Password changed successfully", result);
            setError("");
            setShowNewPassword(false);
            // Perform further actions after successful password change, e.g., redirect
          },
          onFailure: (err) => {
            console.error("Error setting new password", err);
            setError("Error setting new password. Please try again.");
          },
        }
      );
    } catch (err) {
      console.error("Error setting new password", err);
      setError("Error setting new password. Please try again.");
    }
  };
  return (
    <div className={"container"}>
      <div className={"form"}>
        <h2>Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className={"input"}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={"input"}
        />
        <button onClick={handleLogin} className={"button"}>
          Login
        </button>
        <a onClick={() => setIsAuthenticated("ForgotPassword")} href="#">
          Forgot Password
        </a>
        {showNewPassword && (
          <>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className={"input"}
            />
            <button onClick={handleNewPassword} className={"button"}>
              Set New Password
            </button>
          </>
        )}
        {error && <div className={"error"}>{error}</div>}
      </div>
    </div>
  );
};

export default Login;
