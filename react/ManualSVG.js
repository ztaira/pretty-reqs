import React from 'react';
import Circle from './Circle';
import Line from './Line';
import './ManualSVG.css';

class ManualSVG extends React.Component {
    constructor(props) {
        super(props);
        this.processText = this.processText.bind(this);
        this.createAllNodes = this.createAllNodes.bind(this);
        this.getNodeIndex = this.getNodeIndex.bind(this);
        this.getNode = this.getNode.bind(this);
        this.setNodeDefaults = this.setNodeDefaults.bind(this);
    }

    processText() {
        var textarea = document.getElementById(this.props.textarea);
        if (textarea !== null) {
            var splitList = textarea.value.split('\n');
            var field, value, values;
            var currentNode = 0;
            var allNodes = this.createAllNodes(splitList);
            var allLinks = [];
            for (var i = 0; i < splitList.length; i++) {
                if (splitList[i] !== "" && splitList[i].includes(':')) {
                    field = splitList[i].match(/\s*(.*)\s*:\s*.*\s*/);
                    value = splitList[i].match(/\s*.*\s*:\s*(.*)\s*/);
                    if (field[1] !== null && value[1] !== null && value[1] !== "") {
                        field = field[1];
                        value = value[1];
                        if (field === "id") {
                            currentNode = this.getNodeIndex(value, allNodes);
                        }
                        else if (field === "links") {
                            values = value.split(/,\s*/);
                            for (var j = 0; j < values.length; j++) {
                                if (this.getNode(values[j], allNodes) === null) {
                                    allNodes.push({'id': values[j]});
                                }
                                allLinks.push({'linkID': allLinks.length, 'target': this.getNode(values[j], allNodes), 'source': this.getNode(allNodes[currentNode].id, allNodes)});
                            }
                        }
                        else {
                            allNodes[currentNode][field] = value;
                        }
                    }
                }
            }
            return {'nodes': this.setNodeDefaults(allNodes), 'links': allLinks};
        }
        return {'nodes': [], 'links': []};
    }

    setNodeDefaults(nodes) {
        for (var node = 0; node < nodes.length; node++) {
            if (nodes[node].x === undefined) nodes[node].x = 0 ;
            if (nodes[node].y === undefined) nodes[node].y = 0 ;
            if (nodes[node].r === undefined) nodes[node].r = 10 ;
            if (nodes[node].color === undefined) {
                if (nodes[node].r < 24) {
                    nodes[node].color = 'silver';
                }
                else {
                    nodes[node].color = 'dimgrey';
                }
            };
        }
        return nodes;
    }

    createAllNodes(splitList) {
        var nodes = [];
        var nodeIDs = [];
        var field, value;
        for (var i = 0; i < splitList.length; i++) {
            if (splitList[i] !== "" && splitList[i].includes(':')) {
                field = splitList[i].match(/\s*(.*)\s*:\s*.*\s*/);
                value = splitList[i].match(/\s*.*\s*:\s*(.*)\s*/);
                if (field[1] !== null && value[1] !== null && value[1] !== "") {
                    field = field[1];
                    value = value[1];
                    if (field === "id" && nodeIDs.indexOf(value) === -1) {
                        nodes.push({[field]: value});
                        nodeIDs.push(value);
                    }
                }
            }
        }
        return nodes;
    }

    getNodeIndex(id, nodes) {
        for (var nodenum = 0; nodenum < nodes.length; nodenum++) {
            if (nodes[nodenum].id === id) {
                return nodenum;
            }
        }
        return null;
    }

    getNode(id, nodes) {
        for (var nodenum = 0; nodenum < nodes.length; nodenum++) {
            if (nodes[nodenum].id === id) {
                return nodes[nodenum];
            }
        }
        return null;
    }

    render() {
        var items = this.processText();
        console.log('svg items', items);
        return (
            <svg width={this.props.width} height={this.props.height}>
                <g className='links'>{items.links.map(function(item) {
                    return <Line key={item.linkID} item={item}/>;
                })}</g>
                <g className='nodes'>{items.nodes.map(function(item) {
                    return <Circle key={item.id} item={item} />;
                })}</g>
            </svg>
        );
    }

}

export default ManualSVG;
