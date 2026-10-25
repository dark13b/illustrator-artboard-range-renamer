#target illustrator

(function () {
    if (app.documents.length === 0) {
        alert("No document is open. Please open a file and try again.");
        return;
    }

    var doc = app.activeDocument;
    var total = doc.artboards.length;

    // Cancel on any prompt exits silently.
    var findStr = prompt("Text to find in artboard names:", "");
    if (findStr === null) return;
    if (findStr === "") {
        alert("The text to find can't be empty.");
        return;
    }

    var replaceStr = prompt("Replace with (leave empty to delete the text):", "");
    if (replaceStr === null) return;

    var rangeInput = prompt(
        "Artboards to rename, 1-" + total + " (e.g. 1-3, 5, 7-9).\nLeave empty for all artboards:",
        ""
    );
    if (rangeInput === null) return;

    var parsed = parseRanges(rangeInput, total);
    if (parsed.invalid.length > 0) {
        alert("Can't use: " + parsed.invalid.join(", ") +
              "\nValid artboard numbers are 1-" + total + ". Nothing renamed.");
        return;
    }
    if (parsed.indices.length === 0) {
        alert("No artboards specified. Nothing renamed.");
        return;
    }

    var changed = 0;
    var skipped = 0;
    for (var i = 0; i < parsed.indices.length; i++) {
        var ab = doc.artboards[parsed.indices[i]];
        // split/join = literal replace-all: ".", "(", "$" etc. are treated as plain text.
        var newName = ab.name.split(findStr).join(replaceStr);
        if (newName === ab.name) continue;
        if (newName === "") { skipped++; continue; } // never leave an artboard unnamed
        ab.name = newName;
        changed++;
    }

    alert("Done. Renamed " + changed + " of " + parsed.indices.length + " artboard(s)." +
          (skipped ? "\nSkipped " + skipped + " that would have ended up with an empty name." : ""));

    // "1-3, 5, 9-7" -> { indices: [0,1,2,4,6,7,8], invalid: [] } (0-based, unique, in input order).
    // Empty input means all artboards. Anything unparseable or out of 1..max goes to `invalid`.
    function parseRanges(input, max) {
        var indices = [], invalid = [], seen = {};
        var trimmed = trim(input);
        if (trimmed === "") {
            for (var n = 0; n < max; n++) indices.push(n);
            return { indices: indices, invalid: invalid };
        }
        var parts = trimmed.split(",");
        for (var p = 0; p < parts.length; p++) {
            var seg = trim(parts[p]);
            if (seg === "") continue; // tolerate "1,,2" and trailing commas
            var m = seg.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
            if (!m) { invalid.push(seg); continue; }
            var a = parseInt(m[1], 10);
            var b = m[2] ? parseInt(m[2], 10) : a;
            if (a > b) { var t = a; a = b; b = t; } // accept reversed ranges like 9-7
            if (a < 1 || b > max) { invalid.push(seg); continue; }
            for (var r = a; r <= b; r++) {
                if (!seen[r]) { seen[r] = true; indices.push(r - 1); }
            }
        }
        return { indices: indices, invalid: invalid };
    }

    // ExtendScript (ES3) has no String.prototype.trim.
    function trim(s) {
        return s.replace(/^\s+|\s+$/g, "");
    }
})();
