//
// viewController.js
//

import modelControler from './modelController.js';

export default class ViewController {

  constructor(model) {
    this.app = document.getElementsByTagName('app-main')[0];
  	this.model = model;
    this.app.innerHTML = `
      <label class="btn btn-default btn-file">
        Download file *.signal <input type="file" style="display: none;">
      </label>
      <div class="list"></div>`;
    this.table = document.getElementsByClassName('list')[0];
  }

  createTable(title, textProgram, code) {
    let tableStr = `<h2>${ title }</h2>`;
    tableStr += `<pre class="prettyprint linenums">${ textProgram }</pre>`;
    tableStr += `<table class="table table-striped table-bordered table-hover table-condensed"><thead><tr><th>#</th><th>Code</th><th>Token</th><th>Row</th></tr></thead>`;


    for (let i = 0; i < code.length; i++) {
      tableStr += `<tr class="${ code[i].error ? 'error' : '' } ${ code[i].syntax ? 'error-syntax' : '' }">`;
      tableStr += `<td>${ i + 1 }</td>`;
      tableStr += `<td>${ code[i].code }</td>`;
      tableStr += `<td>${ code[i].token }</td>`;
      tableStr += `<td>${ code[i].row }</td>`;
      tableStr += '</tr>';
    }

    tableStr += '</table>';

    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = tableStr;
    this.table.appendChild(div);
  }

}