
let tsModel: monaco.editor.IReadOnlyModel;
let makeModelContent: (model: monaco.editor.IReadOnlyModel) => string = () => '';
let blockPosition = {
  start: 0,
  end: 0
};
let extraChars = 0;

const Embeddable = {
  setup(myLang: string) {
    tsModel = monaco.editor.createModel('', 'typescript');
    monaco.languages.typescript.setupEmbedded(myLang);
  },

  startBlock(position: number) {
    blockPosition.start = position;
  },

  endBlock(position: number) {
    blockPosition.end = position;
  },

  get blockPosition() {
    return blockPosition;
  },

  registerReplace(before: string, after: string) {
    const shift = after.length - before.length;
    extraChars += shift;
    return shift;
  },

  isOffsetInsideBlock(offset: number) {
    const _offset = offset - extraChars;
    return _offset >= blockPosition.start && _offset <= blockPosition.end;
  },

  setMakeModelContent(func: (model: monaco.editor.IReadOnlyModel) => string) {
    makeModelContent = (model: monaco.editor.IReadOnlyModel) => {
      extraChars = 0;
      return func(model);
    };
  },

  getModel(originalModel: monaco.editor.IReadOnlyModel) {
    const text = makeModelContent(originalModel);
    tsModel.setValue(text);
    return tsModel;
  },

  getRawModel() {
    return tsModel;
  }
};
export default Embeddable;
declare var window: any;
window.Embeddable = Embeddable;
