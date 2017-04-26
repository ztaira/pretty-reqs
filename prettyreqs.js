var upload, textarea, textFile, download, allNodes, allLinks;

window.onload = function() {
    // ======================================================================
    // VARIABLES
    // ======================================================================

    upload = document.getElementById("upload");
    textarea = document.getElementById("textarea");
    textFile = null;
    download = document.getElementById("download");
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
                processText(reader.result);
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
    // DOWNLOAD
    // ======================================================================

    // function to make the text file
    var makeTextFile = function(text) {
        var data = new Blob([text], {"type": "text/plain"});
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }
        textFile = window.URL.createObjectURL(data);
        return textFile;
    };

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
    var processText = function(text) {
        var splitList = text.split("\n");
        var field, value;
        for (var i = 0; i < splitList.length; i++) {
            if (splitList[i] !== "") {
                field = splitList[i].match(/\s*(.*)\s*:\s*.*\s*/);
                value = splitList[i].match(/\s*.*\s*:\s*(.*)\s*/);
                if (field[1] !== null && value[1] !== null && value[1] !== "") {
                    field = field[1];
                    value = value[1];
                    console.log(field, value);
                    if (field === "id") {
                        allNodes.push({[field]: value});
                    }
                    else if (field == "links") {
                        values = value.split(/,\s*/);
                        for (var j = 0; j < values.length; j++) {
                            allLinks.push({target: allNodes.slice(-1)[0].id, source: values[j]});
                        }
                    }
                    else {
                        allNodes.slice(-1)[0][field] = value;
                    }
                }
            }
        }
        console.log(allNodes, allLinks);
        d3.select("svg").remove();
        displayGraph();
    };
};

