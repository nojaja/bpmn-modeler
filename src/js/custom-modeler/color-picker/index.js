
import './color-picker.css'
import ColorRenderer from './ColorRenderer';
import ColorContextPadProvider from './ColorContextPadProvider';
import FillColorPopupProvider from './FillColorPopupProvider';
import StrokeColorPopupProvider from './StrokeColorPopupProvider';

export default {
  __init__: ['colorRenderer','colorContextPadProvider','fillColorPopupProvider','strokeColorPopupProvider'],
  colorRenderer: [ 'type', ColorRenderer ],
  colorContextPadProvider: [ 'type', ColorContextPadProvider ],
  fillColorPopupProvider: [ 'type', FillColorPopupProvider ],
  strokeColorPopupProvider: [ 'type', StrokeColorPopupProvider ]
};