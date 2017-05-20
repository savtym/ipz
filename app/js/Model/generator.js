//
// generator.js
//

import Token from './token.js';

const gotoToken = Token.reservedKeyWords['GOTO'];
const ifToken = Token.reservedKeyWords['IF'];
const elseToken = Token.reservedKeyWords['ELSE'];



export default class Generator {

  constructor() {
  }

  static generatorCode(code) {

    let asm = [];
    let counterIf = 1;
    let isCondition = false;
    let isElse = false;

    for (let i = 0; i < code.length - 1; i++) {
      switch (code[i].code) {

        case (gotoToken):
        // debugger;
          asm.push(`JMP ${ code[++i].token }`);
          i++;
          break;

        case (ifToken):
          asm.push(`MOV AX, ${ code[++i].token }`);
          i += 2;
          asm.push(`MOV BX, ${ code[i++].token }`);
          asm.push(`CMP AX, BX`);
          asm.push(`JNE ?L${ counterIf }`);
          isCondition = true;
          continue;


        default:
          if (code[i].label) {
            asm.push(`${ code[i].token }:`);
          } else if (code[i].nope) {
            asm.push(`NOP`);
          }
          break;
      }

      if (isCondition && code[i+1].code === elseToken) {
        asm.push(`JMP ?L${ counterIf + 1 }`);
        asm.push(`?L${ counterIf }: NOP`);
        isCondition = false;
        isElse = true;
        i++;
      } else if (isCondition) {
        asm.push(`?L${ counterIf }: NOP`);
        ++counterIf;
        isCondition = false;
      } else if (isElse) {
        asm.push(`?L${ ++counterIf }: NOP`);
        ++counterIf;
        isElse = false;
      }
    }
    
    return asm;
  }

}