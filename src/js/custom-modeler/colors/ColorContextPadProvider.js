


export default class ColorContextPadProvider {
  constructor(contextPad, popupMenu, canvas) {
    this._contextPad = contextPad;
    this._popupMenu = popupMenu;
    this._canvas = canvas;

    this.self = this;
    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const self = this.self;
    console.log('ColorContextPadProvider-getContextPadEntries',this,self)
    var actions = {
      'set-color': {
        group: 'edit',
        className: 'bpmn-icon-color',
        title: 'Set Color',
        action: {
          click: function (event, element) {
            console.log('ColorContextPadProvider-set-color',this,self)
            // close any existing popup
            self._popupMenu.close();

            // create new color-picker popup
            //var colorPicker = create(self._popupMenu,'color-picker', element);

            // get start popup draw start position
            var opts = getStartPosition(self._canvas, self._contextPad, element);

            // or fallback to current cursor position
            opts.cursor = {
              x: event.x,
              y: event.y
            };

            // open color picker submenu popup
            //element, id, position
            //colorPicker.open(opts, element);
            //colorPicker.open(element,'color-picker',opts);
            self._popupMenu.open(element,'color-picker',opts);
          }
        }
      }
    };

    return actions;
  };
}

ColorContextPadProvider.$inject = [
  'contextPad',
  'popupMenu',
  'canvas'
];


// helpers //////////////////////

function getStartPosition(canvas, contextPad, element) {

  var Y_OFFSET = 5;

  var diagramContainer = canvas.getContainer(),
    pad = contextPad.getPad(element).html;

  var diagramRect = diagramContainer.getBoundingClientRect(),
    padRect = pad.getBoundingClientRect();

  var top = padRect.top - diagramRect.top;
  var left = padRect.left - diagramRect.left;

  var pos = {
    x: left,
    y: top + padRect.height + Y_OFFSET
  };

  return pos;
}