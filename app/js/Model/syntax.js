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

let declarationsLabel;

let treeNodes;

let error;
let endProgram;

let checkIf;

const errorNotFoundEND = 'Not found END.';

export default class Syntax {

  constructor() {
  }

  static get treeNodes() {
    return treeNodes;
  }

  static analyze(code) {

    treeNodes = {
      node: '<signal-program>',
      children: []
    };

    checkIf = {
      counter: 0,
      node: []
    };

    declarationsLabel = [];
    endProgram = false;
    error = false;


    let length = code.length;

    // if code program beginToken the token 'PROGRAM', identifier and token ';' <program> --> PROGRAM <procedure-identifier> ;
    if (length > minLengthTokens
      && code[0].code === startProgramToken
      && Token.isConstNumber(code[1].code)
      && code[2].code === Token.reservedCharacters[';']) {

      let node = this._setNodeTree(treeNodes, '<program>'); // <program> --> PROGRAM <procedure-identifier> ;
      this._setNodeTree(node, code[0]);
      let nodeIdent = this._setNodeTree(node, '<procedure-identifier>');
      this._setNodeTree(nodeIdent, code[1]);
      this._setNodeTree(node, code[2]);
      let nodeBlock = this._setNodeTree(node, '<block>');

      let i = this._isDeclarations(code, 3, length, nodeBlock);

      // beginToken program
      if (code[i].code === beginToken) {

        this._setNodeTree(nodeBlock, code[i++]);

        // <statements-list> --> <statement> <statements-list> | <empty>
        [i,] = this._statementsList(code, i, length, nodeBlock);

        if (!endProgram) {
          error = true;
          code.push(Lexer.createRow(-1, errorNotFoundEND, length, true));
        } else {
          this._setNodeTree(nodeBlock, code[i]);
        }

      } else {
        error = true;
        code[i].syntax = true;
      }
    }
    return [treeNodes, error];
  }

  // <declarations> --> <label-declarations>
  static _isDeclarations(code, i, length, nodeParent) {
    
    let nodeDeclarations = this._setNodeTree(nodeParent, '<declarations>');
    let nodeLabelDeclarations = this._setNodeTree(nodeDeclarations, '<label-declarations>');

    // <declarations> --> <label-declarations>
    if (code[i].code === declarationToken) {
      this._setNodeTree(nodeLabelDeclarations, code[i]);
      i = this._unsignedInteger(code, ++i, length, true, this._setNodeTree(nodeLabelDeclarations, '<unsigned-integer>'));
    }

    return i;
  }

  // <unsigned-integer> <labels-list>; | <empty>
  // <labels-list> --> , <unsigned-integer> <labels-list> | <empty>
  static _unsignedInteger(code, i, length, isLabel = false, nodeParent) {

    // <unsigned-integer>, <labels-list>; <empty>
    if (Token.isIdentifiersNumber(code[i].code)) {

      this._setNodeTree(nodeParent, code[i]);

      if (isLabel) {
        declarationsLabel.push(code[i].code);
      }

      // , <labels-list>
      if (length > i + 1
        && code[++i].code === Token.reservedCharacters[',']) {
        this._setNodeTree(nodeParent, code[i]);
        i = this._unsignedInteger(code, ++i, length, isLabel, nodeParent);
      } else {
        // ; <empty>
        if (code[i].code !== Token.reservedCharacters[';']) {
          code[i].syntax = true;
          error = true;
        } else {
            this._setNodeTree(nodeParent, code[i]);
        }
        i++;
      }

    }

    return i;
  }


  // <statements-list> END
  // <statements-list> --> <statement> <statements-list>
  static _statementsList(code, i, length, nodeParent) {

    const nodeStatementList = this._setNodeTree(nodeParent, '<statements-list>');
    let isElse = true;

    for (; i < length; i++) {

      // <condition-statement> ENDIF ;
      [i, isElse] = this._conditionStatement(code, i, length, nodeStatementList);

      if (isElse) {
        break;
      }

      // <statement> --> <unsigned-integer> : <statement>
      if (Token.isIdentifiersNumber(code[i].code)
        && declarationsLabel.includes(code[i].code)
        && i < length - 2
        && code[++i].code === Token.reservedCharacters[':']) {
          code[i-1].label = true;
          const nodeStatement = this._setNodeTree(nodeStatementList, '<statement>');
          this._setNodeTree(nodeStatement, code[i-1]);
          this._setNodeTree(nodeStatement, code[i]);
      }

      // GOTO <unsigned-integer> ;
      else if (code[i].code === gotoToken
        && i < length - 2
        && declarationsLabel.includes(code[++i].code)
        && code[++i].code === Token.reservedCharacters[';']) {
          const nodeStatement = this._setNodeTree(nodeStatementList, '<statement>');
          this._setNodeTree(nodeStatement, code[i-2]);
          this._setNodeTree(nodeStatement, code[i-1]);
          this._setNodeTree(nodeStatement, code[i]);
      }

      // ;
      else if (code[i].code === Token.reservedCharacters[';']) {
        code[i].nope = true;
        const nodeStatement = this._setNodeTree(nodeStatementList, '<statement>');
        this._setNodeTree(nodeStatement, code[i]);
      }

      // ENDIF ;
      else if (code[i].code === endIfToken
        && i < length - 1
        && code[++i].code === Token.reservedCharacters[';']) {
        if (checkIf.counter > 0) {
          checkIf.counter--;
          let nodeEndIf = checkIf.node.pop();
          this._setNodeTree(nodeEndIf, code[i-1]);
          this._setNodeTree(nodeEndIf, code[i]);
          i++;
          break;
        } else {
          error = true;
          code[i].syntax = true;
        }
      }

      //END
      else if (code[i].code === endToken) {
        if (checkIf.counter > 0) {
          error = true;
          code[i].syntax = true;
        }
        endProgram = true;
        break;
      }

      else {
        code[i].syntax = true;
      }

    }

    return [i, isElse];
  }

  // <incomplete-condition-statement><alternative-part>
  // <incomplete-condition-statement> --> IF <conditional-expression> THEN <statements-list>
  static _conditionStatement(code, i, length, nodeParent) {

    let isElse = false;

    // IF
    if (code[i].code === ifToken) {

      const nodeCondition = this._setNodeTree(this._setNodeTree(nodeParent, '<statement>'), '<condition-statement>');
      const nodeConditionStatement = this._setNodeTree(nodeCondition, '<incomplete-condition-statement>');
      this._setNodeTree(nodeConditionStatement, code[i]);

      // <conditional-expression> --> <variable-identifier> = <unsigned-integer>
      if (i < length - 7
        && Token.isConstNumber(code[++i].code)
        && code[++i].code === Token.reservedCharacters['=']
        && Token.isIdentifiersNumber(code[++i].code)
        && code[++i].code === thenToken) {

        const conditionalExpression = this._setNodeTree(nodeConditionStatement, '<conditional-expression>');
        this._setNodeTree(conditionalExpression, code[i-3]);
        this._setNodeTree(conditionalExpression, code[i-2]);
        this._setNodeTree(conditionalExpression, code[i-1]);
        this._setNodeTree(nodeConditionStatement, code[i]);

        checkIf.counter++;
        checkIf.node.push(nodeCondition);

        // <statements-list>
        [i, isElse] = this._statementsList(code, ++i, length, nodeConditionStatement);

        // <alternative-part> --> ELSE <statements-list> | <empty>
        if (isElse) {
          const nodeAlternativePart = this._setNodeTree(checkIf.node[checkIf.node.length-1], '<alternative-part>');
          this._setNodeTree(nodeAlternativePart, code[i]);
          // <statements-list>
          [i, isElse] = this._statementsList(code, ++i, length, nodeAlternativePart);
        }

      } else {
        error = true;
        code[i].syntax = true;
      }

    }

    if (!endProgram && i < length - 2 && code[i].code === elseToken) {
      isElse = true;
    }

    return [i, isElse];
  }

  static _setNodeTree(parent, str) {
    let node = {
      node: str,
      children: []
    };
    parent.children.push(node);
    return node;
  }


}