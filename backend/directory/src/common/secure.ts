import { compare, genSalt, hash } from 'bcrypt';
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from 'crypto';
import { EncryptionAlgorithm, EncryptionIVLength, EncryptionKey, HashSalt, HashSaltRounds } from './constants';

export const encrypt = function (text) {
  try {
    const iv = randomBytes(EncryptionIVLength);
    const cipher = createCipheriv(EncryptionAlgorithm, Buffer.from(EncryptionKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const decrypt = function (text) {
  try {
    const iv = Buffer.from(text.split(':')[0], 'hex');
    const encryptedText = Buffer.from(text.split(':').pop(), 'hex');
    const decipher = createDecipheriv(EncryptionAlgorithm, Buffer.from(EncryptionKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.log(error);
    return '';
  }
};

//bcrypt for passwords and crypto for non passwords fields
export const generateDataHash = function (message: string) {
  try {
    return createHmac('sha256', HashSalt).update(message).digest('hex');
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const generatePasswordHash = async function (message) {
  try {
    const salt = await genSalt(HashSaltRounds);
    return await hash(message, salt);
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const checkHash = async function (originalData, hash) {
  try {
    return await compare(originalData, hash);
  } catch (error) {
    console.log(error);
    return '';
  }
};

