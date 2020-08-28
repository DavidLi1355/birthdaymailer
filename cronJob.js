const Birthday = require("./birthday_model");
const { sendEmail } = require("./emailSender");
const mongoose = require("mongoose");
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});
const connection = mongoose.connection;

connection.once("open", async () => {
    const tzOffset = require("tz-offset");
    const currentTime = tzOffset.timeAt(new Date(), "America/Los_Angeles");
    const currentMonth = currentTime.getMonth() + 1;
    const currentDay = currentTime.getDate();

    const todayBirthday = await Birthday.find({
        $and: [{ month: currentMonth }, { day: currentDay }],
    }).exec();

    const sendTodayBirthday = new Promise((resolve, reject) => {
        if (todayBirthday.length === 0) {
            resolve();
        } else {
            todayBirthday.forEach(async (birthday, index, array) => {
                let text = `Today is ${birthday.name}'s birthday!`;
                await sendEmail(birthday.email, text);
                if (index === array.length - 1) resolve();
            });
        }
    });

    sendTodayBirthday.then(() => {
        console.log(
            `LOG: ${currentMonth}/${currentDay} send ${todayBirthday.length} email, DONE!`
        );
        process.exit();
    });
});
