import React from 'react';
import './Line.css';

class Line extends React.Component {
    render() {
        return (
            <line x1={this.props.item.source.x} y1={this.props.item.source.y} x2={this.props.item.target.x} y2={this.props.item.target.y} style={this.props.lineStyle}></line>
        )
    }
}

export default Line;
