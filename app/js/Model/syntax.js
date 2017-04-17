//
// syntax.js
//

import Token from './token.js';

const startProgram = Token.reservedKeyWords['PROGRAM'];

export default class Syntax {

  constructor() {
  }

  static analyze(code) {
    let error = false;
    let length = code.length;
    debugger;

    //if code program begin the token 'PROGRAM'
    if (length > 0 && code[0].code === startProgram) {

      let isBeginProgram = false;
      for (let i = 0; i < length; i++, !error) {

        //'PROGRAM'
        if (code[i].code === startProgram) {
          if (!isBeginProgram
            && length > i + 2
            && (code[i + 1].code >= Token.reservedConstsNumber && code[i + 1].code < Token.reservedIdentifiersNumber)
            && code[i + 2].code === Token.reservedCharacters[';']) {
            isBeginProgram = true;
            i += 3;

            //declarations
            if (code[i].code === Token.reservedKeyWords['LABEL']) {
              i++;
              error = this._unsignedInteger(code, i, length);
            }

          } else {
            error = true;
            // continue;
          }
        }

        //main code program
        else if (true) {

        }


      }
    }

    return error;
  }

  static _unsignedInteger(code, i, length, error = false) {
    if (!error) {
      if (length > i + 1
        && code[i].code >= Token.reservedIdentifiersNumber) {
        if (code[i + 1].code === Token.reservedCharacters[',']) {
          i += 2;
          this._unsignedInteger(code, i, length, error);
        } else if (code[i + 1].code !== Token.reservedCharacters[';']) {
          error = true;
          code[i + 1].error = true;
          i += 2;
        } else {
          i += 2;
        }
      } else {
        i += 2;
        error = true;
      }
    }
    return error;
  }

}