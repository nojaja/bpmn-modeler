import Cat from '../cat';


/**
 * A provider for quick service task production
 */
export default class NyanPaletteProvider {
  constructor(palette, create, elementFactory) {
    this._create = create;
    this._elementFactory = elementFactory;
    palette.registerProvider(this);
  }
  getPaletteEntries () {
    let elementFactory = this._elementFactory,
        create = this._create;
  
    function startCreate(event) {
      console.log('startCreate',event)
      var serviceTaskShape = elementFactory.create(
        'shape', { type: 'bpmn:ServiceTask' }
      );
      create.start(event, serviceTaskShape);
    }
  
    return {
      'create-service-task': {
        group: 'activity',
        title: 'Create a new nyan CAT!',
        imageUrl: Cat.dataURL,
        action: {
          dragstart: startCreate,
          click: startCreate
        }
      }
    };
  };
}

NyanPaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory'
];
