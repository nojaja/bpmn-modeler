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


export default class CustomContextPadProvider {
  constructor(injector, connect, translate) {
    this.create = create;
    this.translate = translate;
    contextPad.registerProvider(this);
  }



  var cached = bind(this.getContextPadEntries, this);

   getContextPadEntries(element) {
    const actions = cached(element);

    const businessObject = element.businessObject;

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
  };
}

CustomContextPadProvider.$inject = [
  'injector',
  'connect',
  'translate'
];