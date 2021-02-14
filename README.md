# @typen

:blowfish: Type checker


[![npm version][badge-npm-version]][url-npm]
[![github commit last][badge-github-last-commit]][url-github]
[![github commit total][badge-github-commit-count]][url-github]
[![npm license][badge-npm-license]][url-npm]

[//]: <> (Shields)
[badge-npm-version]: https://flat.badgen.net/npm/v/@typen/typ
[badge-npm-license]: https://flat.badgen.net/npm/license/@typen/typ
[badge-github-last-commit]: https://flat.badgen.net/github/last-commit/hoyeungw/typen
[badge-github-commit-count]: https://flat.badgen.net/github/commits/hoyeungw/typen

[//]: <> (Link)
[url-github]: https://github.com/hoyeungw/typen
[url-npm]: https://npmjs.org/package/@typen/typ

#### Features

- Check primitive or object type of a variable in one function.
- Check whether a variable is numeric in different strictness (and different overhead).
- Parse variable to boolean.
- Check type of an array.
- Lightweight and fast.
- ES-module support.

#### Install

```console
$ npm install @typen/<tool-name>
```

#### Tools

|                                                     |                                                         |                            |
| --------------------------------------------------- | ------------------------------------------------------- | -------------------------- |
| [**typ**](packages/typ)                             | shorthand for Object.prototype.toString.call()          | ![v][typ-dm]               |
| [**bool**](packages/bool)                           | parse input to boolean, e.g. 'false' be parsed to false | ![v][bool-dm]              |
| [**nullish**](packages/nullish)                     | check if input is null or undefined                     | ![v][nullish-dm]           |
| [**num-loose**](packages/num-loose)                 | isNumeric in a loose check                              | ![v][num-loose-dm]         |
| [**num-strict**](packages/num-strict)               | isNumeric in a stricter check                           | ![v][num-strict-dm]        |
| [**vector-type**](packages/vector-type)             | check type of an array                                  | ![v][vector-type-dm]       |
| [**enum-data-types**](packages/enum-data-types)     | types returned by typeof                                | ![v][enum-data-types-dm]   |
| [**enum-object-types**](packages/enum-object-types) | types returned by Object.prototype.toString.call()      | ![v][enum-object-types-dm] |
|                                                     |                                                         |                            |

[//]: <> (Local routes)
[typ-dm]: https://flat.badgen.net/npm/dm/@typen/typ
[bool-dm]: https://flat.badgen.net/npm/dm/@typen/bool
[nullish-dm]: https://flat.badgen.net/npm/dm/@typen/nullish
[num-loose-dm]: https://flat.badgen.net/npm/dm/@typen/num-loose
[num-strict-dm]: https://flat.badgen.net/npm/dm/@typen/num-strict
[vector-type-dm]: https://flat.badgen.net/npm/dm/@typen/vector-type
[enum-data-types-dm]: https://flat.badgen.net/npm/dm/@typen/enum-data-types
[enum-object-types-dm]: https://flat.badgen.net/npm/dm/@typen/enum-object-types

#### Meta

[LICENSE (MIT)](LICENSE)
