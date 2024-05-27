import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";
import "./App.css";
// import { Amplify } from "aws-amplify";
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
  padding: 10px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  font-size: large;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const email = "admin-user";
  const password = "@$TqC32#Nk#fiLWv";
  const dispatch = useDispatch();
  useEffect(() => {
    const checkAuth = async () => {
      
      const user = userPool.getCurrentUser();
      if (user) {
        user.getSession(async(err, session) => {
          if (err || !session.isValid()) {
            setIsAuthenticated(false);
            // history.push("/login"); // Redirect to login if not authenticated
          } else {
            setIsAuthenticated(true);
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
        setIsAuthenticated(false);
        // history.push("/login"); // Redirect to login if not authenticated
        setLoading(false);
      }
    };

    checkAuth();
  }, []);
  const checkIfLoggedIn = () => {
    switch (isAuthenticated) {
      case true:
        return (
          <Container>
            <ToggleButton onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? "X" : "|||"}
            </ToggleButton>
            {sidebarOpen && <Sidebar isOpen={sidebarOpen} />}
            <Main />
          </Container>
        );
      case false:
        return <Login />;
      default:
        return <Login />;
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
