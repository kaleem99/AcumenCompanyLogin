// Existing code
import { SESClient } from "@aws-sdk/client-ses";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import {
  CognitoIdentityProviderClient,
  AdminListGroupsForUserCommand,
  ListUsersInGroupCommand,
  ListUsersCommand,
  ListUserPoolClientsCommand,
} from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
const REGION = process.env.REACT_APP_API_REGION;
const userPoolId = process.env.REACT_APP_API_POOLID;
const config = {
  region: REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: REGION },
    userPoolId: userPoolId,
    clientId: process.env.REACT_APP_API_CLIENTID,
    identityPoolId: process.env.REACT_APP_API_IDENTITYPOOL,
  }),
};
console.log(process.env.REACT_APP_API_IDENTITYPOOL)
const sesClient = new SESClient(config);

const client = new CognitoIdentityProviderClient(config);

// Code to list users under a group

// try {
//   const response = await client.send(command);
//   console.log(response);
// } catch (error) {
//   console.error("Error listing users:", error);
// }

const poolData = {
  UserPoolId: userPoolId,
  ClientId: process.env.REACT_APP_API_CLIENTID,
};

const userPool = new CognitoUserPool(poolData);
console.log(userPool);
export { userPool, client, config, sesClient };
