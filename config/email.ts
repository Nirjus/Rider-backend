import { MailtrapClient } from "mailtrap";
import path from "path";
import ejs from "ejs";
import { mailtrapToken } from "../secret";

const client = new MailtrapClient({
  token: mailtrapToken,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Rider",
};

async function sendEmail(
  recipients: Array<{ email: string }>,
  subject: string,
  templateName: string,
  templateData: any
) {
  const templatePath = path.join(
    __dirname,
    "../email-template",
    `${templateName}.ejs`
  );
  const html: any = await ejs.renderFile(templatePath, templateData);
  await client
    .send({
      from: sender,
      to: recipients,
      subject: subject,
      html: html,
      category: "Integration Test",
    })
    .then(console.log)
    .catch(console.error);
}
export default sendEmail;
