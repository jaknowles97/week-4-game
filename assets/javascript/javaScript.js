$(document).ready(function() {
    var player;
    var defender;
    var fightCounter = 1;
    var enemiesToKill = [];
    var enemiesKilled = 0;


    let characters = {
        'luke': {
            name: 'luke',
            hp: 120,
            atk: 10,
            counterAtk: 5
        },
        'darth': {
            name: 'darth',
            hp: 80,
            atk: 20,
            counterAtk: 15
        },
        'yoda': {
            name: 'yoda',
            hp: 150,
            atk: 15,
            counterAtk: 10
        },
        'jabba': {
            name: 'jabba-da-pizza-hut',
            hp: '200',
            atk: 5,
            counterAtk: 5
        }
    };

    var createCard = function(char, spawnPos, charRole) {
        var card = $("<div class='col char' data-name='"+ char.name +"' >");
        var cardName = $("<div class='char-name'>").text(char.name);
        var cardHealth = $("<div class='char-health'>").text(char.hp);
        // aligin card parts into card structure
        card.append(cardName).append(cardHealth);
        // place card in its correct field based on attr.
        $(spawnPos).append(card);
        //add class based on role chosen for character.
        if(charRole === "defender") {
            $(char).addClass('defender');
        }else if (charRole === "enemy") {
            $(char).addClass('enemy');
        }else {
            $(char).addClass('player');
        }
    }; 
    
    // spawns given card/s at given location and adds a 'role' to given card/s
    var spawnCard = function(char, spawnPos) {
        if(spawnPos === ".player-select-field") {
            for(var key in char) {
                createCard(char[key], spawnPos, " ");
            }
        }else if(spawnPos === ".player-field") {
            createCard(char, ".player-field", "player")
            $(".attackBtn").css("visibility", "visible");
        } else if(spawnPos === "enemy-field") {
            createCard(char, ".enemy-field", 'enemy')
            enemiesToKill.push(char.name);
        }else if(spawnPos === ".defender-field") {
            $(".defender-field").empty();
            createCard(char, ".defender-field", "defender");
        }else{
            console.log('spawnCard says: Parameters dont make sense. char: '+char+'spawnPos: '+spawnPos);
        }
    }

    spawnCard(characters, ".player-field");

    

});