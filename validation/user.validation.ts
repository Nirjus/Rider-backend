export function emailValidate(emailString: string) {
  if (!emailString) throw new Error("Please provide email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailString)) {
    throw new Error("Please enter a valid email address.");
  }
  return true;
}

export function passwordValidation(passwordString: string) {
  if (!passwordString) throw new Error("Please provide password");
  if (passwordString.length < 6)
    throw new Error("Password length must be atlist 6 character");
  if (!/[a-z]/.test(passwordString)) {
    throw new Error("Password must contain at least one lowercase letter.");
  }
  if (!/[A-Z]/.test(passwordString)) {
    throw new Error("Password must contain at least one uppercase letter.");
  }
  if (!/[0-9]/.test(passwordString)) {
    throw new Error("Password must contain at least one number.");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordString)) {
    throw new Error("Password must contain at least one special character.");
  }
  return true;
}

export function nameValidation(nameString: string) {
  if (!nameString) throw new Error("Please provide name");
  if (nameString.length < 3) throw new Error("Name must be 3 character long");
  if (nameString.length > 20)
    throw new Error("Name must be less than 20 character");
  if (nameString.startsWith("_"))
    throw new Error("name can not be starts with underscore");
  if (nameString.startsWith("/")) throw new Error("Name can not contain slash");
  if (!/^[a-zA-Z0-9_ ]+$/.test(nameString))
    throw new Error("name only contains letters, number and underscore");
  return true;
}
