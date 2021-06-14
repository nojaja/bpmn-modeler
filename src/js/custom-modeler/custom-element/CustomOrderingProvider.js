/**
 * カスタム接続が常に上部にレンダリングされることを保証するプロバイダー
 */

import OrderingProvider from 'diagram-js/lib/features/ordering/OrderingProvider';

/**
 * a simple ordering provider that ensures that custom
 * connections are always rendered on top.
 */
export default class CustomOrderingProvider extends OrderingProvider {
  constructor(eventBus, canvas) {
    super(eventBus);
    this.getOrdering = function(element, newParent) {

      if (element.type === 'custom:connection') {

        // always move to end of root element
        // to display always on top
        return {
          parent: canvas.getRootElement(),
          index: -1
        };
      }
    };
  }
}

CustomOrderingProvider.$inject = [
  'eventBus',
  'canvas'
];
