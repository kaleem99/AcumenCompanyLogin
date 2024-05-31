// src/peachPaymentsApi.js

const PEACH_PAYMENTS_AUTH_URL =
  "https://testsecure.peachpayments.com/api/oauth/token"; // Adjust the URL as necessary
const PEACH_PAYMENTS_CHECKOUT_URL =
  "https://testsecure.peachpayments.com/v2/checkout";

const getAuthToken = async (clientId, clientSecret, merchantId) => {
  const response = await fetch(PEACH_PAYMENTS_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientId,
      clientSecret,
      merchantId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get auth token");
  }

  const data = await response.json();
  console.log(data.access_token, data, 26);
  return data.access_token;
};

const getCheckoutId = async (
  authToken,
  entityId,
  amount,
  currency,
  merchantTransactionId,
  nonce,
  shopperResultUrl
) => {
  const response = await fetch(PEACH_PAYMENTS_CHECKOUT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      currency,
      amount,
      merchantTransactionId,
      "authentication.entityId": entityId,
      defaultPaymentMethod: "CARD",
      nonce,
      shopperResultUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get checkout ID");
  }

  const data = await response.json();
  console.log(data.checkoutId, data, 61);
  return data.checkoutId;
};

export { getAuthToken, getCheckoutId };
