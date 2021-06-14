
import './color-picker.css'
import ColorRenderer from './ColorRenderer';
import ColorContextPadProvider from './ColorContextPadProvider';
import ColorPopupProvider from './ColorPopupProvider';

export default {
  __init__: ['colorRenderer','colorContextPadProvider','colorPopupProvider'],
  colorRenderer: [ 'type', ColorRenderer ],
  colorContextPadProvider: [ 'type', ColorContextPadProvider ],
  colorPopupProvider: [ 'type', ColorPopupProvider ]
};