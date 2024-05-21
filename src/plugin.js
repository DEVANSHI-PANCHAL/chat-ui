import React from 'react';
import ReactDOM from 'react-dom';
import ChatComponent from './Chat';

class ChatPlugin {
  constructor(containerId) {
    this.containerId = containerId;
  }

  init() {
    ReactDOM.render(<ChatComponent />, document.getElementById(this.containerId));
  }
}

export default ChatPlugin;
