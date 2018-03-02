$(document).ready(function() {
    var player;
    var defender;
    var fightCounter = 1;
    var enemies = [];
    var deadEnemies = 0;


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

    var initate = function() {
        $(".enemy-field").empty();
        $(".player-field").empty();
        $(".enemy-field").empty();
        $(".battle-terminal").empty();
        $(".resetBtn").hide();
        $(".attackBtn").hide();
        player = undefined;
        defender = undefined;



        spawnCard(characters, ".player-select-field");
    }

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
            $(".attackBtn").show();
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
    // a.k.a. "Battle Terminal", manages all the juicy detials of the game
    var batTerm = function(msg, play, def) {
        var damage = play.atk * fightCounter;
        if(msg === "inBattle") {
            msg = 
            '<p>' + play.name + ' charges toward ' + def.name + ' and attacks. </p>' +
            '<p> The attack does <b>' +  damage + '</b> damage leaving ' + def.name + ' with <b>' + def.hp + 'hp.</b></p>' +
            '<p>' + def.name + ' hits you back and leaves you with <b>' + play.hp + 'hp.</b></p>' +
            '<p>' + def.name + ' still stands.. Dare you attack again?</p>';
        }else if (msg === "death") {
        msg =
            '<p>' + play.name + ' charges toward ' + def.name + ' and attacks. </p>' +
            '<p> The attack does <b>' +  (play.atk * fightCounter) + '</b> damage leaving ' + def.name + ' unconcious on the floor!' +
            '<p> click on an enemy to fight! Choose wisely...</p>';
        }

        if(msg === 'won' || msg === 'lost') {
            $(".resetBtn").show();
            
        } else {
            $(".resetBtn").hide();
        }
        if(msg === 'won' ) {
            msg = '<h3 class="display-4"> YOU WON</h3>';
        } else if(msg === 'lost') {
            msg = '<h3 class="display-4"> < WASTED /> <br> you lost.</h3>';
        }
        $(".battle-terminal").html(msg);
    }

    //---------------------------------------------------------------------------------------------------------------------------------//
    initate();

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
                    enemies.push(characters[key]);
                }
            }
            console.log("total enemies waiting: " + enemies.name);
            //if player is selcted and there is no defender, click selects defender
        } else if(defender === undefined) {
            if($(this).data("name") != player.name) {
                console.log($(this).data('name'));
                name = $(this).data("name");
                defender = characters[name];
                spawnCard(characters[name], ".defender-field");
                enemies.push(characters[name]);
                $(".battle-terminal").empty();
                // update enemies on screen
                $(".enemy-field").empty();
                for(var key in enemies) {
                    if(enemies[key] != defender && enemies[key].hp > 0) {
                        spawnCard(enemies[key], ".enemy-field");
                    }
                }
            }
        }
    });


    $(document).on("click","button", function() {
        // if attack button has been clicked
        if($(this).hasClass("attackBtn")) {
            //player attacks
             defender.hp -= player.atk * fightCounter;
            //player hits back
            player.hp -= defender.counterAtk;
            $(".battle-terminal").empty();
            batTerm("inBattle", player, defender);
            fightCounter++;
            console.log("defender hp: " + defender.hp + " fightCounter: " + fightCounter);
            console.log("player hp: " + player.hp);
            // update fighting cards
            $(".player-field").empty();
            $(".defender-field").empty();
            spawnCard(player, ".player-field");
            spawnCard(defender, ".defender-field");
        } else if($(this).hasClass("resetBtn")) {
            initate();
        }
        // win or lose msg
        if(deadEnemies === 3) {
            $(".battle-terminal").append(batTerm("won"));
            $(".resetBtn").show();
        } else if (player.hp <= 0) {
            $(".battle-terminal").append(batTerm("lost"));
            $(".resetBtn").show();
        }
        if(defender.hp <= 0) {
            $(".defender-field").empty();
            $(".battle-terminal").empty();
            batTerm("death", player, defender);
            deadEnemies++;
            defender = undefined;

        }


    });


});
