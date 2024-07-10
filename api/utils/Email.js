const fs = require("fs");
const nodemailer = require("nodemailer");
module.exports = class {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.name.split(" ")[0];
    this.from = process.env.MY_EMAIL;
    this.url = url;
  }
  createTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(subject, text) {
    const html = fs
      .readFileSync(`${__dirname}/../template/welcomeTemp.html`)
      .toString()
      .replace("{{url}}", this.url)
      .replace("{{name}}", this.firstname);
    console.log(html);
    await this.createTransport().sendMail({
      from: this.from,
      subject,
      to: this.to,
      text,
      html,
    });
  }
  sendWelcome() {
    this.send("Welcome", "welcome to my e-commerce");
  }
};
