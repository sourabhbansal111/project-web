// ===============================
// CITYFORGE - ECONOMY SYSTEM
// ===============================

const buildings = {

    house: {
        name: "House",
        icon: "🏠",
        cost: 5000,

        population: 50,

        taxIncome: 500,
        income: 0,

        maintenance: 50,

        happiness: 2,
        pollution: 0,
        electricity: -2
    },

    apartment: {
        name: "Apartment",
        icon: "🏢",
        cost: 12000,

        population: 150,

        taxIncome: 1500,
        income: 0,

        maintenance: 120,

        happiness: 1,
        pollution: 1,
        electricity: -5
    },

    shop: {
        name: "Shop",
        icon: "🏪",
        cost: 15000,

        population: 10,

        taxIncome: 300,
        income: 2000,

        maintenance: 200,

        happiness: 3,
        pollution: 2,
        electricity: -8
    },

    factory: {
        name: "Factory",
        icon: "🏭",
        cost: 25000,

        population: 50,

        taxIncome: 500,
        income: 3500,

        maintenance: 700,

        happiness: -5,
        pollution: 10,
        electricity: -15
    },

    park: {
        name: "Park",
        icon: "🌳",
        cost: 5000,

        population: 0,

        taxIncome: 0,
        income: 0,

        maintenance: 100,

        happiness: 8,
        pollution: -5,
        electricity: 0
    },

    school: {
        name: "School",
        icon: "🏫",
        cost: 18000,

        population: 100,

        taxIncome: 0,
        income: 0,

        maintenance: 500,

        happiness: 8,
        pollution: 0,
        electricity: -10
    },

    hospital: {
        name: "Hospital",
        icon: "🏥",
        cost: 25000,

        population: 80,

        taxIncome: 0,
        income: 0,

        maintenance: 800,

        happiness: 12,
        pollution: 0,
        electricity: -15
    },

    powerPlant: {
        name: "Power Plant",
        icon: "⚡",
        cost: 30000,

        population: 0,

        taxIncome: 0,
        income: 0,

        maintenance: 1000,

        happiness: -2,
        pollution: 15,
        electricity: 150
    }
};


// ===============================
// CITY STATE
// ===============================

const cityState = {

    money: 100000,

    population: 0,

    happiness: 50,

    pollution: 0,

    electricity: 100,

    day: 1,

    taxRate: 10,

    buildings: []
};


// ===============================
// BUILDING
// ===============================

function buildBuilding(type) {

    const building = buildings[type];

    if (!building) {
        console.log("Building doesn't exist");
        return;
    }


    // Check money

    if (cityState.money < building.cost) {

        showMessage(
            `❌ Not enough money! You need ₹${building.cost.toLocaleString()}`
        );

        return;
    }


    // Remove money

    cityState.money -= building.cost;


    // Add building

    cityState.buildings.push(type);


    // Recalculate city

    updateCity();


    // Show message

    showMessage(
        `${building.icon} ${building.name} built for ₹${building.cost.toLocaleString()}`
    );


    render();
}


// ===============================
// UPDATE CITY
// ===============================

function updateCity() {

    let population = 0;

    let happiness = 50;

    let pollution = 0;

    let electricity = 100;


    cityState.buildings.forEach(type => {

        const building = buildings[type];

        population += building.population;

        happiness += building.happiness;

        pollution += building.pollution;

        electricity += building.electricity;

    });


    // Limit happiness

    happiness = Math.max(
        0,
        Math.min(100, happiness)
    );


    // Limit pollution

    pollution = Math.max(
        0,
        Math.min(100, pollution)
    );


    cityState.population = population;

    cityState.happiness = happiness;

    cityState.pollution = pollution;

    cityState.electricity = Math.max(
        0,
        electricity
    );
}


// ===============================
// CALCULATE INCOME
// ===============================

function calculateIncome() {

    let residentialTax = 0;

    let businessIncome = 0;


    cityState.buildings.forEach(type => {

        const building = buildings[type];


        // Residential tax

        residentialTax += building.taxIncome;


        // Business income

        businessIncome += building.income;

    });


    // Happiness affects tax collection

    const happinessMultiplier =
        cityState.happiness / 100;


    residentialTax =
        residentialTax *
        happinessMultiplier;


    return {

        residentialTax: Math.round(residentialTax),

        businessIncome: Math.round(businessIncome)

    };
}


// ===============================
// CALCULATE EXPENSES
// ===============================

function calculateExpenses() {

    let maintenance = 0;


    cityState.buildings.forEach(type => {

        maintenance += buildings[type].maintenance;

    });


    // Extra electricity expense

    const electricityCost =
        cityState.electricity < 20
            ? 1000
            : 0;


    return {

        maintenance,

        electricityCost

    };
}


// ===============================
// END DAY
// ===============================

function endDay() {

    const income = calculateIncome();

    const expenses = calculateExpenses();


    const totalIncome =
        income.residentialTax +
        income.businessIncome;


    const totalExpenses =
        expenses.maintenance +
        expenses.electricityCost;


    const profit =
        totalIncome -
        totalExpenses;


    cityState.money += profit;

    cityState.day++;


    // Prevent negative money

    if (cityState.money < 0) {

        cityState.money = 0;

    }


    updateCity();

    render();


    addTransaction({

        day: cityState.day,

        income: totalIncome,

        expenses: totalExpenses,

        profit: profit

    });


    showMessage(

        `☀️ Day ${cityState.day} started | ` +

        `Income ₹${totalIncome.toLocaleString()} | ` +

        `Expenses ₹${totalExpenses.toLocaleString()} | ` +

        `Net ${profit >= 0 ? "+" : ""}₹${profit.toLocaleString()}`

    );

}


// ===============================
// TRANSACTION HISTORY
// ===============================

const transactions = [];


function addTransaction(data) {

    transactions.unshift(data);


    // Keep last 10

    if (transactions.length > 10) {

        transactions.pop();

    }


    renderTransactions();

}


// ===============================
// TRANSACTION UI
// ===============================

function renderTransactions() {

    const container =
        document.getElementById(
            "transactions"
        );


    if (!container) return;


    container.innerHTML = "";


    transactions.forEach(transaction => {

        const item =
            document.createElement("div");


        item.className =
            "transaction";


        const sign =
            transaction.profit >= 0
                ? "+"
                : "";


        item.innerHTML = `

            <div>
                <strong>
                    Day ${transaction.day}
                </strong>

                <small>
                    Income:
                    ₹${transaction.income.toLocaleString()}
                </small>

                <small>
                    Expenses:
                    ₹${transaction.expenses.toLocaleString()}
                </small>
            </div>

            <strong>
                ${sign}₹${transaction.profit.toLocaleString()}
            </strong>

        `;


        container.appendChild(item);

    });

}


// ===============================
// CITY FINANCIAL SUMMARY
// ===============================

function getFinancialSummary() {

    const income =
        calculateIncome();

    const expenses =
        calculateExpenses();


    return {

        income:
            income.residentialTax +
            income.businessIncome,

        expenses:
            expenses.maintenance +
            expenses.electricityCost,

        profit:
            income.residentialTax +
            income.businessIncome -
            expenses.maintenance -
            expenses.electricityCost

    };

}


// ===============================
// MESSAGE
// ===============================

function showMessage(message) {

    const element =
        document.getElementById(
            "message"
        );


    if (!element) return;


    element.textContent = message;


    setTimeout(() => {

        element.textContent = "";

    }, 3000);

}


// ===============================
// RENDER
// ===============================

function render() {

    updateCity();


    document.getElementById(
        "money"
    ).textContent =
        "₹" +
        cityState.money.toLocaleString();


    document.getElementById(
        "population"
    ).textContent =
        cityState.population.toLocaleString();


    document.getElementById(
        "happiness"
    ).textContent =
        cityState.happiness + "%";


    document.getElementById(
        "pollution"
    ).textContent =
        cityState.pollution + "%";


    document.getElementById(
        "electricity"
    ).textContent =
        cityState.electricity;


    document.getElementById(
        "day"
    ).textContent =
        cityState.day;


    // Financial summary

    const financial =
        getFinancialSummary();


    const income =
        document.getElementById(
            "dailyIncome"
        );


    const expenses =
        document.getElementById(
            "dailyExpenses"
        );


    const profit =
        document.getElementById(
            "dailyProfit"
        );


    if (income) {

        income.textContent =
            "₹" +
            financial.income.toLocaleString();

    }


    if (expenses) {

        expenses.textContent =
            "₹" +
            financial.expenses.toLocaleString();

    }


    if (profit) {

        profit.textContent =
            (financial.profit >= 0 ? "+" : "") +
            "₹" +
            financial.profit.toLocaleString();

    }

}