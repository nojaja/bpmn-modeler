/**
 * カスタム要素を作成できるカスタムパレット
 */
import {
  assign
} from 'min-dash';

import Image from '../../../assets/shpes/image.svg';
import Star from '../../../assets/shpes/star.svg';
import Iphone from '../../../assets/shpes/iphone.svg';
import TvDisplay from '../../../assets/shpes/tv-display.svg';
import Team from '../../../assets/shpes/team.svg';
import Warning from '../../../assets/shpes/warning.svg';

/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */
export default class CustomPaletteProvider {

  constructor(
    bpmnFactory, palette, create, elementFactory,
    spaceTool, lassoTool, handTool,
    globalConnect, translate) {
    this.bpmnFactory = bpmnFactory;
    this.palette = palette;
    this.create = create;
    this.elementFactory = elementFactory;
    this.spaceTool = spaceTool;
    this.lassoTool = lassoTool;
    this.handTool = handTool;
    this.globalConnect = globalConnect;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    console.log('getPaletteEntries')
    const {
      bpmnFactory,
      create,
      elementFactory,
      spaceTool,
      lassoTool,
      handTool,
      globalConnect,
      translate
    } = this;

    let actions = {}

    function createTask(type, options) {
      return function (event) {
        const businessObject = bpmnFactory.create(type);
        if (options && options.imagedata) {
          businessObject.imagedata = options.imagedata;
        }
        const shape = elementFactory.createShape(
          assign({ type: type, businessObject: businessObject }, options)
        );
        create.start(event, shape);
      };
    }

    function createAction(type, group, className, title, options) {
      const shortType = type.replace(/^bpmn:/, '');
      return {
        group: group,
        className: className,
        title: title || 'Create ' + shortType,
        action: {
          dragstart: createTask(type, options),
          click: createTask(type, options)
        }
      };
    }

    function createParticipant(event, collapsed) {
      create.start(event, elementFactory.createParticipantShape(collapsed));
    }

    function createSubprocess(event) {
      var subProcess = elementFactory.createShape({
        type: 'bpmn:SubProcess',
        x: 0,
        y: 0,
        isExpanded: true
      });

      var startEvent = elementFactory.createShape({
        type: 'bpmn:StartEvent',
        x: 40,
        y: 82,
        parent: subProcess
      });

      create.start(event, [subProcess, startEvent], {
        hints: {
          autoSelect: [startEvent]
        }
      });
    }


    return {
      'hand-tool': {
        group: 'tools',
        className: 'bpmn-icon-hand-tool',
        title: translate('Activate the hand tool'),
        action: {
          click: function (event) {
            handTool.activateHand(event);
          }
        }
      },
      'lasso-tool': {
        group: 'tools',
        className: 'bpmn-icon-lasso-tool',
        title: translate('Activate the lasso tool'),
        action: {
          click: function (event) {
            lassoTool.activateSelection(event);
          }
        }
      },
      'space-tool': {
        group: 'tools',
        className: 'bpmn-icon-space-tool',
        title: translate('Activate the create/remove space tool'),
        action: {
          click: function (event) {
            spaceTool.activateSelection(event);
          }
        }
      },
      'global-connect-tool': {
        group: 'tools',
        className: 'bpmn-icon-connection-multi',
        title: translate('Activate the global connect tool'),
        action: {
          click: function (event) {
            globalConnect.toggle(event);
          }
        }
      },
      'tool-separator': {
        group: 'tools',
        separator: true
      },
      'create.start-event': createAction(
        'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none',
        translate('Create StartEvent')
      ),
      'create.intermediate-event': createAction(
        'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none',
        translate('Create Intermediate/Boundary Event')
      ),
      'create.end-event': createAction(
        'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
        translate('Create EndEvent')
      ),
      'create.exclusive-gateway': createAction(
        'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-none',
        translate('Create Gateway')
      ),
      'create.task': createAction(
        'bpmn:Task', 'activity', 'bpmn-icon-task',
        translate('Create Task')
      ),
      'create.data-object': createAction(
        'bpmn:DataObjectReference', 'data-object', 'bpmn-icon-data-object',
        translate('Create DataObjectReference')
      ),
      'create.data-store': createAction(
        'bpmn:DataStoreReference', 'data-store', 'bpmn-icon-data-store',
        translate('Create DataStoreReference')
      ),
      'create.subprocess-expanded': {
        group: 'activity',
        className: 'bpmn-icon-subprocess-expanded',
        title: translate('Create expanded SubProcess'),
        action: {
          dragstart: createSubprocess,
          click: createSubprocess
        }
      },
      'create.participant-expanded': {
        group: 'collaboration',
        className: 'bpmn-icon-participant',
        title: translate('Create Pool/Participant'),
        action: {
          dragstart: createParticipant,
          click: createParticipant
        }
      },
      'create.group': createAction(
        'bpmn:Group', 'artifact', 'bpmn-icon-group',
        translate('Create Group')
      ),
      'custom-separator': {
        group: 'custom',
        separator: true
      },
      'custom-star': {
        group: 'custom',
        className: 'icon-custom-star',
        title: translate('Create Task with average suitability score'),
        action: {
          dragstart: createTask('bpmn:DataObjectReference', { imagedata: Star }),
          click: createTask('bpmn:DataObjectReference', { imagedata: Star }),
        }
      },
      'custom-iphone': {
        group: 'custom',
        className: 'icon-custom-iphone',
        title: translate('Create Task with average suitability score'),
        action: {
          dragstart: createTask('bpmn:DataObjectReference', { imagedata: Iphone }),
          click: createTask('bpmn:DataObjectReference', { imagedata: Iphone }),
        }
      },
      'custom-team': {
        group: 'custom',
        className: 'icon-custom-team',
        title: translate('Create Task with average suitability score'),
        action: {
          dragstart: createTask('bpmn:DataObjectReference', { imagedata: Team }),
          click: createTask('bpmn:DataObjectReference', { imagedata: Team }),
        }
      },
      'custom-tv-display': {
        group: 'custom',
        className: 'icon-custom-tv-display',
        title: translate('Create Task with average suitability score'),
        action: {
          dragstart: createTask('bpmn:DataObjectReference', { imagedata: TvDisplay }),
          click: createTask('bpmn:DataObjectReference', { imagedata: TvDisplay }),
        }
      },
      'custom-warning': {
        group: 'custom',
        className: 'icon-custom-warning',
        title: translate('Create Task with average suitability score'),
        action: {
          dragstart: createTask('bpmn:DataObjectReference', { imagedata: Warning }),
          click: createTask('bpmn:DataObjectReference', { imagedata: Warning }),
        }
      }
    };
  }
}

CustomPaletteProvider.$inject = [
  'bpmnFactory',
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate'
];