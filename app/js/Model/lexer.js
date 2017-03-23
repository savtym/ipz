//
// lexer.js
//

import Token from './token';

const errorMessage = 'error';
const errorMessageComment = `comment don't close`;
const errorMessageToken = 'wrong token';

export default class Lexer {
  constructor() {
  }

  static parsing(text) {
    let buf = '';
    let lexer = [];
    let counterRow = 1;
    let lastIndex = 0;
    const lenghtText = text.length;

    for (let i = 0; i < lenghtText - 1; i++) {

      //comments
      if (i < lenghtText - 1 && `${text[i]}${text[i+1]}` === '(*') {
        while (`${text[i]}${text[i+1]}` !== '*)') {
          if (i === lenghtText - 1) {
            lexer.push(this._createRow(errorMessage, errorMessageComment, counterRow));
            debugger
            break;
          }
          if (text[i] === '\n') {
            counterRow++;
          }
          i++;
        }
        i++;
        lastIndex = i;
        continue;
      }

      if (!this._findInArray(Token.tabulation, text[i]) && !Token.reservedCharacters[text[i]]) {
        buf += text[i];
        if (i < lenghtText - 2) {
          continue;
        }
        buf += text[i + 1];
      }

      if (text[i] === '\n') {
        counterRow++;
      }

      //key words
      if (Token.reservedKeyWords[buf]) {
        lexer.push(this._createRow(Token.reservedKeyWords[buf], buf, counterRow));
      } 

      //const
      else if (Token.reservedConsts[buf]) {
        lexer.push(this._createRow(Token.reservedKeyWords[buf], buf, counterRow));
      } 

      //identifier
      else if (Token.reservedIdentifiers[buf]) {
        lexer.push(this._createRow(Token.reservedIdentifiers[buf], buf, counterRow));
      } 

      //new const || identifier
      else if (lastIndex !== (i - 1)) {
        this._newValue(buf, lexer, counterRow);
      }

      //one symbol
      if (Token.reservedCharacters[text[i]]) {
        lexer.push(this._createRow(Token.reservedCharacters[text[i]], text[i], counterRow));
      } 

      buf = '';
      lastIndex = i;
    }

    return lexer;
  }

  static _newValue(token, lexer, counterRow) {
    if (Token.checkIdentifier(token)) {
      Token.reservedIdentifiers = token;
      lexer.push(this._createRow(Token.reservedIdentifiers[token], token, counterRow));
    } 
    else if (Token.checkConst(token)) {
      Token.reservedConsts = token;
      lexer.push(this._createRow(Token.reservedConsts[token], token, counterRow));
    }
    else {
      lexer.push(this._createRow(errorMessage, `${errorMessageToken}: ${token}`, counterRow));
    }
  }

  static _createRow(code, string, counterRow) {
    return {
      'code': code, 
      'token': string,
      'row': counterRow
    };
  }

  static _findInArray(array, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === value) {
        return true;
      }
    }
    return false;
  }

}