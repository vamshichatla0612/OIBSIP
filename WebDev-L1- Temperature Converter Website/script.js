const temperatureInput =
    document.getElementById("temperature");

const unitSelect =
    document.getElementById("unit");

const convertBtn =
    document.getElementById("convertBtn");

const inputUnit =
    document.getElementById("inputUnit");

const errorMessage =
    document.getElementById("errorMessage");

const statusText =
    document.getElementById("statusText");

const formula =
    document.getElementById("formula");


const celsiusResult =
    document.getElementById("celsiusResult");

const fahrenheitResult =
    document.getElementById("fahrenheitResult");

const kelvinResult =
    document.getElementById("kelvinResult");


const gaugeValue =
    document.getElementById("gaugeValue");

const gaugeUnit =
    document.getElementById("gaugeUnit");

const gaugeStatus =
    document.getElementById("gaugeStatus");



/* =========================
   UPDATE UNIT
========================= */

function updateInputUnit() {

    const unit =
        unitSelect.value;


    if (unit === "celsius") {

        inputUnit.textContent = "°C";

        formula.textContent =
            "°F = (°C × 9/5) + 32";

    }


    else if (unit === "fahrenheit") {

        inputUnit.textContent = "°F";

        formula.textContent =
            "°C = (°F − 32) × 5/9";

    }


    else {

        inputUnit.textContent = "K";

        formula.textContent =
            "°C = K − 273.15";

    }


    errorMessage.textContent = "";

    statusText.textContent =
        "Ready";

    gaugeStatus.textContent =
        "Ready";
}



/* =========================
   VALIDATION
========================= */

function validate(value, unit) {

    if (value === "") {

        return "Please enter a temperature.";
    }


    const number =
        Number(value);


    if (!Number.isFinite(number)) {

        return "Please enter a valid numeric value.";
    }


    if (
        unit === "celsius" &&
        number < -273.15
    ) {

        return "Temperature cannot be below −273.15°C.";
    }


    if (
        unit === "fahrenheit" &&
        number < -459.67
    ) {

        return "Temperature cannot be below −459.67°F.";
    }


    if (
        unit === "kelvin" &&
        number < 0
    ) {

        return "Kelvin temperature cannot be below 0 K.";
    }


    return "";
}



/* =========================
   NUMBER FORMAT
========================= */

function formatNumber(number) {

    if (
        Math.abs(number) < 0.000001
    ) {

        number = 0;
    }


    return Number(number).toFixed(2);
}



/* =========================
   CONVERT
========================= */

function convertTemperature() {

    const value =
        temperatureInput.value.trim();

    const unit =
        unitSelect.value;


    const error =
        validate(value, unit);


    if (error) {

        errorMessage.textContent =
            error;

        statusText.textContent =
            "Please correct the input.";

        gaugeStatus.textContent =
            "Error";

        return;
    }


    const input =
        Number(value);


    let celsius;
    let fahrenheit;
    let kelvin;



    /* Celsius */

    if (unit === "celsius") {

        celsius =
            input;

        fahrenheit =
            celsius * 9 / 5 + 32;

        kelvin =
            celsius + 273.15;
    }



    /* Fahrenheit */

    else if (
        unit === "fahrenheit"
    ) {

        fahrenheit =
            input;

        celsius =
            (fahrenheit - 32) * 5 / 9;

        kelvin =
            celsius + 273.15;
    }



    /* Kelvin */

    else {

        kelvin =
            input;

        celsius =
            kelvin - 273.15;

        fahrenheit =
            celsius * 9 / 5 + 32;
    }



    /* Results */

    celsiusResult.textContent =
        formatNumber(celsius);

    fahrenheitResult.textContent =
        formatNumber(fahrenheit);

    kelvinResult.textContent =
        formatNumber(kelvin);



    /* Gauge */

    gaugeValue.textContent =
        formatNumber(input);

    gaugeUnit.textContent =
        inputUnit.textContent;

    gaugeStatus.textContent =
        "Converted";



    /* Status */

    errorMessage.textContent = "";

    statusText.textContent =
        "Conversion completed successfully ✓";



    /* Result Animation */

    document
        .querySelectorAll(".result-card")
        .forEach((card, index) => {

            card.animate(

                [
                    {
                        opacity: 0.35,

                        transform:
                            "translateY(10px) scale(.98)"
                    },

                    {
                        opacity: 1,

                        transform:
                            "translateY(0) scale(1)"
                    }
                ],

                {
                    duration: 450,

                    delay:
                        index * 80,

                    easing:
                        "ease-out"
                }

            );

        });



    /* Gauge Animation */

    document
        .querySelector(".gauge")
        .animate(

            [
                {
                    transform:
                        "scale(.94) rotate(-3deg)"
                },

                {
                    transform:
                        "scale(1.03) rotate(2deg)"
                },

                {
                    transform:
                        "scale(1) rotate(0)"
                }
            ],

            {
                duration: 550,

                easing:
                    "ease-out"
            }

        );

}



/* =========================
   EVENTS
========================= */

convertBtn.addEventListener(
    "click",
    convertTemperature
);


unitSelect.addEventListener(
    "change",
    updateInputUnit
);


temperatureInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            convertTemperature();
        }

    }
);


temperatureInput.addEventListener(
    "input",
    function () {

        errorMessage.textContent =
            "";

        statusText.textContent =
            "Ready";

        gaugeStatus.textContent =
            "Ready";
    }
);



/* =========================
   PARTICLES
========================= */

function createParticles() {

    const container =
        document.getElementById(
            "particles"
        );


    const colors = [
        "#ff1744",
        "#ffe600",
        "#00eaff"
    ];


    for (
        let i = 0;
        i < 55;
        i++
    ) {

        const particle =
            document.createElement("i");


        const size =
            2 + Math.random() * 3;


        const color =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        particle.className =
            "particle";


        particle.style.left =
            Math.random() * 100 + "%";


        particle.style.width =
            size + "px";


        particle.style.height =
            size + "px";


        particle.style.background =
            color;


        particle.style.boxShadow =
            `0 0 8px ${color},
             0 0 15px ${color}`;


        particle.style.animationDuration =
            5 + Math.random() * 10 + "s";


        particle.style.animationDelay =
            Math.random() * 10 + "s";


        container.appendChild(
            particle
        );
    }
}



/* =========================
   INITIALIZE
========================= */

createParticles();

updateInputUnit();

convertTemperature();