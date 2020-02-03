import { thunk, action } from "easy-peasy";
import {gscDamageModifiers, rbygsLetters, gscMoveAnimations, gscMoveEffects, gscEvolveTypes, gscStones, gscHappiness, gscStats, gscGrowthRates,
  gsZoneNames, gscGrassEncChances, gsTrainerGroups, gsTrainerCounts, gsUniqueGroupNameIds, gsTrainerTypes, gscShopNames, gscWaterEncChances} from './utils';
const remote = require('electron').remote;
const dialog = remote.dialog;
const fs = remote.require('fs');

const pokemonNameStartByte = 1772404; //Pokemon names start at byte 0x1c21e and also run in Index order.
const pokemonEvosMovesByte = 0x429B3; //Pokemon evolutions and moves learned through leveling are stored together starting at byte 0x429B3.
const pokemonStartByte = 334603; //Pokemon data starts at byte 0x51B0B. It goes in Pokedex order, Bulbasaur through Mewtwo.
const pokemonEvosPointersByte = 0x427BD;
const pointerBase = 0x3C000;

//values used to load the pokemon types
const typesBankByte = 0x4C000; // bank 9
const typesPointer = 0x49AE; // this is a pointer within a bank, not the full address
const typeChartByte = 0x34D01; 
//values used to load the moves
const moveNamesByte = 0x1B1574; //The data for move names starts at 0x1B1574 bytes into the file.
const movesStartingByte = 0x41AFE; //The move data starts 0x41AFE bytes into the file.
//values used to load the TMs and HMs
const tmStartByte = 0x11A66; //The TM info.
const itemPropertiesStartByte = 0x68A0; // The item properties start here. 7 bytes per item.
const itemNamesByte = 0x1B0000  // could be useful later.
//values used to load wild encounters
const johtoGrassWildEncountersByte = 0x2AB35;
const johtoWaterWildEncountersByte = 0x2B669;
const kantoGrassWildEncountersByte = 0x2B7C0;
const kantoWaterWildEncountersByte = 0x2BD43;
//values used to load trainers
const trainerPointersByte = 0x3993E; // this is the start of the pointers to the trainer data.
const trainerBankByte = 0x34000; // the pointers are added to this value to find the trainer data.
//values used to load shops
const shopsStartByte = 0x16342;

export default {
  version: "GOLD/SILVER",
  rawBinArray: [],
  fileFilters: [
    { name: 'Gameboy Color ROM', extensions: ['gbc'] }
    ],
  generation: 2,
  moveAnimations: gscMoveAnimations,
  moveEffects: gscMoveEffects,
  evolveTypes: gscEvolveTypes,
  evolveStones: gscStones,
  evolveHappiness: gscHappiness,
  evolveStats: gscStats,
  growthRates: gscGrowthRates,
  damageModifiers: gscDamageModifiers,
  trainerTypes: gsTrainerTypes,
  maxEvosMovesBytes: 5709,
  maxTrainerBytes: 9791,
  maxShopItems: 229,
  defaultEvolution: {evolve: 1, evolveLevel: 1, evolveTo: 1, evolveStone: 8, evolveHappiness: 1, evolveStats: 1},
  loadData: thunk(async (actions, payload) => {
    actions.loadBinaryData(payload);
    actions.loadPokemonTypes();
    actions.loadPokemonMoves();
    actions.loadTMs();
    actions.loadPokemonData();
    actions.loadItems();
    actions.loadTypeMatchups();
    actions.loadEncounters();
    actions.loadTrainers();
    actions.loadShops();
  }),
  loadBinaryData: action((state, payload) => {
    state.rawBinArray = payload;
  }),
  loadPokemonData: thunk(async (actions, payload, {getState, getStoreActions}) => {    
    let pokemon = [];
    let currentEvosMovesByte = pokemonEvosMovesByte;
    for(let i = 0; i < 251; i++){
      var currentPokemon = {};
      currentPokemon.hp = getState().rawBinArray[pokemonStartByte + (i * 32) +1];
      currentPokemon.attack = getState().rawBinArray[pokemonStartByte + (i * 32) +2];
      currentPokemon.defense = getState().rawBinArray[pokemonStartByte + (i * 32) +3];
      currentPokemon.speed = getState().rawBinArray[pokemonStartByte + (i * 32) +4];
      currentPokemon.specialAttack = getState().rawBinArray[pokemonStartByte + (i * 32) +5];
      currentPokemon.specialDefense = getState().rawBinArray[pokemonStartByte + (i * 32) +6];
      currentPokemon.type1 = getState().rawBinArray[pokemonStartByte + (i * 32) +7];
      currentPokemon.type2 = getState().rawBinArray[pokemonStartByte + (i * 32) +8];
      currentPokemon.catchRate = getState().rawBinArray[pokemonStartByte + (i * 32) + 9];
      currentPokemon.expYield = getState().rawBinArray[pokemonStartByte + (i * 32) + 10];
      currentPokemon.growthRate = getState().rawBinArray[pokemonStartByte + (i * 32) + 22];

      //the tm/hm data for each pokemon is stored as 8 bytes. Each bit is a true/false for the pokemon's compatibility with a tm/hm.
      //first we grab the 8 bytes in an array.
      let tmIntArray = [];
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 32) + 24]);
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 32) + 25]);
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 32) + 26]);
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 32) + 27]);
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 32) + 28]);
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 32) + 29]);
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 32) + 30]);
      tmIntArray.push(getState().rawBinArray[pokemonStartByte + (i * 32) + 31]);
      
      let tmBoolArray = [];

      tmIntArray.forEach((tm) => {
        //this takes each byte and splits it into its base 2 equivalent padded with 0s so each string is 8 characters, then we reverse the string
        let bitArray = tm.toString(2).padStart(8, '0').split("").reverse().join("");
        //go through each character of the string, convert it to a boolean, and add it to our bool array.
        for(let i = 0; i < 8; i++){
          if(tmBoolArray.length < 57){
            tmBoolArray.push(Boolean(Number(bitArray[i])));
          }          
        }
      });

      currentPokemon.tms = tmBoolArray;


      currentPokemon.evolutions = [];
      currentPokemon.learnedMoves = [];
      
      //Evolutions.
      while(getState().rawBinArray[currentEvosMovesByte] !== 0)
      {
          let evo = {evolveLevel: 1, evolveStone: 8, evolveHappiness: 1, evolveStats: 1}; //initialize with some default values.
          evo.evolve = getState().rawBinArray[currentEvosMovesByte];
          
          if (getState().rawBinArray[currentEvosMovesByte] === 1) //Level up
          {
              evo.evolveLevel = getState().rawBinArray[++currentEvosMovesByte];
              evo.evolveTo = getState().rawBinArray[++currentEvosMovesByte]-1;
              currentEvosMovesByte++;
          }
          else if (getState().rawBinArray[currentEvosMovesByte] === 2) //Stone
          {
              evo.evolveStone = getState().rawBinArray[++currentEvosMovesByte];
              evo.evolveTo = getState().rawBinArray[++currentEvosMovesByte]-1;
              currentEvosMovesByte++;
          }
          else if (getState().rawBinArray[currentEvosMovesByte] === 3) //Trade
          {
              evo.tradeItem = getState().rawBinArray[++currentEvosMovesByte];
              evo.evolveTo = getState().rawBinArray[++currentEvosMovesByte]-1;
              currentEvosMovesByte++;
          }
          else if (getState().rawBinArray[currentEvosMovesByte] === 4) //Happiness
          {
              evo.evolveHappiness = getState().rawBinArray[++currentEvosMovesByte];
              evo.evolveTo = getState().rawBinArray[++currentEvosMovesByte]-1;
              currentEvosMovesByte++;
          }
          else if (getState().rawBinArray[currentEvosMovesByte] === 5) //Stats
          {
              evo.evolveLevel = getState().rawBinArray[++currentEvosMovesByte];
              evo.evolveStats = getState().rawBinArray[++currentEvosMovesByte];
              evo.evolveTo = getState().rawBinArray[++currentEvosMovesByte]-1;
              currentEvosMovesByte++;
          }
          //console.log(evo);
          currentPokemon.evolutions.push(evo);
      }
      currentEvosMovesByte++;//Move to the next byte after reading all of the evolution data.
      

      //Moves learned while leveling up.
      while (getState().rawBinArray[currentEvosMovesByte] !== 0) //0 marks the end of move data
      {
          let moveToAdd = {};
          moveToAdd.level = getState().rawBinArray[currentEvosMovesByte++]; //for each move the level learned is the first byte.
          moveToAdd.moveID = getState().rawBinArray[currentEvosMovesByte++]; //move ID is 2nd byte.
          currentPokemon.learnedMoves.push(moveToAdd);
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
      
      currentPokemon.name = pokemonName;
      pokemon.push(currentPokemon); 
    }
    getStoreActions().setPokemonArray(pokemon);
  }),
  savePokemonData: thunk(async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let workingArray = getState().rawBinArray;
    let currentEvosMovesByte = pokemonEvosMovesByte;
    let currentPointerByte = pokemonEvosPointersByte;
    let pokemon = getStoreState().pokemon;

    for (let i = 0; i < 251; i++) //There are 251 pokemon in the game
    {
      //basically just write all of the modify-able data back into its location in the binary array.
      workingArray[pokemonStartByte + (i * 32) + 1] = pokemon[i].hp;
      workingArray[pokemonStartByte + (i * 32) + 2] = pokemon[i].attack;
      workingArray[pokemonStartByte + (i * 32) + 3] = pokemon[i].defense;
      workingArray[pokemonStartByte + (i * 32) + 4] = pokemon[i].speed;
      workingArray[pokemonStartByte + (i * 32) + 5] = pokemon[i].specialAttack;
      workingArray[pokemonStartByte + (i * 32) + 6] = pokemon[i].specialDefense;
      workingArray[pokemonStartByte + (i * 32) + 7] = pokemon[i].type1;
      workingArray[pokemonStartByte + (i * 32) + 8] = pokemon[i].type2;
      workingArray[pokemonStartByte + (i * 32) + 9] = pokemon[i].catchRate;
      workingArray[pokemonStartByte + (i * 32) + 10] = pokemon[i].expYield;        
      workingArray[pokemonStartByte + (i * 32) + 22] = pokemon[i].growthRate;
      let tmArray = [];

      for(let j = 0; j < 8; j++){ //each byte
        let tmByte = 0;
        for(let b = 0; b < 8; b++){ //each bit
          if (pokemon[i].tms[(j * 8 + b)]){
            tmByte += Math.pow(2, b);
          }
        }
        tmArray.push(tmByte);
      }
      
      workingArray[pokemonStartByte + (i * 32) + 24] = tmArray[0];
      workingArray[pokemonStartByte + (i * 32) + 25] = tmArray[1];
      workingArray[pokemonStartByte + (i * 32) + 26] = tmArray[2];
      workingArray[pokemonStartByte + (i * 32) + 27] = tmArray[3];
      workingArray[pokemonStartByte + (i * 32) + 28] = tmArray[4];
      workingArray[pokemonStartByte + (i * 32) + 29] = tmArray[5];
      workingArray[pokemonStartByte + (i * 32) + 30] = tmArray[6];
      workingArray[pokemonStartByte + (i * 32) + 31] = tmArray[6];


      let secondPointerByte = (currentEvosMovesByte - pointerBase) / 256;
      let firstPointerByte = (currentEvosMovesByte - pointerBase) - (secondPointerByte * 256);
      workingArray[currentPointerByte++] = firstPointerByte;
      workingArray[currentPointerByte++] = secondPointerByte;

      pokemon[i].evolutions.forEach((e) => {
        if (e.evolve === 1)
          {
            workingArray[currentEvosMovesByte++] = 1;
            workingArray[currentEvosMovesByte++] = e.evolveLevel;
            workingArray[currentEvosMovesByte++] = e.evolveTo +1;
          }
          else if (e.evolve === 2)
          {
            workingArray[currentEvosMovesByte++] = 2;
            workingArray[currentEvosMovesByte++] = e.evolveStone;
            workingArray[currentEvosMovesByte++] = e.evolveTo +1;
          }
          else if (e.evolve === 3)
          {
            workingArray[currentEvosMovesByte++] = 3;
            workingArray[currentEvosMovesByte++] = e.tradeItem;
            workingArray[currentEvosMovesByte++] = e.evolveTo +1;
          }
          else if (e.evolve === 4)
          {
            workingArray[currentEvosMovesByte++] = 4;
            workingArray[currentEvosMovesByte++] = e.evolveHappiness;
            workingArray[currentEvosMovesByte++] = e.evolveTo +1;
          }
          else if (e.evolve === 5)
          {
            workingArray[currentEvosMovesByte++] = 5;
            workingArray[currentEvosMovesByte++] = e.evolveLevel;
            workingArray[currentEvosMovesByte++] = e.evolveStats;
            workingArray[currentEvosMovesByte++] = e.evolveTo +1;
          }
      });
      workingArray[currentEvosMovesByte++] = 0;

      pokemon[i].learnedMoves.forEach((m) => {
        workingArray[currentEvosMovesByte++] = m.level;
        workingArray[currentEvosMovesByte++] = m.moveID;
      });
      workingArray[currentEvosMovesByte++] = 0;
    }

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
                
      // the unused types all point to the first name: "NORMAL". There is also a pointer to a pokemon type of "???". I skip it with the Or statement.
      if ((currentNamesByte === namesStartByte && types.length !== 0) || currentNamesByte === 0x50A04)
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

    moveToAdd = {}; //The Red/blue ROM uses 0x00 for blank starter moves in the pokemon base stats section. Maybe not needed in Gold?
    moveToAdd.id = 0;
    moveToAdd.name = "nothing";
    moves.push(moveToAdd);

    for (let i = 0; i < 251; i++) //251 because there are 251 moves in the game.
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
        //Each Move uses 7 bytes. i = the current move so we take the starting point and add 7 for each move
        // that we have already read and then add 0-6 as we read through the data fields for that move.
        moveToAdd.animationID = getState().rawBinArray[movesStartingByte + (i * 7)];
        moveToAdd.effect = getState().rawBinArray[movesStartingByte + (i * 7) + 1];
        moveToAdd.power = getState().rawBinArray[movesStartingByte + (i * 7) + 2];
        moveToAdd.moveType = getState().rawBinArray[movesStartingByte + (i * 7) + 3];
        moveToAdd.accuracy = getState().rawBinArray[movesStartingByte + (i * 7) + 4];
        moveToAdd.pp = getState().rawBinArray[movesStartingByte + (i * 7) + 5];
        moveToAdd.effectChance = getState().rawBinArray[movesStartingByte + (i * 7) + 6];

        moves.push(moveToAdd);
    }
    //console.log(moves);
    getStoreActions().setMovesArray(moves);
    //return moves;
  }),
  loadTMs: thunk (async (actions, payload, {getState, getStoreActions}) => {

    let tms = [];

    for (let i = 0; i < 57; i++) //There are 50 TMs and 7 HMs. Each is 1 byte which is the moveID
    {
        let newTM = {};
        //newTM.TMNumber = i; this is just the index, not sure why it was needed in C#
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
    
    //for gold/silver/crystal the tm/hm prices are stored with the other items.

    //console.log(tms);
    getStoreActions().setTMs(tms);
  }),
  loadItems: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let items = [];
    let currentNamesByte = itemNamesByte;
    for(let i = 0; i < 249; i++){
      let newItem = {};
      
      //The price is stored in 2 bytes stored little endian so we need to multiply the 2nd byte by 256 and add it to the first byte.
      newItem.price = (getState().rawBinArray[itemPropertiesStartByte + i*7 + 1] * 256) + getState().rawBinArray[itemPropertiesStartByte + i*7];

      let itemName = "";
      while(getState().rawBinArray[currentNamesByte] !== 0x50){

        itemName += rbygsLetters.get(getState().rawBinArray[currentNamesByte++]);
      }
      currentNamesByte++;
      newItem.name = itemName;

      items.push(newItem);
    }
    //console.log(items);
    getStoreActions().setItems(items);
  }),
  loadTypeMatchups: thunk (async (action, payload, {getState, getStoreActions}) => {
    let typeMatchups = [];
    let currentByte = typeChartByte;
    
    while(getState().rawBinArray[currentByte] !== 0xFF) // Since we are checking the ending byte this can be converted to a while loop?
    {
      // The type matchups are split into 2 groups. The first group ends with FE. 
      // The 2nd group is the ghost immunes that are cancelled by using the Foresight move.
      if(getState().rawBinArray[currentByte] === 0xFE){
        currentByte++;
      }
      else{
        let typeMatchupToAdd = {};
        typeMatchupToAdd.attackType = getState().rawBinArray[currentByte++]; //first byte is the attacking type
        typeMatchupToAdd.defenseType = getState().rawBinArray[currentByte++]; //second byte is the defending type
        typeMatchupToAdd.effectiveness = getState().rawBinArray[currentByte++]; //third byte is effectiveness X 10. So double damage = 20, half damage = 5.
        typeMatchups.push(typeMatchupToAdd);
      }
    }
    
    getStoreActions().setTypeMatchups(typeMatchups);
    //console.log(typeMatchups);
  }),
  loadEncounters: thunk (async (action, payload, {getState, getStoreActions}) => {
    let zones = [];
    
    //johto grass pokemon
    let currentByte = johtoGrassWildEncountersByte;
    let nameCounter = 0;

    while (getState().rawBinArray[currentByte] !== 0xFF)
    {
      currentByte += 2; // map id
      let newZone = {};
      newZone.encounterRate = getState().rawBinArray[currentByte++];
      let dayEncounterRate = getState().rawBinArray[currentByte++];
      let nightEncounterRate = getState().rawBinArray[currentByte++];
      newZone.name =  `${gsZoneNames[nameCounter]} morning`;
      newZone.encounters = [];
      // Each zone has encounters it has 7 slots, each with 2 bytes. The slot determines the chance of the pokemon appearing in a random encounter
      // The first byte is the pokemon's level and the 2nd is the pokemon id.
      for(let i = 0; i < 7; i++){
        let encounter = {};
        encounter.level = getState().rawBinArray[currentByte++]
        encounter.pokemon = getState().rawBinArray[currentByte++]-1;
        encounter.chance = gscGrassEncChances[i];
        newZone.encounters.push(encounter);
      }
      zones.push(newZone);

      newZone = {};
      newZone.encounterRate = dayEncounterRate;
      newZone.name =  `${gsZoneNames[nameCounter]} day`;
      newZone.encounters = [];
      
      for(let i = 0; i < 7; i++){
        let encounter = {};
        encounter.level = getState().rawBinArray[currentByte++]
        encounter.pokemon = getState().rawBinArray[currentByte++]-1;
        encounter.chance = gscGrassEncChances[i];
        newZone.encounters.push(encounter);
      }
      zones.push(newZone);

      newZone = {};
      newZone.encounterRate = nightEncounterRate;
      newZone.name =  `${gsZoneNames[nameCounter]} night`;
      newZone.encounters = [];
      
      for(let i = 0; i < 7; i++){
        let encounter = {};
        encounter.level = getState().rawBinArray[currentByte++]
        encounter.pokemon = getState().rawBinArray[currentByte++]-1;
        encounter.chance = gscGrassEncChances[i];
        newZone.encounters.push(encounter);
      }
      zones.push(newZone);
      nameCounter++;
    }

    //johto water pokemon
    currentByte = johtoWaterWildEncountersByte;

    while (getState().rawBinArray[currentByte] !== 0xFF)
    {
      currentByte += 2; // map id
      let newZone = {};
      newZone.encounterRate = getState().rawBinArray[currentByte++];
      newZone.name =  `${gsZoneNames[nameCounter]} water`;
      newZone.encounters = [];
      // Each water zone has 3 slots, each with 2 bytes. The slot determines the chance of the pokemon appearing in a random encounter
      // The first byte is the pokemon's level and the 2nd is the pokemon id.
      for(let i = 0; i < 3; i++){
        let encounter = {};
        encounter.level = getState().rawBinArray[currentByte++]
        encounter.pokemon = getState().rawBinArray[currentByte++]-1;
        encounter.chance = gscWaterEncChances[i];
        newZone.encounters.push(encounter);
      }
      zones.push(newZone);
      nameCounter++;
    }

    //kanto grass pokemon
    currentByte = kantoGrassWildEncountersByte;

    while (getState().rawBinArray[currentByte] !== 0xFF)
    {
      currentByte += 2; // map id
      let newZone = {};
      newZone.encounterRate = getState().rawBinArray[currentByte++];
      let dayEncounterRate = getState().rawBinArray[currentByte++];
      let nightEncounterRate = getState().rawBinArray[currentByte++];
      newZone.name =  `${gsZoneNames[nameCounter]} morning`;
      newZone.encounters = [];
      // Each zone has encounters it has 7 slots, each with 2 bytes. The slot determines the chance of the pokemon appearing in a random encounter
      // The first byte is the pokemon's level and the 2nd is the pokemon id.
      for(let i = 0; i < 7; i++){
        let encounter = {};
        encounter.level = getState().rawBinArray[currentByte++]
        encounter.pokemon = getState().rawBinArray[currentByte++]-1;
        encounter.chance = gscGrassEncChances[i];
        newZone.encounters.push(encounter);
      }
      zones.push(newZone);

      newZone = {};
      newZone.encounterRate = dayEncounterRate;
      newZone.name =  `${gsZoneNames[nameCounter]} day`;
      newZone.encounters = [];
      
      for(let i = 0; i < 7; i++){
        let encounter = {};
        encounter.level = getState().rawBinArray[currentByte++]
        encounter.pokemon = getState().rawBinArray[currentByte++]-1;
        encounter.chance = gscGrassEncChances[i];
        newZone.encounters.push(encounter);
      }
      zones.push(newZone);

      newZone = {};
      newZone.encounterRate = nightEncounterRate;
      newZone.name =  `${gsZoneNames[nameCounter]} night`;
      newZone.encounters = [];
      
      for(let i = 0; i < 7; i++){
        let encounter = {};
        encounter.level = getState().rawBinArray[currentByte++]
        encounter.pokemon = getState().rawBinArray[currentByte++]-1;
        encounter.chance = gscGrassEncChances[i];
        newZone.encounters.push(encounter);
      }
      zones.push(newZone);
      nameCounter++;
    }

    //kanto water pokemon
    currentByte = kantoWaterWildEncountersByte;

    while (getState().rawBinArray[currentByte] !== 0xFF)
    {
      currentByte += 2; // map id
      let newZone = {};
      newZone.encounterRate = getState().rawBinArray[currentByte++];
      newZone.name =  `${gsZoneNames[nameCounter]} water`;
      newZone.encounters = [];
      // Each water zone has 3 slots, each with 2 bytes. The slot determines the chance of the pokemon appearing in a random encounter
      // The first byte is the pokemon's level and the 2nd is the pokemon id.
      for(let i = 0; i < 3; i++){
        let encounter = {};
        encounter.level = getState().rawBinArray[currentByte++]
        encounter.pokemon = getState().rawBinArray[currentByte++]-1;
        encounter.chance = gscWaterEncChances[i];
        newZone.encounters.push(encounter);
      }
      zones.push(newZone);
      nameCounter++;
    }

    //console.log(encounters);
    getStoreActions().setEncounterZones(zones);
  }),
  loadTrainers: thunk (async (action, payload, {getState, getStoreActions}) => {
    let trainers = [];
    let currentPointerByte = trainerPointersByte;
    let numOfTrainersInGroup = 0;

    // 66 trainer groups
    for(let groupNum = 0; groupNum < 66; groupNum++){

      //get the starting point for the group's data
      let pointerByte1 = getState().rawBinArray[currentPointerByte++];
      let pointerByte2 = getState().rawBinArray[currentPointerByte++] * 256;
      let currentTrainerByte = trainerBankByte + pointerByte1 + pointerByte2;

      //while we haven't reached the last trainer in the group keep loading trainers
      while(numOfTrainersInGroup < gsTrainerCounts[groupNum]){
        let newTrainer = {};
        let trainerName = "";

        //first thing is the name. Each trainer has an individual name and a group name. 
        // For some groups it doesn't make sense to use both e.g. "Lance Lance". 
        if(!gsUniqueGroupNameIds.includes(groupNum)){
          trainerName += `${gsTrainerGroups[groupNum]} `;
        }

        let uniqueName = "";
        //reads the name. The ending is marked with 0x50
        while(getState().rawBinArray[currentTrainerByte] !== 0x50){
          uniqueName += rbygsLetters.get(getState().rawBinArray[currentTrainerByte++]);
        }
        trainerName += uniqueName;
        newTrainer.name = trainerName;
        newTrainer.uniqueName = uniqueName; //need to keep track of this for the saving process and calculating remaining space.
        currentTrainerByte++;

        //the type determines if the trainer has an item to use and if their pokemon have custom movesets.
        newTrainer.type = getState().rawBinArray[currentTrainerByte++];

        newTrainer.pokemon = [];
        //the end of each trainer's data is marked with 0xFF
        while(getState().rawBinArray[currentTrainerByte] !== 0xFF){
          let newPokemon = {};
          newPokemon.level = getState().rawBinArray[currentTrainerByte++];
          newPokemon.pokemon = getState().rawBinArray[currentTrainerByte++]-1; // -1 because the pokemon array is 0 based. We will add 1 when saving.

          //if the type is 2 or 3 the next byte is the pokemon's item
          if(newTrainer.type === 2 || newTrainer.type === 3){
            newPokemon.item = getState().rawBinArray[currentTrainerByte++]-1;
          }else{ // setting default value in case the user switches the trainer's type to one that uses items.
            newPokemon.item = 0;
          }

          //if the type is 1 or 3 the next 4 bytes will be the pokemon's moves.
          if(newTrainer.type === 1 || newTrainer.type === 3){
            newPokemon.move1 = getState().rawBinArray[currentTrainerByte++];
            newPokemon.move2 = getState().rawBinArray[currentTrainerByte++];
            newPokemon.move3 = getState().rawBinArray[currentTrainerByte++];
            newPokemon.move4 = getState().rawBinArray[currentTrainerByte++];
          }else{ // setting some default values in case the user switches the trainer's type to one that uses moves.
            newPokemon.move1 = 0;
            newPokemon.move2 = 0;
            newPokemon.move3 = 0;
            newPokemon.move4 = 0;
          }
          newTrainer.pokemon.push(newPokemon);
        }
        
        trainers.push(newTrainer);
        currentTrainerByte++;
        numOfTrainersInGroup++;
      }
      numOfTrainersInGroup = 0;
      
    }

    //console.log(trainers);
    getStoreActions().setTrainers(trainers);
  }),
  loadShops: thunk (async (action, payload, {getState, getStoreActions}) => {
    let shops = [];
    let currentByte = shopsStartByte;

    for (let i = 0; i < 35; i++)
    {
        let newShop = {};
        newShop.name = gscShopNames[i];
        newShop.items = [];
        currentByte += 1; //Skip the first byte. The first byte is the number of items for sale.
        while(getState().rawBinArray[currentByte] !== 0xFF) //the end of the shop is marked by 0xFF
        {
            newShop.items.push({item: getState().rawBinArray[currentByte++] -1}); // -1 because it is using the index of the items collection.
        }
        shops.push(newShop);
        currentByte++;
    }

    getStoreActions().setShops(shops);
  }),
  saveFileAs: thunk(async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    dialog.showSaveDialog({
      title: 'Save ROM',
      filters: getState().fileFilters
    }).then((res) => {
      //console.log("file path: " + res.filePath);
      getStoreActions().setCurrentFile(res.filePath);
      actions.savePokemonData();      

      fs.writeFileSync(res.filePath, getState().rawBinArray, 'base64');      
    }).catch((err) => {
      console.log(err);
    });
  })
}