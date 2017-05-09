//
// syntax.js
//

import Token from './token.js';
import Lexer from './lexer.js';

const startProgramToken = Token.reservedKeyWords['PROGRAM'];
const declarationToken = Token.reservedKeyWords['LABEL'];
const beginToken = Token.reservedKeyWords['BEGIN'];
const gotoToken = Token.reservedKeyWords['GOTO'];
const ifToken = Token.reservedKeyWords['IF'];
const thenToken = Token.reservedKeyWords['THEN'];
const elseToken = Token.reservedKeyWords['ELSE'];
const endIfToken = Token.reservedKeyWords['ENDIF'];
const endToken = Token.reservedKeyWords['END'];

const minLengthTokens = 5;

let declarationsLabel = [];

let error = false;

let checkIfCounter = 0;
let endProgram = false;

const errorNotFoundEND = 'Not found END.';

export default class Syntax {

  constructor() {
  }

  static analyze(code) {
    let length = code.length;

    // if code program beginToken the token 'PROGRAM', identifier and token ';' <program> --> PROGRAM <procedure-identifier> ;
    if (length > minLengthTokens
      && code[0].code === startProgramToken
      && Token.isConstNumber(code[1].code)
      && code[2].code === Token.reservedCharacters[';']) {

      // <declarations>
      let i = this._isDeclarations(code, 3, length);

      // beginToken program
      if (code[i++].code === beginToken) {

        // <statements-list> --> <statement> <statements-list> | <empty>
        this._statementsList(code, i, length);

        if (!endProgram) {
          code.push(Lexer.createRow(-1, errorNotFoundEND, length, true));
        }

      } else {
        code[i].syntax = true;
      }
    }
    endProgram = false;
  }

  // <declarations> --> <label-declarations>
  static _isDeclarations(code, i, length) {

    // <declarations> --> <label-declarations>
    if (code[i].code === declarationToken) {
      i = this._unsignedInteger(code, ++i, length, true);
    }

    return i;
  }

  // <unsigned-integer> <labels-list>; | <empty>
  // <labels-list> --> , <unsigned-integer> <labels-list> | <empty>
  static _unsignedInteger(code, i, length, isLabel = false) {

    // <unsigned-integer>, <labels-list>; <empty>
    if (Token.isIdentifiersNumber(code[i].code)) {

      if (isLabel) {
        declarationsLabel.push(code[i].code);
      }

      // , <labels-list>
      if (length > i + 1
        && code[++i].code === Token.reservedCharacters[',']) {
        i = this._unsignedInteger(code, ++i, length, isLabel);
      } else {
        // ; <empty>
        if (code[i].code !== Token.reservedCharacters[';']) {
          code[i].syntax = true;
        }
        i++;
      }

    }

    return i;
  }


  // <statements-list> END
  // <statements-list> --> <statement> <statements-list>
  static _statementsList(code, i, length) {

    for (; i < length - 1; i++) {

      // <condition-statement> ENDIF ;
      i = this._conditionStatement(code, i, length);

      // <statement> --> <unsigned-integer> : <statement>
      if ((Token.isIdentifiersNumber(code[i].code)
        && declarationsLabel.includes(code[i].code)
        && i < length - 2
        && code[++i].code === Token.reservedCharacters[':'])

        // GOTO <unsigned-integer> ;
        || (code[i].code === gotoToken
          && i < length - 3
          && code[++i].code === Token.reservedCharacters[':']
          && declarationsLabel.includes(code[++i].code)
          && code[++i].code === Token.reservedCharacters[';'])

        // ;
        || code[i].code === Token.reservedCharacters[';']) {
        continue;
      }

      // ENDIF ;
      else if (code[i].code === endIfToken
        && code[++i].code === Token.reservedCharacters[';']) {
        if (checkIfCounter > 0) {
          checkIfCounter--;
          i++;
          break;
        } else {
          code[i].syntax = true;
        }
      }

      //END
      else if (code[i].code === endToken) {
        if (checkIfCounter > 0) {
          code[i].syntax = true;
        }
        endProgram = true;
        break;
      }

      else {
        code[i].syntax = true;
      }

    }

    return i;
  }

  // <incomplete-condition-statement><alternative-part>
  // <incomplete-condition-statement> --> IF <conditional-expression> THEN <statements-list>
  static _conditionStatement(code, i, length) {

    // IF
    if (code[i].code === ifToken) {

      // <conditional-expression> --> <variable-identifier> = <unsigned-integer>
      if (i < length - 7
        && Token.isConstNumber(code[++i].code)
        && code[++i].code === Token.reservedCharacters['=']
        && Token.isIdentifiersNumber(code[++i].code)
        && code[++i].code === thenToken) {

        checkIfCounter++;

        // <statements-list>
        i = this._statementsList(code, ++i, length);

      } else {
        code[i].syntax = true;
      }

    }

    // <alternative-part> --> ELSE <statements-list> | <empty>
    if (!endProgram && i < length - 2 && code[i].code === elseToken) {
      // <statements-list>
      i = this._statementsList(code, ++i, length);
    }

    return i;
  }


}