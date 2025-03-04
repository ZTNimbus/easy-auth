import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

export const mailer = Nodemailer.createTransport(
  MailtrapTransport({
    token: process.env.MAILTRAP_TOKEN,
  })
);

export const sender = {
  address: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};
