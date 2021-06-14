


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
    const actions = {
      'set-fill-color': {
        group: 'edit',
        className: 'bpmn-icon-fillcolor',
        title: 'Set Fill Color',
        action: {
          click: function (event, element) {
            // close any existing popup
            self._popupMenu.close();

            // create new color-picker popup
            //var colorPicker = create(self._popupMenu,'color-picker', element);

            // get start popup draw start position
            const opts = getStartPosition(self._canvas, self._contextPad, element);

            // or fallback to current cursor position
            opts.cursor = {
              x: event.x,
              y: event.y
            };

            // open color picker submenu popup
            //element, id, position
            self._popupMenu.open(element, 'fill-color-picker', opts);
          }
        }
      },
      'set-stroke-color': {
        group: 'edit',
        className: 'bpmn-icon-strokecolor',
        title: 'Set Stroke Color',
        action: {
          click: function (event, element) {
            // close any existing popup
            self._popupMenu.close();

            // create new color-picker popup
            //var colorPicker = create(self._popupMenu,'color-picker', element);

            // get start popup draw start position
            const opts = getStartPosition(self._canvas, self._contextPad, element);

            // or fallback to current cursor position
            opts.cursor = {
              x: event.x,
              y: event.y
            };

            // open color picker submenu popup
            //element, id, position
            self._popupMenu.open(element, 'stroke-color-picker', opts);
          }
        }
      }
    }
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

  const Y_OFFSET = 5;

  const diagramContainer = canvas.getContainer(),
    pad = contextPad.getPad(element).html;

  const diagramRect = diagramContainer.getBoundingClientRect(),
    padRect = pad.getBoundingClientRect();

  const top = padRect.top - diagramRect.top;
  const left = padRect.left - diagramRect.left;

  const pos = {
    x: left,
    y: top + padRect.height + Y_OFFSET
  };

  return pos;
}