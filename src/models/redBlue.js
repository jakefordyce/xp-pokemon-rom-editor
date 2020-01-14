import { thunk, action } from "easy-peasy";
import {rbygsLetters, rbyMoveAnimations, rbyMoveEffects, rbyItems, rbyEvolveTypes, rbyStones, rbyDamageModifiers} from './utils';
const remote = require('electron').remote;
const dialog = remote.dialog;
const fs = remote.require('fs');

//values used to load pokemon stats and moves.
const mewStartByte = 16987; // Mew's stats start at byte 0x425B
const pokemonNameStartByte = 115230; //Pokemon names start at byte 0x1c21e and also run in Index order.
const pokemonEvosMovesByte = 242136; //Pokemon evolutions and moves learned through leveling are stored together starting at byte 0x3B1D8.
const pokemonStartByte = 230366; //Pokemon data starts at byte 0x383DE. It goes in Pokedex order, Bulbasaur through Mewtwo.
const pokedexStartByte = 266276; //List of pokedex IDs start at byte 0x41024 and run in Index order, Rhydon through Victreebel.

//values used to load the pokemon types
const typesBankByte = 0x20000; // bank 9
const typesPointer = 0x7DAE; // this is a pointer within a bank, not the full address
const typeChartByte = 255092; //The types' strengths start at byte 0x3E474.
//values used to load the moves
const moveNamesByte = 720896; //The data for move names starts at 0xB0000 bytes into the file which is 720896 in Decimal.
const movesStartingByte = 229376; //The move data starts 0x38000 bytes into the file which is 229376 in Decimal.
//values used to load the TMs and HMs
const tmStartByte = 79731; //The TM info starts at byte 0x13773.
const tmPricesStartByte = 507815; //TM prices start at byte 0x7BFA7
const itemPricesStartByte = 17928; // The prices for items start at byte 0x4608

function HexToDec(hexNum)
{
    let tensNum = 0;
    let onesNum = 0;

    tensNum = Math.floor(hexNum / 16);
    onesNum = hexNum % 16;

    return (tensNum * 10) + onesNum;
}

export default {
  version: "RED/BLUE",
  rawBinArray: [],
  fileFilters: [
    { name: 'Gameboy ROM', extensions: ['gb'] }
    ],
  generation: 1,
  moveAnimations: rbyMoveAnimations,
  moveEffects: rbyMoveEffects,
  evolveStones: rbyStones,
  evolveTypes: rbyEvolveTypes,
  damageModifiers: rbyDamageModifiers,
  defaultEvolution: {evolve: 1, evolveTo: 0, evolveLevel: 1, evolveStone: 10},
  loadData: thunk(async (actions, payload) => {
    actions.loadBinaryData(payload);
    actions.loadPokemonTypes();
    actions.loadPokemonMoves();
    actions.loadTMs();
    actions.loadPokemonData();
    actions.loadItems();
    actions.loadTypeMatchups();
  }),
  loadBinaryData: action((state, payload) => {
    state.rawBinArray = payload;
  }),
  loadPokemonData: thunk( async (actions, payload, {getState, getStoreActions}) => {
    let pokemon = [];
    let currentEvosMovesByte = pokemonEvosMovesByte;
    let pokedexIDs = new Map();
    let indexIDs = new Map();

    for(let i = 0; i < 150; i++){
      var currentPokemon = {};
      currentPokemon.hp = getState().rawBinArray[pokemonStartByte + (i * 28) +1];
      currentPokemon.attack = getState().rawBinArray[pokemonStartByte + (i * 28) +2];
      currentPokemon.defense = getState().rawBinArray[pokemonStartByte + (i * 28) +3];
      currentPokemon.speed = getState().rawBinArray[pokemonStartByte + (i * 28) +4];
      currentPokemon.specialAttack = getState().rawBinArray[pokemonStartByte + (i * 28) +5];
      currentPokemon.type1 = getState().rawBinArray[pokemonStartByte + (i * 28) +6];
      currentPokemon.type2 = getState().rawBinArray[pokemonStartByte + (i * 28) +7];
      currentPokemon.catchRate = getState().rawBinArray[pokemonStartByte + (i * 28) + 8];
      currentPokemon.expYield = getState().rawBinArray[pokemonStartByte + (i * 28) + 9];
      currentPokemon.move1 = getState().rawBinArray[pokemonStartByte + (i * 28) + 15];
      currentPokemon.move2 = getState().rawBinArray[pokemonStartByte + (i * 28) + 16];
      currentPokemon.move3 = getState().rawBinArray[pokemonStartByte + (i * 28) + 17];
      currentPokemon.move4 = getState().rawBinArray[pokemonStartByte + (i * 28) + 18];
      currentPokemon.GrowthRate = getState().rawBinArray[pokemonStartByte + (i * 28) + 19];
      //the tm/hm data for each pokemon is stored as 7 bytes. Each bit is a true/false for the pokemon's compatibility with a tm/hm.
      //first we grab the 7 bytes in an array.
      let tmIntArray = [];
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 28) + 20]);
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 28) + 21]);
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 28) + 22]);
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 28) + 23]);
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 28) + 24]);
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 28) + 25]);
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 28) + 26]);
      
      let tmBoolArray = [];

      tmIntArray.forEach((tm) => {
        //this takes each byte and splits it into its base 2 equivalent padded with 0s so each string is 8 characters, then we reverse the string
        let bitArray = tm.toString(2).padStart(8, '0').split("").reverse().join("");
        //go through each character of the string, convert it to a boolean, and add it to our bool array.
        for(let i = 0; i < 8; i++){
          if(tmBoolArray.length < 55){
            tmBoolArray.push(Boolean(Number(bitArray[i])));
          }
        }
      });
      
      currentPokemon.tms = tmBoolArray;

      pokemon.push(currentPokemon);
    }

    var mew = {};
    mew.hp = getState().rawBinArray[mewStartByte+1];
    mew.attack = getState().rawBinArray[mewStartByte+2];
    mew.defense = getState().rawBinArray[mewStartByte+3];
    mew.speed = getState().rawBinArray[mewStartByte+4];
    mew.specialAttack = getState().rawBinArray[mewStartByte+5];
    mew.type1 = getState().rawBinArray[mewStartByte +6];
    mew.type2 = getState().rawBinArray[mewStartByte +7];
    mew.catchRate = getState().rawBinArray[mewStartByte + 8];
    mew.expYield = getState().rawBinArray[mewStartByte + 9];
    mew.move1 = getState().rawBinArray[mewStartByte + 15];
    mew.move2 = getState().rawBinArray[mewStartByte + 16];
    mew.move3 = getState().rawBinArray[mewStartByte + 17];
    mew.move4 = getState().rawBinArray[mewStartByte + 18];
    mew.GrowthRate = getState().rawBinArray[mewStartByte + 19];
    pokemon.push(mew);

    let tmIntArray = [];
    tmIntArray.push(getState().rawBinArray[mewStartByte + 20]);
    tmIntArray.push(getState().rawBinArray[mewStartByte + 21]);
    tmIntArray.push(getState().rawBinArray[mewStartByte + 22]);
    tmIntArray.push(getState().rawBinArray[mewStartByte + 23]);
    tmIntArray.push(getState().rawBinArray[mewStartByte + 24]);
    tmIntArray.push(getState().rawBinArray[mewStartByte + 25]);
    tmIntArray.push(getState().rawBinArray[mewStartByte + 26]);

    let tmBoolArray = [];
    
    tmIntArray.forEach((tm) => {
      let bitArray = tm.toString(2).padStart(8, '0').split("").reverse().join("");
      for(let i = 0; i < 8; i++){
        if(tmBoolArray.length < 55){
          tmBoolArray.push(Boolean(Number(bitArray[i])));
        } 
      }
    });

    mew.tms = tmBoolArray;

    for (let i = 0; i < 190; i++) //There are 190 pokemon index IDs. 39 of which are missingno, and 151 are Pokemon.
    {
      if (getState().rawBinArray[pokedexStartByte + i] !== 0) //0 = missingno
      {

        pokemon[getState().rawBinArray[pokedexStartByte + i] - 1].evolutions = [];
        pokemon[getState().rawBinArray[pokedexStartByte + i] - 1].learnedMoves = [];

        pokedexIDs.set((i + 1), (getState().rawBinArray[pokedexStartByte + i] - 1));
        indexIDs.set(getState().rawBinArray[pokedexStartByte + i] , (i + 1));

        //Evolutions.
        while(getState().rawBinArray[currentEvosMovesByte] !== 0)
        {
            let evo = {evolveLevel: 1, evolveStone: 10}; // setting a couple default values.
            evo.evolve = getState().rawBinArray[currentEvosMovesByte];

            if (getState().rawBinArray[currentEvosMovesByte] === 1) //Level up
            {
                evo.evolveLevel = getState().rawBinArray[++currentEvosMovesByte];
                evo.evolveTo = getState().rawBinArray[++currentEvosMovesByte];
                currentEvosMovesByte++;
            }
            else if (getState().rawBinArray[currentEvosMovesByte] === 2) //Stone
            {
                evo.evolveStone = getState().rawBinArray[++currentEvosMovesByte];
                currentEvosMovesByte++; // Stone evolutions have an extra 1 thrown in for some reason. We are just ignoring that.
                evo.evolveTo = getState().rawBinArray[++currentEvosMovesByte];
                currentEvosMovesByte++;
            }
            else if (getState().rawBinArray[currentEvosMovesByte] === 3) //Trade
            {
                currentEvosMovesByte++; //the 2nd byte for trade evolutions is always 1;
                evo.evolveTo = getState().rawBinArray[++currentEvosMovesByte];
                currentEvosMovesByte++;
            }
            pokemon[getState().rawBinArray[pokedexStartByte + i] - 1].evolutions.push(evo);
        }
        currentEvosMovesByte++;//Move to the next byte after reading all of the evolution data.

        //Moves learned while leveling up.
        while (getState().rawBinArray[currentEvosMovesByte] !== 0) //0 marks the end of move data
        {
            let moveToAdd = {};
            moveToAdd.level = getState().rawBinArray[currentEvosMovesByte++]; //for each move the level learned is the first byte.
            moveToAdd.moveID = getState().rawBinArray[currentEvosMovesByte++]; //move ID is 2nd byte.
            pokemon[getState().rawBinArray[pokedexStartByte + i] - 1].learnedMoves.push(moveToAdd);
        }
        currentEvosMovesByte++;

        let pokemonName = "";
        for (let j = 0; j < 10; j++) //Each name is 10 bytes
        {
          // hex 50 is blank. This is different than a space and only used at the end of names that are less than 10 characters.
          // EF is the male sign. F5 is the female sign. These 2 are only used by the Nidorans
          if (getState().rawBinArray[pokemonNameStartByte + (i * 10) + j] !== 0x50)
          {
              pokemonName += rbygsLetters.get(getState().rawBinArray[pokemonNameStartByte + (i * 10) + j]);
          }
        }
        // -1 is because the pokemon collection created above starts at 0 but the pokedex numbers start at 1.
        // so Bulbasaur's pokedex ID is 1 but he is at the 0 position in the collection.
        pokemon[getState().rawBinArray[pokedexStartByte + i] - 1].name = pokemonName;
      }
      else{
        //the missingno pokemon still take up 2 bytes here so we have to skip that.
        currentEvosMovesByte += 2;
      }
    }

    //This is done at the end because the pokedexIDs aren't set until the loop above has went through every pokemon.
    pokemon.forEach(p => {
      p.evolutions.forEach(e => {
        e.evolveTo = pokedexIDs.get(e.evolveTo);
      })
    });
    
    getStoreActions().setPokemonArray(pokemon);
  }),
  loadPokemonTypes: thunk ( async (actions, payload, {getState, getStoreActions}) => {
    let types = [];
    let newType;
    let currentPointerByte = typesBankByte + typesPointer;
    let namesStartByte;
    let currentNamesByte;
    let typeName;
    let typeIndex = 0;

    let namePointer1 = getState().rawBinArray[currentPointerByte++];
    let namePointer2 = getState().rawBinArray[currentPointerByte++] * 256;

    currentPointerByte -= 2; //reset position because it will be read again in the loop

    //to know that we've reached the end of pointers we will stop at location of the first name
    namesStartByte = typesBankByte + namePointer1 + namePointer2;

    while (currentPointerByte < namesStartByte)
    {
      newType = {};
      typeName = "";

      //get the location of the type's name
      namePointer1 = getState().rawBinArray[currentPointerByte++];
      namePointer2 = getState().rawBinArray[currentPointerByte++] * 256;
      currentNamesByte = typesBankByte + namePointer1 + namePointer2;
                
      // the unused types all point to the first name: "NORMAL"
      if (currentNamesByte === namesStartByte && types.length !== 0)
      {
          newType.typeIsUsed = false;
      }
      else
      {
          newType.typeIsUsed = true;
      }

      // read the name of each type
      while (getState().rawBinArray[currentNamesByte] !== 0x50) //0x50 is the deliminator for the end of a name.
      {
          typeName += rbygsLetters.get(getState().rawBinArray[currentNamesByte++]);
      }
      if (!newType.typeIsUsed)
      {
          typeName = "(unused)";
      }
      newType.typeName = typeName;
      newType.typeIndex = typeIndex++;

      types.push(newType);
    }
    //console.log(types);
    getStoreActions().setPokemonTypes(types);
  }),
  loadPokemonMoves: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let moves = [];
    let currentMoveNameByte = moveNamesByte;
    let moveToAdd;
    let moveName;

    moveToAdd = {}; //The ROM uses 0x00 for blank starter moves in the pokemon base stats section.
    moveToAdd.id = 0;
    moveToAdd.name = "nothing";
    moves.push(moveToAdd);

    for (let i = 0; i < 165; i++) //165 because there are 165 moves in the game.
    {
        moveName = "";

        //Luckily the names for the moves are stored in the same order as the moves, just in a different spot in memory.
        while (getState().rawBinArray[currentMoveNameByte] !== 0x50) //0x50 is the deliminator for the end of a name.
        {
            moveName += rbygsLetters.get(getState().rawBinArray[currentMoveNameByte]);
            currentMoveNameByte++;
        }
        currentMoveNameByte++;

        moveToAdd = {};
        moveToAdd.id = i + 1;
        moveToAdd.name = moveName;
        //Each Move uses 6 bytes. i = the current move so we take the starting point and add 6 for each move
        // that we have already read and then add 0-5 as we read through the data fields for that move.
        moveToAdd.animationID = getState().rawBinArray[movesStartingByte + (i * 6)];
        moveToAdd.effect = getState().rawBinArray[movesStartingByte + (i * 6) + 1];
        moveToAdd.power = getState().rawBinArray[movesStartingByte + (i * 6) + 2];
        moveToAdd.moveType = getState().rawBinArray[movesStartingByte + (i * 6) + 3];
        moveToAdd.accuracy = getState().rawBinArray[movesStartingByte + (i * 6) + 4];
        moveToAdd.pp = getState().rawBinArray[movesStartingByte + (i * 6) + 5];

        moves.push(moveToAdd);
    }
    getStoreActions().setMovesArray(moves);
    //return moves;
  }),
  loadTMs: thunk (async (actions, payload, {getState, getStoreActions}) => {

    let tms = [];

    for (let i = 0; i < 55; i++) //There are 50 TMs and 5 HMs. Each is 1 byte which is the moveID
    {
        let newTM = {};
        newTM.move = getState().rawBinArray[tmStartByte + i];
        if (i < 50)
        {
            newTM.name = `TM${i + 1}`;
        }
        else
        {
            newTM.name = `HM${i - 49}`;
        }
        tms.push(newTM);
    }
         
    //The prices for TMs are stored separately from the other items. There are 25 bytes for the 50 TMs. Each TM is 1 nibble. The value is in thousands.
    // for example: TM1 is 3000 and TM2 is 2000. The first byte is 0x32.
    for (let i = 0; i < 25; i++)
    {
        tms[i * 2].price = Math.floor(getState().rawBinArray[tmPricesStartByte + i] / 16);
        tms[i * 2 + 1].price = getState().rawBinArray[tmPricesStartByte + i] % 16;
    }
    
    getStoreActions().setTMs(tms);
  }),
  loadItems: thunk (async (action, payload, {getState, getStoreActions}) => {
    let items = [];
    let itemToAdd;

    for ( let [name, id] of Object.entries(rbyItems)){
      itemToAdd = {name: name};
      let itemPrice = 0;

      if(id <= 83){
        itemPrice += (HexToDec(getState().rawBinArray[itemPricesStartByte + ((id -1) * 3)]) * 10000);
        itemPrice += (HexToDec(getState().rawBinArray[itemPricesStartByte + ((id -1) * 3) + 1]) * 100);
        itemPrice += (HexToDec(getState().rawBinArray[itemPricesStartByte + ((id -1) * 3) + 2]) * 1 );
        itemToAdd.price = itemPrice;
      }
      items.push(itemToAdd);
    }
    //console.log(items);
    getStoreActions().setItems(items);
  }),
  loadTypeMatchups: thunk (async (action, payload, {getState, getStoreActions}) => {
    let typeMatchups = [];
    
    for (let i = 0; i < 82; i++) //There are 82 type strengths. Each is 3 bytes and the group is terminated by the byte FF.
    {
        if(getState().rawBinArray[typeChartByte + (i * 3)] !== 0xFF) // Since we are checking the ending byte this can be converted to a while loop?
        {
          let typeMatchupToAdd = {};
          typeMatchupToAdd.attackType = getState().rawBinArray[typeChartByte + (i * 3)]; //first byte is the attacking type
          typeMatchupToAdd.defenseType = getState().rawBinArray[typeChartByte + (i * 3) + 1]; //second byte is the defending type
          typeMatchupToAdd.effectiveness = getState().rawBinArray[typeChartByte + (i * 3) + 2]; //third byte is effectiveness X 10. So double damage = 20, half damage = 5.
          typeMatchups.push(typeMatchupToAdd);
        }
        else
        {
            break;
        }
    }
    getStoreActions().setTypeMatchups(typeMatchups);
    //console.log(typeMatchups);
  }),
  saveFileAs: thunk(async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    dialog.showSaveDialog({
      title: 'Save ROM',
      filters: getState().fileFilters
    }).then((res) => {
      //console.log("file path: " + res.filePath);
      getStoreActions().setCurrentFile(res.filePath);
      let pokemon = getStoreState().pokemon;

      for(let i = 0; i < 150; i++){
        getState().rawBinArray[pokemonStartByte + (i * 28) +1] = pokemon[i].hp;
        getState().rawBinArray[pokemonStartByte + (i * 28) +2] = pokemon[i].attack;
        getState().rawBinArray[pokemonStartByte + (i * 28) +3] = pokemon[i].defense;
        getState().rawBinArray[pokemonStartByte + (i * 28) +4] = pokemon[i].speed;
        getState().rawBinArray[pokemonStartByte + (i * 28) +5] = pokemon[i].specialAttack;
        getState().rawBinArray[pokemonStartByte + (i * 28) +6] = pokemon[i].type1;
        getState().rawBinArray[pokemonStartByte + (i * 28) +7] = pokemon[i].type2;
        getState().rawBinArray[pokemonStartByte + (i * 28) +8] = pokemon[i].catchRate;
        getState().rawBinArray[pokemonStartByte + (i * 28) +9] = pokemon[i].expYield;
      }
      getState().rawBinArray[mewStartByte+1] = pokemon[150].hp;
      getState().rawBinArray[mewStartByte+2] = pokemon[150].attack;
      getState().rawBinArray[mewStartByte+3] = pokemon[150].defense;
      getState().rawBinArray[mewStartByte+4] = pokemon[150].speed;
      getState().rawBinArray[mewStartByte+5] = pokemon[150].specialAttack;
      getState().rawBinArray[mewStartByte+6] = pokemon[150].type1;
      getState().rawBinArray[mewStartByte+7] = pokemon[150].type2;
      getState().rawBinArray[mewStartByte+8] = pokemon[150].catchRate;
      getState().rawBinArray[mewStartByte+9] = pokemon[150].expYield;

      fs.writeFileSync(res.filePath, getState().rawBinArray, 'base64');      
    }).catch((err) => {
      console.log(err);
    });
  })
}