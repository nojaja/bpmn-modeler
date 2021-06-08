/**
 * カスタム要素の描画方法を知っているレンダラー
 */
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate
} from 'tiny-svg';

import {
  componentsToPath,
  createLine
} from 'diagram-js/lib/util/RenderUtil';

import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import { isNil } from 'min-dash';

import Image from '../../../assets/shpes/image.svg';

const HIGH_PRIORITY = 2000;
/**
 * A renderer that knows how to render custom elements.
 */
export default class CustomRenderer extends BaseRenderer {

  constructor(eventBus, styles, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);

    const computeStyle = styles.computeStyle;
    this.bpmnRenderer = bpmnRenderer;
  }
  //シェイプの描画チェック？
  canRender(element) {
    // ignore labels
    return !element.labelTarget;
    //return /^custom:/.test(element.type);
  }

  //シェイプの描画
  drawShape(parentNode, element) {
    const type = element.type;

    const imagedata = this.getImageData(element);

    if (type === 'bpmn:DataObjectReference' && !isNil(imagedata)) {
      element.businessObject.href = imagedata
      return this.drawImage(parentNode, element);
    }
    if (type === 'bpmn:TextAnnotation' && !isNil(imagedata)) {
      element.businessObject.href = imagedata
      return this.drawImage(parentNode, element);
    }
    if (type === 'bpmn:Group' && !isNil(imagedata)) {
      element.businessObject.href = imagedata
      return this.drawImage(parentNode, element);
    }
  };

  getShapePath(shape) {
    const type = shape.type;
  };

  //接続線の描画
  drawConnection(p, element) {
    const type = element.type;
  };

  //接続線の取得
  getConnectionPath(connection) {
    const type = connection.type;
  }

  getImageData(element) {
    const businessObject = getBusinessObject(element);
    console.log(businessObject)
    const { imagedata } = businessObject;
    return imagedata ? imagedata : Image;
  }

  //コンポネントのレンダリング
  drawImage(parent, shape) {
    console.log('drawImage', parent, shape)
    let url = shape.businessObject.href || Image;
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


  getCustomConnectionPath(connection) {

  };
}

CustomRenderer.$inject = ['eventBus', 'styles', 'bpmnRenderer'];
