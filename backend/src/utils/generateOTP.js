import otpGenerator from "otp-generator";

const generateOTP = () => {
  return otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

export default generateOTP;
