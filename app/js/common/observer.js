//
// observer.js
//

let isFunction = function(obj) {
  return typeof obj == 'function' || false;
};

let listeners = new Map();

export default class Observer {

  constructor() {
  }

  static get listeners() {
    return listeners;
  }

  static addListener(eventName, callback) {
    this.listeners.has(eventName) || this.listeners.set(eventName, []);
    this.listeners.get(eventName).push(callback);
  }

  static removeListener(eventName, callback) {
    let listeners = this.listeners.get(eventName);
    let index;
      
    if (listeners && listeners.length) {
      index = listeners.reduce((i, listener, index) => {
        return (isFunction(listener) && listener === callback) ? i = index : i;
      }, -1);
      if (index > -1) {
        listeners.splice(index, 1);
        this.listeners.set(eventName, listeners);
        return true;
      }
    }
    return false;
  }
  
  static emit(label, ...args) {
    let listeners = this.listeners.get(label);
    
    if (listeners && listeners.length) {
      listeners.forEach((listener) => {
        listener(...args); 
      });
      return true;
    }
    return false;
  }
}