import React, { Component } from 'react';

export default class UserList extends Component {
    

  render() {
    let self = this
    console.log('gistform',self.props)
    return (
      <form onSubmit={ function(e) { e.preventDefault(); self.props.handlerSubmit(self.props.username) } } >
        <input name="username" 
        value={this.props.username} 
        onChange={(e) => self.props.handlerChange(e.target.value)} />
        <button>获取</button>
      </form>
    );
  }
}