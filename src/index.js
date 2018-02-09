import grapesjs from 'grapesjs';

export default grapesjs.plugins.add('grapesjs-expose', (editor, opts = {}) => {
  const options = { ...{
    target: 'xGrapes'
  },  ...opts };

  console.log('Exposing variables...');

  const getExposedObj = () => {
    const domc = editor.DomComponents;
    const comps = domc.getComponents();
    let exposedObj = {};

    comps.forEach(comp => {
      comps.models.forEach(model => {
        const { expose } = model.attributes;
        if (!expose) return null
        exposedObj = {
          ...exposedObj,
          ...expose
        };
      })
    });

    return exposedObj;
  };

  const updateExpose = model => {
    console.log(model);
    const stop = !model || model.attributes['data-id'] === 'grapes-expose-container';
    if (stop) return null

    const exposedObj = getExposedObj();
    console.log('changing:', exposedObj);

    editor.DomComponents.addComponent({
      'data-id': 'grapes-expose-container',
      tagName: 'script',
      removable: false, // Can't remove it
      draggable: false, // Can't move it
      copyable: false, // Disable copy/past
      content: `window.${options.target} = ${JSON.stringify(exposedObj)};` // Text inside component
    });
  };

  editor.on('load component:add component:remove', updateExpose)
});
