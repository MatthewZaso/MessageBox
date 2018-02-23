import '../styles/main.scss'

class MessageBox {
  constructor(element) {
    this.base = element;

    this.recipientInput = this.base.querySelector('.message-box__send__recipient');
    this.messageInput = this.base.querySelector('.message-box__send__message');

    this.sendBtn = this.base.querySelector('.message-box__send__send-btn');
    this.refreshBtn = this.base.querySelector('.message-box__send__refresh-btn');

    this.messagesContainer = this.base.querySelector('.message-box__messages__container');

    this._bindListeners();
  }

  _bindListeners() {
    this._boundSendClick = this._onSendClick.bind(this);
    this.sendBtn.addEventListener('click', this._boundSendClick);
    this._boundRefreshClick = this._onRefreshClick.bind(this);
    this.refreshBtn.addEventListener('click', this._boundRefreshClick);
  }

  _onSendClick(evt) {
    console.log('send');

    const recipient = this.recipientInput.value;
    const message = this.messageInput.value;

    if(recipient !== '' && message !== '') {
      this._sendMessage(recipient, message).then(data => console.log('message sent'));
    } else {
      alert('please fill out all required fields');
    }
  }

  _onRefreshClick(evt) {
    console.log('refresh');
    this._fetchMessages().then(data => this._renderMessage(data));
  }

  _fetchMessages() {
    return fetch(`/messages`).then(response => response.json());
  }

  _renderMessage(data) {
    const markup = data.reduce((acc, item) => {
      return acc += `
        <div><span>For: ${item.recipient}</span>  <span>Message: ${item.message}</span></div>
      `;
    }, '');

    this.messagesContainer.innerHTML = markup;
  }

  _sendMessage(recipient, message) {
    const data = { recipient, message };

    return fetch(`/send`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(this._fetchMessages());
  }
}

window.MessageBox = new MessageBox(document.querySelector('.message-box'));
