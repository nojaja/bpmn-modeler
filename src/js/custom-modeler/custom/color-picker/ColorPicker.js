
import { is } from 'bpmn-js/lib/util/ModelUtil';

/**
 * A basic color picker implementation.
 *
 * @param {EventBus} eventBus
 * @param {ContextPad} contextPad
 * @param {CommandStack} commandStack
 */
export default class ColorPicker {
  constructor(eventBus, contextPad, commandStack) {
    console.log('ColorPicker',eventBus, contextPad, commandStack)
    //contextPad.registerProvider(this);
    //commandStack.registerHandler('shape.updateColor', ColorPicker.UpdateColorHandler);
    this.contextPad = contextPad;
    this.commandStack = commandStack;
  }

  changeColor(event, element) {
    var color = window.prompt('type a color code');
    this.commandStack.execute('shape.updateColor', { element: element, color: color });
  }

  getContextPadEntries (element) {
    if (is(element, 'bpmn:Event')) {
      return {
        'changeColor': {
          group: 'edit',
          className: 'icon-red',
          title: 'Change element color',
          action: {
            click: changeColor
          }
        }
      };
    }
  };


  /**
   * A handler updating an elements color.
   */
  static UpdateColorHandler() {
    this.execute = function(context) {
      context.oldColor = context.element.color;
      context.element.color = context.color;
      return context.element;
    };
    this.revert = function(context) {
      context.element.color = context.oldColor;
      return context.element;
    };
  }
}


