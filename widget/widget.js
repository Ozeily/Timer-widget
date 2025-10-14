//DOM
let timerElt = document.querySelector("#timer");
let playIcon = document.querySelector("#play-icon");
let playIconState = playIcon.innerText;
let root = document.documentElement;
//variables
let defaultDuration = 60000;
let duration = defaultDuration;
//let oneHour = 3600000; //1hr in ms
let oneMin = 60000; //1min in ms
let timerID = null;
//Embed
let params = new URLSearchParams(window.location.search);

function timer() {
    if (duration <= 0) {
        clearTimeout(timerID); //stops timer when done
        switchPlayIcon()
        return
    }
    renderTimer()
    duration -= 1000;
    timerID = setTimeout(timer, 1000) //update every second
}

function addZero(number) {
    return number < 10? "0" + number : number //add 0 if number <10, else return number
}

function renderTimer() { //display remaining time
    //let h = addZero(Math.floor(duration / oneHour));
    //to remove hours from min: (duration % oneHour)
    let m = addZero(Math.floor(duration / oneMin)); //remove full hours + convert remain ms into min
    let s = addZero(Math.floor((duration % oneMin) / 1000)); //remove full mins + convert to s

    timerElt.innerHTML = `${m}:${s}`
}

//controls
function addMin() {
    duration += 60000;
    renderTimer()
}

function subtractMin() {
    if (duration < 6000) {
        duration = 0
    } else {
        duration -= 60000;
    }
    renderTimer()
}

function switchPlayIcon() {
    if (playIconState === 'play_arrow') {
        timer(duration)
        playIconState = 'pause';
    } else {
        clearTimeout(timerID)
        playIconState = 'play_arrow'
    }
    playIcon.innerText = playIconState;
    
}

function quit() {
    duration = defaultDuration;
    playIconState = 'play_arrow';
    playIcon.innerText = playIconState;
    clearTimeout(timerID)
    renderTimer()
}

//form input reception

window.addEventListener('message', (event) => {
    if (event.data?.type === "settings") {
        let data = event.data.payload;
        applySettings(data)
    }
})

function setVarValue(variable, value) {
    root.style.setProperty(`--${variable}`, value)
}

function applySettings(params) {
    for (const key in params) {
        switch(key) {
            case 'defaultDuration':
                defaultDuration = params[key] * 60000; //convert to ms
                duration = defaultDuration;
                break;
            case 'textColour':
                let color = params[key]
                setVarValue("primary", color)
                setVarValue("secondary", hexToRgba(color, 0.4));
                break;
            default:
                setVarValue(key, params[key])
        }
    }
    renderTimer()
}

//HEX to RGBA
function hexToRgba(hex, alpha) {

    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

//Embed handler
if (params.toString()) { //if embedded
    applySettings(Object.fromEntries(params)) //directly apply settings from URL
}