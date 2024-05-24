// src/aws-exports.js
import { CognitoUserPool } from "amazon-cognito-identity-js";
import {
  CognitoIdentityProviderClient,
  AdminListGroupsForUserCommand,
} from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
// const REGION = "eu-west-1";

// const config = {
//   region: REGION, // Your AWS region
//   credentials: fromCognitoIdentityPool({
//     clientConfig: { region: REGION },

//     userPoolId: "eu-west-1_Y8FTLjqFT",
//     clientId: "69r34hg01hn1bbkvc2tuag0a1c",
//   }),
// };

// const { CognitoIdentityProviderClient, AdminListGroupsForUserCommand } = require("@aws-sdk/client-cognito-identity-provider"); // CommonJS import
// const client = new CognitoIdentityProviderClient(config);
// const input = {
//   // AdminListGroupsForUserRequest
//   Username: "admin-tenant1-d0901868191011ef962b05fac0d9df55", // required
//   UserPoolId: "eu-west-1_Y8FTLjqFT", // required
//   Limit: Number("int"),
//   NextToken: "STRING_VALUE",
//   Region: "eu-west-1",
// };

// const command = new AdminListGroupsForUserCommand(input);
// const response = await client.send(command);
// console.log(response, 100);
// const awsmobile = {
//   Auth: {
//     // REQUIRED - Amazon Cognito Region
//     region: "eu-west-1",

//     // OPTIONAL - Amazon Cognito User Pool ID
//     userPoolId: "eu-west-1_Y8FTLjqFT",

//     // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
//     userPoolWebClientId: "5si7ihk0leh0lctc8j7bu7pheg",

//     // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
//     mandatorySignIn: false,
//   },
// };
// TenantUser
// admin-tenant2-b432a997191511ef869f09ea8a198d43
// 2m%gNIq6
// admin-tenant1-d0901868191011ef962b05fac0d9df55
// 8Yyk@AHL
const poolData = {
  //   UserPoolId: "eu-west-1_Y8FTLjqFT",
  //   ClientId: "5si7ihk0leh0lctc8j7bu7pheg",
  UserPoolId: "eu-west-1_sFRiMvMYf",
  ClientId: "69r34hg01hn1bbkvc2tuag0a1c",
};
// const awsmobile = {
//     "aws_project_region": "eu-west-1",
//     "aws_cognito_region": "eu-west-1",
//     "aws_user_pools_id": "eu-west-1_Y8FTLjqFT",
//     "aws_user_pools_web_client_id": "5si7ihk0leh0lctc8j7bu7pheg",
// };

const userPool = new CognitoUserPool(poolData);
export default userPool;
// export default awsmobile;
