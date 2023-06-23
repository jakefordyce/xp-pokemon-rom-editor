import { thunk, action } from "easy-peasy";
import {rbygsLetters, rbyMoveAnimations, rbyMoveEffects, rbyItems, rbyEvolveTypes, rbyStones, rbyGrowthRates,
  rbyDamageModifiers, rbZoneNames, yZoneNames, rbyGrassEncChances, rbyTrainerNames, rbTrainerCounts, yTrainerCounts, 
  rbUnusedTrainers, yUnusedTrainers, rbyShopNames,  getKeyByValue} from './utils';
import RomBank from './romBank';

//values used to load pokemon stats and moves.
const rbMewStartByte = 0x425B; // Mew's stats start at byte 0x425B in Red and Blue
const yMewStartByte = 0x39446; // Mew's stats start at byte 0x39446 in Yellow
const rbPokemonNameStartByte = 0x1C21E; //Pokemon names start at byte 0x1C21E in Red and Blue and run in Index order.
const yPokemonNameStartByte = 0XE8000; //Pokemon names start at byte 0XE8000 in Yellow and also run in Index order.
const rbPokemonEvosMovesByte = 0x3B1D8; //Pokemon evolutions and moves learned through leveling are stored together starting at byte 0x3B1D8 in Red and Blue
const yPokemonEvosMovesByte = 0x3B361; //Pokemon evolutions and moves learned through leveling are stored together starting at byte 0x3B361 in Yellow
const pokemonStartByte = 0x383DE; //Pokemon data starts at byte 0x383DE. It goes in Pokedex order, Bulbasaur through Mewtwo.
const rbPokedexStartByte = 0x41024; //List of pokedex IDs start at byte 0x41024 in Red and Blue and run in Index order, Rhydon through Victreebel.
const yPokedexStartByte = 0x410B1; //List of pokedex IDs start at byte 0x410B1 in Yellow and run in Index order, Rhydon through Victreebel.
let pokedexIDs = new Map();
let indexIDs = new Map();
const rbPokemonEvosPointersByte = 0x3B05C; //The pointers to the pokemon Evolutions and learned moves start at byte 0x3B05C in Red and Blue
const yPokemonEvosPointersByte = 0x3B1E5; //The pointers to the pokemon Evolutions and learned moves start at byte 0x3B1E5 in yellow.

const rbPointerBase = 0x34000; //this is the value that is added to the pointers to get the location of evolutions/moves and trainer data
const yPointerBase = 0x34000; //this is the value that is added to the pointers to get the location of evolutions/moves and trainer data

//values used to load the pokemon types
const typesBankByte = 0x20000; // bank 9. This is the same bank for Red, Blue, and Yellow.
const rbTypesPointer = 0x7DAE; // this is a pointer within a bank, not the full address
const yTypesPointer = 0x7D63; // this is a pointer within a bank, not the full address
const rbTypeChartByte = 0x3E474; //The types' strengths start at byte 0x3E474 in Red and Blue
const yTypeChartByte = 0x3E5FA; //The types' strengths start at byte 0x3E5FA in yellow

//values used to load the moves
const rbMoveNamesByte = 0xB0000; //The data for move names starts at 0xB0000 in Red and Blue
const yMoveNamesByte = 0xBC000; //The data for move names starts at 0xBC000 in Yellow
const movesStartingByte = 0x38000; //The move data starts at 0x38000. Same for Red, Blue, and Yellow

//values used to load the TMs and HMs
const rbTmStartByte = 0x13773; //The TM info starts at byte 0x13773 in Red and Blue
const yTmStartByte = 0x1232D; //The TM info starts at byte 0x1232D in Yellow
const rbTmPricesStartByte = 0x7BFA7; //TM prices start at byte 0x7BFA7 in Red and Blue
const yTmPricesStartByte = 0xF65F5; //TM prices start at byte 0x7BFA7 in Yellow
const rbItemPricesStartByte = 0x4608; // The prices for items start at byte 0x4608 in Red and Blue
const yItemPricesStartByte = 0x4494; // The prices for items start at byte 0x4495 in Yellow

//values used to load wild encounters
const rbWildEncountersByte = 0xD0DF; //The data for wild encounters start at 0xD0DE in Red and Blue but the first one is empty so I skip it and start at 0xD0DF
const yWildEncountersByte = 0xCD8B; //The data for wild encounters start at 0xCD89 in Yellow

// I split the encounter data into 63 zones, each with 10 slots @ 2 bytes each slot. 
// There is also 1 byte per zone for the encounter rate. 
// For the zones that I didn't split in half (grass and surf are stored in the same area originally), you have to also add 1 byte for the encounter rate that isn't being used.
// 63 X 22 - 7 = the number of bytes to add to the WildEncountersByte to get the End Byte below.
const rbWildEncountersEndByte = 0xD5C7;
const yWildEncountersEndByte = 0xD2EC;

//values used to load trainers
const rbTrainerPointersByte = 0x39D3B; // The pointers to the trainer groups start at byte 0x39D3B in Red and Blue
const yTrainerPointersByte = 0x39DD1; // The pointers to the trainer groups start at byte 0x39DD1 in Yellow
const rbTrainerStartByte = 0x39D99; //The data for trainers starts at 0x39D99 in Red and Blue
const yTrainerStartByte = 0x39E2F; //The data for trainers starts at 0x39E2F in Yellow
//const trainerEndByte = 238893; //The last byte for trainers is 0x3A52D in Red and Blue.

const rbShopsStartByte = 0x2442; //The data for the pokemarts inventories starts at byte 0x2442
const yShopsStartByte = 0x233B; //The data for the pokemarts inventories starts at byte 0x233B

// These are for Red and Blue and are needed for adding/removing items from marts. 
// I'm removing this functionality since I couldn't find the pointers for Yellow.
//const shopPointerBytes = [0x1D4EA, 0x74CB6, 0x5C898, 0x00, 0x5C9E4, 0x5C92F, 0x560F8, 0x560FA, 0x48359, 0x49070, 0x49072, 0x1DD8B, 0x00, 0x75E81, 0x5D40C, 0x19C85];

function HexToDec(hexNum)
{
    let tensNum = 0;
    let onesNum = 0;

    tensNum = Math.floor(hexNum / 16);
    onesNum = hexNum % 16;

    return (tensNum * 10) + onesNum;
}

function DecToHex(decNum)
{
  let hexsNum = 0;
  let onesNum = 0;

  hexsNum = Math.floor(decNum / 10);
  onesNum = decNum % 10;

  return (hexsNum * 16) + onesNum;
}

export default {
  version: "RED/BLUE/YELLOW",
  rawBinArray: [],
  fileFilters: [
    { name: 'Gameboy ROM', extensions: ['gb', 'gbc'] }
    ],
  generation: 1,
  moveAnimations: rbyMoveAnimations,
  moveEffects: rbyMoveEffects,
  evolveStones: rbyStones,
  evolveTypes: rbyEvolveTypes,
  growthRates: rbyGrowthRates,
  damageModifiers: rbyDamageModifiers,
  //zoneNames: yZoneNames,
  items: rbyItems,
  numHighCritMoves: 4,
  defaultEvolution: {evolve: 1, evolveTo: 0, evolveLevel: 1, evolveStone: 10},
  loadData: thunk(async (actions, payload) => {
    actions.loadBinaryData(payload);
    actions.setVersion();
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
    // is this needed?
    state.rawBinArray = payload;
  }),
  setVersion: action((state, payload) => {
    let versionFirstLetter = state.rawBinArray[0x13C];
    // 0x59 = Y, for Yellow version.
    if (versionFirstLetter === 0x59){
      state.altVersion = true;
      state.maxShopItems = 102;
      state.maxEvosMovesBytes = 2206;
      state.maxTrainerBytes = 1923;
    } else {
      state.altVersion = false;
      state.maxShopItems = 100;
      state.maxEvosMovesBytes = 1990;
      state.maxTrainerBytes = 1941;
    }
  }),
  loadPokemonData: thunk( async (actions, payload, {getState, getStoreActions}) => {
    let pokemon = [];
    let currentEvosMovesByte, mewStartByte, pokedexStartByte, pokemonNameStartByte;
    if (getState().altVersion) {
      currentEvosMovesByte = yPokemonEvosMovesByte;
      mewStartByte = yMewStartByte;
      pokedexStartByte = yPokedexStartByte;
      pokemonNameStartByte = yPokemonNameStartByte;
    }else{
      currentEvosMovesByte = rbPokemonEvosMovesByte;
      mewStartByte = rbMewStartByte;
      pokedexStartByte = rbPokedexStartByte;
      pokemonNameStartByte = rbPokemonNameStartByte;
    }

    for(let i = 0; i < 150; i++){
      var currentPokemon = {};
      currentPokemon.id = i;
      currentPokemon.hp = getState().rawBinArray[pokemonStartByte + (i * 28) +1];
      currentPokemon.attack = getState().rawBinArray[pokemonStartByte + (i * 28) +2];
      currentPokemon.defense = getState().rawBinArray[pokemonStartByte + (i * 28) +3];
      currentPokemon.speed = getState().rawBinArray[pokemonStartByte + (i * 28) +4];
      currentPokemon.specialAttack = getState().rawBinArray[pokemonStartByte + (i * 28) +5];
      currentPokemon.specialDefense = 0;
      currentPokemon.totalStats = currentPokemon.hp + currentPokemon.attack + currentPokemon.defense + currentPokemon.speed + currentPokemon.specialAttack + currentPokemon.specialDefense;
      currentPokemon.type1 = getState().rawBinArray[pokemonStartByte + (i * 28) +6];
      currentPokemon.type2 = getState().rawBinArray[pokemonStartByte + (i * 28) +7];
      currentPokemon.catchRate = getState().rawBinArray[pokemonStartByte + (i * 28) + 8];
      currentPokemon.expYield = getState().rawBinArray[pokemonStartByte + (i * 28) + 9];
      currentPokemon.move1 = getState().rawBinArray[pokemonStartByte + (i * 28) + 15];
      currentPokemon.move2 = getState().rawBinArray[pokemonStartByte + (i * 28) + 16];
      currentPokemon.move3 = getState().rawBinArray[pokemonStartByte + (i * 28) + 17];
      currentPokemon.move4 = getState().rawBinArray[pokemonStartByte + (i * 28) + 18];
      currentPokemon.growthRate = getState().rawBinArray[pokemonStartByte + (i * 28) + 19];
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
    mew.id = 150;
    mew.hp = getState().rawBinArray[mewStartByte+1];
    mew.attack = getState().rawBinArray[mewStartByte+2];
    mew.defense = getState().rawBinArray[mewStartByte+3];
    mew.speed = getState().rawBinArray[mewStartByte+4];
    mew.specialAttack = getState().rawBinArray[mewStartByte+5];
    mew.specialDefense = 0;
    mew.totalStats = mew.hp + mew.attack + mew.defense + mew.speed + mew.specialAttack + mew.specialDefense;
    mew.type1 = getState().rawBinArray[mewStartByte +6];
    mew.type2 = getState().rawBinArray[mewStartByte +7];
    mew.catchRate = getState().rawBinArray[mewStartByte + 8];
    mew.expYield = getState().rawBinArray[mewStartByte + 9];
    mew.move1 = getState().rawBinArray[mewStartByte + 15];
    mew.move2 = getState().rawBinArray[mewStartByte + 16];
    mew.move3 = getState().rawBinArray[mewStartByte + 17];
    mew.move4 = getState().rawBinArray[mewStartByte + 18];
    mew.growthRate = getState().rawBinArray[mewStartByte + 19];
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
  savePokemonData: thunk(async(actions, payload, {getState, getStoreState, getStoreActions}) => {
    let workingArray = getState().rawBinArray;
    let currentEvosMovesByte, mewStartByte, pokedexStartByte, currentPointerByte, pointerBase;
    if (getState().altVersion) {
      currentEvosMovesByte = yPokemonEvosMovesByte;
      mewStartByte = yMewStartByte;
      pokedexStartByte = yPokedexStartByte;
      currentPointerByte = yPokemonEvosPointersByte;
      pointerBase = yPointerBase;
    }else{
      currentEvosMovesByte = rbPokemonEvosMovesByte;
      mewStartByte = rbMewStartByte;
      pokedexStartByte = rbPokedexStartByte;
      currentPointerByte = rbPokemonEvosPointersByte;
      pointerBase = rbPointerBase;
    }
    let pokemon = getStoreState().pokemon;

    for (let i = 0; i < 150; i++) //There are 151 pokemon in the game but Mew is stored separately from the others.
    {
        //basically just write all of the modify-able data back into its location in the binary array.
        workingArray[pokemonStartByte + (i * 28) + 1] = pokemon[i].hp;
        workingArray[pokemonStartByte + (i * 28) + 2] = pokemon[i].attack;
        workingArray[pokemonStartByte + (i * 28) + 3] = pokemon[i].defense;
        workingArray[pokemonStartByte + (i * 28) + 4] = pokemon[i].speed;
        workingArray[pokemonStartByte + (i * 28) + 5] = pokemon[i].specialAttack;
        workingArray[pokemonStartByte + (i * 28) + 6] = pokemon[i].type1;
        workingArray[pokemonStartByte + (i * 28) + 7] = pokemon[i].type2;
        workingArray[pokemonStartByte + (i * 28) + 8] = pokemon[i].catchRate;
        workingArray[pokemonStartByte + (i * 28) + 9] = pokemon[i].expYield;
        workingArray[pokemonStartByte + (i * 28) + 15] = pokemon[i].move1;
        workingArray[pokemonStartByte + (i * 28) + 16] = pokemon[i].move2;
        workingArray[pokemonStartByte + (i * 28) + 17] = pokemon[i].move3;
        workingArray[pokemonStartByte + (i * 28) + 18] = pokemon[i].move4;
        workingArray[pokemonStartByte + (i * 28) + 19] = pokemon[i].growthRate;
        let tmArray = [];

        for(let j = 0; j < 7; j++){ //each byte
          let tmByte = 0;
          for(let b = 0; b < 8; b++){ //each bit
            if (pokemon[i].tms[(j * 8 + b)]){
              tmByte += Math.pow(2, b);
            }
          }
          tmArray.push(tmByte);
        }

        workingArray[pokemonStartByte + (i * 28) + 20] = tmArray[0];
        workingArray[pokemonStartByte + (i * 28) + 21] = tmArray[1];
        workingArray[pokemonStartByte + (i * 28) + 22] = tmArray[2];
        workingArray[pokemonStartByte + (i * 28) + 23] = tmArray[3];
        workingArray[pokemonStartByte + (i * 28) + 24] = tmArray[4];
        workingArray[pokemonStartByte + (i * 28) + 25] = tmArray[5];
        workingArray[pokemonStartByte + (i * 28) + 26] = tmArray[6];
    }


    // Mew
    workingArray[mewStartByte + 1] = pokemon[150].hp;
    workingArray[mewStartByte + 2] = pokemon[150].attack;
    workingArray[mewStartByte + 3] = pokemon[150].defense;
    workingArray[mewStartByte + 4] = pokemon[150].speed;
    workingArray[mewStartByte + 5] = pokemon[150].specialAttack;
    workingArray[mewStartByte + 6] = pokemon[150].type1;
    workingArray[mewStartByte + 7] = pokemon[150].type2;
    workingArray[mewStartByte + 8] = pokemon[150].catchRate;
    workingArray[mewStartByte + 9] = pokemon[150].expYield;
    workingArray[mewStartByte + 15] = pokemon[150].move1;
    workingArray[mewStartByte + 16] = pokemon[150].move2;
    workingArray[mewStartByte + 17] = pokemon[150].move3;
    workingArray[mewStartByte + 18] = pokemon[150].move4;
    workingArray[mewStartByte + 19] = pokemon[150].growthRate;
    let tmArray = [];
    for(let j = 0; j < 7; j++){ //each byte
      let tmByte = 0;
      for(let b = 0; b < 8; b++){ //each bit
        if (pokemon[150].tms[(j * 8 + b)]){
          tmByte += Math.pow(2, b);
        }
      }
      tmArray.push(tmByte);
    }
    workingArray[mewStartByte + 20] = tmArray[0];
    workingArray[mewStartByte + 21] = tmArray[1];
    workingArray[mewStartByte + 22] = tmArray[2];
    workingArray[mewStartByte + 23] = tmArray[3];
    workingArray[mewStartByte + 24] = tmArray[4];
    workingArray[mewStartByte + 25] = tmArray[5];
    workingArray[mewStartByte + 26] = tmArray[6];


    for(let i = 0; i < 190; i++)
    {
      //update pointers so the game knows where to find the updated pokemon evos/learned moves.
      // The data in the pointers is how many bytes to move past byte 0x34000 in order to find the start of that pokemon data.
      // 2 bytes per pokemon.
      let secondPointerByte = Math.floor((currentEvosMovesByte - pointerBase) / 256);
      let firstPointerByte = (currentEvosMovesByte - pointerBase) - (secondPointerByte * 256);
      workingArray[currentPointerByte++] = firstPointerByte;
      workingArray[currentPointerByte++] = secondPointerByte;

      if (pokedexIDs.get(i+1) !== undefined) //lookup the pokedex ID so we can skip missingnos
      {
        //evolutions
        let indexfound = workingArray[pokedexStartByte + i] - 1;
        pokemon[indexfound].evolutions.forEach((e) => {
          if (e.evolve === 1)
            {
              workingArray[currentEvosMovesByte++] = 1;
              workingArray[currentEvosMovesByte++] = e.evolveLevel;
              workingArray[currentEvosMovesByte++] = indexIDs.get(e.evolveTo +1);
            }
            else if (e.evolve === 2)
            {
              workingArray[currentEvosMovesByte++] = 2;
              workingArray[currentEvosMovesByte++] = e.evolveStone;
              workingArray[currentEvosMovesByte++] = 1;
              workingArray[currentEvosMovesByte++] = indexIDs.get(e.evolveTo +1);
            }
            else if (e.evolve === 3)
            {
              workingArray[currentEvosMovesByte++] = 3;
              workingArray[currentEvosMovesByte++] = 1;
              workingArray[currentEvosMovesByte++] = indexIDs.get(e.evolveTo +1);
            }
        });
        workingArray[currentEvosMovesByte++] = 0;

        pokemon[indexfound].learnedMoves.forEach((m) => {
          workingArray[currentEvosMovesByte++] = m.level;
          workingArray[currentEvosMovesByte++] = m.moveID;
        });
        workingArray[currentEvosMovesByte++] = 0;
      }
      else
      {
        //write 2 zeroes for missingnos. 1 for no evolution, 1 for no moves
        workingArray[currentEvosMovesByte++] = 0;
        workingArray[currentEvosMovesByte++] = 0;
      }
    }
  }),
  loadPokemonTypes: thunk ( async (actions, payload, {getState, getStoreActions}) => {
    let types = [];
    let newType;
    let typesPointer;
    if (getState().altVersion) {
      typesPointer = yTypesPointer;
    }else{
      typesPointer = rbTypesPointer;
    }
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

    getStoreActions().setPokemonTypes(types);
  }),
  savePokemonTypes: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    /*
      If you check your file against a binary comparison tool and see that there are un-expected changes in the pokemon pointers, don't be alarmed.
      In the original ROM the names are stored in the order: Normal, Fighting, Flying, Poison, Fire, Water, Grass, Electric, Psychic, Ice,
        Ground, Rock, Bird (this isn't used in the game, but it does exist), Bug, Ghost, Dragon.
      The reason it gets out of order is because when it saves it just loops over the types in the order that their pointers were found,
      which goes: All physical types, the 11 ununsed types that point to "Normal", then all of the special types.
      The reordering of the names does not change any functionality in the game.
    */
    
    let romData = getState().rawBinArray;
    let pokemonTypes = getStoreState().pokemonTypes;
    let typesPointer, endOfOriginalSpace, blankDataStartByte, endOfBank;
    if (getState().altVersion) {
      typesPointer = yTypesPointer;
      endOfOriginalSpace = 0x27DFF; // this is the first byte of some data that is between the type names and the extra space at the end of the bank.
      blankDataStartByte = 0x27F3B; // there is some extra space at the end of the bank. This is the first byte of that space.
      endOfBank = 0x27FFF; // End of the bank. Can't go past this.
    }else{
      typesPointer = rbTypesPointer;
      endOfOriginalSpace = 0x27E4A; // this is the first byte of some data that is between the type names and the extra space at the end of the bank.
      blankDataStartByte = 0x27FB8; // there is some extra space at the end of the bank. This is the first byte of that space.
      endOfBank = 0x27FFF; // End of the bank. Can't go past this.
    }
   
    let firstPointerByte;
    let secondPointerByte;

    //setup a class that will help us track where we are saving data.
    let romBank = new RomBank(typesPointer + typesBankByte, endOfBank);

    //get a reference to the block of data that we don't want to overwrite.
    let saveFunctionBlock = romBank.addDataBlock(endOfOriginalSpace, blankDataStartByte - 1);

    let numOfPointerBytes = pokemonTypes.length * 2; // there are 2 bytes for each pointer and we need a pointer for each type even if it is not used.
    let currentPointerByte = typesBankByte + typesPointer; // this is the beginning of the pointers.
    let currentNamesByte = currentPointerByte + numOfPointerBytes; //this is where we will start writing the names.

    //get a reference to the block of data that has the pointers.
    let pointersBlock = romBank.addDataBlock(currentPointerByte, currentNamesByte - 1);

    let firstNamesByte = currentNamesByte; // save the first name location for the types that aren't used.

    for(let i = 0; i < pokemonTypes.length; i++)
    {
      if(pokemonTypes[i].typeIsUsed === true) // if the type is used point to the correct name.
      {
        // check our bank to find where our free space is located.
        currentNamesByte = romBank.hasRoomAt(pokemonTypes[i].typeName.length+1);

        // if there is no space it will return negative.
        if(currentNamesByte >= 0)
        {
          romBank.addData(currentNamesByte, pokemonTypes[i].typeName.length+1);
          secondPointerByte = Math.floor((currentNamesByte - typesBankByte) / 256);
          firstPointerByte = (currentNamesByte - typesBankByte) - (secondPointerByte * 256);
          // write the pointer to the name
          romData[currentPointerByte++] = firstPointerByte;
          romData[currentPointerByte++] = secondPointerByte;

          // write the name
          pokemonTypes[i].typeName.split("").forEach((c) => {
            romData[currentNamesByte] = getKeyByValue(rbygsLetters, c);
            currentNamesByte++;
          });
          romData[currentNamesByte] = 0x50;

        }
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
  }),
  loadPokemonMoves: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let moves = [];
    let moveToAdd;
    let moveName;
    let highCritMovesStartByte, currentMoveNameByte;
    if (getState().altVersion) {
      highCritMovesStartByte = 0x3E190;
      currentMoveNameByte = yMoveNamesByte;
    }else{
      highCritMovesStartByte = 0x3E08E;
      currentMoveNameByte = rbMoveNamesByte;
    }

    let highCritMoves = [];

    for (let i = 0; i < getState().numHighCritMoves; i++){
      highCritMoves.push(getState().rawBinArray[highCritMovesStartByte + i]);
    }

    moveToAdd = {}; //The ROM uses 0x00 for blank starter moves in the pokemon base stats section.
    moveToAdd.id = 0;
    moveToAdd.name = "nothing";
    moveToAdd.power = 0;
    moveToAdd.accuracy = 0;
    moveToAdd.pp = 0;
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
        moveToAdd.highCrit = false;

        if(highCritMoves.includes(moveToAdd.id)){
          moveToAdd.highCrit = true;
        }

        moves.push(moveToAdd);
    }
    getStoreActions().setMovesArray(moves);
    //return moves;
  }),
  savePokemonMoves: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let moves = getStoreState().moves;
    
    let highCritMovesStartByte, currentMoveNameByte;
    if (getState().altVersion) {
      highCritMovesStartByte = 0x3E190;
      currentMoveNameByte = yMoveNamesByte;
    }else{
      highCritMovesStartByte = 0x3E08E;
      currentMoveNameByte = rbMoveNamesByte;
    }
    
    let highCritMoves = [];

    for(let i = 0; i < 165; i++)
    {
        romData[movesStartingByte + (i * 6)] = moves[i + 1].animationID;
        romData[movesStartingByte + (i * 6) + 1] = moves[i + 1].effect;
        romData[movesStartingByte + (i * 6) + 2] = moves[i + 1].power;
        romData[movesStartingByte + (i * 6) + 3] = moves[i + 1].moveType;
        romData[movesStartingByte + (i * 6) + 4] = moves[i + 1].accuracy;
        romData[movesStartingByte + (i * 6) + 5] = moves[i + 1].pp;

        moves[i + 1].name.split("").forEach((c) => {
          romData[currentMoveNameByte] = getKeyByValue(rbygsLetters, c);
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
  loadTMs: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let tms = [];
    let tmStartByte, tmPricesStartByte;
    if (getState().altVersion) {
      tmStartByte = yTmStartByte;
      tmPricesStartByte = yTmPricesStartByte;
    }else{
      tmStartByte = rbTmStartByte;
      tmPricesStartByte = rbTmPricesStartByte;
    }

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
  saveTMs: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let tms = getStoreState().tms;

    let tmStartByte, tmPricesStartByte;
    if (getState().altVersion) {
      tmStartByte = yTmStartByte;
      tmPricesStartByte = yTmPricesStartByte;
    }else{
      tmStartByte = rbTmStartByte;
      tmPricesStartByte = rbTmPricesStartByte;
    }

    for (let i = 0; i < 55; i++) //There are 50 TMs and 5 HMs. Each is 1 byte which is the moveID
    {
        romData[tmStartByte + i] = tms[i].move;
    }
    for(let i = 0; i < 25; i++)
    {
        let price = tms[i * 2].price * 16 + tms[i * 2 + 1].price;
        romData[tmPricesStartByte + i] = price;
    }

  }),
  loadItems: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let items = [];
    let itemToAdd, itemPricesStartByte;
    if (getState().altVersion) {
      itemPricesStartByte = yItemPricesStartByte;
    }else{
      itemPricesStartByte = rbItemPricesStartByte;
    }

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

    getStoreActions().setItems(items);
  }),
  saveItems: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let items = getStoreState().items;
    let currentByte;
    if (getState().altVersion) {
      currentByte = yItemPricesStartByte;
    }else{
      currentByte = rbItemPricesStartByte;
    }

    for(let i = 0; i < items.length; i++){
      if(i < 83){
        let price = items[i].price;
        let firstPriceByte = DecToHex(Math.floor(price / 10000));
        price -= (HexToDec(firstPriceByte) * 10000);
        let secondPriceByte = DecToHex(Math.floor(price / 100));
        price -= (HexToDec(secondPriceByte) * 100);
        let thirdPriceByte = DecToHex(price);

        romData[currentByte++] = firstPriceByte;
        romData[currentByte++] = secondPriceByte;
        romData[currentByte++] = thirdPriceByte;
      }
      else {
        break;
      }
    }

  }),
  loadTypeMatchups: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let typeMatchups = [];

    let typeChartByte;
    if (getState().altVersion) {
      typeChartByte = yTypeChartByte;
    }else{
      typeChartByte = rbTypeChartByte;
    }

    for (let i = 0; i < 82; i++) //There are 82 type strengths. Each is 3 bytes and the group is terminated by the byte FF.
    {
        if(getState().rawBinArray[typeChartByte + (i * 3)] !== 0xFF) // Since we are checking the ending byte this can be converted to a while loop?
        {
          let typeMatchupToAdd = {};
          typeMatchupToAdd.attackType = getState().rawBinArray[typeChartByte + (i * 3)]; //first byte is the attacking type
          typeMatchupToAdd.defenseType = getState().rawBinArray[typeChartByte + (i * 3) + 1]; //second byte is the defending type
          typeMatchupToAdd.effectiveness = getState().rawBinArray[typeChartByte + (i * 3) + 2]; //third byte is effectiveness X 10. So double damage = 20, half damage = 5.
          typeMatchupToAdd.foresight = false;
          typeMatchups.push(typeMatchupToAdd);
        }
        else
        {
            break;
        }
    }
    getStoreActions().setTypeMatchups(typeMatchups);
  }),
  saveTypeMatchups: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let typeMatchups = getStoreState().typeMatchups;
    let currentByte;
    if (getState().altVersion) {
      currentByte = yTypeChartByte;
    }else{
      currentByte = rbTypeChartByte;
    }

    for(let i = 0; i < typeMatchups.length; i++){
      romData[currentByte++] = typeMatchups[i].attackType;
      romData[currentByte++] = typeMatchups[i].defenseType;
      romData[currentByte++] = typeMatchups[i].effectiveness;
    }
    romData[currentByte++] = 0xFF; //writing the ending byte manually in case the user removed some type strengths.

  }),
  loadEncounters: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let zones = [];
    let currentByte, zoneNames, zonesWithWater, waterOnlyZones, wildEncountersEndByte;
    if (getState().altVersion) {
      currentByte = yWildEncountersByte;
      zoneNames = yZoneNames;
      zonesWithWater = [13,14,19,20,28,29,39,40,44,45,46,47,52,53];
      waterOnlyZones = [39, 40];
      wildEncountersEndByte = yWildEncountersEndByte;
    }else{
      currentByte = rbWildEncountersByte;
      zoneNames = rbZoneNames;
      zonesWithWater = [36, 46, 47];
      waterOnlyZones = [36];
      wildEncountersEndByte = rbWildEncountersEndByte;
    }

    while (currentByte < wildEncountersEndByte)
    {
        if(waterOnlyZones.includes(zones.length)) // Skip a byte for water only routes.
        {
            currentByte++;
        }
        if(getState().rawBinArray[currentByte] !== 0) //The zones that dont have encounters are marked with 0 for the first byte.
        {
            let newZone = {};
            newZone.encounterRate = getState().rawBinArray[currentByte++];
            newZone.name = zoneNames[zones.length];
            newZone.encounters = [];
            // If the zone has encounters it has 10 slots, each with 2 bytes. The slot determines the chance of the pokemon appearing in a random encounter
            // The first byte is the pokemon's level and the 2nd is the index ID. We are converting to pokedex IDs for display purposes.
            for(let i = 0; i < 10; i++){
              let encounter = {};
              encounter.level = getState().rawBinArray[currentByte++]
              encounter.pokemon = pokedexIDs.get(getState().rawBinArray[currentByte++]);
              encounter.chance = rbyGrassEncChances[i];
              newZone.encounters.push(encounter);
            }

            if (!zonesWithWater.includes(zones.length)) //For zones that don't have water we skip over the water enc rate byte
            {
                currentByte++;
            }
            zones.push(newZone);
        }
        else // Zones with no encounters have only 2 bytes
        {
            currentByte += 2;
        }
    }
    getStoreActions().setEncounterZones(zones);
  }),
  saveEncounters: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let zones = getStoreState().encounterZones;
    let currentByte, zonesWithWater, waterOnlyZones, numOfZones, route7Index;
    if (getState().altVersion) {
      currentByte = yWildEncountersByte;
      zonesWithWater = [13,14,19,20,28,29,39,40,44,45,46,47,52,53];
      waterOnlyZones = [39, 40];
      numOfZones = 63;
      route7Index = 22;
    }else{
      currentByte = rbWildEncountersByte;
      zonesWithWater = [36, 46, 47];
      waterOnlyZones = [36];
      numOfZones = 57;
      route7Index = 20;
    }

    for (let i = 0; i < numOfZones; i++)
    {
      if(waterOnlyZones.includes(i)) //There's an extra byte at the beginning of these zone
      {
        romData[currentByte++] = 0;
      }
      romData[currentByte++] = zones[i].encounterRate;
      for(let k = 0; k < zones[i].encounters.length; k++){
        romData[currentByte++] = zones[i].encounters[k].level;
        romData[currentByte++] = indexIDs.get(zones[i].encounters[k].pokemon +1);
      }

      if(!zonesWithWater.includes(i)) //there's no ending byte for these, so skip them.
      {
          romData[currentByte++] = 0;
      }
      if(i === route7Index) //These 4 bytes are the first 2 floors of the pokemon tower. The data for them comes after Route 7.
      {
          romData[currentByte++] = 0;
          romData[currentByte++] = 0;
          romData[currentByte++] = 0;
          romData[currentByte++] = 0;
      }
    }

  }),
  loadTrainers: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let trainers = [];
    let currentByte, numOfTrainers, unusedTrainers, trainerCounts;
    if (getState().altVersion) {
      currentByte = yTrainerStartByte;
      numOfTrainers = 396;
      unusedTrainers = yUnusedTrainers;
      trainerCounts = yTrainerCounts;
    }else{
      currentByte = rbTrainerStartByte;
      numOfTrainers = 391;
      unusedTrainers = rbUnusedTrainers;
      trainerCounts = rbTrainerCounts;
    }
    let trainerGroupTracker = 0; // tells which name to pull from the dictionary
    let numOfTrainersInGroup = 0;
    let trainerID = 0;

    while (trainers.length < numOfTrainers)
    {
        let trainerToAdd = {};
        trainerToAdd.id = trainerID++;
        trainerToAdd.pokemon = [];
        if(getState().rawBinArray[currentByte] === 255) // trainers who have pokemon of different levels are marked with 0xFF as the 1st byte
        {
            trainerToAdd.allSameLevel = false;
            currentByte++;
            trainerToAdd.partyLevel = getState().rawBinArray[currentByte];
            while(getState().rawBinArray[currentByte] !== 0)
            {
                trainerToAdd.pokemon.push({
                  level: getState().rawBinArray[currentByte++],
                  pokemon: pokedexIDs.get(getState().rawBinArray[currentByte++])
                });
            }
        }
        else // if the first byte isn't 0xFF then it is the level for all of the pokemon in the team.
        {
            trainerToAdd.allSameLevel = true;
            trainerToAdd.partyLevel = getState().rawBinArray[currentByte++];
            while(getState().rawBinArray[currentByte] !== 0) //list of pokemon ending with 0.
            {
                trainerToAdd.pokemon.push({
                  level: trainerToAdd.partyLevel,
                  pokemon: pokedexIDs.get(getState().rawBinArray[currentByte++])
                });
            }
        }
        currentByte++;

        let trainerName = `${rbyTrainerNames[trainerGroupTracker]} ${numOfTrainersInGroup +1}`;
        if (unusedTrainers.includes(trainers.length))
        {
            trainerName += " (unused)";
        }
        trainerToAdd.name = trainerName;
        numOfTrainersInGroup++;

        while(numOfTrainersInGroup === trainerCounts[trainerGroupTracker] && trainerGroupTracker < 46)
        {
            trainerGroupTracker++;
            numOfTrainersInGroup = 0;
        }
        trainers.push(trainerToAdd);
    }
    getStoreActions().setTrainers(trainers);
  }),
  saveTrainers: thunk (async (action, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let trainers = getStoreState().trainers.sort((a,b) => a.id < b.id ? -1 : 1); // sort the trainers by ID so they get saved in the correct order.

    let currentTrainerGroup = 0;
    let numOfTrainers = 0;
    let currentByte, trainerCounts, currentPointerByte, pointerBase;
    if (getState().altVersion) {
      currentByte = yTrainerStartByte;
      trainerCounts = yTrainerCounts;
      currentPointerByte = yTrainerPointersByte;
      pointerBase = yPointerBase;
    }else{
      currentByte = rbTrainerStartByte;
      trainerCounts = rbTrainerCounts;
      currentPointerByte = rbTrainerPointersByte;
      pointerBase = rbPointerBase;
    }


    for(let i = 0; i < trainers.length; i++)
    {
      if(numOfTrainers === 0)
      {
        //update pointers so the game knows where to find the updated trainer groups.
        // The data in the pointers is how many bytes to move past byte 0x34000 in order to find the start of that trainer group.
        // 2 bytes per trainer.
        let secondPointerByte = Math.floor((currentByte - pointerBase) / 256);
        let firstPointerByte = (currentByte - pointerBase) - (secondPointerByte * 256);
        romData[currentPointerByte++] = firstPointerByte;
        romData[currentPointerByte++] = secondPointerByte;

        //There are 2 trainer groups that aren't used. they have the same pointers as the groups that come after them so I'm just writing those groups twice.
        if (currentTrainerGroup === 12 || currentTrainerGroup === 25)
        {
          romData[currentPointerByte++] = firstPointerByte;
          romData[currentPointerByte++] = secondPointerByte;
        }
      }

      if (trainers[i].allSameLevel)
      {
        romData[currentByte++] = trainers[i].partyLevel;
        for(let p = 0; p < trainers[i].pokemon.length; p++)
        {
          romData[currentByte++] = indexIDs.get(trainers[i].pokemon[p].pokemon + 1);
        }
        romData[currentByte++] = 0;
      }
      else
      {
        romData[currentByte++] = 0xFF;
        for(let p = 0; p < trainers[i].pokemon.length; p++)
        {
          romData[currentByte++] = trainers[i].pokemon[p].level;
          romData[currentByte++] = indexIDs.get(trainers[i].pokemon[p].pokemon + 1);
        }
        romData[currentByte++] = 0;
      }

      numOfTrainers++;
      if(numOfTrainers === trainerCounts[currentTrainerGroup])
      {
        currentTrainerGroup++;
        numOfTrainers = 0;
      }
    }
  }),
  loadShops: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let shops = [];

    let currentByte;
    if (getState().altVersion) {
      currentByte = yShopsStartByte;
    }else{
      currentByte = rbShopsStartByte;
    }

    for (let i = 0; i < 16; i++)
    {
        let newShop = {};
        newShop.name = rbyShopNames[i];
        newShop.items = [];
        currentByte += 2; //Skip the first 2 bytes. The first byte is always 0xFE and the 2nd is the number of items for sale.
        while(getState().rawBinArray[currentByte] !== 0xFF) //the end of the shop is marked by 0xFF
        {
            newShop.items.push({item: getState().rawBinArray[currentByte++]});
        }
        shops.push(newShop);
        currentByte++;
    }

    getStoreActions().setShops(shops);
  }),
  saveShops: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let shops = getStoreState().shops;

    let currentByte;
    if (getState().altVersion) {
      currentByte = yShopsStartByte;
    }else{
      currentByte = rbShopsStartByte;
    }

    for (let i = 0; i < 16; i++)
    {
        /*
        // Removing this for now because I don't have a good way of telling where the Yellow version pointers are stored.
        // If I ever find it I will add this back in.
        //first update pointers to the new location of the shop's data.
        //the game stores these pointers along with the pointers to the text data.
        if(shopPointerBytes[i] !== 0x00) //there are 2 pointers that aren't used. We don't need to update them
        {
            let secondPointerByte = Math.floor((currentByte) / 256);
            let firstPointerByte = (currentByte) - (secondPointerByte * 256);
            romData[shopPointerBytes[i]] = firstPointerByte;
            romData[shopPointerBytes[i]+1] = secondPointerByte;
        }
        */

        //next update the shop data.
        //The first byte is always 0xFE and the 2nd is the number of items for sale.
        romData[currentByte++] = 0xFE;
        romData[currentByte++] = shops[i].items.length;

        for(let k = 0; k < shops[i].items.length; k++)
        {
            romData[currentByte++] = shops[i].items[k].item;
        }
        romData[currentByte++] = 0xFF; //mark end of shop
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
  })
}