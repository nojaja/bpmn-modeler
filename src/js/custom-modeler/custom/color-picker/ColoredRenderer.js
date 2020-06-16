import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
//import BpmnRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  attr as svgAttr
} from 'tiny-svg';

import { is } from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 1400
export default class ColoredRenderer extends BpmnRenderer {

  constructor (config, eventBus, styles, pathMap, canvas, textRenderer) {
    super(config, eventBus, styles, pathMap, canvas, textRenderer, HIGH_PRIORITY)
    console.log(this)
    this.drawBpmnShape = super.drawShape;
  }

  canRender(element) {
    return is(element, 'bpmn:BaseElement') && element.color;
  };

  drawShape (parent, shape) {
    var bpmnShape = this.drawBpmnShape(parent, shape);
    svgAttr(bpmnShape, { fill: shape.color });
    return bpmnShape;
  };
}
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