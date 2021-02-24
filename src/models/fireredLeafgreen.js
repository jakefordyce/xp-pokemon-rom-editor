import { thunk, action } from "easy-peasy";
import {gscDamageModifiers, gen3Letters, gscMoveAnimations, g3MoveEffects, g3EvolveTypes, g3Stones, gscHappiness, gscStats, g3TradeItems, g3GrowthRates,
  g3ZoneNames, g3GrassEncChances, gsTrainerGroups, gsTrainerCounts, gsUniqueGroupNameIds, gsTrainerTypes, gscShopNames, g3WaterEncChances,
  getKeyByValue, g3MoveTargets, g3FishingEncChances} from './utils';


const pokemonNameStartByte = 0x245F5B; //Pokemon names start here and run Pokedex order with Chimecho at the end, out of order.
const pokemonMovesStart = 0x257504; //In Firered the learned moves are stored separately from evolutions.
const pokemonStartByte = 0x25480F; //Pokemon base stats data starts here. It goes in Pokedex order, Bulbasaur through Deoxys. Chimecho is at the end, out of order.
const pokemonMovesPointers = 0x25D824;
const pokemonEvolutionsStart = 0x2597EC;
const pointerBase = 0x3C000;

//values used to load the pokemon types
const typesByte = 0x24F210; //
const typeChartByte = 0x24F0C0;

//values used to load the moves
const moveNamesByte = 0x247111;
const movesStartingByte = 0x250C80; //The move data starts.
const moveDescPointer = 0x1B4000;
const moveDescBank = 0x1B0000;
const moveDescStartByte = 0x1B4202;
//values used to load the TMs and HMs
const tmStart = 0x45A604; //The TM info.
const itemPropertiesStart = 0x3DB098; // The item properties start here. 44 bytes per item.

//values used to load wild encounters
const wildEncountersStart = 0x3C7410;

//values used to load trainers
const trainerPointersByte = 0x3993E; // this is the start of the pointers to the trainer data.
const trainerBankByte = 0x34000; // the pointers are added to this value to find the trainer data.
const trainerDataByte = 0x399C2;
//values used to load shops
const shopsStartByte = 0x16342;
const shopsPointerStartByte = 0x162FE;

export default {
  version: "FIRERED/LEAFGREEN",
  rawBinArray: [],
  fileFilters: [
    { name: 'Gameboy Advance ROM', extensions: ['gba'] }
    ],
  generation: 3,
  moveAnimations: gscMoveAnimations,
  moveEffects: g3MoveEffects,
  evolveTypes: g3EvolveTypes,
  evolveStones: g3Stones,
  evolveHappiness: gscHappiness,
  tradeItems: g3TradeItems,
  growthRates: g3GrowthRates,
  damageModifiers: gscDamageModifiers,
  trainerTypes: gsTrainerTypes,
  moveTargets: g3MoveTargets,
  //these are limitations due to space.
  maxEvosMovesBytes: 5709,
  maxTrainerBytes: 9791,
  maxShopItems: 229,
  numHighCritMoves: 7,
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
    //actions.loadTrainers();
    //actions.loadShops();
    //actions.loadStarters();
    //actions.loadMoveDescriptions();
    //actions.loadShinyOdds();
  }),
  loadBinaryData: action((state, payload) => {
    state.rawBinArray = payload;
  }),
  loadPokemonData: thunk(async (actions, payload, {getState, getStoreActions}) => {
    let pokemon = [];
    let currentMovesPosition = pokemonMovesStart;
    let currentEvolutionsPosition = pokemonEvolutionsStart;
    for(let i = 0; i < 411; i++){
      var currentPokemon = {};
      currentPokemon.id = i;
      currentPokemon.hp = getState().rawBinArray[pokemonStartByte + (i * 28) +1];
      currentPokemon.attack = getState().rawBinArray[pokemonStartByte + (i * 28) +2];
      currentPokemon.defense = getState().rawBinArray[pokemonStartByte + (i * 28) +3];
      currentPokemon.speed = getState().rawBinArray[pokemonStartByte + (i * 28) +4];
      currentPokemon.specialAttack = getState().rawBinArray[pokemonStartByte + (i * 28) +5];
      currentPokemon.specialDefense = getState().rawBinArray[pokemonStartByte + (i * 28) +6];
      currentPokemon.totalStats = currentPokemon.hp + currentPokemon.attack + currentPokemon.defense + currentPokemon.speed + currentPokemon.specialAttack + currentPokemon.specialDefense;
      currentPokemon.type1 = getState().rawBinArray[pokemonStartByte + (i * 28) +7];
      currentPokemon.type2 = getState().rawBinArray[pokemonStartByte + (i * 28) +8];
      currentPokemon.catchRate = getState().rawBinArray[pokemonStartByte + (i * 28) + 9];
      currentPokemon.expYield = getState().rawBinArray[pokemonStartByte + (i * 28) + 10];

      currentPokemon.growthRate = getState().rawBinArray[pokemonStartByte + (i * 28) + 20];

      /*
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

      */
      currentPokemon.evolutions = [];
      currentPokemon.learnedMoves = [];

      //Evolutions.
      while(getState().rawBinArray[currentEvolutionsPosition] !== 0)
      {
          let evo = {param: 1}; //initialize with some default values.
          evo.evolve = getState().rawBinArray[currentEvolutionsPosition];
          currentEvolutionsPosition += 2;

          let evoParam = getState().rawBinArray[currentEvolutionsPosition++];
          evoParam += getState().rawBinArray[currentEvolutionsPosition++] * 256;

          evo.param = evoParam;

          let targetPokemon = getState().rawBinArray[currentEvolutionsPosition++];
          targetPokemon += getState().rawBinArray[currentEvolutionsPosition++] * 256;

          evo.evolveTo = targetPokemon-1;

          //console.log(evo);
          currentPokemon.evolutions.push(evo);
          currentEvolutionsPosition += 2;
      }
      currentEvolutionsPosition += (40 - (currentPokemon.evolutions.length*8));


      //Moves learned while leveling up. They are deliminated with 0xFFFF
      while ((getState().rawBinArray[currentMovesPosition] !== 0xFF) || (getState().rawBinArray[currentMovesPosition+1] !== 0xFF))
      {
          let moveToAdd = {};
          //the moves are stored in 2 bytes, little endian.
          // it is (level << 9 | move). We have to reverse the left shifting and ORing to get the values.
          let moveValue = getState().rawBinArray[currentMovesPosition++];
          moveValue += getState().rawBinArray[currentMovesPosition++] * 256;

          // right shift 9 to get the level
          moveToAdd.level = moveValue >> 9;
          // xor the left shifted level to get the move.
          moveToAdd.moveID = moveValue ^ (moveToAdd.level << 9);
          currentPokemon.learnedMoves.push(moveToAdd);
      }
      currentMovesPosition+=2;

      let pokemonName = "";

      //Each name is 11 bytes
      for (let j = 0; j < 11; j++) {
        //The end of a name is marked with FF
        if (getState().rawBinArray[pokemonNameStartByte + (i * 11) + j] !== 0xFF){
            pokemonName += gen3Letters.get(getState().rawBinArray[pokemonNameStartByte + (i * 11) + j]);
        }else{
          break;
        }
      }

      currentPokemon.name = pokemonName;
      pokemon.push(currentPokemon);
    }
    getStoreActions().setPokemonArray(pokemon);
  }),
  savePokemonData: thunk(async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let workingArray = getState().rawBinArray;
    let currentEvosMovesByte = pokemonMovesStart;
    let currentPointerByte = pokemonMovesPointers;
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
      workingArray[pokemonStartByte + (i * 32) + 31] = tmArray[7];


      let secondPointerByte = Math.floor((currentEvosMovesByte - pointerBase) / 256);
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
  loadPokemonTypes: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let types = [];
    let newType;
    let currentTypesByte = typesByte;
    let typeName;
    let typeIndex = 0;


    while (typeIndex < 18)
    {
      newType = {
        typeIsUsed: true
      };
      typeName = "";

      // read the name of each type
      while (getState().rawBinArray[currentTypesByte] !== 0xFF) //0xFF is the deliminator for the end of a name.
      {
        if(getState().rawBinArray[currentTypesByte] !== 0x00){
          typeName += gen3Letters.get(getState().rawBinArray[currentTypesByte++]);
        }else{
          currentTypesByte++;
        }
      }
      currentTypesByte++;
      //console.log(typeName);

      newType.typeName = typeName;
      newType.typeIndex = typeIndex++;

      types.push(newType);
    }
    //console.log(types);
    getStoreActions().setPokemonTypes(types);
  }),
  savePokemonTypes: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    /*
    let romData = getState().rawBinArray;
    let pokemonTypes = getStoreState().pokemonTypes;

    let firstPointerByte;
    let secondPointerByte;
    let numOfPointerBytes = pokemonTypes.length * 2; // there are 2 bytes for each pointer and we need a pointer for each type even if it is not used.
    let currentPointerByte = typesBankByte + typesPointer; // this is the beginning of the pointers.
    let currentNamesByte = currentPointerByte + numOfPointerBytes; //this is where we will start writing the names.

    let firstNamesByte = currentNamesByte; // save the first name location for the types that aren't used.

    for(let i = 0; i < pokemonTypes.length; i++)
    {
      if(pokemonTypes[i].typeIsUsed === true) // if the type is used point to the correct name.
      {
        secondPointerByte = Math.floor((currentNamesByte - typesBankByte) / 256);
        firstPointerByte = (currentNamesByte - typesBankByte) - (secondPointerByte * 256);
        // write the pointer to the name
        romData[currentPointerByte++] = firstPointerByte;
        romData[currentPointerByte++] = secondPointerByte;

        // write the name
        pokemonTypes[i].typeName.split("").forEach((c) => {
          romData[currentNamesByte++] = getKeyByValue(gen3Letters, c);
        });
        romData[currentNamesByte++] = 0x50;
      }
      else // if the type isn't used point to the first name.
      {
        secondPointerByte = Math.floor((firstNamesByte - typesBankByte) / 256);
        firstPointerByte = (firstNamesByte - typesBankByte) - (secondPointerByte * 256);
        // write the pointer to the name
        romData[currentPointerByte++] = firstPointerByte;
        romData[currentPointerByte++] = secondPointerByte;
      }
    }
    */
  }),
  loadPokemonMoves: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let moves = [];
    let currentMoveNameByte = moveNamesByte;
    let moveToAdd;
    let moveName;


    moveToAdd = {}; //uses 0x00 for blank starter move
    moveToAdd.id = 0;
    moveToAdd.name = "nothing";
    moveToAdd.power = 0;
    moveToAdd.accuracy = 0;
    moveToAdd.pp = 0;
    moves.push(moveToAdd);

    for (let i = 0; i < 354; i++) //354 because there are 354 moves in the game.
    {
        moveName = "";

        //Luckily the names for the moves are stored in the same order as the moves, just in a different spot in memory.
        while (getState().rawBinArray[currentMoveNameByte] !== 0xFF){
          if(getState().rawBinArray[currentMoveNameByte] !== 0x00){
            moveName += gen3Letters.get(getState().rawBinArray[currentMoveNameByte]);
          }
          currentMoveNameByte++;
        }
        currentMoveNameByte++;

        moveToAdd = {};
        moveToAdd.id = i + 1;
        moveToAdd.name = moveName;
        //Each Move uses 12 bytes. i = the current move so we take the starting point and add 12 for each move
        // that we have already read and then add 0-11 as we read through the data fields for that move.
        moveToAdd.animationID = i+1;
        moveToAdd.effect = getState().rawBinArray[movesStartingByte + (i * 12)];
        moveToAdd.power = getState().rawBinArray[movesStartingByte + (i * 12) + 1];
        moveToAdd.moveType = getState().rawBinArray[movesStartingByte + (i * 12) + 2];
        moveToAdd.accuracy = getState().rawBinArray[movesStartingByte + (i * 12) + 3];
        moveToAdd.pp = getState().rawBinArray[movesStartingByte + (i * 12) + 4];
        moveToAdd.effectChance = getState().rawBinArray[movesStartingByte + (i * 12) + 5];
        moveToAdd.target = getState().rawBinArray[movesStartingByte + (i * 12) + 6];
        moveToAdd.priority = getState().rawBinArray[movesStartingByte + (i * 12) + 7];
        moveToAdd.highCrit = false;

        moves.push(moveToAdd);
    }
    //console.log(moves);
    getStoreActions().setMovesArray(moves);
    //return moves;
  }),
  savePokemonMoves: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let currentMoveNameByte = moveNamesByte;
    let romData = getState().rawBinArray;
    let moves = getStoreState().moves;
    const highCritMovesStartByte = 0x347F3;
    let highCritMoves = [];

    for(let i = 0; i < 251; i++)
    {
        romData[movesStartingByte + (i * 7)] = moves[i + 1].animationID;
        romData[movesStartingByte + (i * 7) + 1] = moves[i + 1].effect;
        romData[movesStartingByte + (i * 7) + 2] = moves[i + 1].power;
        romData[movesStartingByte + (i * 7) + 3] = moves[i + 1].moveType;
        romData[movesStartingByte + (i * 7) + 4] = moves[i + 1].accuracy;
        romData[movesStartingByte + (i * 7) + 5] = moves[i + 1].pp;
        romData[movesStartingByte + (i * 7) + 6] = moves[i + 1].effectChance;

        moves[i + 1].name.split("").forEach((c) => {
          romData[currentMoveNameByte] = getKeyByValue(gen3Letters, c);
          currentMoveNameByte++;
        });

        romData[currentMoveNameByte] = 0x50;
        currentMoveNameByte++;

        if(moves[i+1].highCrit === true){
          highCritMoves.push(moves[i+1].id);
        }
    }

    // In Gens I & II the data for high crit chance moves is stored separately. It is just a list of move IDs followed by 0xFF
    for(let i = 0; i < getState().numHighCritMoves; i++){
      romData[highCritMovesStartByte + i] = highCritMoves[i];
    }

  }),

  loadMoveDescriptions: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let descriptions = [];
    let currentMoveDescByte = moveDescStartByte;
    let moveDesc;

    moveDesc = {};
    moveDesc.id = 0;
    moveDesc.text = "not an actual move";

    descriptions.push(moveDesc);

    for (let i = 0; i < 251; i++) //251 because there are 251 moves in the game
    {
        let descText = "";

        while (getState().rawBinArray[currentMoveDescByte] !== 0x50) //0x50 is the deliminator for the end of a name.
        {
          descText += gen3Letters.get(getState().rawBinArray[currentMoveDescByte]);
          currentMoveDescByte++
        }
        currentMoveDescByte++;

        moveDesc = {};
        moveDesc.id = i+1; // +1 because an extra move was added.
        moveDesc.text = descText;


        descriptions.push(moveDesc);
    }

    getStoreActions().setMoveDescriptions(descriptions);
  }),

  saveMoveDescriptions: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let currentMoveDescByte = moveDescStartByte;
    let romData = getState().rawBinArray;
    let moveDescriptions = getStoreState().moveDescriptions;
    let currentPointerByte = moveDescPointer;

    let firstPointerByte;
    let secondPointerByte;

    for(let i = 0; i < 251; i++)
    {
      secondPointerByte = Math.floor((currentMoveDescByte - moveDescBank) / 256);
      firstPointerByte = (currentMoveDescByte - moveDescBank) - (secondPointerByte * 256);
      // write the pointer to the desc
      romData[currentPointerByte++] = firstPointerByte;
      romData[currentPointerByte++] = secondPointerByte;

      // +1 is being used because an extra move is added to the moves array during the load process. We are skipping that here.
      moveDescriptions[i+1].text.split("").forEach((c) => {
        romData[currentMoveDescByte] = getKeyByValue(gen3Letters, c);
        currentMoveDescByte++;
      });

      romData[currentMoveDescByte] = 0x50;
      currentMoveDescByte++;
    }
  }),

  loadTMs: thunk (async (actions, payload, {getState, getStoreActions}) => {

    let tms = [];

    for (let i = 0; i < 58; i++) //There are 50 TMs and 8 HMs. Each is 2 bytes which is the moveID
    {
        let newTM = {};
        
        newTM.move = getState().rawBinArray[tmStart + i*2];
        newTM.move += getState().rawBinArray[tmStart + i*2 + 1] * 256;
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

    //console.log(tms);
    getStoreActions().setTMs(tms);
  }),
  saveTMs: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let tms = getStoreState().tms;

    for (let i = 0; i < 58; i++) //There are 50 TMs and 7 HMs. Each is 1 byte which is the moveID
    {
        romData[tmStart + i] = tms[i].move;
    }
  }),
  loadItems: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let items = [];
    
    for(let i = 0; i < 375; i++){
      let newItem = {};

      //The price is stored in 2 bytes little endian.
      newItem.price = (getState().rawBinArray[itemPropertiesStart + i*44 + 17] * 256) + getState().rawBinArray[itemPropertiesStart + i*44 + 16];

      let itemName = "";
      let currentPosition = itemPropertiesStart + i*44;
      while(getState().rawBinArray[currentPosition] !== 0xFF){
        itemName += gen3Letters.get(getState().rawBinArray[currentPosition++]);
      }
      newItem.name = itemName;

      items.push(newItem);
    }
    //console.log(items);
    getStoreActions().setItems(items);
  }),
  saveItems: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let items = getStoreState().items;

    for(let i = 0; i < 249; i++){
      romData[itemPropertiesStart + i*7] = items[i].price % 256;
      romData[itemPropertiesStart + i*7  +1] = Math.floor(items[i].price / 256);
    }

  }),
  loadTypeMatchups: thunk (async (action, payload, {getState, getStoreActions}) => {
    let typeMatchups = [];
    let currentByte = typeChartByte;
    let foresightTypes = false;

    while(getState().rawBinArray[currentByte] !== 0xFF) // Since we are checking the ending byte this can be converted to a while loop?
    {
      // The type matchups are split into 2 groups. The first group ends with FE.
      // The 2nd group is the ghost immunes that are cancelled by using the Foresight move.
      if(getState().rawBinArray[currentByte] === 0xFE){
        currentByte += 3;
        foresightTypes = true;
      }
      else{
        let typeMatchupToAdd = {};
        typeMatchupToAdd.attackType = getState().rawBinArray[currentByte++]; //first byte is the attacking type
        typeMatchupToAdd.defenseType = getState().rawBinArray[currentByte++]; //second byte is the defending type
        typeMatchupToAdd.effectiveness = getState().rawBinArray[currentByte++]; //third byte is effectiveness X 10. So double damage = 20, half damage = 5.
        typeMatchupToAdd.foresight = foresightTypes;
        typeMatchups.push(typeMatchupToAdd);
      }
    }

    getStoreActions().setTypeMatchups(typeMatchups);
    //console.log(typeMatchups);
  }),
  saveTypeMatchups: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let typeMatchups = getStoreState().typeMatchups;
    let currentByte = typeChartByte;

    let foresightCount = 1;
    for(let m = 0; m < typeMatchups.length; m++){
      if (typeMatchups[m].foresight === true){
        foresightCount++;
      }
    }

    //make sure the matchups that foresight affect are saved last.
    typeMatchups.sort((a,b) => {
      if(a.foresight=== true && b.foresight === false){
        return 1;
      }else if(a.foresight === false && b.foresight === true){
        return -1;
      }else{
        return 0;
      }
    });

    for(let i = 0; i < typeMatchups.length; i++){
      romData[currentByte++] = typeMatchups[i].attackType;
      romData[currentByte++] = typeMatchups[i].defenseType;
      romData[currentByte++] = typeMatchups[i].effectiveness;
      if(i === typeMatchups.length-foresightCount){
        romData[currentByte++] = 0xFE; //0xFE separates the last 2 type matchups. Originally they are the ghost immunes that are removed by foresight.
      }
    }
    romData[currentByte++] = 0xFF; //writing the ending byte manually in case the user removed some type strengths.

  }),
  loadEncounters: thunk (async (action, payload, {getState, getStoreActions}) => {
    let zones = [];

    let currentPosition = wildEncountersStart;

    const rockSmashZones = [24,25,26,28,40,42,44,45,46,47,48,49,70,75];
    const waterZones = [11,20,21,22,23,24,26,32,33,50,51,54,70,71,72,73,75,76,77,78,79,80,81,82,83,86,90,
                        92,96,97,98,99,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,
                        120,121,122];
    const noLandZones = [11,75,76,79,80,83,86,105,106,113,114,115,116,117,118,119,120,121,122,123];

    // 132 maps/zones
    for(let z = 0; z < 132; z++)
    {

      //It's important to keep the order of the 4 if statements below unless a
      // way of checking the zones is changed to a way that looks at each map.

      // no land zones contain the zones that don't have land pokemon.
      // it's easier to find zones that don't have land than those that do.
      // Land in this context includes tall grass and walking in caves.
      if(!noLandZones.includes(z))
      {
        let newZone = {};

        newZone.name =  `${g3ZoneNames[z]} land`;
        newZone.encounters = [];

        for(let i = 0; i < 12; i++){
          let encounter = {};
          encounter.minLevel = getState().rawBinArray[currentPosition++];
          encounter.maxLevel = getState().rawBinArray[currentPosition++];
          let pokeValue = getState().rawBinArray[currentPosition++];
          pokeValue += getState().rawBinArray[currentPosition++] * 256;

          encounter.pokemon = pokeValue - 1;
          encounter.chance = g3GrassEncChances[i];
          newZone.encounters.push(encounter);
        }
        newZone.encounterRate = getState().rawBinArray[currentPosition++];
        currentPosition += 7; //encounter rates use 3 extra bytes. The next 4 bytes are a pointer to the previous data.

        zones.push(newZone);
      }

      // See if the current zone is included in the list of zones with water.
      if(waterZones.includes(z))
      {
        let newZone = {};

        newZone.name =  `${g3ZoneNames[z]} water`;
        newZone.encounters = [];

        for(let i = 0; i < 5; i++){
          let encounter = {};
          encounter.minLevel = getState().rawBinArray[currentPosition++];
          encounter.maxLevel = getState().rawBinArray[currentPosition++];
          let pokeValue = getState().rawBinArray[currentPosition++];
          pokeValue += getState().rawBinArray[currentPosition++] * 256;

          encounter.pokemon = pokeValue - 1;
          encounter.chance = g3WaterEncChances[i];
          newZone.encounters.push(encounter);
        }
        newZone.encounterRate = getState().rawBinArray[currentPosition++];
        currentPosition += 7; //encounter rates use 3 extra bytes. The next 4 bytes are a pointer to the previous data.

        zones.push(newZone);
      }

      // See if the current zone is included in the list of zones with rocks to smash.
      if(rockSmashZones.includes(z))
      {
        let newZone = {};

        newZone.name =  `${g3ZoneNames[z]} rocks`;
        newZone.encounters = [];

        for(let i = 0; i < 5; i++){
          let encounter = {};
          encounter.minLevel = getState().rawBinArray[currentPosition++];
          encounter.maxLevel = getState().rawBinArray[currentPosition++];
          let pokeValue = getState().rawBinArray[currentPosition++];
          pokeValue += getState().rawBinArray[currentPosition++] * 256;

          encounter.pokemon = pokeValue - 1;
          encounter.chance = g3WaterEncChances[i]; // rocksmash uses the same enc chances as water
          newZone.encounters.push(encounter);
        }
        newZone.encounterRate = getState().rawBinArray[currentPosition++];
        currentPosition += 7; //encounter rates use 3 extra bytes. The next 4 bytes are a pointer to the previous data.

        zones.push(newZone);
      }

      // See if the current zone is included in the list of zones with water.
      if(waterZones.includes(z))
      {
        let newZone = {};

        newZone.name =  `${g3ZoneNames[z]} fishing`;
        newZone.encounters = [];

        for(let i = 0; i < 10; i++){
          let encounter = {};
          encounter.minLevel = getState().rawBinArray[currentPosition++];
          encounter.maxLevel = getState().rawBinArray[currentPosition++];
          let pokeValue = getState().rawBinArray[currentPosition++];
          pokeValue += getState().rawBinArray[currentPosition++] * 256;

          encounter.pokemon = pokeValue - 1;
          encounter.chance = g3FishingEncChances[i];
          newZone.encounters.push(encounter);
        }
        newZone.encounterRate = getState().rawBinArray[currentPosition++];
        currentPosition += 7; //encounter rates use 3 extra bytes. The next 4 bytes are a pointer to the previous data.

        zones.push(newZone);
      }

    }

    //console.log(zones.length);
    getStoreActions().setEncounterZones(zones);
  }),
  /*
  saveEncounters: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let zones = getStoreState().encounterZones;
    let indexStartingPoint = 0;

    let currentByte = johtoGrassWildEncountersByte;
    for (let i = 0; i < 61; i++) // johto has 61 grass zones.
    {
      currentByte += 2; //skip the map IDs, we aren't modifying them.
      //when loading we split the zones into morn/day/night but when saving we need them all grouped together.
      romData[currentByte++] = zones[i * 3].encounterRate;
      romData[currentByte++] = zones[i * 3 + 1].encounterRate;
      romData[currentByte++] = zones[i * 3 + 2].encounterRate;

      for(let k = 0; k < zones[i * 3].encounters.length; k++){
        romData[currentByte++] = zones[i * 3].encounters[k].level;
        romData[currentByte++] = zones[i * 3].encounters[k].pokemon +1;
      }
      for(let k = 0; k < zones[i * 3 + 1].encounters.length; k++){
        romData[currentByte++] = zones[i * 3 + 1].encounters[k].level;
        romData[currentByte++] = zones[i * 3 + 1].encounters[k].pokemon +1;
      }
      for(let k = 0; k < zones[i * 3 + 2].encounters.length; k++){
        romData[currentByte++] = zones[i * 3 + 2].encounters[k].level;
        romData[currentByte++] = zones[i * 3 + 2].encounters[k].pokemon +1;
      }
    }
    indexStartingPoint += 183;

    currentByte = johtoWaterWildEncountersByte;
    for(let i = 0; i < 38; i++){
      currentByte += 2; //skip the map IDs, we aren't modifying them.
      romData[currentByte++] = zones[indexStartingPoint + i].encounterRate;

      for(let k = 0; k < zones[indexStartingPoint + i].encounters.length; k++){
        romData[currentByte++] = zones[indexStartingPoint + i].encounters[k].level;
        romData[currentByte++] = zones[indexStartingPoint + i].encounters[k].pokemon +1;
      }
    }
    indexStartingPoint += 38;

    currentByte = kantoGrassWildEncountersByte;
    for (let i = 0; i < 30; i++) // kanto has 30 grass zones.
    {
      currentByte += 2; //skip the map IDs, we aren't modifying them.
      //when loading we split the zones into morn/day/night but when saving we need them all grouped together.
      romData[currentByte++] = zones[indexStartingPoint + i * 3].encounterRate;
      romData[currentByte++] = zones[indexStartingPoint + i * 3 + 1].encounterRate;
      romData[currentByte++] = zones[indexStartingPoint + i * 3 + 2].encounterRate;

      for(let k = 0; k < zones[indexStartingPoint + i * 3].encounters.length; k++){
        romData[currentByte++] = zones[indexStartingPoint + i * 3].encounters[k].level;
        romData[currentByte++] = zones[indexStartingPoint + i * 3].encounters[k].pokemon +1;
      }
      for(let k = 0; k < zones[indexStartingPoint + i * 3 + 1].encounters.length; k++){
        romData[currentByte++] = zones[indexStartingPoint + i * 3 + 1].encounters[k].level;
        romData[currentByte++] = zones[indexStartingPoint + i * 3 + 1].encounters[k].pokemon +1;
      }
      for(let k = 0; k < zones[indexStartingPoint + i * 3 + 2].encounters.length; k++){
        romData[currentByte++] = zones[indexStartingPoint + i * 3 + 2].encounters[k].level;
        romData[currentByte++] = zones[indexStartingPoint + i * 3 + 2].encounters[k].pokemon +1;
      }
    }
    indexStartingPoint += 90;

    currentByte = kantoWaterWildEncountersByte;
    for(let i = 0; i < 24; i++){
      currentByte += 2; //skip the map IDs, we aren't modifying them.
      romData[currentByte++] = zones[indexStartingPoint + i].encounterRate;
      for(let k = 0; k < zones[indexStartingPoint + i].encounters.length; k++){
        romData[currentByte++] = zones[indexStartingPoint + i].encounters[k].level;
        romData[currentByte++] = zones[indexStartingPoint + i].encounters[k].pokemon +1;
      }
    }

  }),
  //*/
  loadTrainers: thunk (async (action, payload, {getState, getStoreActions}) => {
    let trainers = [];
    let currentPointerByte = trainerPointersByte;
    let numOfTrainersInGroup = 0;
    let trainerID = 0;

    // 66 trainer groups
    for(let groupNum = 0; groupNum < 66; groupNum++){

      //get the starting point for the group's data
      let pointerByte1 = getState().rawBinArray[currentPointerByte++];
      let pointerByte2 = getState().rawBinArray[currentPointerByte++] * 256;
      let currentTrainerByte = trainerBankByte + pointerByte1 + pointerByte2;

      //while we haven't reached the last trainer in the group keep loading trainers
      while(numOfTrainersInGroup < gsTrainerCounts[groupNum]){
        let newTrainer = {};
        newTrainer.id = trainerID++;
        let trainerName = "";

        //first thing is the name. Each trainer has an individual name and a group name.
        // For some groups it doesn't make sense to use both e.g. "Lance Lance".
        if(!gsUniqueGroupNameIds.includes(groupNum)){
          trainerName += `${gsTrainerGroups[groupNum]} `;
        }

        let uniqueName = "";
        //reads the name. The ending is marked with 0x50
        while(getState().rawBinArray[currentTrainerByte] !== 0x50){
          uniqueName += gen3Letters.get(getState().rawBinArray[currentTrainerByte++]);
        }
        if(uniqueName === "?"){
          uniqueName = `fight #${Math.floor(numOfTrainersInGroup/3)+1}`;
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
  saveTrainers: thunk (async (action, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let trainers = getStoreState().trainers.sort((a,b) => a.id < b.id ? -1 : 1); // sort the trainers by ID so they get saved in the correct order.
    let numOfTrainersInGroup = 0;
    let currentPointerByte = trainerPointersByte;
    let currentTrainerByte = trainerDataByte;
    let currentTrainer = 0;

    for(let groupNum = 0; groupNum < 66; groupNum++){
      //update pointers so the game knows where to find the updated trainer groups.
      let secondPointerByte = Math.floor((currentTrainerByte - trainerBankByte) / 256);
      let firstPointerByte = (currentTrainerByte - trainerBankByte) - (secondPointerByte * 256);
      romData[currentPointerByte++] = firstPointerByte;
      romData[currentPointerByte++] = secondPointerByte;

      //while we haven't reached the last trainer in the group keep saving trainers
      while(numOfTrainersInGroup < gsTrainerCounts[groupNum]){

        //first is the trainer's unique name.
        trainers[currentTrainer].uniqueName.split("").forEach((c) => {
          romData[currentTrainerByte++] = getKeyByValue(gen3Letters, c);
        });
        romData[currentTrainerByte++] = 0x50; //mark the end of the name.
        romData[currentTrainerByte++] = trainers[currentTrainer].type;

        for(let i = 0; i < trainers[currentTrainer].pokemon.length; i++){
          romData[currentTrainerByte++] = trainers[currentTrainer].pokemon[i].level;
          romData[currentTrainerByte++] = trainers[currentTrainer].pokemon[i].pokemon + 1;

          //if the type is 2 or 3 the next byte is the pokemon's item
          if(trainers[currentTrainer].type === 2 || trainers[currentTrainer].type === 3){
            romData[currentTrainerByte++] = trainers[currentTrainer].pokemon[i].item +1;
          }else

          //if the type is 1 or 3 the next 4 bytes will be the pokemon's moves.
          if(trainers[currentTrainer].type === 1 || trainers[currentTrainer].type === 3){
            romData[currentTrainerByte++] = trainers[currentTrainer].pokemon[i].move1;
            romData[currentTrainerByte++] = trainers[currentTrainer].pokemon[i].move2;
            romData[currentTrainerByte++] = trainers[currentTrainer].pokemon[i].move3;
            romData[currentTrainerByte++] = trainers[currentTrainer].pokemon[i].move4;
          }
        }
        romData[currentTrainerByte++] = 0xFF; //this marks the end of each trainer.
        currentTrainer++;
        numOfTrainersInGroup++;
      }

      numOfTrainersInGroup = 0;
    }

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
  saveShops: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let shops = getStoreState().shops;

    let currentByte = shopsStartByte;
    let currentPointerByte = shopsPointerStartByte;
    for (let i = 0; i < 35; i++)
    {
        //first update pointers to the new location of the shop's data.
        //the game stores these pointers along with the pointers to the text data.
        if(i !== 34) //the last mart doesn't have a pointer i guess?
        {
            let secondPointerByte = Math.floor((currentByte) / 256);
            let firstPointerByte = (currentByte) - (secondPointerByte * 256);
            romData[currentPointerByte++] = firstPointerByte;
            romData[currentPointerByte++] = secondPointerByte;
        }

        //next update the shop data.
        //The first byte is always the number of items for sale.
        romData[currentByte++] = shops[i].items.length;

        for(let k = 0; k < shops[i].items.length; k++)
        {
            romData[currentByte++] = shops[i].items[k].item + 1;
        }
        romData[currentByte++] = 0xFF; //mark end of shop
    }
  }),
  loadStarters: thunk (async (actions, payload, {getState, getStoreActions}) => {
    const starterBytes = [0x1800F6, 0x180138, 0x180174];
    let starters = [];

    for(let i = 0; i < 3; i++){
      let newStarter = {};
      newStarter.pokemon = getState().rawBinArray[starterBytes[i]] - 1;
      newStarter.level = getState().rawBinArray[starterBytes[i]+1];
      newStarter.item = getState().rawBinArray[starterBytes[i]+2] - 1;
      starters.push(newStarter);
    }

    getStoreActions().setStarters(starters);
  }),
  saveStarters: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let starters = getStoreState().starters;
    let pokemon = getStoreState().pokemon;
    const starterBytes = [0x1800D2, 0x180114, 0x180150];
    const starterMessageBytes = [0x1805E4, 0x18060F, 0x18063B];
    const originalStarters = [0x9B, 0x9E, 0x98];
    const starterOriginalMessages = [[0x84, 0x8b, 0x8c, 0x9c, 0x7f, 0x98, 0xae, 0xb4, 0xd1, 0xab, 0x7f, 0xb3, 0xa0, 0xaa, 0xa4, 0x4f, 0x82, 0x98, 0x8d, 0x83, 0x80, 0x90, 0x94, 0x88, 0x8b, 0xf4, 0x7f, 0xb3, 0xa7, 0xa4, 0x55, 0xa5, 0xa8, 0xb1, 0xa4, 0x7f, 0x54, 0x8c, 0x8e, 0x8d, 0xe6, 0x57, 0x00],
     [0x84, 0x8b, 0x8c, 0x9c, 0x7f, 0x83, 0xae, 0x7f, 0xb8, 0xae, 0xb4, 0x7f, 0xb6, 0xa0, 0xad, 0xb3, 0x4f, 0x93, 0x8e, 0x93, 0x8e, 0x83, 0x88, 0x8b, 0x84, 0xf4, 0x7f, 0xb3, 0xa7, 0xa4, 0x55, 0xb6, 0xa0, 0xb3, 0xa4, 0xb1, 0x7f, 0x54, 0x8c, 0x8e, 0x8d, 0xe6, 0x57, 0x00],
     [0x84, 0x8b, 0x8c, 0x9c, 0x7f, 0x92, 0xae, 0xf4, 0x7f, 0xb8, 0xae, 0xb4, 0x7f, 0xab, 0xa8, 0xaa, 0xa4, 0x4f, 0x82, 0x87, 0x88, 0x8a, 0x8e, 0x91, 0x88, 0x93, 0x80, 0xf4, 0x7f, 0xb3, 0xa7, 0xa4, 0x55, 0xa6, 0xb1, 0xa0, 0xb2, 0xb2, 0x7f, 0x54, 0x8c, 0x8e, 0x8d, 0xe6, 0x57, 0x00]];

    for(let i = 0; i < 3; i++){
      //pokemon image to display
      romData[starterBytes[i]] = starters[i].pokemon +1;
      //pokemon cry
      romData[starterBytes[i]+2] = starters[i].pokemon +1;
      //pokemon name for receive message
      romData[starterBytes[i]+25] = starters[i].pokemon +1;
      //pokemon to receive
      romData[starterBytes[i]+36] = starters[i].pokemon +1;
      //pokemon's level
      romData[starterBytes[i]+37] = starters[i].level;
      //pokemon's held item
      romData[starterBytes[i]+38] = starters[i].item +1;

      //if the starter hasn't changed then use the original message;
      if(starters[i].pokemon+1 === originalStarters[i]){
        for(let k = 0; k < starterOriginalMessages[i].length; k++ ){
          romData[starterMessageBytes + k] = starterOriginalMessages[i][k];
        }
      }
      else{ //if the user changed the starters then we need to update the "so you want..." question
        let messageIndex = 0;
        let currentMessageByte = starterMessageBytes[i];
        while(starterOriginalMessages[i][messageIndex] !== 0x4F){
          romData[currentMessageByte++] = starterOriginalMessages[i][messageIndex++];
        }
        romData[currentMessageByte++] = 0x4F;
        //console.log(pokemon);
        //console.log(starters);
        //console.log(pokemon[starters[i].pokemon + 1]);
        pokemon[starters[i].pokemon].name.split("").forEach((c) => {
          romData[currentMessageByte++] = getKeyByValue(gen3Letters, c);
        });
        romData[currentMessageByte++] = 0xE6;
        romData[currentMessageByte++] = 0x57;
      }


    }

  }),
  loadShinyOdds: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    const DVCompareBytes = [0x905E, 0x9065, 0x906C];

    let valuesUnchanged = true;

    for(let i = 0; i < 3; i++){
      if(romData[DVCompareBytes[i]] != 0x20){
        valuesUnchanged = false;
        break;
      }
    }

    getStoreActions().setIncreaseShinyOdds(!valuesUnchanged);
  }),
  saveShinyOdds: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let increaseShinyOdds = getStoreState().increaseShinyOdds;
    const DVCompareBytes = [0x905E, 0x9065, 0x906C];

    for(let i = 0; i < 3; i++){
      if(increaseShinyOdds){
        romData[DVCompareBytes[i]] = 0x28
      }else{
        romData[DVCompareBytes[i]] = 0x20
      }
    }

  }),
  prepareDataForSaving: thunk(async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    actions.savePokemonData();
    actions.savePokemonMoves();
    actions.saveTMs();
    actions.saveItems();
    actions.savePokemonTypes();
    actions.saveTypeMatchups();
    actions.saveEncounters();
    actions.saveTrainers();
    actions.saveShops();
    actions.saveStarters();
    actions.saveMoveDescriptions();
    actions.saveShinyOdds();
  })
}