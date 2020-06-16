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


/*
import inherits from 'inherits';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

import Cat from '../cat';

import {
  append as svgAppend,
  create as svgCreate
} from 'tiny-svg';


export default function NyanRender(eventBus) {
  BaseRenderer.call(this, eventBus, 1500);

  this.canRender = function(element) {
    return is(element, 'bpmn:ServiceTask');
  };


  this.drawShape = function(parent, shape) {
    var url = Cat.dataURL;

    var catGfx = svgCreate('image', {
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

inherits(NyanRender, BaseRenderer);

NyanRender.$inject = [ 'eventBus' ];
*/