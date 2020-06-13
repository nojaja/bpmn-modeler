import inherits from 'inherits';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

//import { is } from 'bpmn-js/lib/util/ModelUtil';

import Cat from '../cat/cat.gif';

import {
  append as svgAppend,
  create as svgCreate
} from 'tiny-svg';


export default function NyanRender(eventBus) {
  BaseRenderer.call(this, eventBus, 1500);
  this.canRender = function(element) {
    return is(element,'bpmn:ServiceTask')
  };

  function is(element, type) {
    let bo = (element && element.businessObject) || element;
    return bo && (element.type === type)
  }
  
  this.drawShape = function(parent, shape) {
    var url = Cat;
    console.log(parent)
    console.log(shape)
    console.log(svgCreate)
    
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