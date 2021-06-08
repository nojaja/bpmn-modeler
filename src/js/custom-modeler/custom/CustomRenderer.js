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
import Star from '../../../assets/shpes/star.svg';
import Iphone from '../../../assets/shpes/iphone.svg';
import TvDisplay from '../../../assets/shpes/tv-display.svg';
import Warning from '../../../assets/shpes/warning.svg';

const HIGH_PRIORITY = 2000,
  TASK_BORDER_RADIUS = 2,
  COLOR_GREEN = '#52B415',
  COLOR_YELLOW = '#ffc800',
  COLOR_RED = '#cc0000';
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



    const suitabilityScore = this.getSuitabilityScore(element);

    if (type === 'bpmn:DataObjectReference' && !isNil(suitabilityScore)) {
      element.businessObject.href = Star
      return this.drawImage(parentNode, element);
    }


    if (!isNil(suitabilityScore)) {
      const shape = this.bpmnRenderer.drawShape(parentNode, element);
      const color = this.getColor(suitabilityScore);

      const rect = drawRect(parentNode, 50, 20, TASK_BORDER_RADIUS, color);

      svgAttr(rect, {
        transform: 'translate(-20, -10)'
      });

      var text = svgCreate('text');

      svgAttr(text, {
        fill: '#fff',
        transform: 'translate(-15, 5)'
      });

      svgClasses(text).add('djs-label');

      svgAppend(text, document.createTextNode(suitabilityScore));

      svgAppend(parentNode, text);
      return shape;
    }


    if (type === 'custom:triangle') {
      return this.drawTriangle(parentNode, element.width);
      //return this.drawNyan(p, element);
    }

    if (type === 'custom:circle') {
      return this.drawCircle(parentNode, element.width, element.height);
    }
    if (type === 'custom:star') {
      element.businessObject.href = Star
      return this.drawImage(parentNode, element);
    }
    if (type === 'custom:iphone') {
      element.businessObject.href = Iphone
      return this.drawImage(parentNode, element);
    }
    if (type === 'custom:tv-display') {
      element.businessObject.href = TvDisplay
      return this.drawImage(parentNode, element);
    }
    if (type === 'custom:warning') {
      element.businessObject.href = Warning
      return this.drawImage(parentNode, element);
    }
    if (type === 'custom:image') {
      return this.drawImage(parentNode, element);
    }

  };

  getShapePath(shape) {
    const type = shape.type;

    if (type === 'custom:triangle') {
      return this.getTrianglePath(shape);
    }

    if (type === 'custom:circle') {
      return this.getCirclePath(shape);
    }
  };

  //接続線の描画
  drawConnection(p, element) {
    const type = element.type;

    if (type === 'custom:connection') {
      return this.drawCustomConnection(p, element);
    }
  };

  //接続線の取得
  getConnectionPath(connection) {
    const type = connection.type;

    if (type === 'custom:connection') {
      return this.getCustomConnectionPath(connection);
    }
  }

  getSuitabilityScore(element) {
    const businessObject = getBusinessObject(element);

    const { suitable } = businessObject;

    return Number.isFinite(suitable) ? suitable : null;
  }

  getColor(suitabilityScore) {
    if (suitabilityScore > 75) {
      return COLOR_GREEN;
    } else if (suitabilityScore > 25) {
      return COLOR_YELLOW;
    }

    return COLOR_RED;
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

  drawTriangle(p, side) {
    const halfSide = side / 2;
    const points = [halfSide, 0, side, side, 0, side];
    const attrs = computeStyle(attrs, {
      stroke: COLOR_GREEN,
      strokeWidth: 2,
      fill: COLOR_GREEN
    });

    const polygon = svgCreate('polygon');

    svgAttr(polygon, {
      points: points
    });

    svgAttr(polygon, attrs);

    svgAppend(p, polygon);

    return polygon;
  };

  getTrianglePath(element) {
    const x = element.x,
      y = element.y,
      width = element.width,
      height = element.height;

    const trianglePath = [
      ['M', x + width / 2, y],
      ['l', width / 2, height],
      ['l', -width, 0],
      ['z']
    ];

    return componentsToPath(trianglePath);
  };

  drawCircle(p, width, height) {
    const cx = width / 2,
      cy = height / 2;

      const attrs = computeStyle(attrs, {
      stroke: COLOR_YELLOW,
      strokeWidth: 4,
      fill: COLOR_YELLOW
    });

    const circle = svgCreate('circle');

    svgAttr(circle, {
      cx: cx,
      cy: cy,
      r: Math.round((width + height) / 4)
    });

    svgAttr(circle, attrs);

    svgAppend(p, circle);

    return circle;
  };

  getCirclePath(shape) {
    const cx = shape.x + shape.width / 2,
      cy = shape.y + shape.height / 2,
      radius = shape.width / 2;

      const circlePath = [
      ['M', cx, cy],
      ['m', 0, -radius],
      ['a', radius, radius, 0, 1, 1, 0, 2 * radius],
      ['a', radius, radius, 0, 1, 1, 0, -2 * radius],
      ['z']
    ];

    return componentsToPath(circlePath);
  };

  drawCustomConnection(p, element) {
    const attrs = computeStyle(attrs, {
      stroke: COLOR_RED,
      strokeWidth: 2
    });

    return svgAppend(p, createLine(element.waypoints, attrs));
  };

  getCustomConnectionPath(connection) {
    const waypoints = connection.waypoints.map(function (p) {
      return p.original || p;
    });

    const connectionPath = [
      ['M', waypoints[0].x, waypoints[0].y]
    ];

    waypoints.forEach(function (waypoint, index) {
      if (index !== 0) {
        connectionPath.push(['L', waypoint.x, waypoint.y]);
      }
    });

    return componentsToPath(connectionPath);
  };
}

CustomRenderer.$inject = ['eventBus', 'styles', 'bpmnRenderer'];


// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color
  });

  svgAppend(parentNode, rect);

  return rect;
}