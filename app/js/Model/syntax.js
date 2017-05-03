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

let error = false;

let checkIfCounter = 0;
let endProgram = false;

const errorNotFoundEND = 'Not found END.';

export default class Syntax {

  constructor() {
  }

  static analyze(code) {
    let length = code.length;
    debugger;

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
        code[i].error = error = true;
      }
    }

    return error;
  }

  // <declarations> --> <label-declarations>
  static _isDeclarations(code, i, length) {

    // <declarations> --> <label-declarations>
    if (code[i].code === declarationToken) {
      i = this._unsignedInteger(code, ++i, length);
    }

    return i;
  }

  // <unsigned-integer> <labels-list>; | <empty>
  // <labels-list> --> , <unsigned-integer> <labels-list> | <empty>
  static _unsignedInteger(code, i, length) {
    if (!error) {
      // <unsigned-integer>, <labels-list>; <empty>
      if (Token.isIdentifiersNumber(code[i].code)) {

        // , <labels-list>
        if (length > i + 1
          && code[++i].code === Token.reservedCharacters[',']) {
          i = this._unsignedInteger(code, ++i, length);
        } else {
          // ; <empty>
          if (code[i].code !== Token.reservedCharacters[';']) code[i].error = error = true;
          i++;
        }

      } else {
        code[i].error = error = true;
      }
    }
    return i;
  }


  // <statements-list> END
  // <statements-list> --> <statement> <statements-list>
  static _statementsList(code, i, length) {

    for (; i < length - 1; i++, !error) {

      // <condition-statement> ENDIF ;
      i = this._conditionStatement(code, i, length);

      // <statement> --> <unsigned-integer> : <statement>
      if ((!Token.isIdentifiersNumber(code[i].code)
        && code[++i].code !== Token.reservedCharacters[':'])

        // | GOTO <unsigned-integer> ;
        || (!code[i].code === gotoToken
          && !Token.isIdentifiersNumber(code[++i].code)
          && length <= i
          && code[++i].code !== Token.reservedCharacters[';'])) {
        code[i].error = error = true;
        code[i].syntax = true;
      }

      // ENDIF
      else if (code[i].code === endIfToken) {
        if (checkIfCounter > 0) {
          checkIfCounter--;
          break;
        } else {
          code[i].error = error = true;
        }
      }

      //END
      else if (code[i].code === endToken) {
        if (checkIfCounter > 0) {
          code[i].error = error = true;
        }
        endProgram = true;
        break;
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
      if ((length <= i
        && !Token.isIdentifiersNumber(code[++i].code))
        || (length <= i
          && code[++i].code !== Token.reservedCharacters['='])
        || (length <= i
          && !Token.isConstNumber(code[++i].code))

        // THEN
        || (length <= i
          && code[++i].code !== thenToken)) {

        code[i].error = error = true;
        code[i].syntax = true;

      } else {

        checkIfCounter++;
        // <statements-list>
        i = this._statementsList(code, i, length);

        if (!endProgram) {
          // <alternative-part> --> ELSE <statements-list> | <empty>
          if (i + 1 < length
            && code[++i].code === elseToken) {
            checkIfCounter++;
            // <statements-list>
            i = this._statementsList(code, i, length);
          }
        }
      }
    }

    return i;
  }

}