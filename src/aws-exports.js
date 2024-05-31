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
const REGION = "eu-west-1";
const userPoolId = "eu-west-1_sFRiMvMYf";
const config = {
  region: REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: REGION },
    userPoolId: userPoolId,
    clientId: "69r34hg01hn1bbkvc2tuag0a1c",
    identityPoolId: "eu-west-1:a6763df5-84e9-412f-b304-90b16b114e22",
  }),
};
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
  UserPoolId: "eu-west-1_sFRiMvMYf",
  ClientId: "69r34hg01hn1bbkvc2tuag0a1c",
};

const userPool = new CognitoUserPool(poolData);
export { userPool, client, config, sesClient };
