import React, { useState } from "react";
import Form from "./Form";
import { connect } from "react-redux";
import { userPool, client, config, sesClient } from "../aws-exports";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  AdminDeleteUserCommand,
  AdminCreateUserCommand,
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
  async function deleteUser(username) {
    const params = {
      UserPoolId: process.env.REACT_APP_API_POOLID,
      Username: username,
    };

    try {
      const command = new AdminDeleteUserCommand(params);
      const response = await client.send(command);
      console.log("User deleted successfully:", response);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
  const handleSignUp = async (setError) => {
    const tenantId = session["accessToken"].payload["cognito:groups"][0];
    const attributeList = [];
    if (!newUsers.email && !newUsers.username) {
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

    try {
      // Create user in the user pool with AdminCreateUserCommand
      const input = {
        UserPoolId: process.env.REACT_APP_API_POOLID,
        Username: newUsers.username,
        UserAttributes: attributeList,
        DesiredDeliveryMediums: ["EMAIL"],
        ForceAliasCreation: false,
      };
      const createUserCommand = new AdminCreateUserCommand(input);
      const createUserResponse = await client.send(createUserCommand);
      console.log("User created in user pool:", createUserResponse);

      // Add the user to a group
      const addUserToGroupCommand = new AdminAddUserToGroupCommand({
        UserPoolId: process.env.REACT_APP_API_POOLID,
        Username: newUsers.username,
        GroupName: session["accessToken"].payload["cognito:groups"][0], // replace with your group name
      });

      const addUserToGroupResponse = await client.send(addUserToGroupCommand);
      console.log("User added to group:", addUserToGroupResponse);

      window.location.reload();
    } catch (error) {
      console.error("Error creating user or adding to group:", error);
      setError(error.message);
    }
  };
  // console.log(session.accessToken.payload.username);
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
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(
                (data) => data.Username !== session.accessToken.payload.username
              )
              .map((data) => (
                <tr key={data.Name}>
                  <td>{data.Username}</td>
                  <td>{data.Attributes[0].Value}</td>
                  <td>
                    <button
                      className="button"
                      onClick={() => deleteUser(data.Username)}
                    >
                      Delete User
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <br />
      <button onClick={() => setState(!state)} className="AddUsers button">
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
