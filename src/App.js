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
import Upload from "./components/Upload";
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
    const fetchData = async (token, tenantid) => {
      // console.log("Token", token, "+".repeat(20), tenantid);
      fetch(
        `https://kjlkl8q5pa.execute-api.eu-west-1.amazonaws.com/prod/tenant/${tenantid}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          console.log(response, "RESPONSE");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("()".repeat(30), data);
          dispatch({ type: "CREDITS_DATA", payload: data });
          console.log(data, 118);
        })
        .catch((error) => console.error("Error:", error));
    };
    // fetch(
    //   "https://3q4kwhfhx4.execute-api.eu-west-1.amazonaws.com/prod/tenants",
    //   {
    //     method: "GET", // or 'POST', 'PUT', etc.
    //     mode: "no-cors",
    //     headers: {
    //       "Content-Type": "application/json",
    //       // Add any other headers if needed
    //     },
    //   }
    // )
    //   .then((response) => response.json())
    //   .then((data) => console.log(data))
    //   .catch((error) => console.error("Error:", error));

    // fetch(
    //   "https://3q4kwhfhx4.execute-api.eu-west-1.amazonaws.com/prod/tenant/cb3ba89d22a411ef953f8d271d3448c1",
    //   {
    //     method: "GET",
    //     // mode: "no-cors",
    //     headers: {
    //       Authorization:
    //         "Bearer eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.K60WjkfU9WGUxbre-pdowgsobjfwojm7YlGbjcS-CWw5flbhuHxJVh4IcaYeCyyMSwZE2YjPs9CDxHUbWwdx7tvy6utJC63aGh678Vl8dBum-74QfQqsZ4k0o-v1nvhejA4cEPrdqDnNoi8eKNJ-YFsXt8Uyd7qch5QgG7T8W2fc0U8N-WPi4VmCybK3nWEdSBqHWdP2SinHUYZ4-CtVs64_xTJ3q271fwOyWT_7RnQrUfIe9Ht-iUvgXN-MMPbAYZgGmJyRnlugGQ9KnIE7fINZjZP1CsFLd7zsb0y4T9JGgaDeRW-6SmMuDnteN8tvyn25kjmfFGAgRJfu56Ucqw.zaODyGexC9RdGqgv.3PF3crpLbwtUukykgOZLURC2A79Qzp_GR_UlFSqN2Y4n6yMQyC36g2k50XlhQrY1e9ZOby_SSSXAxeTQ3ZDediVQMCL6mMdlS8_BedFKa_eZcrhk_pxZtIBzSi8oamCaEcxBlfdADKRCmS85Rd81QFpI8_DaADu-FIRgfjAE7NKdZpmNeN-Az7_PoSoCWkKmmWQOfPCHPWOStr2z_O5O6oHcEPvfEbTGC2W6WV3jwkoxmgci9EvbFN7sAZ8e7zCUe4Z_yFJjrrmFUw1LppA5idqyWtVm4nw_vLXXu8ZFoC3pX9PArAbZEa__QpyAxjFUO0IkoC6rBYLtdtfSUa5P5yfi1jGPwaUUNRsk_nqiUoVlO8P1sa4WGHcCP62hmBPFfLLt7Mu_6S8kuZUf_HXo74dbRGGN27sDBnwIIBF11YUj20or6MTO6_jiKZ8pWvn6JfsG6xRKfZ4oCC4fwvnR4Nfprb_R5k9hGwf5wHGGVXF_QgT7__7OqogPOav2l9-3yI72nX_L5J66EdQJAX1X0DvMo-LDH8PANOMz_nb1RHIpbHGJtFtOInq8hX6FVLAarYmhez-PAcpNiBOzdiINWEzyCr2trHx5_YlnESaGjxYuTq_dSPrkHv3ftiu-jINCr7bskwmG6ZviLu_awzhNKfyNK5Kf7aqtmFEDX_DpnsYJH7cztth_fMGnWUKXSYNW82OEZPUfX4nv4auzQIR11NxRIUZdND1-zonFFYKk7lSHZb2LTUzM58tNbEW2RpXjDYsPm0gmegF3ZMZnO5eVu2K2iZf6WKBZtGKvlkuhqFwH9yEMCxm6m9-WTrkJHg3Jd47z_Lz0E6JRAlny8yUcoHIwBv_xgE9sqndUjvxIs6YUgGGJO69zRSb-Xfz9hm8vSvz5SMP_6g_22RE1G-h8BV0sCie038u8SAqDSUjJoUQfuRPXLsrYH5x2ZjuiakR2jYkh7-pHS4ChCrru7cTrh_bkTeN_PLDei8jOu1KdPoBaf-btEbejGUraredXoctVaFr6XX-py7o14iglwZTcQJCooXn8LvtgyHdyLYhqDI5_-T6xRWXu7M79-yVYPhAXKN2Kl02r1x6ntOhpI1sGzVnnwCOwh0qzefVd3zwXEOTZThE3tki9gdmZg66YVCDnNnED3wJLHBVCPLAwsi5RiwGwimoQmUSAZK-EbNEWNVwxUOznO2p1m97nZ1jDhRTs1YJIRn_flxuNyyzv--N-99s29N8ldA3kRYgOv2hPYzSSBtv4Jtx2AWMV4px6rD75LLjowUne26dcaySG2Xuoiz3uWmotpJ8-v8xD9bG6hs8J93vOUkOeCeYQliN_qsHyVFeh_C3Xi585Cg.loUcl4tAqIbowHxklRnQPA",
    //     },
    //   }
    // )
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     return response.json();
    //   })
    //   .then((data) => console.log(data, 100000000))
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
            // console.log(
            //   session,
            //   "SESSION",
            //   session.idToken.payload["custom:tenantId"]
            // );
            try {
              const input = {
                UserPoolId: process.env.REACT_APP_API_POOLID,
                GroupName: session["accessToken"].payload["cognito:groups"][0],
              };
              const tenantId = session.idToken.payload["custom:tenantId"];
              fetchData(session.idToken.jwtToken, tenantId);
              console.log(
                input,
                20200303030,
                session["accessToken"].payload["cognito:groups"][0]
              );
              const command = new ListUsersInGroupCommand(input);
              console.log(command, 636377373);
              const response = await client.send(command);
              console.log("?".repeat(20));
              console.log(response, "*".repeat(10));
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
            console.log(attributes);
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
