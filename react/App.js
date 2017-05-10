import React, { Component } from 'react';
import './App.css';
import Upload from './Upload';
import Update from './Update';
import Download from './Download';
import ManualSVG from './ManualSVG';

class App extends Component {
  constructor(props) {
      super(props);
      this.uploadFunc = this.uploadFunc.bind(this);
      this.updateFunc = this.updateFunc.bind(this);
      this.uploadCoverFunc = this.uploadCoverFunc.bind(this);
      this.state = {
          update: true,
      }
  }

  uploadCoverFunc() {
      var e = new MouseEvent('click');
      document.getElementById('upload').dispatchEvent(e);
  }

  uploadFunc() {
      var uploadedFile = document.getElementById('upload').files[0];
      var textarea = document.getElementById(this.props.textarea);
      var textType = /text.*/;
      if (uploadedFile === undefined){
      }
      else if (uploadedFile.type.match(textType)) {
          var reader = new FileReader();
          reader.onload = (function(e) {
              textarea.value = reader.result;
              this.setState({'text': this.state.update ? false : true});
          }).bind(this);
          reader.readAsText(uploadedFile);
      }
      else {
          textarea.value = 'File Not Supported';
          this.setState({'text': this.state.update ? false : true});
      }
  }

  updateFunc() {
      this.setState({'text': this.state.update ? false : true});
  }

  render() {
    return (
      <div>
        <div>
          <Upload uploadFunc={this.uploadFunc} uploadCoverFunc={this.uploadCoverFunc}/>
          <Update updateFunc={this.updateFunc}/>
          <Download textarea={this.props.textarea} />
        </div>
        <div>
          <textarea id={this.props.textarea} rows='30' cols='30'></textarea>
          <ManualSVG textarea={this.props.textarea} width='394' height='394' />
        </div>
      </div>
    );
  }
}


export default App;
