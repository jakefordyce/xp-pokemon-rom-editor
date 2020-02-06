import { thunk, action } from "easy-peasy";
import {rbygsLetters, rbyMoveAnimations, rbyMoveEffects, rbyItems, rbyEvolveTypes, rbyStones, rbyGrowthRates,
  rbyDamageModifiers, rbyZoneNames, rbyGrassEncChances, rbTrainerNames, rbTrainerCounts, rbUnusedTrainers, rbyShopNames,
  getKeyByValue} from './utils';
import RomBank from './romBank';
const remote = require('electron').remote;
const dialog = remote.dialog;
const fs = remote.require('fs');

//values used to load pokemon stats and moves.
const mewStartByte = 16987; // Mew's stats start at byte 0x425B
const pokemonNameStartByte = 115230; //Pokemon names start at byte 0x1c21e and also run in Index order.
const pokemonEvosMovesByte = 242136; //Pokemon evolutions and moves learned through leveling are stored together starting at byte 0x3B1D8.
const pokemonStartByte = 230366; //Pokemon data starts at byte 0x383DE. It goes in Pokedex order, Bulbasaur through Mewtwo.
const pokedexStartByte = 266276; //List of pokedex IDs start at byte 0x41024 and run in Index order, Rhydon through Victreebel.
let pokedexIDs = new Map();
let indexIDs = new Map();
const pokemonEvosPointersByte = 241756; //The pointers to the pokemon Evolutions and learned moves start at byte 0x3B05C.
const pointerBase = 212992; //this is the value that is added to the pointers to get the location of evolutions/moves and trainer data

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
//values used to load wild encounters
const wildEncountersByte = 53471; //The data for wild encounters start at 0xD0DE but the first one is empty so I skip it.
const wildEncountersEndByte = 54727;
//values used to load trainers
const trainerPointersByte = 236859; // The pointers to the trainer groups start at byte 0x39D3B
const trainerStartByte = 236953; //The data for trainers starts at 0x39D99
const trainerEndByte = 238893; //The last byte for trainers is 0x3A52D

const shopsStartByte = 9282; //The data for the pokemarts inventories starts at byte 0x2442
const shopPointerBytes = [0x1D4EA, 0x74CB6, 0x5C898, 0x00, 0x5C9E4, 0x5C92F, 0x560F8, 0x560FA, 0x48359, 0x49070, 0x49072, 0x1DD8B, 0x00, 0x75E81, 0x5D40C, 0x19C85];

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
  growthRates: rbyGrowthRates,
  damageModifiers: rbyDamageModifiers,
  zoneNames: rbyZoneNames,
  items: rbyItems,
  maxEvosMovesBytes: 1990,
  maxTrainerBytes: 1941,
  maxShopItems: 100,
  defaultEvolution: {evolve: 1, evolveTo: 0, evolveLevel: 1, evolveStone: 10},
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
  loadPokemonData: thunk( async (actions, payload, {getState, getStoreActions}) => {
    let pokemon = [];
    let currentEvosMovesByte = pokemonEvosMovesByte;

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
    let currentEvosMovesByte = pokemonEvosMovesByte;
    let currentPointerByte = pokemonEvosPointersByte;
    let pokemon = getStoreState().pokemon;

    for (let i = 0; i < 150; i++) //There are 151 pokemon in the game but Mew is stored separately from the others.
    {
        //basically just write all of the modify-able data back into its location in the binary array.
        workingArray[pokemonStartByte + (i * 28) + 1] = pokemon[i].hp;
        workingArray[pokemonStartByte + (i * 28) + 2] = pokemon[i].attack;
        workingArray[pokemonStartByte + (i * 28) + 3] = pokemon[i].defense;
        workingArray[pokemonStartByte + (i * 28) + 4] = pokemon[i].speed;
        workingArray[pokemonStartByte + (i * 28) + 5] = pokemon[i].special;
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
    workingArray[mewStartByte + 5] = pokemon[150].special;
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
      let secondPointerByte = (currentEvosMovesByte - pointerBase) / 256;
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
  savePokemonTypes: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let pokemonTypes = getStoreState().pokemonTypes;

    let endOfOriginalSpace = 0x27e4a; // this is the first byte of some data that is between the type names and the extra space at the end of the bank.
    let blankDataStartByte = 0x27fb8; // there is some extra space at the end of the bank. This is the first byte of that space.
    //int endOfBank = 0x28000; // this is the first byte of the next bank. We can't write on this byte or any after it.
    let firstPointerByte;
    let secondPointerByte;

    //setup a class that will help us track where we are saving data.
    let romBank = new RomBank(typesPointer + typesBankByte, 0x27fff);

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
  savePokemonMoves: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let currentMoveNameByte = moveNamesByte;
    let romData = getState().rawBinArray;
    let moves = getStoreState().moves;

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
    }
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
  saveTMs: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let tms = getStoreState().tms;

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
    
    getStoreActions().setItems(items);
  }),
  saveItems: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let items = getStoreState().items;
    let currentByte = itemPricesStartByte;

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
  saveTypeMatchups: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let typeMatchups = getStoreState().typeMatchups;
    let currentByte = typeChartByte;

    for(let i = 0; i < typeMatchups.length; i++){
      romData[currentByte++] = typeMatchups[i].attackType;
      romData[currentByte++] = typeMatchups[i].defenseType;
      romData[currentByte++] = typeMatchups[i].effectiveness;
    }
    romData[currentByte++] = 0xFF; //writing the ending byte manually in case the user removed some type strengths.

  }),
  loadEncounters: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let zones = [];
    let currentByte = wildEncountersByte;

    while (currentByte < wildEncountersEndByte)
    {
        if(zones.length === 36) // There's an extra byte at the beginning of this data.
        {
            currentByte++;
        }                
        if(getState().rawBinArray[currentByte] !== 0) //The zones that dont have encounters are marked with 0 for the first byte.
        {
            let newZone = {};
            newZone.encounterRate = getState().rawBinArray[currentByte++];
            newZone.name = rbyZoneNames[zones.length];
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
            
            if (zones.length !== 36 && zones.length !== 46 && zones.length !== 47) //There's no ending byte at the end of these 3 zones.
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
    //console.log(encounters);
    getStoreActions().setEncounterZones(zones);
  }),
  saveEncounters: thunk (async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let zones = getStoreState().encounterZones;
    
    let currentByte = wildEncountersByte;
    for (let i = 0; i < 57; i++)
    {
      if(i === 36) //There's an extra byte at the beginning of this zone
      {
        romData[currentByte++] = 0;
      }
      romData[currentByte++] = zones[i].encounterRate;
      for(let k = 0; k < zones[i].encounters.length; k++){
        romData[currentByte++] = zones[i].encounters[k].level;
        romData[currentByte++] = indexIDs.get(zones[i].encounters[k].pokemon +1);
      }
      
      if(i !== 36 && i !== 46 && i !== 47) //there's no ending byte for these 3
      {
          romData[currentByte++] = 0;
      }
      if(i === 20) //These 4 bytes are the first 2 floors of the pokemon tower. The data for them comes after Route 7.
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
    let currentByte = trainerStartByte;
    let trainerGroupTracker = 0; // tells which name to pull from the dictionary
    let numOfTrainersInGroup = 0;

    while (trainers.length < 391)
    {
        let trainerToAdd = {};
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
        
        let trainerName = `${rbTrainerNames[trainerGroupTracker]} ${numOfTrainersInGroup +1}`;
        if (rbUnusedTrainers.includes(trainers.length))
        {
            trainerName += " (unused)";
        }
        trainerToAdd.name = trainerName;

        //trainerToAdd.GroupNum = trainerGroupTracker + 201;
        //trainerToAdd.TrainerNum = numOfTrainersInGroup + 1;

        numOfTrainersInGroup++;
        while(numOfTrainersInGroup === rbTrainerCounts[trainerGroupTracker] && trainerGroupTracker < 46)
        {
            trainerGroupTracker++;
            numOfTrainersInGroup = 0;
        }
        trainers.push(trainerToAdd);
    }

    //console.log(trainers);
    getStoreActions().setTrainers(trainers);
  }),
  saveTrainers: thunk (async (action, payload, {getState, getStoreState, getStoreActions}) => {
    let romData = getState().rawBinArray;
    let trainers = getStoreState().trainers;

    let currentByte = trainerStartByte;
    let currentTrainerGroup = 0;
    let numOfTrainers = 0;
    let currentPointerByte = trainerPointersByte;
    

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
      if(numOfTrainers === rbTrainerCounts[currentTrainerGroup])
      {
        currentTrainerGroup++;
        numOfTrainers = 0;
      }
    }
  }),
  loadShops: thunk (async (actions, payload, {getState, getStoreActions}) => {
    let shops = [];
    let currentByte = shopsStartByte;

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

    let currentByte = shopsStartByte;
    for (let i = 0; i < 16; i++)
    {                
        //first update pointers to the new location of the shop's data.
        //the game stores these pointers along with the pointers to the text data.
        if(shopPointerBytes[i] !== 0x00) //there are 2 pointers that aren't used. We don't need to update them
        {                    
            let secondPointerByte = Math.floor((currentByte) / 256);
            let firstPointerByte = (currentByte) - (secondPointerByte * 256);
            romData[shopPointerBytes[i]] = firstPointerByte;
            romData[shopPointerBytes[i]+1] = secondPointerByte;
        }

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
  saveFileAs: thunk(async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    dialog.showSaveDialog({
      title: 'Save ROM',
      filters: getState().fileFilters
    }).then((res) => {
      //console.log("file path: " + res.filePath);
      getStoreActions().setCurrentFile(res.filePath);
      actions.savePokemonData();
      actions.savePokemonMoves();
      actions.saveTMs();
      actions.saveItems();
      actions.savePokemonTypes();
      actions.saveTypeMatchups();
      actions.saveEncounters();
      actions.saveTrainers();
      actions.saveShops();

      fs.writeFileSync(res.filePath, getState().rawBinArray, 'base64');      
    }).catch((err) => {
      console.log(err);
    });
  })
}