import * as _ from 'lodash';
import {gcd} from './math';

type int = number; // just to be explicit about things we expect to be integers

type SpecialNumber = "Inf" | "NInf" | "NaN";

class Inexact {

    static expRegEx = /(-?[0-9.]+)[eE](-?[0-9]+)/;

    constructor (private sig: int, private err: int, private exp: int) {}

    static fromString(private str: string) {
      console.log( str.match(Inexact.expRegEx) );
    }
}

class Exact{ // AKA rational; Exact numbers have effectively infinite precision

    constructor(private num: int, private den: int = 1) {
        // NOTE: this ensures that all Exacts are in lowest terms
        const g = gcd(num, den);
        this.num = num/g;
        this.den = den/g;
    }

    toString(): string {
        if (this.den===1) {
            return `${this.num}`;
        } else {
            return `${this.num}/${this.den}`;
        }
    }

    add(other:Exact) {
        return new Exact(this.num*other.den + this.den*other.num, this.den*other.den);
    }

    sub(other:Exact) {
        return new Exact(this.num*other.den - this.den*other.num, this.den*other.den);
    }

    mul(other:Exact) {
        return new Exact(this.num*other.num, this.den*other.den);
    }

    div(other:Exact) {
        return new Exact(this.num*other.den, this.den*other.num);
    }
}

const CDOT = '\xB7';

class UnitHash {

    // e.g. {m:1, s:-2} means meters-per-second-squared
    constructor( private units: {[u: string]: int}) {}

    toString(): string {

        return _.entries(this.units).map(
            (pair) => {
                return `${pair[0]}${pair[1]===1?'':toSuper(pair[1])}`
            }
        ).join(CDOT);
    }
}

const noUnit = {};

const supers = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
const superMinus = '⁻';

function toSuper(n: int) {
    const sign = n<0 ? superMinus : '';
    const abs = Number(Math.abs(n)).toString(10);

    return `${sign}${abs.split('').map( n => supers[parseInt(n)] ).join('')}`;
}

class Quantity {

    constructor(
        private val: Exact | Inexact | SpecialNumber,
        private unit: UnitHash
    ){}

    toString(): string {
        return `${this.val.toString()} ${this.unit.toString()}`;
    }
}

class Startup {
    static main(): number {

        const qu = [
            new Quantity(new Exact(1,3), new UnitHash({m:1, s:-2})),
            new Quantity(new Exact(-12345,3), new UnitHash({foo:1, bar:2, A:-1, o:-1})),
            new Exact(2,3).add(new Exact(1,12))
        ];

        console.log(qu.map( (x) => x.toString() ).join('\n'));

        Inexact.fromString('1.25e7');
        Inexact.fromString('-1.25e7');
        Inexact.fromString('1.25E-7');
        Inexact.fromString('-1.25e-7');
        Inexact.fromString('10E100')

        return 0;
    }
}

Startup.main();
