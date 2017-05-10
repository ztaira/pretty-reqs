import React from 'react';

class Update extends React.Component {
    render() { 
        return (
            <button onClick={this.props.updateFunc} id="update">Update</button>
        );
    }
}

export default Update;
