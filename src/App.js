import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";
import "./App.css";
// import { Amplify } from "aws-amplify";
import { IoMdCloseCircle } from "react-icons/io";
import { HiMenu } from "react-icons/hi";

import { userPool, client, command } from "./aws-exports";
import {
  CognitoIdentityProviderClient,
  AdminListGroupsForUserCommand,
  ListUsersInGroupCommand,
  ListUsersCommand,
  ListUserPoolClientsCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import Login from "./Login";
import { connect, useDispatch } from "react-redux";
import ForgotPassword from "./components/ForgotPassword";
const Container = styled.div`
  display: flex;
  height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  overflow: hidden;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background: white;
  color: black;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const authenticate = (Email, Password) => {
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
      onSuccess: (result) => {
        console.log("Login successful");
        console.log(result);
        resolve(result);
      },
      onFailure: (err) => {
        console.log("login failed", err);
        reject(err);
      },
    });
  });
};
const signup = (email, password) => {
  const attributeList = [];
  attributeList.push(
    new CognitoUserAttribute({
      Name: "email",
      Value: email,
    })
  );
  let username = email;
  userPool.signUp(username, password, attributeList, null, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data, "Success");
    }
  });
};
const App = ({ session }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState("Login");
  const [loading, setLoading] = useState(true);

  const email = "admin-user";
  const password = "@$TqC32#Nk#fiLWv";
  const dispatch = useDispatch();
  useEffect(() => {
    // fetch(
    //   "https://ce97918edeb1450cb2ca96f38624a54b.vfs.cloud9.eu-west-1.amazonaws.com/get",
    //   {
    //     method: "GET",
    //   }
    // )
    //   .then((res) => {
    //     if (!res.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return res.json();
    //   })
    //   .then((data) => console.log(data))
    //   .catch((error) => console.error("Fetch error:", error));

    // fetch("http://localhost:8080/api/auth-token", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     clientId: "your_client_id",
    //     clientSecret: "your_client_secret",
    //     merchantId: "your_merchant_id",
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log(data))
    //   .catch((error) => console.error("Error:", error));
    // fetch("http://localhost:8080/api/create-checkout-id", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     accessToken:
    //       "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMjEtMDktMDYifQ.eyJlbnRpdHlJRCI6ImFmZGI4YzQ2OThkNjRkMzE5Yzg3YTg0YjNiZWIwZDhkIiwicGFydG5lciI6ZmFsc2UsInNpZCI6ImYxNDM2Mjk1ODJkYjk1OGE2YmEwIiwibWVyY2hhbnRJZCI6ImFmZGI4YzQ2OThkNjRkMzE5Yzg3YTg0YjNiZWIwZDhkIiwiaWF0IjoxNzE3NDM5MDgzLCJuYmYiOjE3MTc0MzkwODMsImV4cCI6MTcxNzQ1MzQ4MywiYXVkIjoiaHR0cHM6Ly9tMm0ucGVhY2hwYXltZW50cy5jb20iLCJpc3MiOiJodHRwczovL3NhbmRib3gtc2VydmljZXMucHBheS5pby8iLCJzdWIiOiI5YTI3NzExODVjNmNjODY3MWVjY2FjNjE4ZTAyNzUifQ.di_jTKd0a_MSbPRUxongqYRiXyMa5TXOFcOtKr9WLP2EI3_TUL7Sadku1cW_nGug08VClT2PJ2oT0vpJR5_nDV0UBe7faSlbdJ4OCzpIk6Fmj8kxZnxmhUS9y6lRL2hd7DJ8h66ls_zkC5wAUdeB8eWYXWOynGn3cYdI3KBMJ6C6Z-PBnXrF8fxu5cYCtLX_A9ePDBSUuAWRLnRHc4UQFZyTmZnmJqYxBJ4-It_KdSJ0Y9h68aSacxdprnre8pDICiU7Se_7uebsnuX1dNB7xaizMeqWtr6SeHjhdHp7fXqdBpv1v3bJylqr_OU-UcgjnMIjNhRP5q2_wLJ2mQidQ24c81lrIaEXvGSU8axADlzGkfD91Xldb-PVGotoPqlogaRmYzvOYdkocm9PQHmjVWXh8qze_nYyTj_iKWGHncjql_aFWzyefZIOvHdVFDkLTcOcOYKFuVVnB7W-hzsCVs4CM4qR1oxc0Cz3xr5IGhCuv0b1K5Ll0lDTl7MgEf0oM9YOb_hDliWRATLopYY-VWCetdlWAWJRg7W8ma661fHxIaP4ghzXlfeBUSCvYsnx6ScS6PYIQleZT4L4NoVVlUYOTSezAtPMIUKHMcfaQFlYBYlnOoT6fISMw5vUzdDXvtlEzvuON2GpZfUkIH_8ryZdMIdaXcn-m_IkOnSW9OU",
    //     amount: 100.00,
    //     merchantTransactionId: "OrderNo45dd",
    //     currency: "ZAR",
    //     forceDefaultMethod: true,
    //     entityId: "8ac7a4c88fc8ac63018fc92d2ce50163",
    //     nonce: "UNQ00012345678",
    //     shopperResultUrl: "https://kaleem99.github.io/BlazingGrill-UI/",
    //     defaultPaymentMethod: "CARD",
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log(data))
    //   .catch((error) => console.error("Error:", error));
    const checkAuth = async () => {
      const user = userPool.getCurrentUser();
      if (user) {
        user.getSession(async (err, session) => {
          if (err || !session.isValid()) {
            setIsAuthenticated("Login");
            // history.push("/login"); // Redirect to login if not authenticated
          } else {
            setIsAuthenticated("Home");
            console.log(session);
            try {
              const input = {
                UserPoolId: process.env.REACT_APP_API_POOLID,
                GroupName: session["accessToken"].payload["cognito:groups"][0],
              };

              const command = new ListUsersInGroupCommand(input);

              const response = await client.send(command);
              console.log(response);
              dispatch({ type: "GET_USERS", payload: response });
            } catch (error) {
              console.error("Error listing users:", error);
            }
            dispatch({ type: "SESSION_DATA", payload: session });
          }
          setLoading(false);
        });
        user.getUserAttributes((err, attributes) => {
          if (err) {
            console.log(err);
          } else {
            // console.log(attributes);
            // dispatch({ type: "GET_USERS", payload: attributes });
          }
        });
        user.getUserData((err, data) => {
          if (err) {
            console.log(err);
          } else {
            // console.log(data, 1);
          }
        });
      } else {
        setIsAuthenticated("Login");
        // history.push("/login"); // Redirect to login if not authenticated
        setLoading(false);
      }
    };

    checkAuth();
  }, []);
  const checkIfLoggedIn = () => {
    switch (isAuthenticated) {
      case "Home":
        return (
          <Container>
            <ToggleButton onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <IoMdCloseCircle /> : <HiMenu />}
            </ToggleButton>
            {sidebarOpen && <Sidebar isOpen={sidebarOpen} />}
            <Main />
          </Container>
        );
      case "Login":
        return <Login setIsAuthenticated={setIsAuthenticated} />;
      case "ForgotPassword":
        return <ForgotPassword setIsAuthenticated={setIsAuthenticated} />;
      default:
        return <Login setIsAuthenticated={setIsAuthenticated} />;
    }
  };
  return <div>{checkIfLoggedIn()}</div>;
};
const mapStateToProps = (state) => {
  // console.log(state.users, 1);
  return {
    users: state.users.Users,
    session: state.session,
  };
};

export default connect(mapStateToProps, {})(App);
