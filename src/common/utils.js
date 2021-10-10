import Constants from './../common/constants'

export const setLocalStorage = (key, value) => {
  let images = getLocalStorage()
  const json = JSON.stringify(value)
  if (images) {
    images[key] = json
  }
  else {
    images = {
      [key]: json
    }
  }
  localStorage.setItem(Constants.LOCAL_STORAGE_KEY, JSON.stringify(images))
}


export const getLocalStorage = (key) => {
  const images = localStorage.getItem(Constants.LOCAL_STORAGE_KEY)
  const img = images && JSON.parse(images)
  if (img && key) {
    const data = JSON.parse(images)
    return data[key] && JSON.parse(data[key])
  }
  return img
}

export const storePhoto = img => {
  const photo_obj = {
      ...img,
      id: img.id || img.name.split('.')[0]
  }
  setLocalStorage(photo_obj.id, photo_obj)
}

/**
 * Convert BASE64 to BLOB
 * @param base64Image Pass Base64 image data to convert into the BLOB
 */
 export const convertBase64ToBlob = (base64Image) => {
  // Split into two parts
  const parts = base64Image.split(';base64,');

  // Hold the content type
  const imageType = parts[0].split(':')[1];

  // Decode Base64 string
  const decodedData = window.atob(parts[1]);

  // Create UNIT8ARRAY of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length);

  // Insert all character code into uInt8Array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }

  // Return BLOB image after conversion
  return new Blob([uInt8Array], { type: imageType });
}