import {AES, enc} from 'crypto-js';

export function encryptData(data) {
	return AES.encrypt(data, `${process.env.SECRET_KEY}`).toString();
}

export function decryptData(encryptedData) {
	return AES.decrypt(encryptedData, `${process.env.SECRET_KEY}`).toString(enc.Utf8);
}
