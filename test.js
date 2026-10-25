// Runs the .jsx against a fake Illustrator. Usage: node test.js
var fs = require("fs");
var vm = require("vm");
var assert = require("assert");

var src = fs.readFileSync(__dirname + "/illustrator-rename-script.jsx", "utf8").replace(/^#target.*$/m, "");

function run(names, answers) {
    var alerts = [];
    var artboards = names.map(function (n) { return { name: n }; });
    vm.runInNewContext(src, {
        app: { documents: [1], activeDocument: { artboards: artboards } },
        prompt: function () { return answers.shift(); },
        alert: function (m) { alerts.push(m); }
    });
    return { names: artboards.map(function (a) { return a.name; }), alert: alerts.join("\n") };
}

var base = ["Art 1.0", "Art 2.0", "Art 3.0", "Other (v1)"];

// Special characters are literal, range limits the targets.
assert.deepStrictEqual(run(base, [".", "_", "1-2"]).names, ["Art 1_0", "Art 2_0", "Art 3.0", "Other (v1)"]);
// "(" no longer throws; "$&" is inserted literally.
assert.deepStrictEqual(run(base, ["(v1)", "$&", "4"]).names[3], "Other $&");
// Empty range = all; reversed ranges and duplicates are fine.
assert.deepStrictEqual(run(base, ["Art", "AB", ""]).names, ["AB 1.0", "AB 2.0", "AB 3.0", "Other (v1)"]);
assert.deepStrictEqual(run(base, ["Art", "AB", "3-2, 2,"]).names, ["Art 1.0", "AB 2.0", "AB 3.0", "Other (v1)"]);
// Invalid or out-of-range input renames nothing and says why.
var bad = run(base, ["Art", "AB", "1, x, 9"]);
assert.deepStrictEqual(bad.names, base);
assert.ok(/x, 9/.test(bad.alert));
// Empty find text is rejected.
assert.deepStrictEqual(run(base, ["", "X", ""]).names, base);
// A rename that would empty the name is skipped.
var empty = run(["Art", "Art 2"], ["Art", "", ""]);
assert.deepStrictEqual(empty.names, ["Art", " 2"]);
assert.ok(/Skipped 1/.test(empty.alert));
// Cancel exits quietly.
assert.strictEqual(run(base, [null]).alert, "");

console.log("ok");
