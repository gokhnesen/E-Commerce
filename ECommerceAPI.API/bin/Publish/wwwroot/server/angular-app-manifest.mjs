
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "route": "/"
  },
  {
    "renderMode": 0,
    "route": "/product/*"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-OQBFVN4T.js",
      "chunk-UEMLHTDL.js",
      "chunk-ATDXF54K.js"
    ],
    "route": "/products/category/*"
  },
  {
    "renderMode": 0,
    "route": "/cart"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-VTJUAKRQ.js",
      "chunk-UEMLHTDL.js",
      "chunk-BOQ2IRMQ.js"
    ],
    "route": "/checkout"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-VTJUAKRQ.js",
      "chunk-UEMLHTDL.js",
      "chunk-BOQ2IRMQ.js"
    ],
    "route": "/checkout/success"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-MIQ4TSCI.js",
      "chunk-BOQ2IRMQ.js",
      "chunk-DM2AV76X.js"
    ],
    "route": "/order"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-MIQ4TSCI.js",
      "chunk-BOQ2IRMQ.js",
      "chunk-DM2AV76X.js"
    ],
    "route": "/order/*"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-JP4IMEVY.js",
      "chunk-ATDXF54K.js",
      "chunk-DM2AV76X.js"
    ],
    "route": "/admin"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-R6PVJ5WM.js"
    ],
    "route": "/account"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-R6PVJ5WM.js"
    ],
    "route": "/account/login"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-R6PVJ5WM.js"
    ],
    "route": "/account/register"
  },
  {
    "renderMode": 0,
    "route": "/test-error"
  },
  {
    "renderMode": 0,
    "route": "/not-found"
  },
  {
    "renderMode": 0,
    "route": "/server-error"
  },
  {
    "renderMode": 0,
    "route": "/internal-error"
  },
  {
    "renderMode": 0,
    "redirectTo": "/not-found",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 31036, hash: '6b4fd2a06f59b6dcd56aad566c4a5163e674dfadee1db86c55fca89d5375576b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17863, hash: '6d5aa85aef195258dcbd0bab5efd2ab75baaedac482a2f95492d842c8044ebe1', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-L36TQFCH.css': {size: 30845, hash: 'RVZ3HfCay/E', text: () => import('./assets-chunks/styles-L36TQFCH_css.mjs').then(m => m.default)}
  },
};
