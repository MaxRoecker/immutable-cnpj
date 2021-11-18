# Immutable CNPJ

A tiny library to handle CNPJ in an immutable flavour.

> The **[CNPJ][cnpj]** (Cadastro Nacional da Pessoa Jurídica; portuguese for
> "National Registry of Legal Entities") is an identification number issued to
> Brazilian companies. This number is attributed by the Brazilian Federal
> Revenue to companies that, directly or indirectly, pay taxes in Brazil.

## [![View on NPM](https://img.shields.io/npm/v/immutable-cnpj?style=flat-square)](https://www.npmjs.com/package/immutable-cnpj) [![License](https://img.shields.io/npm/l/immutable-cnpj?style=flat-square)](https://maxroecker.mit-license.org/) 🇧🇷

## Installation

Use the npm package manager to install Immutable CNPJ.

```bash
npm i immutable-cnpj
```

## Usage

The library provides a the [`CNPJ`][cnpjclass] class to create immutable
instances representing CNPJ documents. You can create instances with any
iterable of digits and format or validate them. See the example:

```js
import { CNPJ } from 'immutable-cnpj';

const cnpj = new CNPJ([1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 6, 1]);

cnpj.equals(cnpj); // true

cnpj.checkValidity(); // true

cnpj.format(); // '11.444.777/0001-61'
```

You can also create instances from strings using the [`CNPJ.from`][cnpj.from]
method.

```js
import { CNPJ } from 'immutable-cnpj';

const cnpjA = new CNPJ([1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 6, 1]);
const cnpjB = CNPJ.from('11.444.777/0001-61');
const cnpjC = CNPJ.from('1 1  4 4 4  7 7 7   0 0 0 1    6 1    ');

cnpjA.equals(cnpjB); // true

cnpjA.equals(cnpjC); // true
```

> The `CNPJ` class implements the [`Evaluable`][evaluable] interface and it's
> suitable to be used along [ImmutableJS][immutablejs] data structures.

The method [`CNPJ.prototype.getValidity`][cnpj.getvalidity] returns the validity
state of the instance. If you only want to check if the instance is valid or
not, see the [`CNPJ.prototype.checkValidity`][cnpj.checkvalidity] method.

```js
import { CNPJ } from 'immutable-cnpj';

const empty = new CNPJ([]);
empty.checkValidity(); // false, it's empty

const semi = new CNPJ([1, 1, 4, 4, 4]);
semi.checkValidity(); // false, it's not complete

const invalid = new CNPJ([1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 7, 2]);
semi.checkValidity(); // false, its check digits fails

const valid = new CNPJ([1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 6, 1]);
valid.checkValidity(); // true
```

The library also provides the method [`CNPJ.create`][cnpj.create] to generate
valid instances with pseudo-random numbers.

```js
import { CNPJ } from 'immutable-cnpj';

const cnpj = CNPJ.create();

cnpj.checkValidity(); // true
```

The default JSON serialization a `CNPJ` instance is a string. You can also
access it directly calling the [`CNPJ.prototype.toJSON`][cnpj.tojson].

```js
import { CNPJ } from 'immutable-cnpj';

const user = {
  name: 'Sá, Pato & Cia',
  cnpj: new CNPJ([1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 6, 1]),
};

JSON.stringify(user); // '{"name": "Sá, Pato & Cia", "cnpj": "11444777000161"}'

user.cnpj.toJSON(); // '11444777000161'
```

## API

See the complete API on the [Wiki's page][wiki].

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://maxroecker.mit-license.org/)

[evaluable]: https://github.com/MaxRoecker/evaluable
[wiki]: https://github.com/MaxRoecker/immutable-cnpj/wiki
[cnpj]: https://en.wikipedia.org/wiki/CNPJ
[cnpjclass]: https://github.com/MaxRoecker/immutable-cnpj/wiki#class-cnpj
[cnpj.from]: https://github.com/MaxRoecker/immutable-cnpj/wiki#from
[cnpj.getvalidity]: https://github.com/MaxRoecker/immutable-cnpj/wiki#getvalidity
[cnpj.checkvalidity]: https://github.com/MaxRoecker/immutable-cnpj/wiki#checkvalidity
[cnpj.create]: https://github.com/MaxRoecker/immutable-cnpj/wiki#create
[cnpj.tojson]: https://github.com/MaxRoecker/immutable-cnpj/wiki#tojson
[immutablejs]: https://immutable-js.github.io/immutable-js/
