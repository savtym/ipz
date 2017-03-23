//
// appController.js
//

import Lexer from './Model/lexer.js'

const urlFile = './start.signal';
let textFile;

export class AppController {

  static start() {
    let rawFile = new XMLHttpRequest();
    rawFile.open('GET', urlFile, false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          textFile = rawFile.responseText;
          console.log(textFile);
          console.table(Lexer.parsing(textFile));
        }
      }
    }
    rawFile.send(null);
  }


}
