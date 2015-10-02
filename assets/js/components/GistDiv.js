import React, { Component } from 'react';

export default class GistDiv extends Component {
    
  render() {
    let self = this
    console.log('gistdiv',self.props)
    let row = self.props.items.map(function (url,index) {
      return  <div><a href={url} target="_blank">{index}</a></div>
    })
    console.log(row)
    return (
     <div>
      { row }
     </div>
    );
  }
}