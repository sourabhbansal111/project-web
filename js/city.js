let city = getCityData();

let selectedType = "house";

let demolishMode = false;

let zoom = 1;

const canvas =
    document.getElementById("cityCanvas");

const ctx =
    canvas.getContext("2d");


const GRID_SIZE = 18;

let tileWidth = 70;

let tileHeight = 35;

let offsetX = 0;

let offsetY = 0;


/* =====================================
   BUILDING DESCRIPTIONS
===================================== */

const descriptions = {

    house:
        "Small residential home",

    apartment:
        "High-density residential building",

    shop:
        "Commercial building that generates income",

    factory:
        "Industrial building with high pollution",

    park:
        "Green space that improves happiness",

    school:
        "Education facility for citizens",

    hospital:
        "Healthcare facility",

    powerPlant:
        "Generates electricity",

    road:
        "Road connecting different parts of the city"

};


/* =====================================
   CANVAS RESIZE
===================================== */

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    canvas.width =
        rect.width * window.devicePixelRatio;

    canvas.height =
        rect.height * window.devicePixelRatio;

    ctx.setTransform(
        window.devicePixelRatio,
        0,
        0,
        window.devicePixelRatio,
        0,
        0
    );


    offsetX =
        rect.width / 2;

    offsetY =
        100;


    drawCity();

}


window.addEventListener(
    "resize",
    resizeCanvas
);


/* =====================================
   ISOMETRIC COORDINATES
===================================== */

function isoToScreen(row, col) {

    return {

        x:
            offsetX
            +
            (col - row)
            * tileWidth
            * 0.5
            * zoom,

        y:
            offsetY
            +
            (col + row)
            * tileHeight
            * 0.5
            * zoom

    };

}


/* =====================================
   DRAW DIAMOND TILE
===================================== */

function drawTile(x, y, color) {

    const w =
        tileWidth * zoom;

    const h =
        tileHeight * zoom;


    ctx.beginPath();

    ctx.moveTo(
        x,
        y
    );

    ctx.lineTo(
        x + w / 2,
        y + h / 2
    );

    ctx.lineTo(
        x,
        y + h
    );

    ctx.lineTo(
        x - w / 2,
        y + h / 2
    );

    ctx.closePath();

    ctx.fillStyle =
        color;

    ctx.fill();

    ctx.strokeStyle =
        "rgba(25,60,25,.35)";

    ctx.lineWidth =
        1;

    ctx.stroke();

}


/* =====================================
   DRAW TREE
===================================== */

function drawTree(x, y) {

    ctx.fillStyle =
        "#6d4728";

    ctx.fillRect(
        x - 3,
        y - 15,
        6,
        18
    );


    ctx.beginPath();

    ctx.arc(
        x,
        y - 25,
        13,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#245c2b";

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        x - 7,
        y - 20,
        9,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#347a35";

    ctx.fill();

}


/* =====================================
   DRAW BUILDING
===================================== */

function drawBuilding(
    x,
    y,
    type
) {

    const data =
        BUILDING_TYPES[type];

    if (!data) return;


    const colors = {

        house: "#d87952",

        apartment: "#8094aa",

        shop: "#e1aa45",

        factory: "#687078",

        park: "#4e9c51",

        school: "#d6b55c",

        hospital: "#e8e5d8",

        powerPlant: "#7d6661"

    };


    const color =
        colors[type] || "#777";


    /* Park */

    if (type === "park") {

        drawTree(
            x - 12,
            y + 2
        );

        drawTree(
            x + 10,
            y + 5
        );

        drawTree(
            x,
            y - 3
        );

        return;

    }


    let height = 25;


    if (type === "apartment") {

        height = 65;

    }

    if (type === "hospital") {

        height = 45;

    }

    if (type === "factory") {

        height = 35;

    }

    if (type === "powerPlant") {

        height = 45;

    }


    const w =
        34 * zoom;

    const h =
        18 * zoom;


    /* Building front */

    ctx.fillStyle =
        shadeColor(
            color,
            -20
        );


    ctx.fillRect(
        x - w / 2,
        y - height,
        w,
        height
    );


    /* Roof */

    ctx.beginPath();

    ctx.moveTo(
        x - w / 2,
        y - height
    );

    ctx.lineTo(
        x,
        y - height - h / 2
    );

    ctx.lineTo(
        x + w / 2,
        y - height
    );

    ctx.lineTo(
        x,
        y - height + h / 2
    );

    ctx.closePath();

    ctx.fillStyle =
        color;

    ctx.fill();


    /* Windows */

    if (
        type !== "factory" &&
        type !== "powerPlant"
    ) {

        ctx.fillStyle =
            "#d8ecba";


        for (
            let i = 0;
            i < 2;
            i++
        ) {

            ctx.fillRect(

                x - w / 2 + 7,

                y -
                height +
                10 +
                i * 15,

                6,

                7

            );


            ctx.fillRect(

                x + 7,

                y -
                height +
                10 +
                i * 15,

                6,

                7

            );

        }

    }


    /* Hospital cross */

    if (type === "hospital") {

        ctx.fillStyle =
            "#d94b4b";

        ctx.fillRect(
            x - 2,
            y - height - 8,
            4,
            16
        );

        ctx.fillRect(
            x - 8,
            y - height - 2,
            16,
            4
        );

    }


    /* Factory chimney */

    if (type === "factory") {

        ctx.fillStyle =
            "#444";

        ctx.fillRect(
            x + 9,
            y - height - 22,
            7,
            22
        );

    }


    /* Power plant */

    if (type === "powerPlant") {

        ctx.beginPath();

        ctx.arc(
            x,
            y - height - 8,
            9,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#f0c34a";

        ctx.fill();

    }

}


/* =====================================
   COLOR HELPER
===================================== */

function shadeColor(
    color,
    amount
) {

    let num =
        parseInt(
            color.replace("#", ""),
            16
        );


    let r =
        Math.max(
            0,
            Math.min(
                255,
                (num >> 16) + amount
            )
        );


    let g =
        Math.max(
            0,
            Math.min(
                255,
                ((num >> 8) & 0x00FF) + amount
            )
        );


    let b =
        Math.max(
            0,
            Math.min(
                255,
                (num & 0x0000FF) + amount
            )
        );


    return "#" +
        (
            0x1000000 +
            (r << 16) +
            (g << 8) +
            b
        )
        .toString(16)
        .slice(1);

}


/* =====================================
   DRAW CITY
===================================== */

function drawCity() {

    const rect =
        canvas.getBoundingClientRect();


    ctx.clearRect(
        0,
        0,
        rect.width,
        rect.height
    );


    /* Background */

    ctx.fillStyle =
        "#4d8f49";

    ctx.fillRect(
        0,
        0,
        rect.width,
        rect.height
    );


    /* Water */

    ctx.fillStyle =
        "#2679a5";

    ctx.fillRect(
        0,
        rect.height * 0.72,
        rect.width,
        rect.height * 0.28
    );


    /* Terrain */

    for (
        let row = 0;
        row < GRID_SIZE;
        row++
    ) {

        for (
            let col = 0;
            col < GRID_SIZE;
            col++
        ) {

            const point =
                isoToScreen(
                    row,
                    col
                );


            let color =
                "#4f9348";


            /* water tiles */

            if (
                row > 14 &&
                col > 11
            ) {

                color =
                    "#2c82ac";

            }


            drawTile(
                point.x,
                point.y,
                color
            );

        }

    }


    /* Random decorative trees */

    drawTree(
        offsetX - 350,
        offsetY + 70
    );

    drawTree(
        offsetX + 350,
        offsetY + 90
    );

    drawTree(
        offsetX - 290,
        offsetY + 250
    );

    drawTree(
        offsetX + 300,
        offsetY + 250
    );


    /* Roads */

    city.buildings.forEach(
        building => {

            if (
                building.type !== "road"
            ) return;


            const point =
                isoToScreen(
                    building.row,
                    building.column
                );


            drawRoad(
                point.x,
                point.y
            );

        }
    );


    /* Buildings */

    city.buildings
        .filter(
            building =>
                building.type !== "road"
        )
        .sort(
            (a, b) =>
                (a.row + a.column)
                -
                (b.row + b.column)
        )
        .forEach(
            building => {

                const point =
                    isoToScreen(
                        building.row,
                        building.column
                    );


                drawBuilding(
                    point.x,
                    point.y,
                    building.type
                );

            }
        );

}


/* =====================================
   ROAD
===================================== */

function drawRoad(x, y) {

    drawTile(
        x,
        y,
        "#55595a"
    );


    ctx.strokeStyle =
        "#e0d16b";

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.moveTo(
        x - 12,
        y + 17
    );

    ctx.lineTo(
        x,
        y + 9
    );

    ctx.lineTo(
        x + 12,
        y + 17
    );

    ctx.stroke();

}


/* =====================================
   MOUSE → GRID
===================================== */

function screenToGrid(
    mouseX,
    mouseY
) {

    const x =
        (mouseX - offsetX)
        /
        (tileWidth * zoom * 0.5);


    const y =
        (mouseY - offsetY)
        /
        (tileHeight * zoom * 0.5);


    const col =
        Math.round(
            (x + y) / 2
        );


    const row =
        Math.round(
            (y - x) / 2
        );


    return {
        row,
        col
    };

}


/* =====================================
   CANVAS CLICK
===================================== */

canvas.addEventListener(
    "click",
    event => {

        const rect =
            canvas.getBoundingClientRect();


        const mouseX =
            event.clientX -
            rect.left;


        const mouseY =
            event.clientY -
            rect.top;


        const grid =
            screenToGrid(
                mouseX,
                mouseY
            );


        const row =
            grid.row + 1;

        const col =
            grid.col + 1;


        if (
            row < 1 ||
            row > GRID_SIZE ||
            col < 1 ||
            col > GRID_SIZE
        ) {

            return;

        }


        const building =
            city.buildings.find(
                item =>
                    item.row === row &&
                    item.column === col
            );


        if (demolishMode) {

            if (building) {

                removeBuilding(
                    building
                );

            }

            return;

        }


        if (building) {

            selectExistingBuilding(
                building
            );

            return;

        }


        createBuilding(
            row,
            col
        );

    }
);


/* =====================================
   CREATE
===================================== */

function createBuilding(
    row,
    column
) {

    if (!selectedType) return;


    const data =
        BUILDING_TYPES[selectedType];


    if (!data) return;


    if (city.money < data.cost) {

        showMessage(
            "❌ Not enough money!"
        );

        return;

    }


    const building = {

        id:
            generateId(),

        type:
            selectedType,

        row:
            row,

        column:
            column,

        createdAt:
            new Date().toISOString()

    };


    city.money -=
        data.cost;


    city.buildings.push(
        building
    );


    calculateStats();

    saveCityData(city);

    drawCity();

    updateUI();

    showMessage(
        `${data.icon} ${data.name} constructed!`
    );

}


/* =====================================
   DELETE
===================================== */

function removeBuilding(
    building
) {

    const data =
        BUILDING_TYPES[
            building.type
        ];


    if (!data) return;


    if (
        !confirm(
            `Remove ${data.name}?\n\nYou will receive 50% refund.`
        )
    ) {

        return;

    }


    city.buildings =
        city.buildings.filter(
            item =>
                item.id !== building.id
        );


    city.money +=
        Math.floor(
            data.cost * 0.5
        );


    calculateStats();

    saveCityData(city);

    drawCity();

    updateUI();


    showMessage(
        `🗑️ ${data.name} removed.`
    );

}


/* =====================================
   SELECT BUILDING
===================================== */

function selectExistingBuilding(
    building
) {

    const data =
        BUILDING_TYPES[
            building.type
        ];


    if (!data) return;


    updateInfoPanel(
        data
    );


    showMessage(
        `${data.icon} ${data.name} selected`
    );

}


/* =====================================
   INFO PANEL
===================================== */

function updateInfoPanel(
    data
) {

    document.getElementById(
        "infoIcon"
    ).textContent =
        data.icon;


    document.getElementById(
        "infoName"
    ).textContent =
        data.name;


    document.getElementById(
        "infoDescription"
    ).textContent =
        descriptions[
            selectedType
        ] ||
        descriptions[
            Object.keys(BUILDING_TYPES)
                .find(
                    key =>
                        BUILDING_TYPES[key]
                        === data
                )
        ] ||
        "City building";


    document.getElementById(
        "infoCost"
    ).textContent =
        `₹${data.cost.toLocaleString("en-IN")}`;


    document.getElementById(
        "infoPopulation"
    ).textContent =
        `+${data.population}`;


    document.getElementById(
        "infoHappiness"
    ).textContent =
        `${data.happiness >= 0 ? "+" : ""}${data.happiness}`;


    document.getElementById(
        "infoPollution"
    ).textContent =
        `${data.pollution >= 0 ? "+" : ""}${data.pollution}`;


    document.getElementById(
        "infoPower"
    ).textContent =
        `${data.electricity >= 0 ? "+" : ""}${data.electricity}`;

}


/* =====================================
   SELECT TOOL
===================================== */

document
    .querySelectorAll(".tool-button")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".tool-button"
                        )
                        .forEach(
                            btn =>
                                btn.classList
                                    .remove(
                                        "selected"
                                    )
                        );


                    button.classList.add(
                        "selected"
                    );


                    if (
                        button.id ===
                        "demolishTool"
                    ) {

                        demolishMode =
                            true;

                        selectedType =
                            null;

                        showMessage(
                            "🔨 Demolish mode enabled"
                        );

                        return;

                    }


                    demolishMode =
                        false;


                    selectedType =
                        button.dataset.type;


                    updateInfoPanel(
                        BUILDING_TYPES[
                            selectedType
                        ]
                    );

                }
            );

        }
    );


/* =====================================
   ZOOM
===================================== */

document
    .getElementById("zoomIn")
    .addEventListener(
        "click",
        () => {

            zoom =
                Math.min(
                    1.6,
                    zoom + 0.15
                );

            drawCity();

        }
    );


document
    .getElementById("zoomOut")
    .addEventListener(
        "click",
        () => {

            zoom =
                Math.max(
                    0.6,
                    zoom - 0.15
                );

            drawCity();

        }
    );


document
    .getElementById("resetView")
    .addEventListener(
        "click",
        () => {

            zoom = 1;

            drawCity();

        }
    );


/* =====================================
   STATS
===================================== */

function calculateStats() {

    let population = 0;

    let happiness = 50;

    let pollution = 0;

    let electricity = 100;


    city.buildings.forEach(
        building => {

            const data =
                BUILDING_TYPES[
                    building.type
                ];


            if (!data) return;


            population +=
                data.population;


            happiness +=
                data.happiness;


            pollution +=
                data.pollution;


            electricity +=
                data.electricity;

        }
    );


    city.population =
        population;


    city.happiness =
        Math.max(
            0,
            Math.min(
                100,
                happiness
            )
        );


    city.pollution =
        Math.max(
            0,
            Math.min(
                100,
                pollution
            )
        );


    city.electricity =
        Math.max(
            0,
            electricity
        );

}


/* =====================================
   UI
===================================== */

function updateUI() {

    document.getElementById(
        "money"
    ).textContent =
        `₹${city.money.toLocaleString("en-IN")}`;


    document.getElementById(
        "population"
    ).textContent =
        city.population.toLocaleString("en-IN");


    document.getElementById(
        "happiness"
    ).textContent =
        `${city.happiness}%`;


    document.getElementById(
        "pollution"
    ).textContent =
        `${city.pollution}%`;


    document.getElementById(
        "electricity"
    ).textContent =
        city.electricity;


    document.getElementById(
        "day"
    ).textContent =
        city.day;

}


/* =====================================
   END DAY
===================================== */

document
    .getElementById("nextDayBtn")
    .addEventListener(
        "click",
        () => {

            let income = 0;

            let expenses = 0;


            city.buildings.forEach(
                building => {

                    const data =
                        BUILDING_TYPES[
                            building.type
                        ];


                    if (!data) return;


                    income +=
                        data.income;


                    expenses +=
                        data.maintenance;

                }
            );


            const profit =
                income - expenses;


            city.money +=
                profit;


            city.day++;


            city.transactions =
                city.transactions || [];


            city.transactions.unshift({

                id:
                    generateId(),

                day:
                    city.day,

                income:
                    income,

                expenses:
                    expenses,

                profit:
                    profit,

                date:
                    new Date().toISOString()

            });


            city.transactions =
                city.transactions.slice(
                    0,
                    10
                );


            calculateStats();

            saveCityData(city);

            updateUI();


            showMessage(
                `☀️ Day ${city.day} | Net profit ₹${profit.toLocaleString("en-IN")}`
            );

        }
    );


/* =====================================
   MESSAGE
===================================== */

function showMessage(
    message
) {

    const element =
        document.getElementById(
            "cityMessage"
        );


    element.textContent =
        message;


    element.classList.add(
        "show"
    );


    setTimeout(
        () => {

            element.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =====================================
   INITIALIZE
===================================== */

calculateStats();

updateUI();

updateInfoPanel(
    BUILDING_TYPES.house
);

resizeCanvas();