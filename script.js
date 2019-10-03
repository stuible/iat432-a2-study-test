// Options
const numberOfTests = 3;

const sliderRange = 100;


// Array to store recorded times
let times = []

// Other global variables
let currentTest = 0;
let targetNumber = undefined;


document.addEventListener("DOMContentLoaded", function () {
    generateTest();
});

function generateTest() {
    clearSliders();

    targetNumber = Math.floor(Math.random() * sliderRange / 2) * 2;
    document.querySelector("#target").innerHTML = targetNumber;

    const sliderTypes = [
        "horizontal",
        "verticle"
    ];

    let randomType = sliderTypes[Math.floor(Math.random() * sliderTypes.length)];

    createSlider(randomType);
}

function createSlider(typeParam) {
    let slider = new gsuiSlider();
    let userStartInteracting = undefined;
    let userFinishedInteracting = undefined;
    let firstMouseDown = true;

    const typeOption = () => {
        if (typeParam == 'horizontal') return 'linear-x'
        else if (typeParam == 'verticle') return 'linear-y'
        return undefined
    }

    slider.options({ type: typeOption(), min: 0, max: 100, step: 2, value: 10 });

    document.querySelector("#sliderWrapper").append(slider.rootElement);
    document.querySelector("#sliderWrapper").append(sliderValue(10));

    slider.oninput = event => {
        document.querySelector(".slide-value").innerHTML = event;
    }

    slider.oninputstart = event => {
        if (firstMouseDown) {
            userStartInteracting = performance.now();
            firstMouseDown = false;
        }

    }
    slider.oninputend = event => {
        if (event == targetNumber) {
            userFinishedInteracting = performance.now();
            const time = userFinishedInteracting - userStartInteracting
            console.log(`Time to use: ${time}ms`)
            recordTime(typeParam, time)
            currentTest++;
            if(currentTest < numberOfTests ){
                generateTest();
            }
            else {
                showResults();
            }
        }

    }

    slider.attached();
}

function sliderValue(val) {
    const el = document.createElement('div');
    el.classList += 'slide-value'
    el.innerHTML = `${val}`
    return el
}

function recordTime(type, time) {
    times.push({
        type: type,
        time: time
    })
}

function clearSliders() {
    document.querySelector("#sliderWrapper").innerHTML = '';
}

function showResults(){
    clearSliders();
    const el = document.createElement('pre');
    el.classList += 'results';
    el.innerHTML = `${JSON.stringify(times, null, 2)}`;
    document.querySelector("#sliderWrapper").append(el);
}