import React, { Component } from 'react';

export default class GistDiv extends Component {

  componentDidMount () {
    console.log('componentDidMount');
    this._hightlight();
  }

  componentDidUpdate () {
    console.log('componentDidUpdate');
    this._hightlight();
  }

  _hightlight () {
      console.log('_hightlight')
      Prism.highlightAll(true);
  }
    
  render() {
    let self = this
    console.log('gistdiv',self.props)
    let row = self.props.items.map(function (obj,index) {
      let  language = 'text';
      if (obj.language !== null) {
            language = obj.language === 'Shell' ? 'bash' : obj.language.toLowerCase();
      }

      let cname = "language-"+ language;
      let pname = "line-numbers" + " " + cname;
       return (
            <div className="gist-div">
                  <pre className={pname}>
                        <code className={cname}>{obj.code}</code>
                  </pre>
            </div>
      )
    })
    console.log(row)
    return (
     <div >
      { row }
     </div>
    );
  }
}