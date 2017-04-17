//
// appController.js
//

import Observer from './common/observer.js';
import Variables from './common/variables.js'

import ModelController from './modelController.js';
import ViewController from './viewController.js';


const urlFile = 'start.signal';

export class AppController {

  static start() {
    this.model = new ModelController();
    this.view = new ViewController();
    Observer.addListener(Variables.responseToRequest, (title, textProgram, code) => this.responseToRequest(title, textProgram, code));
    this.model.request(urlFile);
  }

  static responseToRequest(title, textProgram, code) {
    this.view.createTable(title, textProgram, code);
  }



}
