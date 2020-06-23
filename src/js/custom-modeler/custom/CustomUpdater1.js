/**
 * ユーザーがダイアグラムを操作しているときにビジネスデータを更新するアップデーター
 */
import {
  pick,
  assign
} from 'min-dash';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import {
  add as collectionAdd,
  remove as collectionRemove
} from 'diagram-js/lib/util/Collections';


/**
 * A handler responsible for updating the custom element's businessObject
 * once changes on the diagram happen.
 */
export default class CustomUpdater extends CommandInterceptor {
  constructor(eventBus, modeling, bpmnjs) {
    super(eventBus);
    console.log('CustomUpdater constructor',eventBus, modeling, bpmnjs)
    this.eventBus = eventBus
    this.modeling = modeling
    this.bpmnjs = bpmnjs
    this.executed([
      'shape.create',
      'shape.move',
      'shape.delete'
    ], ifCustomElement(this.updateCustomElement));
  
    this.reverted([
      'shape.create',
      'shape.move',
      'shape.delete'
    ], ifCustomElement(this.updateCustomElement));
  
    this.executed([
      'connection.create',
      'connection.reconnectStart',
      'connection.reconnectEnd',
      'connection.updateWaypoints',
      'connection.delete',
      'connection.layout',
      'connection.move'
    ], ifCustomElement(this.updateCustomConnection));
  
    this.reverted([
      'connection.create',
      'connection.reconnectStart',
      'connection.reconnectEnd',
      'connection.updateWaypoints',
      'connection.delete',
      'connection.layout',
      'connection.move'
    ], ifCustomElement(this.updateCustomConnection));
  
    this.postExecute('canvas.updateRoot', this.updateCustomElementsRoot);
  }

  updateCustomElement(e) {
    var context = e.context,
        shape = context.shape,
        businessObject = shape.businessObject;

    if (!isCustom(shape)) {
      return;
    }

    var parent = shape.parent;

    var customElements = this.bpmnjs._customElements;

    // make sure element is added / removed from bpmnjs.customElements
    if (!parent) {
      collectionRemove(customElements, businessObject);
    } else {
      collectionAdd(customElements, businessObject);
    }

    // save custom element position
    assign(businessObject, pick(shape, [ 'x', 'y' ]));
  }

  updateCustomConnection(e) {

    var context = e.context,
        connection = context.connection,
        source = connection.source,
        target = connection.target,
        businessObject = connection.businessObject;

    var parent = connection.parent;

    var customElements = this.bpmnjs._customElements;

    // make sure element is added / removed from bpmnjs.customElements
    if (!parent) {
      collectionRemove(customElements, businessObject);
    } else {
      collectionAdd(customElements, businessObject);
    }

    // update waypoints
    assign(businessObject, {
      waypoints: copyWaypoints(connection)
    });

    if (source && target) {
      assign(businessObject, {
        source: source.id,
        target: target.id
      });
    }

  }


  /**
   * When morphing a Process into a Collaboration or vice-versa,
   * make sure that the existing custom elements get their parents updated.
   */
  updateCustomElementsRoot(event) {
    var context = event.context,
        oldRoot = context.oldRoot,
        newRoot = context.newRoot,
        children = oldRoot.children;

    var customChildren = children.filter(isCustom);

    if (customChildren.length) {
      modeling.moveElements(customChildren, { x: 0, y: 0 }, newRoot);
    }
  }

}
CustomUpdater.$inject = [ 'eventBus', 'modeling', 'bpmnjs' ];


/////// helpers ///////////////////////////////////

function copyWaypoints(connection) {
  return connection.waypoints.map(function(p) {
    return { x: p.x, y: p.y };
  });
}

function isCustom(element) {
  return element && /custom:/.test(element.type);
}

function ifCustomElement(fn) {
  return function(event) {
    var context = event.context,
        element = context.shape || context.connection;

    if (isCustom(element)) {
      fn(event);
    }
  };
}