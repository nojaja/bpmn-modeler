import inherits from 'inherits';

import {
  attr as svgAttr
} from 'tiny-svg';

//import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
//import BpmnRenderer from 'diagram-js/lib/draw/BaseRenderer';
const BpmnRenderer = require('diagram-js/lib/draw/BaseRenderer')

export default function ColoredRenderer(
  config, eventBus, styles,
  pathMap, canvas, textRenderer) {

  BpmnRenderer.call(
    this, eventBus,
    1400
  );

  this.canRender = function(element) {
  //  return is(element, 'bpmn:BaseElement') && element.color;
  };

  function is(element, type) {
    let bo = (element && element.businessObject) || element;
    return bo && (element.type === type)
  }

  this.drawShape = function(parent, shape) {
/*
    var bpmnShape = this.drawBpmnShape(parent, shape);
    svgAttr(bpmnShape, { fill: shape.color });
    return bpmnShape;
    */
  };
}

inherits(ColoredRenderer, BpmnRenderer);

ColoredRenderer.$inject = [
  'config.bpmnRenderer',
  'eventBus',
  'styles',
  'pathMap',
  'canvas',
  'textRenderer'
];

/*
import inherits from 'inherits';

import {
  attr as svgAttr
} from 'tiny-svg';

//import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
import BpmnRenderer from 'diagram-js/lib/draw/BaseRenderer';

export default function ColoredRenderer(
    config, eventBus, styles,
    pathMap, canvas, textRenderer) {

  BpmnRenderer.call(
    this,
    config, eventBus, styles,
    pathMap, canvas, textRenderer,
    1400
  );

  this.canRender = function(element) {
  //  return is(element, 'bpmn:BaseElement') && element.color;
  };

  function is(element, type) {
    let bo = (element && element.businessObject) || element;
    return bo && (element.type === type)
  }

  this.drawShape = function(parent, shape) {

    var bpmnShape = this.drawBpmnShape(parent, shape);

    svgAttr(bpmnShape, { fill: shape.color });

    return bpmnShape;
  };
}

inherits(ColoredRenderer, BpmnRenderer);

ColoredRenderer.prototype.drawBpmnShape = BpmnRenderer.prototype.drawShape;


ColoredRenderer.$inject = [
  'config.bpmnRenderer',
  'eventBus',
  'styles',
  'pathMap',
  'canvas',
  'textRenderer'
];
*/