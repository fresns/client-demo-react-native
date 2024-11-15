/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

/**
 * base64 encode
 * @param str - The string to be encoded
 * @returns {string} - The base64 encoded string
 */
export function base64_encode(str: string): string {
  let c1: number, c2: number, c3: number;
  const base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let i = 0;
  const len = str.length;
  let strin = "";

  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i === len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
      strin += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i === len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
      strin += base64EncodeChars.charAt((c2 & 0xf) << 2);
      strin += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    strin += base64EncodeChars.charAt(c1 >> 2);
    strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
    strin += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
    strin += base64EncodeChars.charAt(c3 & 0x3f);
  }
  return strin;
}

/**
 * base64 decode
 * @param input - The base64 encoded string
 * @returns {string} - The decoded string
 */
export function base64_decode(input: string): string {
  const base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  let chr1: number, chr2: number, chr3: number;
  let enc1: number, enc2: number, enc3: number, enc4: number;
  let i = 0;

  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  while (i < input.length) {
    enc1 = base64EncodeChars.indexOf(input.charAt(i++));
    enc2 = base64EncodeChars.indexOf(input.charAt(i++));
    enc3 = base64EncodeChars.indexOf(input.charAt(i++));
    enc4 = base64EncodeChars.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output += String.fromCharCode(chr1);
    if (enc3 !== 64) {
      output += String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output += String.fromCharCode(chr3);
    }
  }
  return utf8_decode(output);
}

/**
 * utf8 decode
 * @param utfText - The UTF-8 encoded string
 * @returns {string} - The decoded string
 */
export function utf8_decode(utfText: string): string {
  let string = "";
  let i = 0;
  let c = 0;
  let c1 = 0;
  let c2 = 0;

  while (i < utfText.length) {
    c = utfText.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if (c > 191 && c < 224) {
      c1 = utfText.charCodeAt(i + 1);
      string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
      i += 2;
    } else {
      c1 = utfText.charCodeAt(i + 1);
      c2 = utfText.charCodeAt(i + 2);
      string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
      i += 3;
    }
  }
  return string;
}
