import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient, client } from "../aws-exports";
import { connect } from "react-redux";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { useState } from "react";
import Checkout from "./Checkout";

const Upload = ({ users, session, creditsData, email }) => {
  // const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses"); // CommonJS import
  const [file, setFile] = useState(null);
  // { // SendEmailResponse
  console.log(creditsData);
  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };
  const uploadFile = async () => {
    // if (!file) {
    //   console.error("No file selected");
    //   return;
    // }

    // try {
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onloadend = async () => {
    //     const base64File = reader.result.split(",")[1]; // Get the base64 part of the result
    //     const payload = {
    //       body: {
    //         file: base64File,
    //         bucket: "create-entities-uploads-acumen-154654dasfk",
    //         file_name: file.name,
    //       },
    //     };
    //     console.log(base64File, 35);
    //     try {
    //       const response = await fetch(
    //         "https://kjlkl8q5pa.execute-api.eu-west-1.amazonaws.com/s3upload",
    //         {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //           body: JSON.stringify(payload),
    //         }
    //       );

    //       if (response.ok) {
    //         const data = await response.json();
    //         console.log("File uploaded successfully:", data);
    //       } else {
    //         console.error("File upload failed:", response.statusText);
    //       }
    //     } catch (error) {
    //       console.error("Error uploading file:", error);
    //     }
    //   };
    // } catch (error) {
    //   console.error("Error reading file:", error);
    // }
    // console.log(session.idToken.jwtToken)
    try {
      const response = await fetch(
        "https://kjlkl8q5pa.execute-api.eu-west-1.amazonaws.com/prod/s3upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.idToken.jwtToken}`,
          },
          body: JSON.stringify({
            file: "Testing",
            bucket: "create-entities-uploads-acumen-154654dasfk",
            file_name: "TestingImage.png",
          }),
        }
      );
        console.log(response, 78)
      if (response.ok) {
        const data = await response.json();
        console.log("File uploaded successfully:", data);
      } else {
        console.error("File upload failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  return (
    <div className="Sections">
      <h1>Upload</h1>
      <input onChange={handleFileChange} type="file" />
      <button onClick={() => uploadFile()}>Upload</button>
    </div>
  );
};
const mapStateToProps = (state) => {
  // console.log(state.users, 1);
  return {
    users: state.users.Users || [],
    session: state.session,
    creditsData: state.creditsData,
    email: state?.session?.idToken?.payload?.email || "",
  };
};
export default connect(mapStateToProps, {})(Upload);
