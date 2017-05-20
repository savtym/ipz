//
// viewController.js
//

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

  createTable(title, textProgram, code, tree) {
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

    tableStr += this._createTree(tree, '<div class="tree">');
    tableStr += '</div>';

    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = tableStr;
    this.table.appendChild(div);
  }

  _createTree(tree, domStr, deep = 0) {

    if (typeof tree.node === 'string') {
      domStr += `<div><span class="counter">${ deep }</span>`;
      for (let i = 0; i < deep; i++) {
        domStr += '<span class="tab"></span>';
      }
      domStr += `<xmp class="description">${ tree.node }</xmp>`;
    }

    if (tree.children.length !== 0) {
      for (let childNode of tree.children) {
        if (typeof childNode.node === 'object') {
          domStr += `<span class="token">${ childNode.node.token }</span>`;
        } else {
          domStr += `<span class="space-description">${ deep + 1 }</span>`;
        }
      }
      for (let childNode of tree.children) {
        if (typeof childNode.node === 'string') {
          domStr = this._createTree(childNode, domStr, deep + 1);
        }
      }
    }

    if (typeof tree.node === 'string') {
      domStr += '</div>';
    }

    return domStr;
  }

}