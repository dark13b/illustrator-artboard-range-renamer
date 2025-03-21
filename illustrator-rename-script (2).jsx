#target illustrator

(function() {
    if (app.documents.length === 0) {
        alert("No document is open. Please open a file and try again.");
        return;
    }

    var doc = app.activeDocument;

    // Prompt for the text to find
    var findStr = prompt("Enter the text to find in artboard names:", "");
    if (findStr === null) {
        alert("Canceled.");
        return;
    }

    // Prompt for the replacement text
    var replaceStr = prompt("Enter the replacement text:", "");
    if (replaceStr === null) {
        alert("Canceled.");
        return;
    }

    // Prompt for artboard numbers or ranges (1-based)
    // Example: "1-3,5,7-9"
    var rangeInput = prompt(
        "Enter artboard numbers/ranges (comma-separated, 1-based), e.g. 1-3,5,7-9:",
        ""
    );
    if (rangeInput === null) {
        alert("Canceled.");
        return;
    }

    // Function to trim whitespace (for older ExtendScript)
    function safeTrim(str) {
        return str.replace(/^\s+|\s+$/g, "");
    }

    var segments = rangeInput.split(",");
    var validIndices = [];

    // Parse each comma-separated segment
    for (var i = 0; i < segments.length; i++) {
        var segment = safeTrim(segments[i]);

        // Check if it's a range (e.g. "2-5")
        if (segment.indexOf("-") !== -1) {
            var parts = segment.split("-");
            if (parts.length === 2) {
                var start = parseInt(parts[0], 10);
                var end = parseInt(parts[1], 10);
                if (!isNaN(start) && !isNaN(end) && start <= end) {
                    for (var r = start; r <= end; r++) {
                        var zeroBased = r - 1;
                        if (zeroBased >= 0 && zeroBased < doc.artboards.length) {
                            validIndices.push(zeroBased);
                        }
                    }
                }
            }
        } else {
            // Single artboard number
            var single = parseInt(segment, 10);
            if (!isNaN(single)) {
                var zeroBasedSingle = single - 1;
                if (zeroBasedSingle >= 0 && zeroBasedSingle < doc.artboards.length) {
                    validIndices.push(zeroBasedSingle);
                }
            }
        }
    }

    // Remove duplicates without using indexOf
    var uniqueIndices = [];
    for (var j = 0; j < validIndices.length; j++) {
        var alreadyAdded = false;
        for (var k = 0; k < uniqueIndices.length; k++) {
            if (uniqueIndices[k] === validIndices[j]) {
                alreadyAdded = true;
                break;
            }
        }
        if (!alreadyAdded) {
            uniqueIndices.push(validIndices[j]);
        }
    }

    if (uniqueIndices.length === 0) {
        alert("No valid artboard numbers/ranges provided. Nothing renamed.");
        return;
    }

    var changedCount = 0;
    for (var m = 0; m < uniqueIndices.length; m++) {
        var abIndex = uniqueIndices[m];
        var ab = doc.artboards[abIndex];
        var oldName = ab.name;

        // Replace all occurrences of findStr
        var regex = new RegExp(findStr, "g");
        var newName = oldName.replace(regex, replaceStr);

        if (newName !== oldName) {
            ab.name = newName;
            changedCount++;
        }
    }

    alert("Done. Renamed " + changedCount + " artboard(s).");
})();
