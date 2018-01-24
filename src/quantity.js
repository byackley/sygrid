"use strict";
exports.__esModule = true;
var _ = require("lodash");
var math_1 = require("./math");
var Inexact = /** @class */ (function () {
    function Inexact(sig, err, exp) {
        this.sig = sig;
        this.err = err;
        this.exp = exp;
    }
    Inexact.fromString = function (str) {
        console.log(str.match(Inexact.expRegEx));
    };
    Inexact.expRegEx = /(-?[0-9.]+)[eE](-?[0-9]+)/;
    return Inexact;
}());
var Exact = /** @class */ (function () {
    function Exact(num, den) {
        if (den === void 0) { den = 1; }
        this.num = num;
        this.den = den;
        // NOTE: this ensures that all Exacts are in lowest terms
        var g = math_1.gcd(num, den);
        this.num = num / g;
        this.den = den / g;
    }
    Exact.prototype.toString = function () {
        if (this.den === 1) {
            return "" + this.num;
        }
        else {
            return this.num + "/" + this.den;
        }
    };
    Exact.prototype.add = function (other) {
        return new Exact(this.num * other.den + this.den * other.num, this.den * other.den);
    };
    Exact.prototype.sub = function (other) {
        return new Exact(this.num * other.den - this.den * other.num, this.den * other.den);
    };
    Exact.prototype.mul = function (other) {
        return new Exact(this.num * other.num, this.den * other.den);
    };
    Exact.prototype.div = function (other) {
        return new Exact(this.num * other.den, this.den * other.num);
    };
    return Exact;
}());
var CDOT = '\xB7';
var UnitHash = /** @class */ (function () {
    // e.g. {m:1, s:-2} means meters-per-second-squared
    function UnitHash(units) {
        this.units = units;
    }
    UnitHash.prototype.toString = function () {
        return _.entries(this.units).map(function (pair) {
            return "" + pair[0] + (pair[1] === 1 ? '' : toSuper(pair[1]));
        }).join(CDOT);
    };
    return UnitHash;
}());
var noUnit = {};
var supers = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
var superMinus = '⁻';
function toSuper(n) {
    var sign = n < 0 ? superMinus : '';
    var abs = Number(Math.abs(n)).toString(10);
    return "" + sign + abs.split('').map(function (n) { return supers[parseInt(n)]; }).join('');
}
var Quantity = /** @class */ (function () {
    function Quantity(val, unit) {
        this.val = val;
        this.unit = unit;
    }
    Quantity.prototype.toString = function () {
        return this.val.toString() + " " + this.unit.toString();
    };
    return Quantity;
}());
var Startup = /** @class */ (function () {
    function Startup() {
    }
    Startup.main = function () {
        var qu = [
            new Quantity(new Exact(1, 3), new UnitHash({ m: 1, s: -2 })),
            new Quantity(new Exact(-12345, 3), new UnitHash({ foo: 1, bar: 2, A: -1, o: -1 })),
            new Exact(2, 3).add(new Exact(1, 12))
        ];
        console.log(qu.map(function (x) { return x.toString(); }).join('\n'));
        Inexact.fromString('1.25e7');
        Inexact.fromString('-1.25e7');
        Inexact.fromString('1.25E-7');
        Inexact.fromString('-1.25e-7');
        Inexact.fromString('10E100');
        return 0;
    };
    return Startup;
}());
Startup.main();
