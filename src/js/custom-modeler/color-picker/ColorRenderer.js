import {
  attr as svgAttr
} from 'tiny-svg';


import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';

const CALL_PRIORITY = 2000
export default class ColorRenderer extends BpmnRenderer {
  constructor(config, eventBus, styles, pathMap, canvas, textRenderer) {
    super(config, eventBus, styles, pathMap, canvas, textRenderer, CALL_PRIORITY)
    this.drawBpmnShape = super.drawShape;
    this.drawBpmnConnection = super.drawConnection;
  }
  canRender(element) {
    var businessObject = element.businessObject;

    //if(isAny(businessObject, 'bpmn:textAnnotation')) return false
    //if(isAny(businessObject, 'bpmn:Artifact')) return false

    //return (isAny(businessObject, ['bpmn:task']));
    return (isAny(businessObject, ['bpmn:BaseElement']));
  };

  drawConnection(parentGfx, shape) {
    // call default implementation
    const bpmnConnection = this.drawBpmnConnection(parentGfx, shape);
    // line shape with default black color
    svgAttr(bpmnConnection, {
      stroke: getBackgroundColor(shape) || '#000000'
    });
    // make sure default renderer is not called anymore
    return bpmnConnection;
  };

  drawShape(parentGfx, shape) {
    console.log('render.shape')
    // call default implementation
    const bpmnShape = this.drawBpmnShape(parentGfx, shape);
    // 2D shape with default white color
    if(getBackgroundColor(shape))
    svgAttr(bpmnShape, {
      fill: getBackgroundColor(shape) || '#ffffff'
    });
    if(getBorderColor(shape))
    svgAttr(bpmnShape, {
      stroke: getBorderColor(shape) || '#000000'
    });
    // make sure default renderer is not called anymore
    return bpmnShape;
  };
}

ColorRenderer.$inject = [
  'config.bpmnRenderer',
  'eventBus',
  'styles',
  'pathMap',
  'canvas',
  'textRenderer'
];


function getBackgroundColor(element) {
  const bo = getBusinessObject(element);
  return bo.di.get('color:background-color');
}
function getBorderColor(element) {
  const bo = getBusinessObject(element);
  return bo.di.get('color:border-color');
}
