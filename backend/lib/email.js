import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      // The free tier requires using this address until you verify a custom domain
      from: "CinemaLux <onboarding@resend.dev>", 
      to: [to],
      subject: subject,
      html: html,
    });
    
    console.log("Email sent successfully via Resend API:", data.id);
    return data;
  } catch (error) {
    console.error("Resend API Error details:", error);
    throw error;
  }
};
