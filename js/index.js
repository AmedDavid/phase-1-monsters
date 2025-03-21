

const BASE_URL = "http://localhost:3000/monsters";
let currentPage = 1;
const monstersPerPage = 50;


const fetchMonsters = (page = 1) => {
    fetch(`${BASE_URL}/?_limit=${monstersPerPage}&_page=${page}`)
        .then(response => response.json())
        .then(monsters => {
            const monsterContainer = document.getElementById("monster-container");
            monsterContainer.innerHTML = "";
            monsters.forEach(monster => renderMonster(monster));
        })
        .catch(error => console.error("Error fetching monsters:", error));
};


const renderMonster = (monster) => {
    const monsterDiv = document.createElement("div");
    monsterDiv.innerHTML = `
        <h2>${monster.name}</h2>
        <h4>Age: ${monster.age}</h4>
        <p>${monster.description}</p>
    `;
    document.getElementById("monster-container").appendChild(monsterDiv);
};


const createMonsterForm = () => {
    const formDiv = document.getElementById("create-monster");

    const form = document.createElement("form");
    form.id = "monster-form";

    const nameInput = document.createElement("input");
    nameInput.id = "name";
    nameInput.placeholder = "Name...";

    const ageInput = document.createElement("input");
    ageInput.id = "age";
    ageInput.type = "number";
    ageInput.placeholder = "Age...";

    const descInput = document.createElement("input");
    descInput.id = "description";
    descInput.placeholder = "Description...";

    const createButton = document.createElement("button");
    createButton.textContent = "Create Monster";

    form.append(nameInput, ageInput, descInput, createButton);
    formDiv.appendChild(form);

    
    form.addEventListener("submit", handleFormSubmit);
};


const handleFormSubmit = (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = parseFloat(document.getElementById("age").value);
    const description = document.getElementById("description").value.trim();

    if (!name || isNaN(age) || !description) {
        alert("Please fill out all fields correctly.");
        return;
    }

    const newMonster = { name, age, description };

    fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(newMonster),
    })
        .then(response => response.json())
        .then(createdMonster => {
            renderMonster(createdMonster);
            document.getElementById("monster-form").reset();
        })
        .catch(error => console.error("Error creating monster:", error));
};


const addPaginationListeners = () => {
    document.getElementById("forward").addEventListener("click", () => {
        currentPage++;
        fetchMonsters(currentPage);
    });

    document.getElementById("back").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchMonsters(currentPage);
        } else {
            alert("No previous monsters available!");
        }
    });
};


const init = () => {
    fetchMonsters();
    createMonsterForm();
    addPaginationListeners();
};

document.addEventListener("DOMContentLoaded", init);
