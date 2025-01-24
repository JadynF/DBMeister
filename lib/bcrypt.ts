const bcrypt = require('bcrypt');

//Takes a password (string) as an input and hashes it with bcrypt. Returns hashed password.
export const hashPassword = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPass = await bcrypt.hash(password, salt);

    return hashedPass;
};

//Compares the two passwords. Extracts salt from realPassword, applies to inPassword and compares strings.
export const comparePasswords = async (inPassword: string, realPassword: string) => {
    let passwordsMatched = await bcrypt.compare(inPassword, realPassword);
    return passwordsMatched;
};