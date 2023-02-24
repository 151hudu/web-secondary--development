import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ResponseDataHoc } from '@sd-ui/custom-plugin';

if (process.env.NODE_ENV !== 'production') {
  require('antd/dist/antd.css');
}

if (process.env.NODE_ENV !== 'production') {
  const props = require('./mock').props;
  const propsConfig = require('./mock').propsConfig;
  console.log(props);
  const Apps = () => (
    <>
      <App {...propsConfig} />
    </>
  );
  ReactDOM.render(<Apps {...props} />, document.getElementById('root'));
} else {
  if (!window.CUSTOM_PLUGIN) {
    window.CUSTOM_PLUGIN = new Map();
  }
  window.CUSTOM_PLUGIN.set(
    process.env.CUSTOM_PLUGIN_ID,
    (dom, props, context, eventBus) => {
      const pluginProps = {
        props,
        context,
        eventBus,
      };
      ReactDOM.render(ResponseDataHoc(pluginProps)(App), dom);
      // ReactDOM.render(<App {...props} />, dom);
    }
  );
}
