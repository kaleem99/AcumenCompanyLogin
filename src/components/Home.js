import React, { useState } from "react";
import Form from "./Form";
import { connect } from "react-redux";
import userPool from "../aws-exports";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";

const Home = ({ users }) => {
  const [state, setState] = useState(false);
  const [newUsers, setNewUsers] = useState([...users]);
  console.log(users, 9);

  // const handleUpdateAttribute = () => {
  //   const cognitoUser = userPool.getCurrentUser();
  //   console.log(cognitoUser, 15);

  //   if (cognitoUser) {
  //     cognitoUser.getSession((err, session) => {
  //       if (err) {
  //         console.log("Session error:", err);
  //         return;
  //       }

  //       const attributeList = [...users];
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
  const handleSignUp = () => {
    const attributeList = [];

    const emailAttribute = new CognitoUserAttribute({
      Name: "email",
      Value: "kaleem1999@outlook.com",
    });

    const customUserAttribute = new CognitoUserAttribute({
      Name: `email`, // Custom attribute key
      Value: "kaleem1999@outlook.com", // Custom attribute value
    });

    attributeList.push(emailAttribute);
    attributeList.push(customUserAttribute);

    userPool.signUp(
      "kaleem99",
      "K10-2028t$=dd",
      attributeList,
      null,
      (err, result) => {
        if (err) {
          console.error("Error signing up:", err);
          return;
        }
        console.log("User signed up:", result);
      }
    );
  };
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
                <td>{data.Name}</td>
                {/* <td>{data.surname}</td> */}
                <td>{data.Value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />
      <button onClick={handleSignUp} className="AddUsers">
        Add More Users
      </button>
    </div>
  ) : (
    <Form newUsers={newUsers} setNewUsers={setNewUsers} setState={setState} />
  );
};

const mapStateToProps = (state) => {
  return {
    users: state.users,
  };
};

export default connect(mapStateToProps, {})(Home);
