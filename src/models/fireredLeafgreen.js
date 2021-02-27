import { thunk, action } from "easy-peasy";
import {gscDamageModifiers, gen3Letters, g3MoveAnimations, g3MoveEffects, g3EvolveTypes, g3Stones, g3TradeItems, g3GrowthRates,
  g3ZoneNames, g3GrassEncChances, gsTrainerTypes, g3WaterEncChances,
  getKeyByValue, g3MoveTargets, g3FishingEncChances, g3Abilities} from './utils';


const pokemonNameStartByte = 0x245F5B; //Pokemon names start here and run Pokedex order with Chimecho at the end, out of order.
const pokemonMovesStart = 0x257504; //In Firered the learned moves are stored separately from evolutions.
const pokemonStartByte = 0x25480F; //Pokemon base stats data starts here. It goes in Pokedex order, Bulbasaur through Deoxys. Chimecho is at the end, out of order.
const pokemonMovesPointers = 0x25D828;//The first pointer is a dup pointer to bulbasaur's moves so I skipped it.
const pokemonEvolutionsStart = 0x2597EC;
const pointerBase = 0x3C000;
const pokemonTMStart = 0x252C40;

//values used to load the pokemon types
const typesByte = 0x24F210; //
const typeChartByte = 0x24F0C0;

//values used to load the moves
const moveNamesByte = 0x247111;
const movesStartingByte = 0x250C80; //The move data starts.
const moveAnimationsStart = 0x1C6968;
const moveDescPointer = 0x1B4000;
const moveDescBank = 0x1B0000;
const moveDescStartByte = 0x1B4202;
//values used to load the TMs and HMs
const tmStart = 0x45A604; //The TM info.
const itemPropertiesStart = 0x3DB098; // The item properties start here. 44 bytes per item.

//values used to load wild encounters
const wildEncountersStart = 0x3C7410;

//values used to load trainers
const trainerDataStart = 0x23EB38; // this is the start of the trainer data.
const trainerClassesStart = 0x23E5C8; // the names of the different types of trainers.

//values used to load shops
const shopsStarts = [
  {shopName: "Viridian", pointer: 0x16A310},
  {shopName: "Pewter", pointer: 0x16A780},
  {shopName: "Cerulean", pointer: 0x16AD50},
  {shopName: "Vermillion", pointer: 0x16B704},
  {shopName: "Lavender", pointer: 0x16B408},
  {shopName: "Celadon 2F Items", pointer: 0x16BBB0},
  {shopName: "Celadon 2F TMs", pointer: 0x16BBEC},
  {shopName: "Celadon 4F", pointer: 0x16BCA8},
  {shopName: "Celadon 5F Items", pointer: 0x16BCFC},
  {shopName: "Celadon 5F Vitamins", pointer: 0x16BD34},
  {shopName: "Saffron", pointer: 0x16F054},
  {shopName: "Fuchsia", pointer: 0x16D590},
  {shopName: "Cinnabar", pointer: 0x16EAC0},
  {shopName: "Indigo Plateau", pointer: 0x16EB6C},
  {shopName: "Two Island Initial", pointer: 0x16775C},
  {shopName: "Two Island Exp 1", pointer: 0x167774},
  {shopName: "Two Island Exp 2", pointer: 0x167790},
  {shopName: "Two Island Exp 3", pointer: 0x1677B0},
  {shopName: "Three Island", pointer: 0x17192C},
  {shopName: "Four Island", pointer: 0x171D4C},
  {shopName: "Seven Island", pointer: 0x170BD0}
]

const animationPointers = [  
  0x081C6FA4,
  0x081C6FA4,
  0x081CFD5A,
  0x081C6FD5,
  0x081C7ED3,
  0x081C7D5D,
  0x081C94C5,
  0x081D0925,
  0x081CD350,
  0x081CD73A,
  0x081CD9EA,
  0x081C93F1,
  0x081C9439,
  0x081D1629,
  0x081C86B4,
  0x081C839A,
  0x081CF6B8,
  0x081CF709,
  0x081C99F9,
  0x081CFC8D,
  0x081D0D70,
  0x081C8B19,
  0x081C8BA1,
  0x081C833A,
  0x081CFF08,
  0x081C7E37,
  0x081CFE15,
  0x081CA24A,
  0x081CDF92,
  0x081CA2CD,
  0x081CA32A,
  0x081CA397,
  0x081CA414,
  0x081C7502,
  0x081C7540,
  0x081D0DAA,
  0x081C78F6,
  0x081CA591,
  0x081C798A,
  0x081C8381,
  0x081C7A9D,
  0x081C7AF2,
  0x081C776C,
  0x081D0A38,
  0x081CE200,
  0x081CDBC7,
  0x081CDB30,
  0x081CA610,
  0x081C75CD,
  0x081C7F4B,
  0x081D170F,
  0x081CF378,
  0x081C7CE9,
  0x081CFA85,
  0x081D0891,
  0x081CF8EA,
  0x081CEA5E,
  0x081CFA71,
  0x081CE36B,
  0x081CE7D8,
  0x081D0DC0,
  0x081C9D83,
  0x081CE4AF,
  0x081D2A17,
  0x081CF7A6,
  0x081C8BD8,
  0x081D030C,
  0x081CA6E4,
  0x081D00CA,
  0x081D479C,
  0x081C746E,
  0x081CEC45,
  0x081CED5D,
  0x081C7C93,
  0x081C99C3,
  0x081D05FC,
  0x081CE583,
  0x081C7028,
  0x081C7159,
  0x081C7287,
  0x081D04C4,
  0x081D14B6,
  0x081CE0D8,
  0x081C88A6,
  0x081C7FAC,
  0x081C801A,
  0x081C81D0,
  0x081CD5E0,
  0x081C9B6F,
  0x081CA741,
  0x081CA78E,
  0x081CA8B1,
  0x081CF1A1,
  0x081CD47B,
  0x081CD4DC,
  0x081D0E5A,
  0x081CA9CD,
  0x081CA9EA,
  0x081CAA34,
  0x081CAA8C,
  0x081CAB02,
  0x081D122B,
  0x081D17E7,
  0x081C7625,
  0x081CAB1B,
  0x081D173D,
  0x081CD11B,
  0x081CAB62,
  0x081C9F20,
  0x081C9AA1,
  0x081CE4A2,
  0x081C8F8C,
  0x081CDD9D,
  0x081CDC98,
  0x081D08F2,
  0x081CDD4A,
  0x081D1377,
  0x081D13B7,
  0x081CAB75,
  0x081C6FA4,
  0x081C8A29,
  0x081D1273,
  0x081D1350,
  0x081CDE90,
  0x081CF210,
  0x081CF4C6,
  0x081C7B65,
  0x081C8C31,
  0x081CE30E,
  0x081C73B5,
  0x081CAB9F,
  0x081C8601,
  0x081D1831,
  0x081CAC65,
  0x081CAC89,
  0x081D1959,
  0x081CFE72,
  0x081CACDA,
  0x081D0A8F,
  0x081D0C92,
  0x081CAD43,
  0x081CF0F5,
  0x081D1CDC,
  0x081CAD8B,
  0x081D2881,
  0x081CDDBA,
  0x081C876C,
  0x081D045F,
  0x081CAF23,
  0x081D0EBA,
  0x081CAF30,
  0x081CAF45,
  0x081CF977,
  0x081C8E85,
  0x081D1D23,
  0x081CF472,
  0x081CD43B,
  0x081C9BFB,
  0x081D21D5,
  0x081CAF5E,
  0x081CA019,
  0x081D223C,
  0x081CAF6A,
  0x081CAFEB,
  0x081D34A3,
  0x081CB025,
  0x081CB08B,
  0x081CFF3B,
  0x081C9D3C,
  0x081D1588,
  0x081CD218,
  0x081CB0B3,
  0x081C7672,
  0x081CDC08,
  0x081D1899,
  0x081CB109,
  0x081CA12E,
  0x081CF7CD,
  0x081D0405,
  0x081C84B5,
  0x081CB146,
  0x081CE964,
  0x081C8FC5,
  0x081CB175,
  0x081D1C10,
  0x081CDF0B,
  0x081D1C73,
  0x081CD130,
  0x081CF252,
  0x081CE03A,
  0x081D082B,
  0x081CF573,
  0x081D0F40,
  0x081CB1FD,
  0x081CB23C,
  0x081D1FB1,
  0x081C9E60,
  0x081C8FE2,
  0x081CF528,
  0x081C9AF4,
  0x081C9518,
  0x081CFB22,
  0x081CEEED,
  0x081CB297,
  0x081CB32B,
  0x081CB36E,
  0x081CB3AF,
  0x081CB436,
  0x081CB47E,
  0x081C96B3,
  0x081C895A,
  0x081D1025,
  0x081C9B2A,
  0x081C98CA,
  0x081D211A,
  0x081D19DB,
  0x081D376A,
  0x081D1E38,
  0x081C9040,
  0x081C9307,
  0x081C9349,
  0x081CD803,
  0x081CB4C0,
  0x081D0002,
  0x081CF5CA,
  0x081CDA1C,
  0x081D1F8F,
  0x081D246E,
  0x081C8590,
  0x081CB551,
  0x081D292D,
  0x081D10D4,
  0x081D1198,
  0x081D0199,
  0x081D2899,
  0x081CF177,
  0x081CB5BE,
  0x081C83CC,
  0x081CFDAC,
  0x081D4D7E,
  0x081CE1B5,
  0x081D03AF,
  0x081CE25E,
  0x081CDD24,
  0x081C86FA,
  0x081CB64E,
  0x081D0703,
  0x081D130D,
  0x081CD53F,
  0x081D0214,
  0x081CFBAA,
  0x081C823F,
  0x081D1BD5,
  0x081CB70C,
  0x081D25DB,
  0x081D2692,
  0x081D27D5,
  0x081CB7D6,
  0x081CB886,
  0x081CB8BE,
  0x081D2B59,
  0x081D23B0,
  0x081CB902,
  0x081CB946,
  0x081D36A3,
  0x081CB966,
  0x081CB9C1,
  0x081D0703,
  0x081CB9E0,
  0x081CBA7B,
  0x081CBACF,
  0x081D2515,
  0x081D2C55,
  0x081D2593,
  0x081CBB42,
  0x081D1D87,
  0x081CBBB3,
  0x081D48F9,
  0x081CBC6E,
  0x081D33CD,
  0x081CBCA2,
  0x081CBEA7,
  0x081D4A7F,
  0x081CBEEA,
  0x081CBF5F,
  0x081CC02C,
  0x081CC077,
  0x081D2CB2,
  0x081CC0BA,
  0x081D41BF,
  0x081D4D2A,
  0x081D41D9,
  0x081D2F03,
  0x081CC0E2,
  0x081CC128,
  0x081CC16B,
  0x081CC282,
  0x081CC311,
  0x081CC3E1,
  0x081D2CF5,
  0x081CC44C,
  0x081D4FFE,
  0x081CC583,
  0x081CC733,
  0x081D2D7D,
  0x081D3464,
  0x081CC74B,
  0x081D3C7E,
  0x081D4622,
  0x081D3346,
  0x081D4754,
  0x081D51CD,
  0x081CC7BB,
  0x081CC91D,
  0x081CC9AD,
  0x081D4330,
  0x081CCA0F,
  0x081D3EC0,
  0x081D3FA7,
  0x081D3653,
  0x081CCA59,
  0x081CCB4C,
  0x081D3BF9,
  0x081CCBB8,
  0x081CEB5D,
  0x081CCBE6,
  0x081CCC41,
  0x081D4C31,
  0x081D2E06,
  0x081D2EDE,
  0x081D2F98,
  0x081D2FAA,
  0x081CCCA9,
  0x081C7831,
  0x081CCD13,
  0x081CCD3D,
  0x081CCD4C,
  0x081D3040,
  0x081D34AF,
  0x081CCD6E,
  0x081CFCF7,
  0x081D32A9,
  0x081D1132,
  0x081CCD8C,
  0x081CCDE9,
  0x081D4EDD,
  0x081CCEE1,
  0x081CCF07,
  0x081CCF87,
  0x081CD00A,
  0x081D4293,
  0x081CD079,
  0x081D4916,
  0x081D4B0F,
  0x081D4A0B
]

export default {
  version: "FIRERED/LEAFGREEN",
  rawBinArray: [],
  fileFilters: [
    { name: 'Gameboy Advance ROM', extensions: ['gba'] }
    ],
  generation: 3,
  moveAnimations: g3MoveAnimations,
  moveEffects: g3MoveEffects,
  evolveTypes: g3EvolveTypes,
  evolveStones: g3Stones,
  tradeItems: g3TradeItems,
  growthRates: g3GrowthRates,
  damageModifiers: gscDamageModifiers,
  trainerTypes: gsTrainerTypes,
  moveTargets: g3MoveTargets,
  abilities: g3Abilities,
  //these are limitations due to space.
  maxEvosMovesBytes: 5709,
  maxTrainerBytes: 9791,
  maxShopItems: 229,
  numHighCritMoves: 7,
  defaultEvolution: {evolve: 1, param: 1, evolveTo: 1},
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
      currentPokemon.ability1 = getState().rawBinArray[pokemonStartByte + (i * 28) + 23];
      currentPokemon.ability2 = getState().rawBinArray[pokemonStartByte + (i * 28) + 24];

      //*
      //the tm/hm data for each pokemon is stored as 8 bytes. Each bit is a true/false for the pokemon's compatibility with a tm/hm.
      //first we grab the 8 bytes in an array.
      let tmIntArray = [];
      tmIntArray.push(getState().rawBinArray[pokemonTMStart + (i * 8) + 0]);
      tmIntArray.push(getState().rawBinArray[pokemonTMStart + (i * 8) + 1]);
      tmIntArray.push(getState().rawBinArray[pokemonTMStart + (i * 8) + 2]);
      tmIntArray.push(getState().rawBinArray[pokemonTMStart + (i * 8) + 3]);
      tmIntArray.push(getState().rawBinArray[pokemonTMStart + (i * 8) + 4]);
      tmIntArray.push(getState().rawBinArray[pokemonTMStart + (i * 8) + 5]);
      tmIntArray.push(getState().rawBinArray[pokemonTMStart + (i * 8) + 6]);
      tmIntArray.push(getState().rawBinArray[pokemonTMStart + (i * 8) + 7]);

      let tmBoolArray = [];

      tmIntArray.forEach((tm) => {
        //this takes each byte and splits it into its base 2 equivalent padded with 0s so each string is 8 characters, then we reverse the string
        let bitArray = tm.toString(2).padStart(8, '0').split("").reverse().join("");
        //go through each character of the string, convert it to a boolean, and add it to our bool array.
        for(let i = 0; i < 8; i++){
          if(tmBoolArray.length < 58){
            tmBoolArray.push(Boolean(Number(bitArray[i])));
          }
        }
      });

      currentPokemon.tms = tmBoolArray;

      //*/
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
    let currentMovesPosition = pokemonMovesStart;
    let currentPointerPosition = pokemonMovesPointers;
    let pokemon = getStoreState().pokemon;

    for (let i = 0; i < 411; i++) //There are 411 pokemon in the game
    {
      //basically just write all of the modify-able data back into its location in the binary array.
      workingArray[pokemonStartByte + (i * 28) + 1] = pokemon[i].hp;
      workingArray[pokemonStartByte + (i * 28) + 2] = pokemon[i].attack;
      workingArray[pokemonStartByte + (i * 28) + 3] = pokemon[i].defense;
      workingArray[pokemonStartByte + (i * 28) + 4] = pokemon[i].speed;
      workingArray[pokemonStartByte + (i * 28) + 5] = pokemon[i].specialAttack;
      workingArray[pokemonStartByte + (i * 28) + 6] = pokemon[i].specialDefense;
      workingArray[pokemonStartByte + (i * 28) + 7] = pokemon[i].type1;
      workingArray[pokemonStartByte + (i * 28) + 8] = pokemon[i].type2;
      workingArray[pokemonStartByte + (i * 28) + 9] = pokemon[i].catchRate;
      workingArray[pokemonStartByte + (i * 28) + 10] = pokemon[i].expYield;
      workingArray[pokemonStartByte + (i * 28) + 20] = pokemon[i].growthRate;
      workingArray[pokemonStartByte + (i * 28) + 23] = pokemon[i].ability1;
      workingArray[pokemonStartByte + (i * 28) + 24] = pokemon[i].ability2;
      let tmArray = [];

      //*
      for(let j = 0; j < 8; j++){ //each byte
        let tmByte = 0;
        for(let b = 0; b < 8; b++){ //each bit
          if (pokemon[i].tms[(j * 8 + b)]){
            tmByte += Math.pow(2, b);
          }
        }
        tmArray.push(tmByte);
      }

      workingArray[pokemonTMStart + (i * 8) + 0] = tmArray[0];
      workingArray[pokemonTMStart + (i * 8) + 1] = tmArray[1];
      workingArray[pokemonTMStart + (i * 8) + 2] = tmArray[2];
      workingArray[pokemonTMStart + (i * 8) + 3] = tmArray[3];
      workingArray[pokemonTMStart + (i * 8) + 4] = tmArray[4];
      workingArray[pokemonTMStart + (i * 8) + 5] = tmArray[5];
      workingArray[pokemonTMStart + (i * 8) + 6] = tmArray[6];
      workingArray[pokemonTMStart + (i * 8) + 7] = tmArray[7];
      
      
      for(let e = 0; e < 5; e++){
        if(pokemon[i].evolutions[e] !== undefined){
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8)] = pokemon[i].evolutions[e].evolve & 0xFF;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 1] = pokemon[i].evolutions[e].evolve >> 8;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 2] = pokemon[i].evolutions[e].param & 0xFF;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 3] = pokemon[i].evolutions[e].param >> 8;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 4] = (pokemon[i].evolutions[e].evolveTo + 1) & 0xFF;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 5] = (pokemon[i].evolutions[e].evolveTo + 1) >> 8;
        }else{
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8)] = 0x00;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 1] = 0x00;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 2] = 0x00;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 3] = 0x00;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 4] = 0x00;
          workingArray[pokemonEvolutionsStart + (i * 40) + (e * 8) + 5] = 0x00;
        }
      }

      //mark the current moves position as this pokemon's pointer
      workingArray[currentPointerPosition++] = currentMovesPosition & 0xFF;
      workingArray[currentPointerPosition++] = (currentMovesPosition >> 8) & 0xFF;
      workingArray[currentPointerPosition++] = (currentMovesPosition >> 16) & 0xFF;
      workingArray[currentPointerPosition++] = 0x08; //they always end with 0x08

      //save the pokemon's moves. Once they are all done we mark the end with 0xFFFF
      //*
      pokemon[i].learnedMoves.forEach((m) => {
        let moveValue = (m.level << 9 | m.moveID);
        workingArray[currentMovesPosition++] = moveValue & 0xFF;
        workingArray[currentMovesPosition++] = moveValue >> 8;
      });
      workingArray[currentMovesPosition++] = 0xFF;
      workingArray[currentMovesPosition++] = 0xFF;
      //*/
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
      moveToAdd.effect = getState().rawBinArray[movesStartingByte + (i * 12)];
      moveToAdd.power = getState().rawBinArray[movesStartingByte + (i * 12) + 1];
      moveToAdd.moveType = getState().rawBinArray[movesStartingByte + (i * 12) + 2];
      moveToAdd.accuracy = getState().rawBinArray[movesStartingByte + (i * 12) + 3];
      moveToAdd.pp = getState().rawBinArray[movesStartingByte + (i * 12) + 4];
      moveToAdd.effectChance = getState().rawBinArray[movesStartingByte + (i * 12) + 5];
      moveToAdd.target = getState().rawBinArray[movesStartingByte + (i * 12) + 6];
      moveToAdd.priority = getState().rawBinArray[movesStartingByte + (i * 12) + 7];
      moveToAdd.highCrit = false;

      let animationPointer = getState().rawBinArray[moveAnimationsStart + i*4];
      animationPointer += getState().rawBinArray[moveAnimationsStart + i*4 + 1] * 0x100;
      animationPointer += getState().rawBinArray[moveAnimationsStart + i*4 + 2] * 0x10000;
      animationPointer += getState().rawBinArray[moveAnimationsStart + i*4 + 3] * 0x1000000;

      moveToAdd.animationID = animationPointers.indexOf(animationPointer);

      moves.push(moveToAdd);
    }

    getStoreActions().setMovesArray(moves);
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

    while(getState().rawBinArray[currentByte] !== 0xFF)
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
        romData[currentByte++] = 0xFE;
        romData[currentByte++] = 0x00;
      }
    }
    romData[currentByte++] = 0xFF; //writing the ending byte manually in case the user removed some type strengths.
    romData[currentByte++] = 0xFF;
    romData[currentByte++] = 0x00;

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
  /* saveEncounters
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
    let trainerClasses = [];
    let currentClassPosition = trainerClassesStart;

    for(let i = 0; i < 107; i++){
      let trainerClassName = "";
      while(getState().rawBinArray[currentClassPosition] !== 0xFF){
        if(getState().rawBinArray[currentClassPosition] !== 0x00 || trainerClassName.length > 0){
          trainerClassName += gen3Letters.get(getState().rawBinArray[currentClassPosition++]);
        }else{
          currentClassPosition++;
        }
      }
      trainerClasses.push(trainerClassName);
      currentClassPosition++;
    }

    for(let t = 0; t < 743; t++){
      let newTrainer = {};

      //this value determines if the trainers pokemon hold items and/or have custom movesets.
      newTrainer.type = getState().rawBinArray[trainerDataStart + t*40 + 0];

      let trainerName = "";
      trainerName += trainerClasses[getState().rawBinArray[trainerDataStart + t*40 + 1]];

      let uniqueName = "";
      let currentNamePosition = trainerDataStart + t*40 + 4;
      //reads the name. The ending is marked with 0xFF
      while(getState().rawBinArray[currentNamePosition] !== 0xFF){
        uniqueName += gen3Letters.get(getState().rawBinArray[currentNamePosition++]);
      }
      trainerName += " " + uniqueName;
      newTrainer.name = trainerName;
      newTrainer.uniqueName = uniqueName; //need to keep track of this for the saving process.

      let numOfPokemon = getState().rawBinArray[trainerDataStart + t*40 + 32];

      //get the starting point for the trainer's pokemon
      let pokemonPointer = getState().rawBinArray[trainerDataStart + t*40 + 36];
      pokemonPointer += getState().rawBinArray[trainerDataStart + t*40 + 37] * 256;
      pokemonPointer += getState().rawBinArray[trainerDataStart + t*40 + 38] * 65536;

      let currentPokemonPosition = pokemonPointer;
      newTrainer.pokemon = [];
      //The trainer data tells us how many pokemon to load.
      for(let p = 0; p < numOfPokemon; p++){
        let newPokemon = {};

        newPokemon.ivs = getState().rawBinArray[currentPokemonPosition++];
        currentPokemonPosition++;

        newPokemon.level = getState().rawBinArray[currentPokemonPosition++];
        currentPokemonPosition++;

        newPokemon.pokemon = getState().rawBinArray[currentPokemonPosition++]-1; // -1 because the pokemon array is 0 based. We will add 1 when saving.
        newPokemon.pokemon += getState().rawBinArray[currentPokemonPosition++] * 256;

        //if the trainer type is 2 or 3 the next 2 bytes are the pokemon's item
        if(newTrainer.type === 2 || newTrainer.type === 3){
          newPokemon.item = getState().rawBinArray[currentPokemonPosition++];
          newPokemon.item += getState().rawBinArray[currentPokemonPosition++] * 256;
        }else{ // setting default value in case the user switches the trainer's type to one that uses items.
          newPokemon.item = 0;
        }

        //if the trainer type is 1 or 3 the next 8 bytes will be the pokemon's moves.
        if(newTrainer.type === 1 || newTrainer.type === 3){
          newPokemon.move1 = getState().rawBinArray[currentPokemonPosition++];
          newPokemon.move1 += getState().rawBinArray[currentPokemonPosition++] * 256;
          newPokemon.move2 = getState().rawBinArray[currentPokemonPosition++];
          newPokemon.move2 += getState().rawBinArray[currentPokemonPosition++] * 256;
          newPokemon.move3 = getState().rawBinArray[currentPokemonPosition++];
          newPokemon.move3 += getState().rawBinArray[currentPokemonPosition++] * 256;
          newPokemon.move4 = getState().rawBinArray[currentPokemonPosition++];
          newPokemon.move4 += getState().rawBinArray[currentPokemonPosition++] * 256;
        }else{ // setting some default values in case the user switches the trainer's type to one that uses moves.
          newPokemon.move1 = 0;
          newPokemon.move2 = 0;
          newPokemon.move3 = 0;
          newPokemon.move4 = 0;
        }

        if(newTrainer.type === 0 || newTrainer.type === 1){
          currentPokemonPosition += 2;
        }
        newTrainer.pokemon.push(newPokemon);
      }

      trainers.push(newTrainer);
    }

    //console.log(trainers);
    getStoreActions().setTrainers(trainers);
  }),
  /* saveTrainers
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
  //*/
  loadShops: thunk (async (action, payload, {getState, getStoreActions}) => {
    let shops = [];

    shopsStarts.forEach(s => {
      let newShop = {};
      newShop.name = s.shopName;
      let currentItemPosition = s.pointer;
      newShop.items = [];
      while(getState().rawBinArray[currentItemPosition] !== 0x00 || getState().rawBinArray[currentItemPosition + 1] !== 0x00) //the end of the shop is marked by 0x0000
      {
        let newItem = getState().rawBinArray[currentItemPosition++];
        newItem += getState().rawBinArray[currentItemPosition++] * 256;
        newShop.items.push({item: newItem });
      }
      shops.push(newShop);
    });

    getStoreActions().setShops(shops);
  }),
  /* saveShops
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
  //*/

  prepareDataForSaving: thunk(async (actions, payload, {getState, getStoreState, getStoreActions}) => {
    actions.savePokemonData();
    //actions.savePokemonMoves();
    //actions.saveTMs();
    //actions.saveItems();
    //actions.savePokemonTypes();
    actions.saveTypeMatchups();
    //actions.saveEncounters();
    //actions.saveTrainers();
    //actions.saveShops();
    //actions.saveStarters();
    //actions.saveMoveDescriptions();
    //actions.saveShinyOdds();
  })
}