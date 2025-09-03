
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
      "chunk-XSBCSY6T.js",
      "chunk-ZVGK5ARK.js",
      "chunk-KVLD5VZE.js"
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
      "chunk-4RDGAJOZ.js",
      "chunk-ZVGK5ARK.js",
      "chunk-BPFPOO2P.js"
    ],
    "route": "/checkout"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-4RDGAJOZ.js",
      "chunk-ZVGK5ARK.js",
      "chunk-BPFPOO2P.js"
    ],
    "route": "/checkout/success"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-OCBGKEIL.js",
      "chunk-BPFPOO2P.js",
      "chunk-A537U7E4.js"
    ],
    "route": "/order"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-OCBGKEIL.js",
      "chunk-BPFPOO2P.js",
      "chunk-A537U7E4.js"
    ],
    "route": "/order/*"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-TBZQETAV.js",
      "chunk-KVLD5VZE.js",
      "chunk-A537U7E4.js"
    ],
    "route": "/admin"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-Z3L5BPJD.js"
    ],
    "route": "/account"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-Z3L5BPJD.js"
    ],
    "route": "/account/login"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-Z3L5BPJD.js"
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
    'index.csr.html': {size: 31036, hash: 'ab23fadd1b2040f6eada3a28708592ea76b7a99dc50a37b065ce3d55ee80bd43', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17863, hash: '5bf7f51f86834769e5f4e4b656280a59b069c173114ee5804b0cbc23e371a724', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-L36TQFCH.css': {size: 30845, hash: 'RVZ3HfCay/E', text: () => import('./assets-chunks/styles-L36TQFCH_css.mjs').then(m => m.default)}
  },
};
