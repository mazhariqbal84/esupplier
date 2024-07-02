const ID_TOKEN_KEY = "id_token";
import CryptoJS from "crypto-js";

export const getToken = () => {
  const encryptedToken = window.localStorage.getItem(ID_TOKEN_KEY);
  if (encryptedToken) {
    const decrypted = CryptoJS.AES.decrypt(
      encryptedToken,
      "secretKey"
    ).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
  return null;
};

export const getUser = () => {
  const encryptedUser = window.localStorage.getItem("users");
  if (encryptedUser) {
    const decrypted = CryptoJS.AES.decrypt(encryptedUser, "secretKey").toString(
      CryptoJS.enc.Utf8
    );
    return JSON.parse(decrypted);
  }
  return null;
};

export const saveToken = (token) => {
  const encrypted = CryptoJS.AES.encrypt(token, "secretKey").toString();
  window.localStorage.setItem(ID_TOKEN_KEY, encrypted);
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

export const destroyUser = () => {
  window.localStorage.removeItem("users");
};

export default { getToken, saveToken, destroyToken, getUser, destroyUser };
