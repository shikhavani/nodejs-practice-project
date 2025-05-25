const validator = require("validator");
const validateSignupData = (req) => {
    const {firstName, emailId, password} = req.body;
    if (!firstName) {
        throw new Error("First Name is required");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid " + emailId);
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please input a strong password");s
    }
}

module.exports = {validateSignupData};