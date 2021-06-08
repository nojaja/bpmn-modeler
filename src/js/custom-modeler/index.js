import Modeler from 'bpmn-js/lib/Modeler';


import {
  assign,
  isArray
} from 'min-dash';

import inherits from 'inherits';

import CustomModule from './custom';
import ResizeAllModule from './resize-all-rules'
import ColorPickerModule from './color-picker'

export default function CustomModeler(options) {
  Modeler.call(this, options);

  this._customElements = [];
}

inherits(CustomModeler, Modeler);

CustomModeler.prototype._modules = [].concat(
  CustomModeler.prototype._modules,
  [
    CustomModule,
    ResizeAllModule,
    ColorPickerModule
  ]
);

/**
 * Add a single custom element to the underlying diagram
 *
 * @param {Object} customElement
 */
CustomModeler.prototype._addCustomShape = function(customElement) {

  //injector bpmnFactory
  //elementFactory.create
  const type = customElement.type
  console.log('_addCustomShape-customElement',customElement)
  const elementFactory = this.get('elementFactory');
  console.log('_addCustomShape-elementFactory',this,elementFactory)
  const bpmnFactory = elementFactory._bpmnFactory;
  console.log('_addCustomShape-bpmnFactory',bpmnFactory)
  const businessObject = bpmnFactory.create(type);
  console.log('_addCustomShape-businessObject',businessObject)
  if (customElement && customElement.imagedata) {
    businessObject.imagedata = customElement.imagedata;
  }
  const shape = elementFactory.createShape(
    assign({ type: type, businessObject: businessObject }, customElement)
  );
  const create = this.get('create')
  console.log('_addCustomShape-create',create)
  const modeling = this.get('modeling')
  console.log('_addCustomShape-modeling',modeling)
  
  const definitions = this.getDefinitions()
  const rootElements = definitions.get('rootElements')
  
  console.log('_addCustomShape-definitions',definitions)
  console.log('_addCustomShape-rootElements',rootElements)

  //create.start(event, shape);
  //const canvas = this.get('canvas')
  //return canvas.addShape(shape);
  let position = {
    x: customElement.x,
    y: customElement.y
  };


  create.start(event, shape);

  //const elements = modeling.createElements(shape, position, rootElements);

  console.log('_addCustomShape-elements',elements)

/*
  this._customElements.push(customElement);

  var canvas = this.get('canvas'),
      elementFactory = this.get('elementFactory');

  var customAttrs = assign({ businessObject: customElement }, customElement);

  var customShape = elementFactory.create('shape', customAttrs);

  return canvas.addShape(customShape);
*/
};

CustomModeler.prototype._addCustomConnection = function(customElement) {

  this._customElements.push(customElement);

  var canvas = this.get('canvas'),
      elementFactory = this.get('elementFactory'),
      elementRegistry = this.get('elementRegistry');

  var customAttrs = assign({ businessObject: customElement }, customElement);

  var connection = elementFactory.create('connection', assign(customAttrs, {
    source: elementRegistry.get(customElement.source),
    target: elementRegistry.get(customElement.target)
  }),
  elementRegistry.get(customElement.source).parent);

  return canvas.addConnection(connection);

};

/**
 * Add a number of custom elements and connections to the underlying diagram.
 *
 * @param {Array<Object>} customElements
 */
CustomModeler.prototype.addCustomElements = function(customElements) {

  if (!isArray(customElements)) {
    throw new Error('argument must be an array');
  }

  var shapes = [],
      connections = [];

  customElements.forEach(function(customElement) {
    if (isCustomConnection(customElement)) {
      connections.push(customElement);
    } else {
      shapes.push(customElement);
    }
  });

  // add shapes before connections so that connections
  // can already rely on the shapes being part of the diagram
  shapes.forEach(this._addCustomShape, this);

  connections.forEach(this._addCustomConnection, this);
};

/**
 * Get custom elements with their current status.
 *
 * @return {Array<Object>} custom elements on the diagram
 */
CustomModeler.prototype.getCustomElements = function() {
  return this._customElements;
};


function isCustomConnection(element) {
  return element.type === 'custom:connection';
}
