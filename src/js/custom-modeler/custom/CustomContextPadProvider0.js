/**
 * カスタム要素をBPMN要素に接続できるようにするカスタムコンテキストパッド
 */
import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  assign,
  bind
} from 'min-dash';



export default class CustomContextPadProvider {

  constructor(eventBus, contextPad, commandStack, injector, connect, translate) {
    console.log('CustomContextPadProvider constructor')
    contextPad.registerProvider(this);
    //commandStack.registerHandler('shape.updateColor', UpdateColorHandler);
    this.contextPad = contextPad;
    this.commandStack = commandStack;
    this.injector = injector;
    this.connect = connect;
    this.translate = translate;
    this.cached = bind(this.getContextPadEntries, this);
  }

  changeColor(event, element) {
    var color = window.prompt('type a color code');
    this.self.commandStack.execute('shape.updateColor', { element: element, color: color });
  }

  getContextPadEntries (element) {
      console.log('getContextPadEntries',element)
      let actions = this.cached(element);
      let businessObject = element.businessObject;

      function startConnect(event, element, autoActivate) {
        this.self.connect.start(event, element, autoActivate);
      }

      if (isAny(businessObject, ['custom:triangle', 'custom:circle'])) {
        assign(actions, {
          'connect': {
            group: 'connect',
            className: 'bpmn-icon-connection-multi',
            title: translate('Connect using custom connection'),
            action: {
              click: startConnect,
              dragstart: startConnect,
              self:this
            }
          }
        });
      }

      return actions;
  }
}

CustomContextPadProvider.$inject = [
  'eventBus', 'contextPad', 'commandStack' ,
  'injector',
  'connect',
  'translate'
];

/**
 * A handler updating an elements color.
 */
class UpdateColorHandler {
  constructor(eventBus){
    console.log('UpdateColorHandler',this,eventBus)
  }
  execute (context) {
    context.oldColor = context.element.color;
    context.element.color = context.color;
    return context.element;
  };
  revert(context) {
    context.element.color = context.oldColor;
    return context.element;
  };
}
UpdateColorHandler.$inject = ['eventBus'];

/*
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
*/