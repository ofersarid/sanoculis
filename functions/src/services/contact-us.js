"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _emailjsCom = require("emailjs-com");

const CONFIG = {
  SERVICE_ID: 'rechter_studio',
  USER_ID: 'user_G5XidPOIQwVxbe1dVDS1Q',
  TEMPLATE: 'uppercase_lead'
};

const send = (name, email, phone) => {
  return (0, _emailjsCom.send)(CONFIG.SERVICE_ID, CONFIG.TEMPLATE, {
    'email': email,
    'name': name,
    'phone': phone.toString()
  }, CONFIG.USER_ID);
};

var _default = {
  send
};
exports.default = _default;