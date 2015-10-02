import React, { Component } from 'react';
import GistForm from './GistForm';
import GistDiv from './GistDiv';
import { fetchGists } from '../actions/user';

export default class UserBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('call once');
    console.log(this.props)
    return (
      <div className="userBox">
            <h1>GistBox</h1>
            <GistForm username={this.props.username} 
                handlerSubmit={this.props.handlerSubmit}   
                handlerChange={this.props.handlerChange} />
            <GistDiv items={this.props.items} />
      </div>
    );
  }
}