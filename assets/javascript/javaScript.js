$(document).ready(function() {
    var player;
    var defender;
    var fightCounter = 1;
    var enemiesToKill = [];
    var deadCharacters = [];


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
            name: 'jabba',
            hp: '200',
            atk: 5,
            counterAtk: 5
        }
    };

    var createCard = function(char, spawnPos, charRole) {
        var column = $("<div class='col text-center'>")
        var card = $("<div class='char' data-name='"+ char.name +"' >");
        var cardName = $("<p class='char-name'>").text(char.name);
        var cardHealth = $("<p class='char-health'>").text(char.hp);
        // aligin card parts into card structure
        card.append(cardName).append(cardHealth);
        column.append(card);
        $(spawnPos).append(column);
        //add class based on role chosen for character.
        if(charRole == "defender") {
            $(card).addClass("defender");
        }
        if (charRole == "enemy") {
            $(card).addClass('enemy');
        }
        if(charRole == "player") {
            $(card).addClass('player');
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
        } else if(spawnPos === ".enemy-field") {
            createCard(char, ".enemy-field", 'enemy');
        }else if(spawnPos === ".defender-field") {
            $(".defender-field").empty();
            createCard(char, ".defender-field", "defender");
        }else{
            console.log('spawnCard says: Parameters dont make sense. char: '+char+'spawnPos: '+spawnPos);
        }
        console.log('spawnCard was called.  char: '+char+'spawnPos: '+spawnPos)
    }

    spawnCard(characters, ".player-select-field");

    $(document).on("click", ".char", function() {
        $(".player-select-field").empty();
        // first click of the game (the only time the player is undefined) will determine the player.
        if(player === undefined) {
            name = $(this).data("name");
            player = characters[name];
            console.log(player.name);
            spawnCard(characters[name], ".player-field");
            console.log("clicked on " + $(this).data("name")+ " to be the player!");
            //every other character spawns at "enemy-field"
            for(var key in characters) {
                if(key != name) {
                    spawnCard(characters[key], ".enemy-field")
                    enemiesToKill.push(characters[key]);
                }
            }
            console.log("total enemies waiting: " + enemiesToKill);
            //if player is selcted and there is no defender, click selects defender
        } else if(defender === undefined) {
            if($(this).data("name") != player.name) {
                console.log($(this).data('name'));
                name = $(this).data("name");
                defender = characters[name];
                spawnCard(characters[name], ".defender-field");
                enemiesToKill.push(characters[name]);
                // update enemies on screen
                $(".enemy-field").empty();
                for(var key in enemiesToKill) {
                    if(enemiesToKill[key] != defender && enemiesToKill[key].hp > 0) {
                        spawnCard(enemiesToKill[key], ".enemy-field");
                    }
                }
            }
        }
    });


    $(document).on("click","button", function() {
        if($(this).hasClass("attackBtn")) {
            //player attacks
            defender.hp -= (player.atk * fightCounter);
            //player hits back
            player.hp -= defender.counterAtk;
            fightCounter++;
            console.log("defender hp: " + defender.hp + " fightCounter: " + fightCounter);
            console.log("player hp: " + player.hp);
            // update fighting cards
            $(".player-field").empty();
            $(".defender-field").empty();
            spawnCard(player, ".player-field");
            spawnCard(defender, ".defender-field");

        }
        if(defender.hp <= 0) {
            $(".defender-field").empty();
            defender = undefined;
        }
    });

 

    

});