import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 8080;

// Configuration for allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost.com:3000'
];

// Middleware to handle CORS
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(bodyParser.json());

// Your constants
const CLIENT_ID = "9a2771185c6cc8671eccac618e0275";
const CLIENT_SECRET = "0R1Ajhju03/c1CSZVn49+deMWW7lCfZxkhwvGyowieL3zOuxPYK6mlGKjuq468fjymFULvk/UcE/6d248yyrGg==";
const MERCHANT_ID = "afdb8c4698d64d319c87a84b3beb0d8d";
const ENTITY_ID = "8ac7a4c88fc8ac63018fc92d2ce50163";

// API endpoint to get auth token
app.post("/api/auth-token", async (req, res) => {
  try {
    const response = await fetch("https://sandbox-dashboard.peachpayments.com/api/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        merchantId: MERCHANT_ID,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get auth token");
    }

    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example GET endpoint to test CORS
app.get("/get", (req, res) => {
  res.send({ message: "Hello World" });
});

// API endpoint to create checkout ID
app.post("/api/create-checkout-id", async (req, res) => {
  const {
    accessToken,
    amount,
    merchantTransactionId,
    currency,
    forceDefaultMethod,
    entityId,
    nonce,
    shopperResultUrl,
    defaultPaymentMethod,
  } = req.body;

  // Check if required fields are provided
  if (!accessToken || !amount || !merchantTransactionId || !currency || !entityId || !nonce || !shopperResultUrl || !defaultPaymentMethod) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const response = await fetch("https://testsecure.peachpayments.com/v2/checkout", {
      method: "POST",
      headers: {
        Referer: "https://mydemostore.com",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currency,
        forceDefaultMethod,
        "authentication.entityId": entityId,
        merchantTransactionId,
        amount,
        nonce,
        shopperResultUrl,
        defaultPaymentMethod,
      }),
    });

    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});


// curl --location --request POST 'https://sandbox-dashboard.peachpayments.com/api/oauth/token' --header 'content-type: application/json' --data-raw {"clientId": "9a2771185c6cc8671eccac618e0275","clientSecret": "0R1Ajhju03/c1CSZVn49+deMWW7lCfZxkhwvGyowieL3zOuxPYK6mlGKjuq468fjymFULvk/UcE/6d248yyrGg==","merchantId": "afdb8c4698d64d319c87a84b3beb0d8d"}'
// curl --location --request POST 'https://testsecure.peachpayments.com/api/oauth/token' \
// --header 'Content-Type: application/json' \
// --header 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMjEtMDktMDYifQ.eyJlbnRpdHlJRCI6ImFmZGI4YzQ2OThkNjRkMzE5Yzg3YTg0YjNiZWIwZDhkIiwicGFydG5lciI6ZmFsc2UsInNpZCI6IjY5MmZhMjZjYzI2MDI0N2Y5ZGIzIiwibWVyY2hhbnRJZCI6ImFmZGI4YzQ2OThkNjRkMzE5Yzg3YTg0YjNiZWIwZDhkIiwiaWF0IjoxNzE3NDEzNTA0LCJuYmYiOjE3MTc0MTM1MDQsImV4cCI6MTcxNzQyNzkwNCwiYXVkIjoiaHR0cHM6Ly9tMm0ucGVhY2hwYXltZW50cy5jb20iLCJpc3MiOiJodHRwczovL3NhbmRib3gtc2VydmljZXMucHBheS5pby8iLCJzdWIiOiI5YTI3NzExODVjNmNjODY3MWVjY2FjNjE4ZTAyNzUifQ.cWcLBhaldVTB0ZHgNBGPJ9YAaDd8ucMl67voYGbgSm5TEBv2VDjYGiD-CU2Bhk6MqEa4FzWK2juvsxEAxVE0ipTwdWTvyjX8n6CEqNazo4_bzvrRC-hvxizRKsMYk-yXwi6vmaguRQu2tubByRQL2C_Eg5FgKyagLXZ7-GnvWOsqFnn2l1Z_4qu7bIcWibYTGZwFMruNF40IndCfiDVz4OJjiYzAZRffpG_j1ChNivvv9-UkokN_3wiXuw2GmES4_7SToj7DfWGJ1m9ml8xENJcTW_TVpqE3Mq4h8yO9rhFml4TfXOyZlmh20EEGD3lRo_bQXyQnTmrOPQ2tsXjjO2iMkWdR6XMvV0Y8jR3XaL66-Ux_BrcFGERFPmJxGT6kJBQ8t7VrhLAhT7M2oV2NnuEGh9ct53wc4cfUwVtniPdmpgZ_LI9kz9mI-cLACIr6umjA640ld4aXEQ6Rg8xCMiJRIyIQb6oGoWq36h86VA2naK-vbowtQ_L6Sty7JHXst6dNrlDzrZgig4wijrHDVIkhuRNKDSII2toJ5gxQoKkdOj22F_VHohlgQRNrIiKUfHb4uGRDhAFToeZFUeXwfaxkAfccSrg6418TedXc02zSwt9EDHgwCsA9v16a8NRNkht48RpqlrnyjmqnirmFBem7hzUQGgaPScFSIJqGZLE' \
// --data-raw '{
//     "clientId": "9a2771185c6cc8671eccac618e0275",
//     "clientSecret": "0R1Ajhju03/c1CSZVn49+deMWW7lCfZxkhwvGyowieL3zOuxPYK6mlGKjuq468fjymFULvk/UcE/6d248yyrGg==",
//     "merchantId": "afdb8c4698d64d319c87a84b3beb0d8d"
// }'

// curl --location --request POST 'http://localhost:8080/api/auth-token' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "clientId": "your_client_id",
//     "clientSecret": "your_client_secret",
//     "merchantId": "your_merchant_id"
// }'
// curl --request POST \
//      --url http://localhost:8080/api/create-checkout-id \
//      --header 'Content-Type: application/json' \
//      --data '{
//        "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMjEtMDktMDYifQ.eyJlbnRpdHlJRCI6ImFmZGI4YzQ2OThkNjRkMzE5Yzg3YTg0YjNiZWIwZDhkIiwicGFydG5lciI6ZmFsc2UsInNpZCI6IjQwOTE2NjFlZGM0MTQyNDdjNjY4IiwibWVyY2hhbnRJZCI6ImFmZGI4YzQ2OThkNjRkMzE5Yzg3YTg0YjNiZWIwZDhkIiwiaWF0IjoxNzE3NDE4NzU2LCJuYmYiOjE3MTc0MTg3NTYsImV4cCI6MTcxNzQzMzE1NiwiYXVkIjoiaHR0cHM6Ly9tMm0ucGVhY2hwYXltZW50cy5jb20iLCJpc3MiOiJodHRwczovL3NhbmRib3gtc2VydmljZXMucHBheS5pby8iLCJzdWIiOiI5YTI3NzExODVjNmNjODY3MWVjY2FjNjE4ZTAyNzUifQ.ZqiWSvjg3lFuQR8iV0xBo9hZ2495zH9ORUsSmjwSC0W_cBUGSjsJNQbMXIMlm5jmUhA2Ab1vchf5tme25XDYaeYdnbV4qbUm_TGD4zPxBpf26pr5uqQsVLK85aG8zbWAz1FRQc7Zbff4zNiqGAKL0PupHYJC6KTuVIJgnsprqinNc0UlOSwIPksdkGWARdvAuz7q4_xf64WpJIj9FfAfKXsIAlfNMP49CQ9QYOulSqPQLVVgJH2OyuTY7VGjp6wBBOINgR77b0RzbutqT8i6usxw1uEgIyPSioGmt9d-AAmjU4YbkWVqO65QbUB4ogE1vFXO_9R-A_ROFq2qAECIEdyBg1albNxAJlE9gNPJGun4-48QE8QxhmS1mv3ZRUVpG_CErh0zdBH-asJ58Q7Yh3Y2rJAkWYu2AqrJe3uPMtb5Zs_kFc-cLqi5cyktn5Fui3BK9PKW6GXW_CXDTf97IvMbi2_8kxP4b2KbzMPAZZWNbTOMtjwc-FnjIgYGqdkRFShhqhy0I80IfGYLJCLBseRBV6CdLgc_tUfPjX5DKBEAY7H2Sar7ankoRfT9rZ98uD0tHBQtuHiFQF_RZ6SEgpMLPISzxAImAC2BJD-kt0T9zWreiIrc_BtuAPyhMbyLOnZOfSWZ8ZUPn8naCbqBosSWbgho15pAZLKUCupmuwI",
//        "amount": 300,
//        "merchantTransactionId": "OrderNo4534df12",
//        "currency": "ZAR",
//        "forceDefaultMethod": true,
//        "entityId": "8ac7a4c88fc8ac63018fc92d2ce50163",
//        "nonce": "UNQ00012345678",
//        "shopperResultUrl": "https://mydemostore.com/OrderNo453432",
//        "defaultPaymentMethod": "CARD"
//      }'

// i-01ad1e72d82ec473c EC2 instance id
// public ip 3.248.252.190
