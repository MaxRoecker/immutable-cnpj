# Immutable CNPJ

A tiny library to handle CNPJ in an immutable flavour.

> The **[CNPJ][CNPJ]** (Cadastro Nacional da Pessoa Jurídica; portuguese for
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

The library provides a the [`CNPJ`][CNPJClass] class to create immutable
instances representing CNPJ documents. You can create instances with any
iterable of digits and format or validate them. See the example:

```js
import { CNPJ } from 'immutable-cnpj';

const cnpj = new CNPJ([1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 6, 1]);

cnpj.equals(cnpj) // true

cnpj.checkValidity() // true

cnpj.format() // '11.444.777/0001-61'
```

You can also create instances from strings using the [`CNPJ.from`][CNPJ.from]
method.

```js
import { CNPJ } from 'immutable-cnpj';

const cnpj = new CNPJ([1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 6, 1]);
const cnpjB = CNPJ.from('11.444.777/0001-61');
const cnpjC = CNPJ.from('1 1  4 4 4  7 7 7   0 0 0 1    6 1    ');

cnpjA.equals(cnpjB); // true

cnpjA.equals(cnpjC); // true
```

> The `CNPJ` class implements the [`Evaluable`][Evaluable] interface and it's
> suitable to be used along [ImmutableJS][ImmutableJS] data structures.

The library also provides the method [`CNPJ.create`][CNPJ.create] to generate
valid instances with pseudo-random numbers.

```js
import { CNPJ } from 'immutable-cnpj';

const cnpj = CNPJ.create();

cnpj.checkValidity() // true
```

The default JSON serialization a `CNPJ` instance is a string. You can also access
it directly calling the [`CNPJ.prototype.toJSON`][CNPJ.toJSON].

```js
import { CNPJ } from 'immutable-cnpj';

const user = {
  name: 'Sá, Pato & Cia',
  cnpj: new CNPJ([1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 6, 1]),
};

JSON.stringify(user) // '{"name": "Sá, Pato & Cia", "cnpj": "11444777000161"}'

user.cnpj.toJSON() // '11444777000161'
```

## API

See the complete API on the [Wiki's page][Wiki].

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://maxroecker.mit-license.org/)

[Evaluable]: https://github.com/MaxRoecker/evaluable
[Wiki]: https://github.com/MaxRoecker/immutable-cnpj/wiki
[CNPJ]: https://en.wikipedia.org/wiki/CNPJ_number
[CNPJClass]: https://github.com/MaxRoecker/immutable-cnpj/wiki#class-cnpj
[CNPJ.from]: https://github.com/MaxRoecker/immutable-cnpj/wiki#from
[CNPJ.create]: https://github.com/MaxRoecker/immutable-cnpj/wiki#create
[CNPJ.toJSON]: https://github.com/MaxRoecker/immutable-cnpj/wiki#tojson
[ImmutableJS]: https://immutable-js.github.io/immutable-js/
