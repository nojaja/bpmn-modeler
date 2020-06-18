import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import Cat from '../cat/cat.gif';

import {
  append as svgAppend,
  create as svgCreate
} from 'tiny-svg';

import { is } from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 1500

export default class NyanRender extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
  }

  canRender (element) {
    return is(element,'bpmn:ServiceTask')
  };
  
  drawShape (parent, shape) {
    let url = Cat;
    
    let catGfx = svgCreate('image', {
      x: 0,
      y: 0,
      width: shape.width,
      height: shape.height,
      href: url
    });
    
    svgAppend(parent, catGfx);
    
    return catGfx;
  };

}
NyanRender.$inject = [ 'eventBus' ];

