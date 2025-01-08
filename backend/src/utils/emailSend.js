import nodemailer from "nodemailer";

const sendEmail = async (OTP, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or another service
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email, // Your email to receive messages
    subject: `kishan sevice`,
    text: ` Your OTP is ${OTP}`,
  };

  const otpSend = await transporter.sendMail(mailOptions);
  return otpSend;
};

export default sendEmail;
