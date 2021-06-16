import Modeler from 'bpmn-js/lib/Modeler';
import ResizeAllModule from './resize-all-rules'

export default class CustomModeler extends Modeler {
  constructor(options) {
    super(options);
    this._customElements = [];
  }
}

CustomModeler.prototype._modules = [].concat(
  CustomModeler.prototype._modules,
  [
    ResizeAllModule
  ]
);
