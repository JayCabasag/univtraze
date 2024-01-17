import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";

export async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  
    const fileRef = ref(getStorage(), uuid.v4());
    const result = await uploadBytes(fileRef, blob);
  
    // We're done with the blob, close and release it
    blob.close();
  
    return await getDownloadURL(fileRef);
}

export const convertStringDateToISOString = (inputDateString) => {
  // Parse the input date string
  const parts = inputDateString.split('-');
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Create a Date object
  const dateObject = new Date(year, month - 1, day); // Note: months are 0-based in JavaScript

  // Get the ISO string
  const isoString = dateObject.toISOString().split('T')[0];

  return isoString;
};

export const PROVIDER = {
  EMAIL_PASSWORD: 'email/password',
  GOOGLE: 'google',
  FACEBOOK: 'facebook'
}