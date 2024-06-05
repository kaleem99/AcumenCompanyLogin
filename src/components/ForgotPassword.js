// src/ForgotPassword.js
import React, { useState } from "react";
import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { client } from "../aws-exports";
const clientId = process.env.REACT_APP_API_CLIENTID;
const ForgotPassword = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleSendCode = async () => {
    const command = new ForgotPasswordCommand({
      Username: username,
      ClientId: clientId,
    });
    try {
      await client.send(command);
      setStep(2);
    } catch (error) {
      console.error("Error sending code: ", error);
    }
  };

  const handleResetPassword = async () => {
    const command = new ConfirmForgotPasswordCommand({
      Username: username,
      ConfirmationCode: code,
      Password: newPassword,
      ClientId: clientId,
    });

    try {
      await client.send(command);
      alert("Password reset successful");
      setStep(1);
      setIsAuthenticated("Login");
    } catch (error) {
      console.error("Error resetting password: ", error);
    }
  };

  return (
    <div className="forgot-password-container">
      {step === 1 && (
        <div>
          <h2>Forgot Password</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleSendCode}>Send Code</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Reset Password</h2>
          <input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}
      <a onClick={() => setIsAuthenticated("Login")} href="#">
        Login
      </a>
    </div>
  );
};

export default ForgotPassword;
