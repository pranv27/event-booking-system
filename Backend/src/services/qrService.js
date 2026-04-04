const qrcode = require('qrcode');

const generateQrCode = async (data) => {
  try {
    const qrCodeDataUrl = await qrcode.toDataURL(JSON.stringify(data));
    // In a real application, you might save this to a file and return the path,
    // or store it in a cloud storage and return the URL.
    // For now, we return the data URL directly.
    return qrCodeDataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Could not generate QR code');
  }
};

module.exports = { generateQrCode };
