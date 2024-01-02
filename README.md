# CourtHive Mobile

(This is an archaelogical project to revive incredibly hacky code written in 2016-2017)

CourtHive Mobile is a tracker for tennis matches showcasing a number of data visualizations originally created for TennisVisuals.com

## Install

```js
pnpm i // dependencies for mobile client

cd src/server
pnpm i // dependencies for mobile server
```

## Running locally

The app can run 'standalone' with no server.

```js
pnpm start
```

## Starting server

```js
cd src/server
node -r esm mobileServer.js
```
