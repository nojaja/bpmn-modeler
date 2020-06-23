/**
 * カスタム要素をBPMN要素に接続できるようにするカスタムコンテキストパッド
 */
import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  assign,
  bind
} from 'min-dash';


export default class CustomContextPadProvider extends ContextPadProvider {

  constructor(injector, connect, translate) {
    super()
    
    console.log('CustomContextPadProvider constructor')
    injector.registerProvider(this);
    injector.invoke(ContextPadProvider, this);

    var cached = bind(this.getContextPadEntries, this);

    this.getContextPadEntries = function (element) {
      var actions = cached(element);

      var businessObject = element.businessObject;

      function startConnect(event, element, autoActivate) {
        connect.start(event, element, autoActivate);
      }

      if (isAny(businessObject, ['custom:triangle', 'custom:circle'])) {
        assign(actions, {
          'connect': {
            group: 'connect',
            className: 'bpmn-icon-connection-multi',
            title: translate('Connect using custom connection'),
            action: {
              click: startConnect,
              dragstart: startConnect
            }
          }
        });
      }

      return actions;
    }
  }
}
CustomContextPadProvider.$inject = [
  'injector',
  'connect',
  'translate'
];