const Birthday = require("./birthday_model");
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const { sendEmail } = require("./emailSender");
// const tzOffset = require("tz-offset");

// const currentTime = tzOffset.timeAt(new Date(), "America/Los_Angeles");
// const currentMonth = currentTime.getMonth() + 1;
// const currentDay = currentTime.getDate();

// const todayBirthday = await Birthday.find({
//     $and: [{ month: currentMonth }, { day: currentDay }],
// }).exec();

// todayBirthday.forEach((birthday) => {
//     let text = `Today is ${birthday.name}'s birthday!`;
//     sendEmail(birthday.email, text);
// });

const test = await Birthday.find({
    $and: [{ month: 1 }, { day: 1 }],
}).exec();
let text = `Today is ${birthday.name}'s birthday!`;
sendEmail(test.email);
