const STORAGE_KEY = "cityforge_data";

const DEFAULT_CITY = {

    money: 100000,

    day: 1,

    happiness: 50,

    population: 0,

    pollution: 0,

    electricity: 100,

    buildings: [],

    transactions: []

};


function getCityData() {

    const savedData =
        localStorage.getItem(STORAGE_KEY);


    if (!savedData) {

        return structuredClone(DEFAULT_CITY);

    }


    try {

        return JSON.parse(savedData);

    } catch (error) {

        console.error(
            "Could not load saved city:",
            error
        );

        return structuredClone(DEFAULT_CITY);

    }

}


function saveCityData(city) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(city)
    );

}


function resetCityData() {

    localStorage.removeItem(STORAGE_KEY);

}


function generateId() {

    return Date.now().toString()
        + Math.random()
            .toString(16)
            .slice(2);

}