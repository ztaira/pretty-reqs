import React from 'react';
import './Upload.css'

class Upload extends React.Component {
    render() { 
        return (
            <div>
                <input onChange={this.props.uploadFunc} type="file" id="upload"/>
                <button onClick={this.props.uploadCoverFunc} id="uploadCover">Upload</button>
            </div>
        );
    }
}

export default Upload;
