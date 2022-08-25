// To eventually be added into the main file.
require("dotenv").config()
const gram = require("telegram")
const fs = require("fs")
const input = require("input")

const session = new gram.sessions.StringSession("")
const Telegram = new gram.TelegramClient(session, Number(process.env.TELEGRAM_APP_ID), process.env.TELEGRAM_APP_HASH);
(async () => {
await Telegram.start({
    phoneNumber: async () => await input.text("Please enter your phone number > "),
    password: async () => await input.text("Please enter your 2FA password > "),
    phoneCode: async () => await input.text("Please enter the code you recieved >"),
    onError: async (err) => {throw err}
});
await fs.writeFileSync("./tokens/TELEGRAM_TOKEN",Telegram.session.save());
console.log("Authenticated to Telegram");

(async () => {
    const resp = await input.text("Do you have Premium? (y == yes/n == no) > ")
    if (resp.toLowerCase() == "y") {
        await fs.writeFileSync("./tokens/TELEGRAM_PREMIUM_TOKEN","true") // We just check for the file.
    }
})()

// Close the connection after authenticating
Telegram.destroy()
})();