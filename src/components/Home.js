import React, { useState } from "react";
import Form from "./Form";
import { connect } from "react-redux";
import { userPool, client } from "../aws-exports";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const Home = ({ users, session }) => {
  const [state, setState] = useState(false);
  const [newUsers, setNewUsers] = useState({});
  // console.log(session["accessToken"].payload["cognito:groups"][0], 9);
  // const handleUpdateAttribute = () => {
  //   const cognitoUser = userPool.getCurrentUser();
  //   console.log(cognitoUser, 15);

  //   if (cognitoUser) {
  //     cognitoUser.getSession((err, session) => {
  //       if (err) {
  //         console.log("Session error:", err);
  //         return;
  //       }

  //       const attributeList = [];
  //       const attribute = new CognitoUserAttribute({
  //         Name: `custom:user1`, // Custom attribute key
  //         Value: "TenantUser", // Custom attribute value
  //       });
  //       attributeList.push(attribute);

  //       cognitoUser.updateAttributes(attributeList, (err, result) => {
  //         if (err) {
  //           console.log("Update attributes error:", err);
  //           return;
  //         }
  //         console.log("Attributes updated:", result);
  //       });
  //     });
  //   } else {
  //     console.log("No current user");
  //   }
  // };
  const handleSignUp = async (setError) => {
    const tenantId = session["accessToken"].payload["cognito:groups"][0];
    const region = process.env.REACT_APP_API_REGION;
    const sesClient = new SESClient({ region });

    const attributeList = [];
    if (!newUsers.email && !newUsers.username && !newUsers.password) {
      return false;
    }
    const emailAttribute = new CognitoUserAttribute({
      Name: "email",
      Value: newUsers.email,
    });

    const tenantIdAttribute = new CognitoUserAttribute({
      Name: "custom:tenantId",
      Value: tenantId,
    });
    const userRoleAttribute = new CognitoUserAttribute({
      Name: "custom:userRole",
      Value: "TenantUser",
    });

    attributeList.push(emailAttribute);
    attributeList.push(tenantIdAttribute);
    attributeList.push(userRoleAttribute);
    // console.log(newUsers, 67);
    userPool.signUp(
      newUsers.username,
      newUsers.password,
      attributeList,
      null,
      async (err, result) => {
        if (err) {
          console.error("Error signing up:", err.message);
          setError(err.message);
          return;
        }
        console.log("User signed up:", result);
        try {
          const username = result.user.getUsername(); // get the username
          const addUserToGroupCommand = new AdminAddUserToGroupCommand({
            UserPoolId: process.env.REACT_APP_API_POOLID,
            Username: username,
            GroupName: session["accessToken"].payload["cognito:groups"][0], // replace with your group name
          });

          const addUserToGroupResponse = await client.send(
            addUserToGroupCommand
          );
          console.log("User added to group:", addUserToGroupResponse);
          // setState(!state);
          window.location.reload();
        } catch (addGroupError) {
          console.error("Error adding user to group:", addGroupError);
        }
      }
    );
    // const emailParams = {
    //   Destination: { ToAddresses: [newUsers.email] },
    //   Message: {
    //     Body: {
    //       Text: {
    //         Charset: "UTF-8",
    //         Data: `Welcome to our service. Your username is: ${newUsers.email} and your password is: ${newUsers.password}`,
    //       },
    //     },
    //     Subject: { Charset: "UTF-8", Data: "Your new account details" },
    //   },
    //   Source: "Acumen Team",
    // };
    // const sendEmailCommand = new SendEmailCommand(emailParams);
    // await sesClient.send(sendEmailCommand);
  };
  console.log(users);
  return !state ? (
    <div className="Sections">
      <h2>Users</h2>
      <div className="InnerHomeDiv">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              {/* <th>Surname</th> */}
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {users.map((data) => (
              <tr key={data.Name}>
                <td>{data.Username}</td>
                <td>{data.Attributes[0].Value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />
      <button onClick={() => setState(!state)} className="AddUsers">
        Add More Users
      </button>
    </div>
  ) : (
    <Form
      handleSignUp={handleSignUp}
      newUsers={newUsers}
      setNewUsers={setNewUsers}
      setState={setState}
    />
  );
};

const mapStateToProps = (state) => {
  // console.log(state.users, 1);
  return {
    users: state.users.Users || [],
    session: state.session,
  };
};

export default connect(mapStateToProps, {})(Home);
