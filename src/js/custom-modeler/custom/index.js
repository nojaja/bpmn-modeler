import ResizeAllModule from './resize-all-rules'
import ColorPickerModule from './color-picker'
//import NyanDrawModule from './nyan/draw'
//import NyanPaletteModule from './nyan/palette'


export default {
  __init__: [
    'resizeAllModule',
    'colorPickerModule',
//    'nyanDrawModule',
//    'nyanPaletteModule'
  ],
  resizeAllModule: [ 'type', ResizeAllModule ],
  colorPickerModule: [ 'type', ColorPickerModule ],
//  nyanDrawModule: [ 'type', NyanDrawModule ],
//  nyanPaletteModule: [ 'type', NyanPaletteModule ],
};
