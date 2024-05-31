import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient, client } from "../aws-exports";
import { connect } from "react-redux";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { useState } from "react";
import Checkout from "./Checkout";

const Account = ({ users, session }) => {
  // const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses"); // CommonJS import
  const [checkout, setCheckout] = useState(false);
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
            <button onClick={() => setCheckout(true)}>Add More</button>
          </td>
        </tr>
      </table>
      {checkout && <Checkout />}
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
