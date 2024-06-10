import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient, client } from "../aws-exports";
import { connect } from "react-redux";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { useState } from "react";
import Checkout from "./Checkout";

const Account = ({ users, session, creditsData }) => {
  // const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses"); // CommonJS import
  const [checkout, setCheckout] = useState(false);
  const [code, setCode] = useState(null);
  const [amount, setAmount] = useState(8);
  const [pages, setPages] = useState(1);
  // { // SendEmailResponse
  const testing = async () => {
    // const fetchData = async (token) => {
    const updatedData = creditsData;
    updatedData.tenantBalance = 0;
    const tenantId = session.idToken.payload["custom:tenantId"];
    try {
      const response = await fetch(
        `https://3q4kwhfhx4.execute-api.eu-west-1.amazonaws.com/prod/tenant/${tenantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.idToken.jwtToken}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
    // };
    // await fetchData();
    console.log(session);
    console.log(creditsData, "function running");
  };
  return (
    <div className="Sections">
      <table>
        <tr>
          <th>Credits</th>
          <th>Enter an Amount</th>
          <th>Buy More Credits</th>
        </tr>
        <tr>
          <td>{creditsData?.tenantBalance}</td>
          <td>
            {/* <input onChange={(e) => setAmount(e.target.value)} value={amount} /> */}
            <select
              onChange={(e) => {
                setPages(e.target.value);
                console.log(e.target.value, 61, e.target.value * 8);
                setAmount(e.target.value * 8);
              }}
            >
              <option value={1}>1 Page R8</option>
              <option value={10}>10 Pages R80</option>
              <option value={50}>50 Pages R400</option>
            </select>
          </td>
          <td>
            <button
              onClick={() => {
                setCheckout(true);
                setCode(new Date().getTime());
              }}
            >
              Add More
            </button>
          </td>
        </tr>
      </table>
      {checkout && (
        <Checkout
          tenantId={session.idToken.payload["custom:tenantId"]}
          testing={testing}
          pages={pages}
          amount={amount}
          code={code}
          token={session.idToken.jwtToken}
          creditsData={creditsData}
          session={session}
        />
      )}
      {/* <button onClick={() => testing()}>Change Credits</button> */}
    </div>
  );
};
const mapStateToProps = (state) => {
  // console.log(state.users, 1);
  return {
    users: state.users.Users || [],
    session: state.session,
    creditsData: state.creditsData[0],
  };
};
export default connect(mapStateToProps, {})(Account);
