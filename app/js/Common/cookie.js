//
// eventEmiter.js
//

/*

option for cookie:
name - name cookie
value - value cookie
options:
  expires - time life for coolie in seconds
  path - path for cookie
  domain - domain for cookie
  secure - true/false if need send cookie with secure canal

*/

import User from '../Model/user.js';
import Company from '../Model/company.js';

export class Cookie {
  constructor() {
  }

  static getCookies(name) {
    var cookies = {};
    for (let cookie of document.cookie.split('; ')) {
      let [name, value] = cookie.split('=');
      cookies[name] = decodeURIComponent(value);
    }
    return JSON.parse(cookies[name]);
  }

  setCookie(name, value, options = {
    expires: 3600
  }) {
    let expires = options.expires;

    if (typeof expires == 'number' && expires) {
      const d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }

    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(JSON.stringify(value));
      debugger
    let updatedCookie = `${name}=${value}`;

    for (let propName in options) {
      updatedCookie += `; ${propName}`;
      let propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += `=${propValue}`;
      }
    }

    document.cookie = updatedCookie;
  }

  deleteCookie(name) {
    this.setCookie(name, '');
  }

}