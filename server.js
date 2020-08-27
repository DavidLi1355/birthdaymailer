const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const mongoose = require("mongoose");
// const config = require("config");
const path = require("path");

app.use(express.static(path.join(__dirname, "/public")));

// view engine
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(
    express.urlencoded({
        extended: true,
    })
);

const uri = process.env.ATLAS_URI;
//const uri = config.get("ATLAS_URI");
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});
const connection = mongoose.connection;

connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.get("/", (req, res) => {
    res.render("home");
});

const isEmpty = require("is-empty");
const validateInput = require("./validation");
const Birthday = require("./birthday_model");

// API end point for adding new birthdays
app.post("/api/add", async (req, res) => {
    // Trim the input
    const body = req.body;

    body.email = !isEmpty(body.email) ? body.email : "";
    body.name = !isEmpty(body.name) ? body.name : "";
    body.month = !isEmpty(body.month) ? body.month : "";
    body.day = !isEmpty(body.day) ? body.day : "";

    body.email = body.email.trim();
    body.name = body.name.trim();
    body.month = body.month.trim();
    body.day = body.day.trim();

    // Validate input
    const { errors, isValid } = validateInput(body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Check if the email already have max number of birthdays
    const numEmail = await Birthday.find({ email: body.email }).exec();
    if (numEmail.length >= 5) {
        return res.status(400).json({ email: "Email have 5 birthday already" });
    }

    // Check if the name already exist under the email
    const dupEmailName = await Birthday.find({
        $and: [{ email: body.email }, { name: body.name }],
    }).exec();
    if (!isEmpty(dupEmailName)) {
        return res.status(400).json({ name: "Name already exist" });
    }

    // Passed all checks, add to database
    const newBirthday = new Birthday({
        email: body.email,
        name: body.name,
        month: body.month,
        day: body.day,
    });
    newBirthday.save().then(() => res.json({ result: "Success" }));
});

// // Send email everyday at 00:05
// const { sendEmail } = require("./emailSender");
// const cron = require("node-cron");
// const tzOffset = require("tz-offset");
// cron.schedule(
//     "0 5 0 * * *",
//     async () => {
//         const currentTime = tzOffset.timeAt(new Date(), "America/Los_Angeles");
//         const currentMonth = currentTime.getMonth() + 1;
//         const currentDay = currentTime.getDate();

//         const todayBirthday = await Birthday.find({
//             $and: [{ month: currentMonth }, { day: currentDay }],
//         }).exec();

//         todayBirthday.forEach((birthday) => {
//             let text = `Today is ${birthday.name}'s birthday!`;
//             sendEmail(birthday.email, text);
//         });
//     },
//     {
//         scheduled: true,
//         timezone: "America/Los_Angeles",
//     }
// );
