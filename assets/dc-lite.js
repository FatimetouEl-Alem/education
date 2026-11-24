/* dc-lite: minimal runtime for the exported pages (template + state + DOM morph). */
(function () {
  var root, tpl, comp;
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch) {
    var p = typeof patch === 'function' ? patch(this.state) : patch, changed = false;
    for (var k in p) { if (this.state[k] !== p[k]) { changed = true; } this.state[k] = p[k]; }
    if (changed) render();
  };
  DCLogic.prototype.renderVals = function () { return {}; };
  window.DCLogic = DCLogic;

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    var parts = path.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) { if (v == null) return undefined; v = v[parts[i]]; }
    return v;
  }
  var ONE = /^\{\{([^{}]+)\}\}$/, ANY = /\{\{([^{}]+)\}\}/g;
  function interp(str, scope) {
    var m = str.match(ONE);
    if (m) return lookup(m[1], scope);
    return str.replace(ANY, function (_, p) { var v = lookup(p, scope); return v == null ? '' : String(v); });
  }
  var EVENTS = { onclick: 'click', onmouseenter: 'mouseenter', onmouseleave: 'mouseleave', oninput: 'input', onchange: 'change', onfocus: 'focus', onblur: 'blur' };
  function bind(el) {
    el.__b = el.__b || {};
    for (var t in el.__h) {
      if (!el.__b[t]) {
        el.__b[t] = true;
        (function (type) { el.addEventListener(type, function (e) { var f = el.__h && el.__h[type]; if (typeof f === 'function') f(e); }); })(t);
      }
    }
  }
  function build(node, scope, out) {
    if (node.nodeType === 3) { out.push(document.createTextNode(interp(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    var tag = node.localName;
    if (tag === 'sc-for') {
      var list = lookup((node.getAttribute('list') || '').replace(/[{}]/g, ''), scope) || [];
      var as = node.getAttribute('as') || 'item';
      list.forEach(function (item, i) {
        var s = Object.create(scope); s[as] = item; s.index = i;
        node.childNodes.forEach(function (c) { build(c, s, out); });
      });
      return;
    }
    if (tag === 'sc-if') {
      if (lookup((node.getAttribute('value') || '').replace(/[{}]/g, ''), scope)) node.childNodes.forEach(function (c) { build(c, scope, out); });
      return;
    }
    var el = node.namespaceURI && node.namespaceURI !== 'http://www.w3.org/1999/xhtml'
      ? document.createElementNS(node.namespaceURI, node.nodeName) : document.createElement(tag);
    el.__h = {};
    for (var i = 0; i < node.attributes.length; i++) {
      var a = node.attributes[i], name = a.name;
      if (name.indexOf('hint-') === 0) continue;
      var low = name.toLowerCase();
      if (EVENTS[low]) { el.__h[EVENTS[low]] = interp(a.value, scope); continue; }
      var v = interp(a.value, scope);
      if (v === false || v == null) continue;
      el.setAttribute(name, v === true ? '' : String(v));
    }
    bind(el);
    var kids = node.localName === 'template' ? node.content.childNodes : node.childNodes;
    var arr = [];
    kids.forEach(function (c) { build(c, scope, arr); });
    arr.forEach(function (c) { el.appendChild(c); });
    out.push(el);
  }
  function morph(o, n) {
    if (o.nodeType !== n.nodeType || o.nodeName !== n.nodeName) { o.parentNode.replaceChild(n, o); return; }
    if (o.nodeType === 3) { if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue; return; }
    if (o.nodeType !== 1) return;
    var i, a;
    for (i = o.attributes.length - 1; i >= 0; i--) { a = o.attributes[i]; if (!n.hasAttribute(a.name)) o.removeAttribute(a.name); }
    for (i = 0; i < n.attributes.length; i++) { a = n.attributes[i]; if (o.getAttribute(a.name) !== a.value) o.setAttribute(a.name, a.value); }
    o.__h = n.__h; bind(o);
    var oc = Array.prototype.slice.call(o.childNodes), nc = Array.prototype.slice.call(n.childNodes);
    for (i = 0; i < nc.length; i++) { if (i < oc.length) morph(oc[i], nc[i]); else o.appendChild(nc[i]); }
    for (i = nc.length; i < oc.length; i++) o.removeChild(oc[i]);
  }
  function render() {
    var vals = comp.renderVals() || {};
    var out = [];
    tpl.content.childNodes.forEach(function (c) { build(c, vals, out); });
    var fresh = document.createElement('div');
    out.forEach(function (c) { fresh.appendChild(c); });
    morph(root, (function () { var r = root.cloneNode(false); while (fresh.firstChild) r.appendChild(fresh.firstChild); return r; })());
  }
  window.dcMount = function (Cls) {
    tpl = document.getElementById('dc-template');
    root = document.getElementById('dc-root');
    comp = new Cls({});
    render();
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  };
})();
