import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
//import BpmnRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  attr as svgAttr
} from 'tiny-svg';

import { is } from 'bpmn-js/lib/util/ModelUtil';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';


const HIGH_PRIORITY = 1400
export default class ColoredRenderer extends BpmnRenderer {
  constructor (config, eventBus, styles, pathMap, canvas, textRenderer) {
    super(config, eventBus, styles, pathMap, canvas, textRenderer, HIGH_PRIORITY)
    console.log(this)
    this.drawBpmnShape = super.drawShape;
  }

  canRender(element) {
    var businessObject = element.businessObject;
    return (isAny(businessObject, [ 'bpmn:BaseElement', 'custom:triangle', 'custom:circle'])) && element.color;
    
    //return is(element, 'bpmn:BaseElement') && element.color;
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
