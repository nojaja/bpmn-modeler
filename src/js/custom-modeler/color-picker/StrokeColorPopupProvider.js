import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

const CALL_PRIORITY = 2000

export default class StrokeColorPopupProvider {
  constructor(popupMenu, modeling) {
    this._popupMenu = popupMenu;
    this._modeling = modeling;
    this._popupMenu.registerProvider('stroke-color-picker', this);
  }

  getEntries(element) {
    const self = this;


    const colors = [
      {
        label: 'Black',
        hex: '000000'
      }, {
        label: 'Gray',
        hex: 'b7b7b7'
      }, {
        label: 'Dark-Gray',
        hex: '434343'
      }, {
        label: 'Light-Gray',
        hex: 'efefef'
      }, {
        label: 'Red',
        hex: 'ff0000'
      }, {
        label: 'Dark-Red',
        hex: 'cc0000'
      }, {
        label: 'Light-Red',
        hex: 'e06666'
      }, {
        label: 'Orange',
        hex: 'ff7f00'
      }, {
        label: 'Dark-Orange',
        hex: 'e69138'
      }, {
        label: 'Light-Orange',
        hex: 'f6b26b'
      }, {
        label: 'Yellow',
        hex: 'ffff00'
      }, {
        label: 'Dark-Yellow',
        hex: 'f1c232'
      }, {
        label: 'Light-Yellow',
        hex: 'ffd966'
      }, {
        label: 'Green',
        hex: '00ff00'
      }, {
        label: 'Dark-Green',
        hex: '6aa84f'
      }, {
        label: 'Light-Green',
        hex: '93c47d'
      }, {
        label: 'Blue',
        hex: '0000ff'
      }, {
        label: 'Dark-Blue',
        hex: '3c78d8'
      }, {
        label: 'Light-Blue',
        hex: '6d9eeb'
      }, {
        label: 'Indigo',
        hex: '4b0082'
      }, {
        label: 'Dark-Indigo',
        hex: '674ea7'
      }, {
        label: 'Light-Indigo',
        hex: '8e7cc3'
      }, {
        label: 'Violet',
        hex: '9400d3'
      }, {
        label: 'Dark-Violet',
        hex: 'a64d79'
      }, {
        label: 'Light-Violet',
        hex: 'c27ba0'
      }
    ];

    const entries = colors.map(function (color) {
      return {
        label: color.label,
        id: color.label.toLowerCase() + '-color',
        className: 'color-icon-' + color.hex,
        action: createAction(self._modeling, element, '#' + color.hex)
      };
    });

    return entries;
  }


  getHeaderEntries(element) {
    return [
      {
        label: 'Clear',
        id: 'clear-color',
        className: 'color-icon-clear',
        action: createAction(this._modeling, element)
      }
    ];
  };

}


StrokeColorPopupProvider.$inject = [
  'popupMenu',
  'modeling'
];



function createAction(modeling, element, newColor) {
  // set hex value to an element
  return function () {
    var bo = getBusinessObject(element);
    var di = bo.di;

    var currentColor = di.get('color:border-color');

    console.log('Replacing colors from/to: ', currentColor, newColor);

    var ns = (
      newColor ?
        'http://www.omg.org/spec/BPMN/non-normative/color/1.0' :
        undefined
    );

    modeling.updateProperties(element, {
      di: {
        'xmlns:color': ns,
        'color:border-color': newColor
      }
    });

  };
}