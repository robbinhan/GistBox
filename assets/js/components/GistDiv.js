import React, { Component } from 'react';
import _ from 'lodash'

export default class GistDiv extends Component {

  componentDidMount () {
    console.log('componentDidMount');
    this._hightlight();
  }

  componentDidUpdate () {
    console.log('componentDidUpdate');
    this._hightlight();

    var client = new ZeroClipboard( document.getElementsByClassName("copy-button") );
  }

  _hightlight () {
      console.log('_hightlight')
      Prism.highlightAll(true);
  }
    
  render() {
    let self = this
    console.log('gistdiv',self.props)
    
    let row = self.props.items.map(function (gist,index) {
      let  language = 'textile';
      if (gist.language !== null) {
            language = gist.language === 'Shell' ? 'bash' : gist.language.toLowerCase();
      }

      if (language === 'text') {
            language = 'textile';
      }

      let cname = "language-"+ language;
      let pname = "line-numbers" + " " + cname;
       return (
            <div >
                  <h2>{gist.filename}</h2>
                  <span>
                            <button className="copy-button" data-clipboard-text={gist.code}>复制</button>
                  </span>
                  <div className="gist-div">
                        <pre className={pname}>
                              <code className={cname}>{gist.code}</code>
                        </pre>
                  </div>
            </div>
      )
    })
    console.log('row',row)
    if (_.isEmpty(row)) {
      row = "请先获取Gist"
    }
    return (
       <div className="code-div" >
        { row }
       </div>
    );
  }
}