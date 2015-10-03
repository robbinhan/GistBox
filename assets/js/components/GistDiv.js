import React, { Component } from 'react';
import _ from 'lodash'

export default class GistDiv extends Component {

  componentDidMount () {
    this._hightlight();
  }

  componentDidUpdate () {
    this._hightlight();

    var client = new ZeroClipboard( document.getElementsByClassName("copy-button") );
  }

  _hightlight () {
      Prism.highlightAll(true);
  }
    
  render() {
    let self = this
    
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
            <div key={index}>
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
    if (_.isEmpty(row)) {
      row = "请先获取Gist"
    }

    if (this.props.isFetching === true) {
      return (
            <div>
            <img src="./public/img/482.GIF" />
            </div>
        )
    }

    if (!_.isEmpty(this.props.error)) {
      row = this.props.error
    };

    return (
       <div className="code-div" >
        { row }
       </div>
    );
  }
}