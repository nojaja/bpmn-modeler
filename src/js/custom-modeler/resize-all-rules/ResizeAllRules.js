import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';


const HIGH_PRIORITY = 1500

export default class ResizeAllRules extends RuleProvider {
  constructor(eventBus) {
    super(eventBus);
  }
  init () {
    this.addRule('shape.resize', HIGH_PRIORITY, function() {
      return true;
    });
  }
}
ResizeAllRules.$inject = [ 'eventBus' ];
