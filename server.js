const path = require('path');
const express = require('express');
const minify = require('express-minify');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

//Setting up a KEY and an initializition vector with the crypto library and creating variable to keep the authtag.
const SECRET_KEY = crypto.randomBytes(32);
const IV = crypto.randomBytes(16);
let authTag;

//Just setting up server to be able to use front-end and handle data received and sent in json format.
app.use(minify());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//Setting up landing page
app.get('/', (req, res) => {
  res.render('index');
});

//Recieve post request for encryption
app.post('/encrypt', (req, res) => {
  const body = { ...req.body };
  const cipherText = aesEncrypt(body.plaintext);
  res.send(JSON.stringify({ encryptedMessage: cipherText }));
  res.end();
});

//Recieve post request for decryption
app.post('/decrypt', (req, res) => {
  const body = { ...req.body };
  const plaintext = aesDecrypt(body.cipher);
  res.send(JSON.stringify({ plaintext }));
  res.end();
});

//Encryption function
const aesEncrypt = plaintext => {
  //Sets up a cipher with the alogrithm aes-256-gcm, with the key and the iv
  let cipher = crypto.createCipheriv('aes-256-gcm', SECRET_KEY, IV);
  //Encrypts the message, from utf8 to buffer with base64
  let encryptedMessage = cipher.update(plaintext, 'utf8', 'base64');
  //Adds cipher final
  encryptedMessage += cipher.final('base64');
  //Create authentication tag to be able to decrypt, and saves it in the variable.
  authTag = cipher.getAuthTag();
  //Return encrypted message
  return encryptedMessage;
}

//Decryption function
const aesDecrypt = cipher => {
  //Creates a decipher, with the same arguments as in the encryption
  let decipher = crypto.createDecipheriv('aes-256-gcm', SECRET_KEY, IV);
  //Decrypt the message from base64 to utf8
  let decrypt = decipher.update(cipher, 'base64', 'utf8');
  //Sets up the authtag to be able to finialize the deciphering
  decipher.setAuthTag(authTag);
  //returns decrypted message
  return decrypt += decipher.final('utf8');
}

//Setting up server to listen to PORT: 3000, test code with command 'node server.js' and visit localhost:3000
app.listen(PORT, (e) => {
  console.log(`Server is listening to PORT: ${PORT}`);
});