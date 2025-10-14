//DOM elements
let form = document.querySelector("#form");
let preview = document.querySelector("#preview");
let copyURLBtn = document.querySelector("#copyURLBtn");

function sendSettings() { //send settings to widget
    let data = new FormData(form);
    let params = Object.fromEntries(data);

    preview.contentWindow.postMessage({type: 'settings', payload: params}, '*')
}

form.addEventListener('input', () => {
    sendSettings();
});

function getBaseURL() {
    const currentHost = window.location.host;
    if (currentHost.includes("ozeily.github.io")) {
        return "https://ozeily.github.io/Timer-widget/widget/widget.html?"
    } else {
        return window.location.origin + "widget/widget.html?"
    }
}

window.copyURL = function() {
    let data = new FormData(form);
    let params = Object.fromEntries(data);
    let url = getBaseURL() + new URLSearchParams(params).toString()

    navigator.clipboard.writeText(url)
    .then(() => { alert('Copied text:' + url) })
    .catch(err => { alert('Error: ' + err)})
}