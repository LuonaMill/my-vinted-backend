//*  Je prépare une fonction pour convertir mes buffer en base64

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

module.exports = convertToBase64; //!
