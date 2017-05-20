//
// generator.js
//

import Token from './token.js';

const startProgramToken = Token.reservedKeyWords['PROGRAM'];
const declarationToken = Token.reservedKeyWords['LABEL'];
const beginToken = Token.reservedKeyWords['BEGIN'];
const gotoToken = Token.reservedKeyWords['GOTO'];
const ifToken = Token.reservedKeyWords['IF'];
const thenToken = Token.reservedKeyWords['THEN'];
const elseToken = Token.reservedKeyWords['ELSE'];
const endIfToken = Token.reservedKeyWords['ENDIF'];
const endToken = Token.reservedKeyWords['END'];


export default class Generator {

  constructor() {
  }

  static generatorCode(tree) {

    if (typeof tree.node === 'object') {
      switch (tree.node.code) {

        case (startProgramToken):

          break;


        default:
          break;
      }
    }

    if (tree.children.length !== 0) {
      for (let childNode of tree.children) {
        this.generatorCode(childNode);
      }
    }

  }

}