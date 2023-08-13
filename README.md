# oxipng-wasm

[oxipng](https://github.com/shssoichiro/oxipng) bindings for JavaScript

## Build

```
CFLAGS="-flto" wasm-pack build --target bundler
```

## Update LICENSE-THIRD-PARTY

```
cargo bundle-licenses --format json | node ./transform-license.mjs
```
