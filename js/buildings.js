let city = getCityData();

let editingId = null;


const table =
    document.getElementById(
        "buildingTable"
    );

const modal =
    document.getElementById(
        "buildingModal"
    );

const form =
    document.getElementById(
        "buildingForm"
    );

const typeSelect =
    document.getElementById(
        "buildingType"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const typeFilter =
    document.getElementById(
        "typeFilter"
    );

const sortSelect =
    document.getElementById(
        "sortSelect"
    );


function populateTypes() {

    typeSelect.innerHTML = "";

    typeFilter.innerHTML =
        `<option value="all">
            All Types
        </option>`;


    Object.entries(BUILDING_TYPES)
        .forEach(([type, data]) => {

            typeSelect.innerHTML += `

                <option value="${type}">
                    ${data.icon} ${data.name}
                </option>

            `;


            typeFilter.innerHTML += `

                <option value="${type}">
                    ${data.name}
                </option>

            `;

        });

}


function renderBuildings() {

    let buildings =
        [...city.buildings];


    const search =
        searchInput
            .value
            .toLowerCase()
            .trim();


    const filter =
        typeFilter.value;


    if (search) {

        buildings =
            buildings.filter(
                building => {

                    const data =
                        BUILDING_TYPES[
                            building.type
                        ];


                    return data.name
                        .toLowerCase()
                        .includes(search);

                }
            );

    }


    if (filter !== "all") {

        buildings =
            buildings.filter(
                building =>
                    building.type === filter
            );

    }


    switch (sortSelect.value) {

        case "oldest":

            buildings.sort(
                (a, b) =>
                    new Date(a.createdAt)
                    -
                    new Date(b.createdAt)
            );

            break;


        case "cost-high":

            buildings.sort(
                (a, b) =>
                    BUILDING_TYPES[b.type].cost
                    -
                    BUILDING_TYPES[a.type].cost
            );

            break;


        case "cost-low":

            buildings.sort(
                (a, b) =>
                    BUILDING_TYPES[a.type].cost
                    -
                    BUILDING_TYPES[b.type].cost
            );

            break;


        default:

            buildings.sort(
                (a, b) =>
                    new Date(b.createdAt)
                    -
                    new Date(a.createdAt)
            );

    }


    table.innerHTML = "";


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (buildings.length === 0) {

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }


    emptyState.classList.add(
        "hidden"
    );


    buildings.forEach(
        building => {

            const data =
                BUILDING_TYPES[
                    building.type
                ];


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <div class="building-name">

                        <span>
                            ${data.icon}
                        </span>

                        <strong>
                            ${data.name}
                        </strong>

                    </div>

                </td>


                <td>
                    Row ${building.row},
                    Column ${building.column}
                </td>


                <td>
                    ₹${data.cost.toLocaleString()}
                </td>


                <td>
                    ${data.population}
                </td>


                <td>

                    <div class="table-actions">

                        <button
                            class="edit-btn"
                            data-id="${building.id}"
                        >
                            ✏️ Edit
                        </button>

                        <button
                            class="delete-btn"
                            data-id="${building.id}"
                        >
                            🗑️ Delete
                        </button>

                    </div>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


function openAddModal() {

    editingId = null;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Building";


    form.reset();


    modal.classList.remove(
        "hidden"
    );

}


function openEditModal(id) {

    const building =
        city.buildings.find(
            item => item.id === id
        );


    if (!building) return;


    editingId = id;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Building";


    typeSelect.value =
        building.type;


    document.getElementById(
        "buildingRow"
    ).value =
        building.row;


    document.getElementById(
        "buildingColumn"
    ).value =
        building.column;


    modal.classList.remove(
        "hidden"
    );

}


function closeModal() {

    modal.classList.add(
        "hidden"
    );

    editingId = null;

}


function saveBuilding(event) {

    event.preventDefault();


    const type =
        typeSelect.value;


    const row =
        Number(
            document.getElementById(
                "buildingRow"
            ).value
        );


    const column =
        Number(
            document.getElementById(
                "buildingColumn"
            ).value
        );


    if (
        row < 1 ||
        row > 10 ||
        column < 1 ||
        column > 10
    ) {

        showMessage(
            "❌ Location must be between 1 and 10."
        );

        return;

    }


    if (editingId) {

        updateBuilding(
            editingId,
            type,
            row,
            column
        );

    } else {

        createBuilding(
            type,
            row,
            column
        );

    }

}


function createBuilding(
    type,
    row,
    column
) {

    const occupied =
        city.buildings.some(
            building =>
                building.row === row &&
                building.column === column
        );


    if (occupied) {

        showMessage(
            "❌ This location is already occupied."
        );

        return;

    }


    const data =
        BUILDING_TYPES[type];


    if (city.money < data.cost) {

        showMessage(
            "❌ Not enough money."
        );

        return;

    }


    const building = {

        id: generateId(),

        type: type,

        row: row,

        column: column,

        createdAt:
            new Date().toISOString()

    };


    city.money -=
        data.cost;


    city.buildings.push(
        building
    );


    saveCityData(city);

    closeModal();

    renderBuildings();


    showMessage(
        `✅ ${data.name} created.`
    );

}


function updateBuilding(
    id,
    type,
    row,
    column
) {

    const building =
        city.buildings.find(
            item => item.id === id
        );


    if (!building) return;


    const occupied =
        city.buildings.some(
            item =>
                item.id !== id &&
                item.row === row &&
                item.column === column
        );


    if (occupied) {

        showMessage(
            "❌ Another building already occupies this location."
        );

        return;

    }


    building.type = type;

    building.row = row;

    building.column = column;


    saveCityData(city);

    closeModal();

    renderBuildings();


    showMessage(
        "✅ Building updated."
    );

}


function deleteBuilding(id) {

    const building =
        city.buildings.find(
            item => item.id === id
        );


    if (!building) return;


    const data =
        BUILDING_TYPES[
            building.type
        ];


    const confirmed =
        confirm(
            `Delete ${data.name}?\n\n` +
            `You will receive 50% of its original cost back.`
        );


    if (!confirmed) return;


    city.buildings =
        city.buildings.filter(
            item => item.id !== id
        );


    city.money +=
        Math.floor(
            data.cost * 0.5
        );


    saveCityData(city);

    renderBuildings();


    showMessage(
        `🗑️ ${data.name} deleted.`
    );

}


table.addEventListener(
    "click",
    event => {

        const editButton =
            event.target.closest(
                ".edit-btn"
            );


        const deleteButton =
            event.target.closest(
                ".delete-btn"
            );


        if (editButton) {

            openEditModal(
                editButton.dataset.id
            );

        }


        if (deleteButton) {

            deleteBuilding(
                deleteButton.dataset.id
            );

        }

    }
);


document
    .getElementById(
        "addBuildingBtn"
    )
    .addEventListener(
        "click",
        openAddModal
    );


document
    .getElementById(
        "closeModal"
    )
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById(
        "cancelModal"
    )
    .addEventListener(
        "click",
        closeModal
    );


form.addEventListener(
    "submit",
    saveBuilding
);


searchInput.addEventListener(
    "input",
    renderBuildings
);


typeFilter.addEventListener(
    "change",
    renderBuildings
);


sortSelect.addEventListener(
    "change",
    renderBuildings
);


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


populateTypes();

renderBuildings();