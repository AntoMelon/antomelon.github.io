const KEY = "bingo_gen";

document.addEventListener("DOMContentLoaded", function() {

    /**
     * Esacpes a String to remove HTML tags
     * @param {String} str the String to escape
     */
     function escapeString(str) {
        return str.replaceAll("<","&lt;").replaceAll(">","&gt;");
    }


    function addGame(name) {
        let memory = localStorage.getItem(KEY);
        if (memory == null) {
            console.log("no data");
            let obj = {};
            obj[name] = [];

            localStorage.setItem(KEY,JSON.stringify(obj));
        } else {
            memory = JSON.parse(memory);
            if (memory[name] != undefined) {
                alert("Game has already been added.");
                return;
            } else {
                memory[name] = [];

                localStorage.setItem(KEY,JSON.stringify(memory));
                window.location.reload();
            }
        }
    }

    function removeSelectedGame() {
        let memory = localStorage.getItem(KEY);
        if (memory == null) {
            alert("No game has been registered yet.");
        }

        let num = document.getElementById("games").selectedIndex;

        if (num == 0) {
            alert("No game is selected.");
            return;
        }

        let name = document.getElementById("games").value;

        memory = JSON.parse(memory);

        delete memory[name];
        localStorage.setItem(KEY,JSON.stringify(memory));
        window.location.reload();
    }

    function loadGames() {
        let memory = localStorage.getItem(KEY);
        if (memory == null) {
            return;
        }

        memory = JSON.parse(memory);

        let sel = document.getElementById("games");

        for (let game in memory) {
            sel.innerHTML+= "<option value=\""+game+"\">"+game+"</option>"
        }
    }

    function addObjective() {
        let num = document.getElementById("games").selectedIndex;

        if (num == 0) {
            alert("No game is selected.");
            return;
        }

        let game = document.getElementById("games").value;

        let memory = localStorage.getItem(KEY);
        if (memory == null) {
            return;
        }

        memory = JSON.parse(memory);

        let objective = document.getElementById("fieldAddObjective").value;
        memory[game].push(escapeString(objective));

        document.getElementById("fieldAddObjective").value = "";

        localStorage.setItem(KEY,JSON.stringify(memory));
    }

    function loadObjectivesFromSelectedGame() {
        let memory = localStorage.getItem(KEY);
        if (memory == null) {
            return;
        }
        memory = JSON.parse(memory);

        let name = document.getElementById("games").value;

        let objectives = document.getElementById("objectives");
        objectives.innerHTML = "";

        for (let objective of memory[name]) {
            objectives.innerHTML += "<li><button class=\"delete\"></button>"+objective+"</li>"; 
        }
    }

    function generateJSON() {
        let memory = localStorage.getItem(KEY);
        if (memory == null) {
            return;
        }

        let num = document.getElementById("games").selectedIndex;

        if (num == 0) {
            alert("No game is selected.");
            return;
        }

        let game = document.getElementById("games").value;

        memory = JSON.parse(memory);

        if (memory[game].length < 25) {
            alert("You need at least 25 objectives.");
            return;
        }

        let copy = [];

        for (let obj of memory[game]) {
            copy.push(obj);
        }

        let output = "[";

        for (let i = 0; i < 25; ++i) {
            let id = Math.floor(Math.random()*copy.length);

            output += "{\"name\": \""+copy[id]+"\"}";

            if (i < 24) {
                output += ",";
            }

            copy.splice(id,1);
        }
        output += "]";


        let target = document.getElementById("output");
        target.innerHTML = "";
        target.setAttribute('readonly',true);
        target.innerHTML += output;
    }


    loadGames();

    let btnAddGame = document.getElementById("btnAddGame");
    btnAddGame.addEventListener("click",function(e) {
        let name = escapeString(document.getElementById("fieldAddGame").value);
        document.getElementById("fieldAddGame").value = "";
        
        if (name.trim() == "") {
            alert("Name must not be empty");
        }

        addGame(name);


    })

    let btnRemoveGame = document.getElementById("btnRemoveGame");
    btnRemoveGame.addEventListener("click",function(e) {
        removeSelectedGame();
    });

    let btnLoadObjectives = document.getElementById("btnLoadObjectives");
    btnLoadObjectives.addEventListener("click",function(e) {
        loadObjectivesFromSelectedGame();
    });

    let btnAddObjective = document.getElementById("btnAddObjective");
    btnAddObjective.addEventListener("click", function(e) {
        addObjective();
        loadObjectivesFromSelectedGame();
    });

    let btnGenerate = document.getElementById("btnGenerate");
    btnGenerate.addEventListener("click",function(e) {
        loadObjectivesFromSelectedGame();
        generateJSON();
    })

    let btnCopy = document.getElementById("btnCopy");
    btnCopy.addEventListener("click",function(e) {
        let copyText = document.getElementById("output");
        navigator.clipboard.writeText(copyText.innerHTML).then(function() {
            alert("Copied successfully!");
          }, function() {
            alert("Failed to copy.");
          });
    });


    let ul = document.querySelector("ul");
    ul.addEventListener("click",function(e) {
        if (e.target.tagName == "BUTTON") {
            let objective = e.target.parentElement.innerHTML;
            objective = objective.replace('<button class=\"delete\"></button>','');


            let memory = localStorage.getItem(KEY);
            if (memory == null) {
                return;
            }

            let num = document.getElementById("games").selectedIndex;

            if (num == 0) {
                alert("No game is selected.");
                return;
            }

            let game = document.getElementById("games").value;

            memory = JSON.parse(memory);
            console.log(memory)


            for (let i = 0; i < memory[game].length; ++i) {
                if (memory[game][i] == objective) {
                    memory[game].splice(i,1);
                    break;
                }
            }

            localStorage.setItem(KEY,JSON.stringify(memory));
            loadObjectivesFromSelectedGame();
            
        }
    });

});