const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let whatsappClient = null;
let isWhatsAppReady = false;

let initializingPromise = null;

async function initializeWhatsApp() {
  return new Promise((resolve, reject) => {

    if (whatsappClient && isWhatsAppReady) {
      return resolve(whatsappClient);
    }

    if (initializingPromise) {
      return initializingPromise.then(resolve).catch(reject);
    }

    initializingPromise = new Promise((res, rej) => {
      whatsappClient = new Client({
        authStrategy: new LocalAuth({
          clientId: "leave-management-system"
        }),
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      whatsappClient.on('qr', (qr) => {
        console.log('📱 Scan QR code');
        qrcode.generate(qr, { small: true });
      });

      whatsappClient.on('ready', () => {
        console.log('✅ WhatsApp client is ready!');
        isWhatsAppReady = true;
        res(whatsappClient);
      });

      whatsappClient.on('auth_failure', (msg) => {
        console.error('❌ Auth failed:', msg);
        rej(msg);
      });

      whatsappClient.on('disconnected', () => {
        console.log('⚠️ WhatsApp disconnected');
        isWhatsAppReady = false;
        initializingPromise = null; 
      });

      whatsappClient.initialize();
    });

    initializingPromise.then(resolve).catch(reject);
  });
}

async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    if (!isWhatsAppReady) {
      console.log(`WhatsApp not ready, initializing...`);
      await initializeWhatsApp();
    }
    
    if (!phoneNumber) {
      console.log(`No phone number provided`);
      return null;
    }
    
    let formattedNumber = phoneNumber.toString().replace(/\D/g, '');
    
    if (formattedNumber.length === 10) {
      formattedNumber = `91${formattedNumber}`;
    }
    
    const whatsappId = `${formattedNumber}@c.us`;
    
    const result = await whatsappClient.sendMessage(whatsappId, message);
    console.log(`✅ WhatsApp message sent to ${phoneNumber}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send WhatsApp message to ${phoneNumber}:`, error.message);
    return null;
  }
}

async function sendWhatsAppFile(phoneNumber, buffer, filename) {
  try {
    if (!isWhatsAppReady) {
      console.log(`WhatsApp not ready, initializing...`);
      await initializeWhatsApp();
    }
    
    if (!phoneNumber) {
      console.log(`No phone number provided`);
      return null;
    }
    
    let formattedNumber = phoneNumber.toString().replace(/\D/g, '');
    
    if (formattedNumber.length === 10) {
      formattedNumber = `91${formattedNumber}`;
    }
    
    const whatsappId = `${formattedNumber}@c.us`;
    
    const media = new MessageMedia(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer.toString('base64'),
      filename
    );
    
    const result = await whatsappClient.sendMessage(whatsappId, media);
    console.log(`Excel file sent to ${phoneNumber}`);
    return result;
  } catch (error) {
    console.error(`Failed to send Excel file to ${phoneNumber}:`, error.message);
    return null;
  }
}

module.exports = { initializeWhatsApp, sendWhatsAppMessage, sendWhatsAppFile };