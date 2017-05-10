import React from 'react';

class Download extends React.Component {
    constructor(props) {
        super(props);
        this.makeTextFile = this.makeTextFile.bind(this);
        this.download = this.download.bind(this);
        this.state = {
            textFile: null,
        };
    }

    makeTextFile(text) {
        var data = new Blob([text], {"type": "text/plain"});
        if (this.textFile !== null) {
            window.URL.revokeObjectURL(this.textFile);
        }
        this.textFile = window.URL.createObjectURL(data);
        return this.textFile;
    }

    download() {
        var textarea = document.getElementById(this.props.textarea);
        var link = document.createElement("a");
        link.setAttribute("download", "download.txt");
        link.href = this.makeTextFile(textarea.value);
        document.body.appendChild(link);
        window.requestAnimationFrame(function() {
            var e = new MouseEvent("click");
            link.dispatchEvent(e);
            document.body.removeChild(link);
        });
    }

    render() {
        return (
            <button onClick={ this.download } id='download'>Download</button>
        );
    }
}

export default Download;
