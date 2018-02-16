import grapesjs from 'grapesjs';

export default grapesjs.plugins.add('grapesjs-plugin-expose', (editor, opts = {}) => {
  const options = { ...{
    target: 'xGrapes'
  },  ...opts };

  const getExposedObj = () => {
    const domc = editor.DomComponents;
    const comps = domc.getComponents();
    let exposedObj = {};

    comps.forEach(comp => {
      comps.models.forEach(model => {
        const { expose } = model.attributes;
        if (!expose) return null
        exposedObj = Object.assign(exposedObj, expose);
      });
    });

    const objIsEmpty = Object.keys(exposedObj).length === 0;
    return objIsEmpty ? false : exposedObj;
  };

  let replacer = (key, value) => {
    // if we get a function, give us the code for that function  
    if (typeof value === 'function') {
      return value.toString().replace(/"/g, '\\"');
    }

    return value;
  };

  const updateExpose = model => {
    const dataId = 'grapes-expose-container';
    const stop = !model || model.attributes['data-id'] === dataId;
    if (stop) return null

    const currentComponent = editor.DomComponents
                              .getComponents().models
                              .find(item => item.attributes['data-id'] === dataId);

    if (currentComponent) currentComponent.destroy();
    
    const exposedObj = getExposedObj();
    if (exposedObj) {
      const exposedObjStr = JSON.stringify(exposedObj, replacer, 2).replace(/\n/g, '');
  
      editor.DomComponents.addComponent({
        'data-id': 'grapes-expose-container',
        tagName: 'script',
        removable: false, // Can't remove it
        draggable: false, // Can't move it
        copyable: false, // Disable copy/past
        content: `
          var grapesReviver = function(key, value) {
            if (typeof value === 'string' && value.indexOf('function') === 0) {
              var functionTemplate = '(' + value + ')';    
              return eval(functionTemplate);
            }
            return value;
          };
  
          window.${options.target}Str = '${ exposedObjStr }';
          window.${options.target} = JSON.parse(window.${options.target}Str, grapesReviver);
          `
      });
    }
  };

  editor.on('load component:add component:remove', updateExpose)
});
