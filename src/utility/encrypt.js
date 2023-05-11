import bcrypt from "bcrypt"

export async function encryptPassword(password) {
    const saltRounds = 10 
    return bcrypt.hash(password, saltRounds);
  // Store hash in DB instead of password.
}

export async function unencryptPassword(enteredPassword, storedPasswordHash) {
    return bcrypt.compare(enteredPassword, storedPasswordHash);
}