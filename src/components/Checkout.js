// src/Checkout.js
import React, { useEffect, useState } from "react";
import { getAuthToken, getCheckoutId } from "./PeachPaymentsApi";

const CLIENT_ID = "9a2771185c6cc8671eccac618e0275";
const CLIENT_SECRET =
  "0R1Ajhju03/c1CSZVn49+deMWW7lCfZxkhwvGyowieL3zOuxPYK6mlGKjuq468fjymFULvk/UcE/6d248yyrGg==";
const MERCHANT_ID = "afdb8c4698d64d319c87a84b3beb0d8d";
const ENTITY_ID = "8ac7a4c88fc8ac63018fc92d2ce50163";
const MERCHANT_TRANSACTION_ID = "unique-transaction-id";
const AMOUNT = 10.0;
const CURRENCY = "ZAR";
const NONCE = "UNQ00012345678";
const SHOPPER_RESULT_URL = "https://mydemostore.com/OrderNo453432";

const Checkout = () => {
  const [checkoutId, setCheckoutId] = useState(null);

  useEffect(() => {
    const fetchCheckoutId = async () => {
      try {
        const authToken = await getAuthToken(
          CLIENT_ID,
          CLIENT_SECRET,
          MERCHANT_ID
        );
        const checkoutId = await getCheckoutId(
          authToken,
          ENTITY_ID,
          AMOUNT,
          CURRENCY,
          MERCHANT_TRANSACTION_ID,
          NONCE,
          SHOPPER_RESULT_URL
        );
        setCheckoutId(checkoutId);
      } catch (error) {
        console.error("Failed to initialize checkout:", error);
      }
    };

    fetchCheckoutId();
  }, []);

  useEffect(() => {
    if (checkoutId) {
      const loadScript = () => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://sandbox-checkout.peachpayments.com/js/checkout.js";
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      loadScript()
        .then(() => {
          if (window.Checkout) {
            initializeCheckout();
          } else {
            console.error(
              "Checkout script loaded, but Checkout object is not available."
            );
          }
        })
        .catch((error) => {
          console.error("Failed to load the Checkout script:", error);
        });
    }
  }, [checkoutId]);

  const initializeCheckout = () => {
    const checkout = window.Checkout.initiate({
      key: ENTITY_ID, // Your entity ID
      checkoutId, // Your checkout ID
      options: {
        theme: {
          brand: {
            primary: "#ff0000",
          },
          cards: {
            background: "#00ff00",
            backgroundHover: "#F3F3F4",
          },
        },
      },
      events: {
        onCompleted: (event) => console.log("Completed:", event),
        onCancelled: (event) => console.log("Cancelled:", event),
        onExpired: (event) => console.log("Expired:", event),
      },
    });

    checkout.render("#payment-form");
  };

  return <div id="payment-form" style={{ height: "100vh" }}></div>;
};

export default Checkout;
