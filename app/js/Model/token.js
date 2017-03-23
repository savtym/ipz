//
// token.js
//

const tabulation = [
  '\t',
  '\n',
  '\r',
  ' '
];

const reservedCharacters = {
  ':' : ':'.charCodeAt(0),
  ';' : ';'.charCodeAt(0),
  '=' : '='.charCodeAt(0),
  ',' : ','.charCodeAt(0)
};

const reservedKeyWords = {
  'PROGRAM' : 401,
  'LABEL'   : 402,
  'BEGIN'   : 403,
  'GOTO'    : 404,
  'ENDIF'   : 405,
  'IF'      : 406,
  'THEN'    : 407,
  'ELSE'    : 408,
  'END'     : 409
};

let reservedConsts = {};
let reservedIdentifiers = {};

const reservedConstsNumber = 501;
const reservedIdentifiersNumber = 1001;

export default class Token {
  constructor() {
  }

  /* getters */

  static get reservedCharacters() {
    return reservedCharacters;
  }

  static get reservedKeyWords() {
    return reservedKeyWords;
  }

  static get reservedConsts() {
    return reservedConsts;
  }

  static get reservedIdentifiers() {
    return reservedIdentifiers;
  }

  static get tabulation() {
    return tabulation;
  }


  /* setters */

  static set reservedConsts(token) {
    if (this.checkConst(token)) {
      reservedConsts[token] = Object.keys(reservedConsts).length + reservedIdentifiersNumber;
    }
  }

  static set reservedIdentifiers(token) {
    if (this.checkIdentifier(token)) {
      reservedIdentifiers[token] = Object.keys(reservedIdentifiers).length + reservedConstsNumber;
    }
  }


  /* common */

  static checkConst(token) {
    for (var i = 0; i < token.length; i++) {
      if (token[i].charCodeAt(0) < 48 || 57 < token[i].charCodeAt(0)) {
        return false;
      }
    }
    return true;
  }

  static checkIdentifier(token) {
    for (var i = 0; i < token.length; i++) {
      if (token[i].charCodeAt(0) < 65 || 95 < token[i].charCodeAt(0)) {
        return false;
      }
    }
    return true;
  }
}