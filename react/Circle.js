import React from 'react';

class Circle extends React.Component {
    render() {
        return (
            <circle r={this.props.item.r} cx={this.props.item.x} cy={this.props.item.y} fill={this.props.item.color}></circle>
        )
    }
}

export default Circle;
