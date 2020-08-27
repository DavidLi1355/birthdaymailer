const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateInput(data) {
    let errors = {};

    // Email checks
    if (validator.isEmpty(data.email)) {
        errors.email = "Email is required";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    // Name checks
    if (validator.isEmpty(data.name)) {
        errors.name = "Name is required";
    }

    // Month checks
    if (validator.isEmpty(data.month)) {
        errors.month = "Month is required";
    } else if (!validator.isInt(data.month, { min: 1, max: 12 })) {
        errors.month = "Month is invalid";
    }

    // Day checks
    if (validator.isEmpty(data.day)) {
        errors.day = "Day is required";
    } else if (!validator.isInt(data.day, { min: 1, max: 31 })) {
        errors.day = "Day is invalid";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
