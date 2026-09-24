let city = getCityData();


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


    saveCityData(city);

}


function calculateEconomy() {

    let income = 0;

    let expenses = 0;


    city.buildings.forEach(
        building => {

            const data =
                BUILDING_TYPES[
                    building.type
                ];


            income += data.income;

            expenses +=
                data.maintenance;

        }
    );


    return {

        income,

        expenses,

        profit:
            income - expenses

    };

}


function renderDashboard() {

    calculateStats();


    document.getElementById(
        "money"
    ).textContent =
        `₹${city.money.toLocaleString()}`;


    document.getElementById(
        "population"
    ).textContent =
        city.population.toLocaleString();


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


    const economy =
        calculateEconomy();


    document.getElementById(
        "dailyIncome"
    ).textContent =
        `₹${economy.income.toLocaleString()}`;


    document.getElementById(
        "dailyExpenses"
    ).textContent =
        `₹${economy.expenses.toLocaleString()}`;


    document.getElementById(
        "dailyProfit"
    ).textContent =
        `₹${economy.profit.toLocaleString()}`;


    renderBuildingSummary();

    renderTransactions();

}


function renderBuildingSummary() {

    const container =
        document.getElementById(
            "buildingSummary"
        );


    container.innerHTML = "";


    const counts = {};


    city.buildings.forEach(
        building => {

            counts[building.type] =
                (counts[building.type] || 0)
                + 1;

        }
    );


    if (Object.keys(counts).length === 0) {

        container.innerHTML = `

            <div class="empty-small">
                🏗️ No buildings yet.
                <a href="city.html">
                    Start building →
                </a>
            </div>

        `;

        return;

    }


    Object.entries(counts)
        .forEach(
            ([type, count]) => {

                const data =
                    BUILDING_TYPES[type];


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "building-summary-card";


                card.innerHTML = `

                    <span>
                        ${data.icon}
                    </span>

                    <strong>
                        ${count}
                    </strong>

                    <small>
                        ${data.name}
                    </small>

                `;


                container.appendChild(
                    card
                );

            }
        );

}


function renderTransactions() {

    const container =
        document.getElementById(
            "transactions"
        );


    container.innerHTML = "";


    if (
        !city.transactions ||
        city.transactions.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-small">
                No financial activity yet.
            </div>

        `;

        return;

    }


    city.transactions.forEach(
        transaction => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "transaction";


            const profitClass =
                transaction.profit >= 0
                    ? "positive"
                    : "negative";


            item.innerHTML = `

                <div>

                    <strong>
                        Day ${transaction.day}
                    </strong>

                    <small>
                        Income:
                        ₹${transaction.income.toLocaleString()}
                        ·
                        Expenses:
                        ₹${transaction.expenses.toLocaleString()}
                    </small>

                </div>


                <strong class="${profitClass}">
                    ${transaction.profit >= 0 ? "+" : ""}
                    ₹${transaction.profit.toLocaleString()}
                </strong>

            `;


            container.appendChild(
                item
            );

        }
    );

}


function endDay() {

    const economy =
        calculateEconomy();


    city.money +=
        economy.profit;


    city.day++;


    if (city.money < 0) {

        city.money = 0;

    }


    city.transactions.unshift({

        id: generateId(),

        day: city.day,

        income: economy.income,

        expenses: economy.expenses,

        profit: economy.profit,

        date:
            new Date().toISOString()

    });


    city.transactions =
        city.transactions.slice(
            0,
            10
        );


    saveCityData(city);

    renderDashboard();


    showMessage(
        `☀️ Day ${city.day} completed. ` +
        `Net profit: ₹${economy.profit.toLocaleString()}`
    );

}


function showMessage(message) {

    const element =
        document.getElementById(
            "message"
        );


    element.textContent =
        message;


    setTimeout(
        () => {
            element.textContent = "";
        },
        3000
    );

}


document
    .getElementById(
        "nextDayBtn"
    )
    .addEventListener(
        "click",
        endDay
    );


renderDashboard();