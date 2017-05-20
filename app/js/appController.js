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
    Observer.addListener(Variables.responseToRequest, (title, textProgram, code, tree) => this.responseToRequest(title, textProgram, code, tree));
    this.model.request(urlFile);
  }

  static requestToModel(textFile, title) {
  	if (!this.model) {
      this.model = new ModelController();
  	}
    this.model.start(textFile, title);
  }

  static responseToRequest(title, textProgram, code, tree) {
    this.view.createTable(title, textProgram, code, tree);
  }



}
