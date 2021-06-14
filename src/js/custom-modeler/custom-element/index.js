import CustomElementFactory from './CustomElementFactory';
import CustomOrderingProvider from './CustomOrderingProvider';
import CustomPalette from './CustomPaletteProvider';
import CustomRenderer from './CustomRenderer';
import CustomRules from './CustomRules';



export default {
  __init__: [
    'customOrderingProvider',
    'customRenderer',
    'customRules',
    'paletteProvider',
  ],
  customOrderingProvider: [ 'type', CustomOrderingProvider ],　//表示順
  customRenderer: [ 'type', CustomRenderer ],
  customRules: [ 'type', CustomRules ],
  elementFactory: [ 'type', CustomElementFactory ],
  paletteProvider: [ 'type', CustomPalette ],
};
