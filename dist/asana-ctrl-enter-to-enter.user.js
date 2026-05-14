// ==UserScript==
// @name Asana Ctrl+Enter to Enter
// @namespace http://tampermonkey.net/
// @version 1.0.0
// @description Map Ctrl+Enter to Enter in Asana to prevent accidental task completion
// @author Ray Guo
// @match https://app.asana.com/*
// @run-at document-start
// ==/UserScript==

(function() {
	//#region src/asana-ctrl-enter-to-enter/main.ts
	/**
	* @file asana-ctrl-enter-to-enter/main.ts
	* @description
	* Intercept Ctrl+Enter keydown/keyup events on Asana and replace them with
	* plain Enter events, preventing the default "complete task" behavior.
	*/
	let suppressNextCtrlEnter = false;
	function isCtrlEnter(event) {
		return event.key === "Enter" && event.ctrlKey;
	}
	function dispatchPlainEnter(target, type) {
		const event = new KeyboardEvent(type, {
			key: "Enter",
			code: "Enter",
			bubbles: true,
			cancelable: true,
			composed: true
		});
		target.dispatchEvent(event);
	}
	window.addEventListener("keydown", (event) => {
		if (!event.isTrusted) return;
		if (isCtrlEnter(event)) {
			event.preventDefault();
			event.stopImmediatePropagation();
			suppressNextCtrlEnter = true;
			dispatchPlainEnter(event.target ?? document.documentElement, "keydown");
		}
	}, true);
	window.addEventListener("keyup", (event) => {
		if (!event.isTrusted) return;
		if (suppressNextCtrlEnter && isCtrlEnter(event)) {
			event.preventDefault();
			event.stopImmediatePropagation();
			suppressNextCtrlEnter = false;
			dispatchPlainEnter(event.target ?? document.documentElement, "keyup");
		}
	}, true);
	//#endregion
})();
