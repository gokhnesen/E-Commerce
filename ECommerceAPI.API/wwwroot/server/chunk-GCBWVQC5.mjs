import './polyfills.server.mjs';
import{b as u}from"./chunk-TX7ZOVXX.mjs";import{T as t,Zc as o,j as e,o as n}from"./chunk-RN6IYZSF.mjs";var A=(m,a)=>{let r=t(u),c=t(o);return r.currentUser()?e(!0):r.getAuthState().pipe(n(i=>i.isAuthenticated?!0:(c.navigate(["/account/login"],{queryParams:{returnUrl:a.url}}),!1)))};export{A as a};
