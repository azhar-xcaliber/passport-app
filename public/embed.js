(function () {
  "use strict";

  // Derive chatbot origin from this script's own src attribute
  var scriptEl =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();
  var scriptSrc = scriptEl ? scriptEl.src : "";
  var origin = scriptSrc ? new URL(scriptSrc).origin : "http://localhost:3000";
  var embedUrl = origin + "/embed";

  // App design tokens (from globals.css)
  // Light: --primary oklch(0.37 0.08 260), --primary-foreground oklch(0.98 0 0)
  // Dark:  --primary oklch(0.92 0.008 75), --primary-foreground oklch(0.16 0.012 260)
  var style = document.createElement("style");
  style.textContent =
    "#acme-chat-widget{position:fixed;bottom:24px;right:24px;z-index:2147483647;}" +

    "#acme-chat-btn{" +
    "  width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;" +
    "  background:oklch(0.37 0.08 260);" +
    "  color:oklch(0.98 0 0);" +
    "  box-shadow:0 4px 6px -1px oklch(0.3 0.01 260/0.07),0 10px 24px -4px oklch(0.3 0.01 260/0.12);" +
    "  display:flex;align-items:center;justify-content:center;" +
    "  transition:transform .2s cubic-bezier(0.22,1,0.36,1),box-shadow .2s,background .15s;" +
    "  padding:0;" +
    "}" +
    "#acme-chat-btn:hover{" +
    "  transform:scale(1.08);" +
    "  box-shadow:0 8px 24px -4px oklch(0.3 0.01 260/0.18);" +
    "}" +
    "#acme-chat-btn svg,#acme-chat-btn img{pointer-events:none;display:block;}" +

    "#acme-chat-panel{" +
    "  position:absolute;bottom:68px;right:0;" +
    "  width:400px;height:600px;" +
    "  border-radius:0.625rem;overflow:hidden;" +
    "  box-shadow:0 4px 6px -1px oklch(0.3 0.01 260/0.07),0 10px 24px -4px oklch(0.3 0.01 260/0.12);" +
    "  border:1px solid oklch(0.88 0.006 260);" +
    "  background:oklch(0.985 0.003 75);" +
    "  transform:translateY(16px) scale(0.97);" +
    "  opacity:0;" +
    "  pointer-events:none;" +
    "  transition:transform .25s cubic-bezier(0.22,1,0.36,1),opacity .2s ease;" +
    "}" +
    "#acme-chat-panel.acme-open{" +
    "  transform:translateY(0) scale(1);" +
    "  opacity:1;" +
    "  pointer-events:auto;" +
    "}" +
    "#acme-chat-panel iframe{width:100%;height:100%;border:none;display:block;}" +

    "@media(prefers-color-scheme:dark){" +
    "  #acme-chat-btn{" +
    "    background:oklch(0.92 0.008 75);" +
    "    color:oklch(0.16 0.012 260);" +
    "    box-shadow:0 0 0 1px oklch(1 0 0/0.06),0 8px 24px -4px oklch(0 0 0/0.45);" +
    "  }" +
    "  #acme-chat-btn:hover{box-shadow:0 0 0 1px oklch(1 0 0/0.08),0 12px 32px -4px oklch(0 0 0/0.55);}" +
    "  #acme-chat-panel{" +
    "    background:oklch(0.16 0.012 260);" +
    "    border-color:oklch(0.28 0.016 260);" +
    "    box-shadow:0 0 0 1px oklch(1 0 0/0.06),0 8px 24px -4px oklch(0 0 0/0.45),0 4px 8px -2px oklch(0 0 0/0.25);" +
    "  }" +
    "}" +

    "@media(max-width:480px){" +
    "  #acme-chat-widget{bottom:16px;right:16px;}" +
    "  #acme-chat-panel{" +
    "    position:fixed;bottom:0;left:0;right:0;top:0;" +
    "    width:auto;height:auto;border-radius:0;" +
    "  }" +
    "}";
  document.head.appendChild(style);

  const ICON_CHAT =
    '<img src="' + origin + '/XC%20Logo%20Vector.png" alt="XC" ' +
    'style="width:34px;height:34px;object-fit:contain;display:block;pointer-events:none;" />';

  const ICON_CLOSE =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M18 6 6 18M6 6l12 12"/>' +
    "</svg>";

  // Build DOM
  const widget = document.createElement("div");
  widget.id = "acme-chat-widget";
  widget.innerHTML =
    '<div id="acme-chat-panel">' +
    '  <iframe src="' + embedUrl + '" title="Acme Health Chat" allow="clipboard-write"></iframe>' +
    "</div>" +
    '<button id="acme-chat-btn" aria-label="Open health assistant chat" aria-expanded="false">' +
    ICON_CHAT +
    "</button>";

  document.body.appendChild(widget);

  var btn = document.getElementById("acme-chat-btn");
  var panel = document.getElementById("acme-chat-panel");
  var isOpen = false;

  function open() {
    isOpen = true;
    panel.classList.add("acme-open");
    btn.setAttribute("aria-expanded", "true");
    btn.innerHTML = ICON_CLOSE;
  }

  function close() {
    isOpen = false;
    panel.classList.remove("acme-open");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = ICON_CHAT;
  }

  btn.addEventListener("click", function () {
    if (isOpen) {
      close();
    } else {
      open();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) close();
  });
})();
