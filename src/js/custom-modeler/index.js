import Modeler from 'bpmn-js/lib/Modeler';


import {
  assign,
  isArray
} from 'min-dash';

import CustomModule from './custom-element';
import ResizeAllModule from './resize-all-rules'
import ColorPickerModule from './color-picker'


export default class CustomModeler extends Modeler {
  constructor(options) {
    super(options);
    this._customElements = [];
  }
  /**
   * Add a single custom element to the underlying diagram
   *
   * @param {Object} customElement
   */
  _addCustomShape(event) {
    const self = this;
    return (customElement) => {
      const type = customElement.type
      const elementFactory = self.get('elementFactory');
      const bpmnFactory = elementFactory._bpmnFactory;
      const create = self.get('create')

      const businessObject = bpmnFactory.create(type);
      businessObject.imagedata = customElement.imagedata;
      const shape = elementFactory.createShape(
        assign({ type: type, businessObject: businessObject })
      );
      create.start(event, shape);
      //modeling#createShape
    }
  };

  _addCustomConnection(event) {
    const self = this;
    return (customElement) => {
      self._customElements.push(customElement);

      var canvas = self.get('canvas'),
        elementFactory = self.get('elementFactory'),
        elementRegistry = self.get('elementRegistry');

      var customAttrs = assign({ businessObject: customElement }, customElement);

      var connection = elementFactory.create('connection', assign(customAttrs, {
        source: elementRegistry.get(customElement.source),
        target: elementRegistry.get(customElement.target)
      }),
        elementRegistry.get(customElement.source).parent);

      return canvas.addConnection(connection);
    }
  };


  /**
   * Add a number of custom elements and connections to the underlying diagram.
   *
   * @param {Array<Object>} customElements
   */
  addCustomElements(event, customElements) {
    const self = this;

    if (!isArray(customElements)) {
      throw new Error('argument must be an array');
    }

    var shapes = [],
      connections = [];

    customElements.forEach(function (customElement) {
      if (isCustomConnection(customElement)) {
        connections.push(customElement);
      } else {
        shapes.push(customElement);
      }
    });

    // add shapes before connections so that connections
    // can already rely on the shapes being part of the diagram
    shapes.forEach(self._addCustomShape(event), self);

    connections.forEach(self._addCustomConnection(event), self);
  };

  /**
   * Get custom elements with their current status.
   *
   * @return {Array<Object>} custom elements on the diagram
   */
  getCustomElements() {
    const self = this;
    return self._customElements;
  };

}

CustomModeler.prototype._modules = [].concat(
  CustomModeler.prototype._modules,
  [
    CustomModule,
    ResizeAllModule,
    ColorPickerModule
  ]
);




function isCustomConnection(element) {
  return element.type === 'custom:connection';
}
