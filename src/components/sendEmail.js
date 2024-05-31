import emailjs from "emailjs-com";

const SendEmailOrder = (
  name,

  userEmail
) => {
  const templateParams = {
    name: name,
    from_name: "The Blazing Grill",
    subject: "Hello from React App",
    message: `Your organisation has signed you up to use Acumen3 unique services.`,

    to_email: [userEmail], // Replace with the recipient email address
  };
  emailjs
    .send(
      "service_ji3wqqb",
      "template_iozp1aa",
      templateParams,
      "v41Nb4FhAqVgO7UYx"
    )
    .then((response) => {
      console.log("Email sent successfully!", response.status, response.text);
    })
    .catch((error) => {
      console.error("Failed to send email:", error.text);
    });
};

export default SendEmailOrder;
