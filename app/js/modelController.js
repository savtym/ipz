//
// modelController.js
//

import Observer from './common/observer.js';
import Variables from './common/variables.js';

import Lexer from './Model/lexer.js';
import Syntax from './Model/syntax.js';
import Generator from './Model/generator.js';


let textFiles = [];
let arrCodes = [];

export default class ModelController {

  constructor() {

  }

  get textFiles() {
    return textFiles;
  }
  get arrCodes() {
    return arrCodes;
  }



  request(url, params, method = 'GET') {
    const XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    const xhr = new XHR();
    xhr.open(method, url, true);
    xhr.send(params);

    xhr.onload = (response) => {
      this.start(response.currentTarget.responseText, url);
    };

    xhr.onerror = function () {
      console.log(`Error API to url ${ url } : ${ this }`);
    };
  }

  start(textFile, title) {

    let asm, code, tree, errorLexer, errorSyntax;

    [code, errorLexer] = Lexer.parsing(textFile);
    [tree, errorSyntax] = Syntax.analyze(code);

    if (!errorLexer && !errorSyntax) {
      asm = Generator.generatorCode(code);
    }

    textFiles.push(textFile);
    arrCodes.push(code);
    Observer.emit(Variables.responseToRequest, title, textFile, code, tree, asm);
  }

}
