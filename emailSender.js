const nodemailer = require("nodemailer");
// const config = require("config");
// const senderEmail = config.get("senderEmail");
// const senderPassword = config.get("senderPassword");
const senderEmail = process.env.senderEmail;
const senderPassword = process.env.senderPassword;
const subject = "Birthday Reminder";
module.exports = {
    sendEmail: async (to, text) => {
        try {
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: senderEmail,
                    pass: senderPassword,
                },
            });

            const message = {
                from: `Birthday Mailer <${senderEmail}>`,
                to,
                subject,
                text,
            };

            transporter.sendMail(message, () => {});
        } catch (e) {
            // handle errors here
        }
    },
};
