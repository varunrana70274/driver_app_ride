import React, {PureComponent} from 'react';
import {Provider} from 'react-redux';

const injectStore = (Component, store) => {
  return class extends PureComponent {
    render = () => (
      <Provider store={store}>
        <Component {...this.props} />
      </Provider>
    );
  };
};

export default injectStore;
