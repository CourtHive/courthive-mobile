# Server

## Install

```js
pnpm i
```

## Create JWT Keys

Create a `cache/config/keys` subdirectory.

```js
openssl genrsa -out privateKey.key 2048
openssl rsa -in privateKey.key -pubout -outform PEM -out publicKey.key

```

## Start

The server code uses esm imports and therefore requires the `esm` package to run.

```js
pm2 start ecosystem.config.js
```
