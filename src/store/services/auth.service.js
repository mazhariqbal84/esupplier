
import CryptoJS from "crypto-js";

const AuthService = {
  hasPermission() {
    const encryptedValue = sessionStorage.getItem("permission");
    if (encryptedValue) {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, "secretKey");
      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedText);
    }
    return null;
  },
};

export default AuthService;
