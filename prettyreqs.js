var upload, textarea, update, textFile, download, allNodes, allLinks, simulation,
    svg, node, link, g;

window.onload = function() {
    // ======================================================================
    // VARIABLES
    // ======================================================================

    upload = document.getElementById("upload");
    update = document.getElementById("update");
    download = document.getElementById("download");
    textarea = document.getElementById("textarea");
    textFile = null;
    allNodes = [];
    allLinks = [];

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
    function processText(text) {
        var splitList = text.split("\n");
        var field, value;
        var currentNode = 0;
        allNodes = createAllNodes(splitList);
        allLinks = [];
        for (var i = 0; i < splitList.length; i++) {
            if (splitList[i] !== "") {
                field = splitList[i].match(/\s*(.*)\s*:\s*.*\s*/);
                value = splitList[i].match(/\s*.*\s*:\s*(.*)\s*/);
                if (field[1] !== null && value[1] !== null && value[1] !== "") {
                    field = field[1];
                    value = value[1];
                    if (field === "id") {
                        currentNode = getNodeIndex(value);
                    }
                    else if (field === "links") {
                        values = value.split(/,\s*/);
                        for (var j = 0; j < values.length; j++) {
                            allLinks.push({'target': getNode(values[j]), 'source': getNode(allNodes[currentNode].id)});
                        }
                    }
                    else {
                        allNodes[currentNode][field] = value;
                    }
                }
            }
        }
        console.log(allNodes, allLinks);
    }

    // creates allNodes based on the id's in the text
    function createAllNodes(splitList) {
        var nodes = [];
        var nodeIDs = [];
        var field, value;
        for (var i = 0; i < splitList.length; i++) {
            if (splitList[i] !== "") {
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
    function getNode(id) {
        for (var nodenum = 0; nodenum < allNodes.length; nodenum++) {
            if (allNodes[nodenum].id === id) {
                return allNodes[nodenum];
            }
        }
        return null;
    }

    // gets the index of the first node with the id given
    function getNodeIndex(id) {
        for (var nodenum = 0; nodenum < allNodes.length; nodenum++) {
            if (allNodes[nodenum].id === id) {
                return nodenum;
            }
        }
        return null;
    }

    // ======================================================================
    // GRAPH
    // ======================================================================

    // function to be called on tick
    function ticked() {
        node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });

        link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
    }

    // function to restart the simulation
    function restart() {
      processText(textarea.value);

      // Apply the general update pattern to the nodes.
      node = node.data(allNodes);
      node.exit().remove();
      node = node.enter().append("circle")
          .attr("fill", function(d) { return color(d.id); })
          .attr("r", 8)
          .attr("id", function(d) { return d.id; })
          .merge(node);

      // Apply the general update pattern to the links.
      link = link.data(allLinks);
      link.exit().remove();
      link = link.enter().append("line").merge(link);

      // Update and restart the simulation.
      simulation.nodes(allNodes);
      simulation.force("link").links(allLinks);
      simulation.alpha(1).restart();
    }

    svg = d3.select("svg");
    width = +svg.attr("width");
    height = +svg.attr("height");
    color = d3.scaleOrdinal(d3.schemeCategory20c);

    simulation = d3.forceSimulation(allNodes)
        .force("charge", d3.forceManyBody().strength(-50))
        .force("link", d3.forceLink(allLinks).distance(100))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .alphaTarget(1)
        .on("tick", ticked);

    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link");
    node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");
};

