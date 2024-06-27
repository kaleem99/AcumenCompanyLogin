// src/Checkout.js
import React, { useEffect, useState, useRef } from "react";
import { getAuthToken, getCheckoutId } from "./PeachPaymentsApi";

// const CLIENT_ID = "9a2771185c6cc8671eccac618e0275";
// const CLIENT_SECRET =
//   "0R1Ajhju03/c1CSZVn49+deMWW7lCfZxkhwvGyowieL3zOuxPYK6mlGKjuq468fjymFULvk/UcE/6d248yyrGg==";
// const MERCHANT_ID = "afdb8c4698d64d319c87a84b3beb0d8d";
// const ENTITY_ID = "8ac7a4c88fc8ac63018fc92d2ce50163";
// const MERCHANT_TRANSACTION_ID = "unique-transaction-id";
// const AMOUNT = 10.0;
// const CURRENCY = "ZAR";
// const NONCE = "UNQ00012345678";
// const SHOPPER_RESULT_URL = "https://mydemostore.com/OrderNo453432";

const Checkout = ({ code, amount, pages, session, creditsData }) => {
  const paymentFormRef = useRef(null);
  const iframeRef = useRef(null);

  const [checkoutId, setCheckoutId] = useState(null);

  useEffect(() => {
    fetch("https://acumencompanylogin.onrender.com/api/auth-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({
      //   clientId: "your_client_id",
      //   clientSecret: "your_client_secret",
      //   merchantId: "your_merchant_id",
      // }),
    })
      .then((response) => response.json())
      .then((data) => {
        getCheckoutId(data.access_token);
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
    const getCheckoutId = (accessToken) => {
      fetch("https://acumencompanylogin.onrender.com/api/create-checkout-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: accessToken,
          amount,
          merchantTransactionId: "OrNo" + code + "ddd",
          currency: "ZAR",
          forceDefaultMethod: true,
          entityId: "8ac7a4c88fc8ac63018fc92d2ce50163",
          nonce: "UNQ00012345678",
          shopperResultUrl: "https://kaleem99.github.io/BlazingGrill-UI/",
          defaultPaymentMethod: "CARD",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setCheckoutId(data.checkoutId);
          console.log(data.checkoutId, data);
        })
        .catch((error) => console.error("Error:", error));
    };
  }, []);

  useEffect(() => {
    const updatedBalance =
      parseInt(creditsData.tenantBalance) + parseInt(pages);
    if (checkoutId && iframeRef.current) {
      console.log(creditsData, session, "CREDITS AND SESSION");
      const iframeDocument = iframeRef.current.contentDocument;
      const iframeContent = `
        <html>
          <body>
            <div id="payment-form" style="height: 100vh"></div>
            <script src="https://sandbox-checkout.peachpayments.com/js/checkout.js"></script>
            <script>
            const testing = async () => {
              // const fetchData = async (token) => {
              const updatedData = ${JSON.stringify(creditsData)};
              updatedData.tenantBalance = ${updatedBalance.toString()};
              const tenantId = ${JSON.stringify(
                session.idToken.payload["custom:tenantId"]
              )};
              try {
                const response = await fetch(
                  'https://kjlkl8q5pa.execute-api.eu-west-1.amazonaws.com/prod/tenant/' + tenantId,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: 'Bearer ${session.idToken.jwtToken}',
                    },
                    body: JSON.stringify(updatedData),
                  }
                );
          
                if (!response.ok) {
                  throw new Error('HTTP error! status: response.status');
                }
          
                const data = await response.json();
                console.log(data);
                // setTimeout(() => {
                //   window.location.reload()
                // }, 2500)
              } catch (error) {
                console.error("Error:", error);
              }
             
            };
              document.addEventListener('DOMContentLoaded', function() {
                const checkout = Checkout.initiate({
                  key: '8ac7a4c88fc8ac63018fc92d2ce50163',
                  checkoutId: '${checkoutId}',
                  options: {
                    theme: {
                      brand: {
                        primary: '#ff0000',
                      },
                      cards: {
                        background: '#00ff00',
                        backgroundHover: '#F3F3F4',
                      },
                    },
                  },
                  events: {
                    onCompleted: (event) => testing(),
                    onCancelled: (event) => console.log("cancelled", event),
                    onExpired: (event) => console.log('Expired:', event),
                  },
                });

                checkout.render('#payment-form');
              });
            </script>
          </body>
        </html>
      `;

      iframeDocument.open();
      iframeDocument.write(iframeContent);
      iframeDocument.close();
    }
  }, [checkoutId]);
  return (
    <div
      id="payment-form"
      // ref={paymentFormRef}
      style={{ height: "100vh", width: "100%" }}
      // dangerouslySetInnerHTML={{
      //   __html: `<html>
      //   <div id="payment-form" style="height: 100vh"></div>
      //   <script src="https://sandbox-checkout.peachpayments.com/js/checkout.js"></script>
      //   <script>
      //     const checkout = Checkout.initiate({
      //       key: "8ac7a4c88fc8ac63018fc92d2ce50163",
      //       checkoutId: "6bf3481943f947b5ba1fce3091afd6d5",
      //       options: {
      //         theme: {
      //           brand: {
      //             primary: "#ff0000",
      //           },
      //           cards: {
      //             background: "#00ff00",
      //             backgroundHover: "#F3F3F4",
      //           },
      //         },
      //       },
      //       events: {
      //         onCompleted: (event) => console.log("Completed:", event),
      //         onCancelled: (event) => console.log("Cancelled:", event),
      //         onExpired: (event) => console.log("Expired:", event),
      //       },
      //     });

      //     checkout.render("#payment-form");
      //   </script>`,
      // }}
    >
      <iframe
        ref={iframeRef}
        width="500px"
        height="600px"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};

export default Checkout;
