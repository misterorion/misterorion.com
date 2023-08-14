var r = window.document,
  o = r.currentScript,
  s = o.getAttribute("data-siteid");

fetch("/oshc", {
  method: "POST",
  body: JSON.stringify({
    s: s,
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8",
    "X-Frontend-Auth": "M26wMxW#4wVJ",
  },
});
