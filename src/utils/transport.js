import nodemailer from "nodemailer";
import dotenv from "dotenv";

// import { google } from "googleapis";
// const OAuth2 = google.auth.OAuth2;
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
// const createTransporter = async () => {
//   const oauth2Client = new OAuth2(
//     process.env.CLIENT_ID ||
//       "194743104861-ps69om7crrptt9kdbl1oupae0e17h51u.apps.googleusercontent.com",
//     process.env.CLIENT_SECRET || "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",
//     "https://developers.google.com/oauthplayground"
//   );

//   oauth2Client.setCredentials({
//     refresh_token:
//       process.env.REFRESH_TOKEN ||
//       "1//04hAl62F1r1IyCgYIARAAGAQSNwF-L9IrFT_Sob0lDKWobeU8dknm22R5c_YJ8angr-zK7AjDAuSfrtGpnxCUC05ALKSJGaULyng",
//   });

//   const accessToken = await new Promise((resolve, reject) => {
//     oauth2Client.getAccessToken((err, token) => {
//       if (err) {
//         reject("Failed to create access token :(");
//       }
//       resolve(token);
//     });
//   });

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: process.env.MAIL_USER || "il_matamorosc@unicah.edu",
//       accessToken,
//       clientId: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       refreshToken: process.env.REFRESH_TOKEN,
//     },
//   });

//   return transporter;
// };
const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 466,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.PASSWORD,
  },
});
// const sendEmail = async (emailOptions) => {
//   let emailTransporter = await createTransporter();
//   await emailTransporter.sendMail(emailOptions);
// };
const sendEmail = async (emailOptions) => {
  try {
    await transport.sendMail(emailOptions);
    
  } catch (error) {
    console.log("Failed to send EMAIL");
  }
};
export {
  //  createTransporter,
   sendEmail };
