const mongoose = require("mongoose");

const BirthdaySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    day: {
        type: Number,
        required: true,
    },
});

const Birthday = mongoose.model("birthdays", BirthdaySchema);
module.exports = Birthday;
