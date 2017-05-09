window.onload = function() {
    // ======================================================================
    // VARIABLES
    // ======================================================================

    var upload = document.getElementById("upload");
    var update = document.getElementById("update");
    var download = document.getElementById("download");
    var textarea = document.getElementById("textarea");
    var textFile = null;

    // ======================================================================
    // UPLOAD
    // ======================================================================

    // add an onchange listener so things happen upon upload
    upload.addEventListener("change", function(e) {
        // get the uploaded file
        // if it's text, do some stuff
        // otherwise, do some other stuff
        var uploadedFile = upload.files[0];
        var textType = /text.*/;
        if (uploadedFile === undefined){
        }
        else if (uploadedFile.type.match(textType)) {
            var reader = new FileReader();
            reader.onload = function(e) {
                textarea.value = reader.result;
                restart();
            };
            reader.readAsText(uploadedFile);
        }
        else {
            textarea.value = "File Not Supported";
        }
    });

    // make the uploadCover button click the upload button when click
    uploadCover.addEventListener("click", function() {
        var e = new MouseEvent("click");
        upload.dispatchEvent(e);
    });

    // ======================================================================
    // UPDATE
    // ======================================================================

    update.addEventListener("click", restart);

    // ======================================================================
    // DOWNLOAD
    // ======================================================================

    // function to make the text file
    function makeTextFile(text) {
        var data = new Blob([text], {"type": "text/plain"});
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }
        textFile = window.URL.createObjectURL(data);
        return textFile;
    }

    // add an onclick listener so things happen upon click
    // when clicked, create a blob, create a URL for it, and download it via link
    download.addEventListener("click", function() {
        var link = document.createElement("a");
        link.setAttribute("download", "download.txt");
        link.href = makeTextFile(textarea.value);
        document.body.appendChild(link);
        window.requestAnimationFrame(function() {
            var e = new MouseEvent("click");
            link.dispatchEvent(e);
            document.body.removeChild(link);
        });
    });

    // ======================================================================
    // TEXT PROCESSING
    // ======================================================================

    // function to process text in file
    function processText() {
        var textarea = document.getElementById('textarea');
        if (textarea !== null) {
            var splitList = textarea.value.split('\n');
            var field, value, values;
            var currentNode = 0;
            var allNodes = createAllNodes(splitList);
            var allLinks = [];
            for (var i = 0; i < splitList.length; i++) {
                if (splitList[i] !== "" && splitList[i].includes(':')) {
                    field = splitList[i].match(/\s*(.*)\s*:\s*.*\s*/);
                    value = splitList[i].match(/\s*.*\s*:\s*(.*)\s*/);
                    if (field[1] !== null && value[1] !== null && value[1] !== "") {
                        field = field[1];
                        value = value[1];
                        if (field === "id") {
                            currentNode = getNodeIndex(value, allNodes);
                        }
                        else if (field === "links") {
                            values = value.split(/,\s*/);
                            for (var j = 0; j < values.length; j++) {
                                if (getNode(values[j], allNodes) === null) {
                                    allNodes.push({'id': values[j]});
                                }
                                allLinks.push({'linkID': allLinks.length, 'target': getNode(values[j], allNodes), 'source': getNode(allNodes[currentNode].id, allNodes)});
                            }
                        }
                        else {
                            allNodes[currentNode][field] = value;
                        }
                    }
                }
            }
            return {'nodes': setNodeDefaults(allNodes), 'links': allLinks};
        }
        return {'nodes': [], 'links': []};
    }

    // creates allNodes based on the id's in the text
    function createAllNodes(splitList) {
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

    // gets the first node with the id given
    function getNode(id, nodes) {
        for (var nodenum = 0; nodenum < nodes.length; nodenum++) {
            if (nodes[nodenum].id === id) {
                return nodes[nodenum];
            }
        }
        return null;
    }

    // gets the index of the first node with the id given
    function getNodeIndex(id, nodes) {
        for (var nodenum = 0; nodenum < nodes.length; nodenum++) {
            if (nodes[nodenum].id === id) {
                return nodenum;
            }
        }
        return null;
    }

    // function to set node defaults
    function setNodeDefaults(nodes) {
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

    // ======================================================================
    // GRAPH
    // ======================================================================

    // function to empty the current svg and then add nodes based on what's
    // in the textarea
    function restart() {
      var items = processText(textarea.value);
      var links = document.getElementById("links");
      var nodes = document.getElementById("nodes");
      links.innerHTML = '';
      nodes.innerHTML = '';
      for (var item = 0; item<items.nodes.length; item++) {
          var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', items.nodes[item].x);
          circle.setAttribute('cy', items.nodes[item].y);
          circle.setAttribute('r', items.nodes[item].r);
          circle.setAttribute('fill', items.nodes[item].color);
          nodes.append(circle);
      }
      for (var item = 0; item<items.links.length; item++) {
          var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', items.links[item].source.x);
          line.setAttribute('y1', items.links[item].source.y);
          line.setAttribute('x2', items.links[item].target.x);
          line.setAttribute('y2', items.links[item].target.y);
          links.append(line);
      }
    }
};

