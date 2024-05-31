import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient, client } from "../aws-exports";
import { connect } from "react-redux";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const Account = ({ users, session }) => {
  // const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses"); // CommonJS import
  const testing = async () => {
    const REGION = "eu-west-1";

    const sesClient = new SESClient({
      region: REGION,
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: REGION },
        identityPoolId: "eu-west-1:a6763df5-84e9-412f-b304-90b16b114e22",
      }),
    });

    // Assuming session.idToken.payload.email contains the recipient's email address
    const recipientEmail = session.idToken.payload.email;

    const input = {
      Source: "kaleem1999@outlook.com", // Update with your verified SES email
      Destination: {
        ToAddresses: ["kaleem1999@outlook.com"],
      },
      Message: {
        Subject: {
          Data: "Your Subject",
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: "Your Email Body",
            Charset: "UTF-8",
          },
          // You can also include an HTML version if needed
          // Html: {
          //   Data: "<p>Your HTML Email Body</p>",
          //   Charset: "UTF-8",
          // },
        },
      },
    };

    try {
      const command = new SendEmailCommand(input);
      const response = await sesClient.send(command);
      console.log("Email sent:", response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // { // SendEmailResponse
  return (
    <div className="Sections">
      <table>
        <tr>
          <th>Credits</th>
          <th>Buy More Credits</th>
        </tr>
        <tr>
          <td>100</td>
          <td>
            <button onClick={testing}>Add More</button>
          </td>
        </tr>
      </table>
    </div>
  );
};
const mapStateToProps = (state) => {
  // console.log(state.users, 1);
  return {
    users: state.users.Users || [],
    session: state.session,
  };
};
export default connect(mapStateToProps, {})(Account);
