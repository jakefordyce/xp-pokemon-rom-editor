const rbygsLetters = new Map([
            [ 0x4E, ">" ],
            [ 0x4F, "=" ],
            [ 0x54, "$"],
            [ 0x55, "+" ],
            [ 0x57, "#" ],
            [ 0x7F, " " ],
            [ 0x80, "A"],
            [ 0x81, "B" ],
            [ 0x82, "C" ],
            [ 0x83, "D" ],
            [ 0x84, "E" ],
            [ 0x85, "F" ],
            [ 0x86, "G" ],
            [ 0x87, "H" ],
            [ 0x88, "I" ],
            [ 0x89, "J" ],
            [ 0x8A, "K" ],
            [ 0x8B, "L" ],
            [ 0x8C, "M"],
            [ 0x8D, "N" ],
            [ 0x8E, "O" ],
            [ 0x8F, "P" ],
            [ 0x90, "Q" ],
            [ 0x91, "R" ],
            [ 0x92, "S" ],
            [ 0x93, "T" ],
            [ 0x94, "U" ],
            [ 0x95, "V" ],
            [ 0x96, "W" ],
            [ 0x97, "X" ],
            [ 0x98, "Y" ],
            [ 0x99, "Z" ],
            [ 0x9A, "(" ],
            [ 0x9B, ")" ],
            [ 0x9C, ":" ],
            [ 0xA0, "a" ],
            [ 0xA1, "b" ],
            [ 0xA2, "c" ],
            [ 0xA3, "d" ],
            [ 0xA4, "e" ],
            [ 0xA5, "f" ],
            [ 0xA6, "g" ],
            [ 0xA7, "h" ],
            [ 0xA8, "i" ],
            [ 0xA9, "j" ],
            [ 0xAA, "k" ],
            [ 0xAB, "l" ],
            [ 0xAC, "m" ],
            [ 0xAD, "n" ],
            [ 0xAE, "o" ],
            [ 0xAF, "p" ],
            [ 0xB0, "q" ],
            [ 0xB1, "r" ],
            [ 0xB2, "s" ],
            [ 0xB3, "t" ],
            [ 0xB4, "u" ],
            [ 0xB5, "v" ],
            [ 0xB6, "w" ],
            [ 0xB7, "x" ],
            [ 0xB8, "y" ],
            [ 0xB9, "z" ],
            [ 0xBA, "‚" ],
            [ 0xD1, "`" ],
            [ 0xD4, "\"" ],
            [ 0xE0, "'" ],
            [ 0xE3, "-" ],
            [ 0xE6, "?" ],
            [ 0xE8, "." ],
            [ 0xE9, "&" ],
            [ 0xEF, "M" ],
            [ 0xF3, "/" ],
            [ 0xF4, "," ],
            [ 0xF5, "F" ],
            [ 0xF6, "0" ],
            [ 0xF7, "1" ],
            [ 0xF8, "2" ],
            [ 0xF9, "3" ],
            [ 0xFA, "4" ],
            [ 0xFB, "5" ],
            [ 0xFC, "6" ],
            [ 0xFD, "7" ],
            [ 0xFE, "8" ],
            [ 0xFF, "9" ]
]);

export const gen3Letters = new Map([
  [0x00, " "],
  [0xA1, "0"],
  [0xA2, "1"],
  [0xA3, "2"],
  [0xA4, "3"],
  [0xA5, "4"],
  [0xA6, "5"],
  [0xA7, "6"],
  [0xA8, "7"],
  [0xA9, "8"],
  [0xAA, "9"],
  [0xAB, "!"],
  [0xAC, "?"],
  [0xAD, "."],
  [0xAE, "-"],
  [0xB4, "'"],
  [0xBB, "A"],
  [0xBC, "B"],
  [0xBD, "C"],
  [0xBE, "D"],
  [0xBF, "E"],
  [0xC0, "F"],
  [0xC1, "G"],
  [0xC2, "H"],
  [0xC3, "I"],
  [0xC4, "J"],
  [0xC5, "K"],
  [0xC6, "L"],
  [0xC7, "M"],
  [0xC8, "N"],
  [0xC9, "O"],
  [0xCA, "P"],
  [0xCB, "Q"],
  [0xCC, "R"],
  [0xCD, "S"],
  [0xCE, "T"],
  [0xCF, "U"],
  [0xD0, "V"],
  [0xD1, "W"],
  [0xD2, "X"],
  [0xD3, "Y"],
  [0xD4, "Z"],
  [0xD5, "a"],
  [0xD6, "b"],
  [0xD7, "c"],
  [0xD8, "d"],
  [0xD9, "e"],
  [0xDA, "f"],
  [0xDB, "g"],
  [0xDC, "h"],
  [0xDD, "i"],
  [0xDE, "j"],
  [0xDF, "k"],
  [0xE0, "l"],
  [0xE1, "m"],
  [0xE2, "n"],
  [0xE3, "o"],
  [0xE4, "p"],
  [0xE5, "q"],
  [0xE6, "r"],
  [0xE7, "s"],
  [0xE8, "t"],
  [0xE9, "u"],
  [0xEA, "v"],
  [0xEB, "w"],
  [0xEC, "x"],
  [0xED, "y"],
  [0xEE, "z"],
  [0xB5, "M"],
  [0xB6, "F"],
]);

function getKeyByValue(mapObject, searchValue) {

  for (let [key, value] of mapObject.entries()) {
    if (value === searchValue)
      return key;
  }
  return 0x50;
};

const rbyMoveAnimations = [
  "None",
  "POUND",
  "KARATE CHOP",
  "DOUBLESLAP",
  "COMET PUNCH",
  "MEGA PUNCH",
  "PAY DAY",
  "FIRE PUNCH",
  "ICE PUNCH",
  "THUNDERPUNCH",
  "SCRATCH",
  "VICEGRIP",
  "GUILLOTINE",
  "RAZOR WIND",
  "SWORDS DANCE",
  "CUT",
  "GUST",
  "WING ATTACK",
  "WHIRLWIND",
  "FLY",
  "BIND",
  "SLAM",
  "VINE WHIP",
  "STOMP",
  "DOUBLE KICK",
  "MEGA KICK",
  "JUMP KICK",
  "ROLLING KICK",
  "SAND ATTACK",
  "HEADBUTT",
  "HORN ATTACK",
  "FURY ATTACK",
  "HORN DRILL",
  "TACKLE",
  "BODY SLAM",
  "WRAP",
  "TAKE DOWN",
  "THRASH",
  "DOUBLE EDGE",
  "TAIL WHIP",
  "POISON STING",
  "TWINEEDLE",
  "PIN MISSILE",
  "LEER",
  "BITE",
  "GROWL",
  "ROAR",
  "SING",
  "SUPERSONIC",
  "SONICBOOM",
  "DISABLE",
  "ACID",
  "EMBER",
  "FLAMETHROWER",
  "MIST",
  "WATER GUN",
  "HYDRO PUMP",
  "SURF",
  "ICE BEAM",
  "BLIZZARD",
  "PSYBEAM",
  "BUBBLEBEAM",
  "AURORA BEAM",
  "HYPER BEAM",
  "PECK",
  "DRILL PECK",
  "SUBMISSION",
  "LOW KICK",
  "COUNTER",
  "SEISMIC TOSS",
  "STRENGTH",
  "ABSORB",
  "MEGA DRAIN",
  "LEECH SEED",
  "GROWTH",
  "RAZOR LEAF",
  "SOLARBEAM",
  "POISONPOWDER",
  "STUN SPORE",
  "SLEEP POWDER",
  "PETAL DANCE",
  "STRING SHOT",
  "DRAGON RAGE",
  "FIRE SPIN",
  "THUNDERSHOCK",
  "THUNDERBOLT",
  "THUNDER WAVE",
  "THUNDER",
  "ROCK THROW",
  "EARTHQUAKE",
  "FISSURE",
  "DIG",
  "TOXIC",
  "CONFUSION",
  "PSYCHIC M",
  "HYPNOSIS",
  "MEDITATE",
  "AGILITY",
  "QUICK ATTACK",
  "RAGE",
  "TELEPORT",
  "NIGHT SHADE",
  "MIMIC",
  "SCREECH",
  "DOUBLE TEAM",
  "RECOVER",
  "HARDEN",
  "MINIMIZE",
  "SMOKESCREEN",
  "CONFUSE RAY",
  "WITHDRAW",
  "DEFENSE CURL",
  "BARRIER",
  "LIGHT SCREEN",
  "HAZE",
  "REFLECT",
  "FOCUS ENERGY",
  "BIDE",
  "METRONOME",
  "MIRROR MOVE",
  "SELFDESTRUCT",
  "EGG BOMB",
  "LICK",
  "SMOG",
  "SLUDGE",
  "BONE CLUB",
  "FIRE BLAST",
  "WATERFALL",
  "CLAMP",
  "SWIFT",
  "SKULL BASH",
  "SPIKE CANNON",
  "CONSTRICT",
  "AMNESIA",
  "KINESIS",
  "SOFTBOILED",
  "HI JUMP KICK",
  "GLARE",
  "DREAM EATER",
  "POISON GAS",
  "BARRAGE",
  "LEECH LIFE",
  "LOVELY KISS",
  "SKY ATTACK",
  "TRANSFORM",
  "BUBBLE",
  "DIZZY PUNCH",
  "SPORE",
  "FLASH",
  "PSYWAVE",
  "SPLASH",
  "ACID ARMOR",
  "CRABHAMMER",
  "EXPLOSION",
  "FURY SWIPES",
  "BONEMERANG",
  "REST",
  "ROCK SLIDE",
  "HYPER FANG",
  "SHARPEN",
  "CONVERSION",
  "TRI ATTACK",
  "SUPER FANG",
  "SLASH",
  "SUBSTITUTE"
];

const rbyMoveEffects = [
  "No Additional Effect",
  "Sleep No Damage",
  "High Chance Of Poison",
  "Absorb Half",
  "Low Chance Of Burn",
  "Low Chance Of Freeze",
  "Low Chance Of Paralyze",
  "User Feints",
  "Eat Dream",
  "Mirror Last Move",
  "Raise Attack",
  "Raise Defense",
  "Raise Speed",
  "Raise Special",
  "Raise Accuracy",
  "Raise Evasion",
  "Money After Battle",
  "Always Hits",
  "Lower Enemy Attack",
  "Lower Enemy Defense",
  "Lower Enemy Speed",
  "Lower Enemy Special",
  "Lower Enemy Accuracy",
  "Lower Enemy Evasion",
  "Copy Enemy Type",
  "Remove All Stat Changes",
  "Bide Effect",
  "Attack 2-3 Turns Then Confused",
  "Leave Battle",
  "Attack 2-5 Times",
  "Attack 2-5 Turns",
  "Low Chance Of Flinch",
  "Enemy Sleeps",
  "Very High Chance Of Poison",
  "High Chance Of Burn",
  "High Chance Of Freeze",
  "High Chance Of Paralyze",
  "High Chance Of Flinch",
  "One Hit KO",
  "Charge 1 Turn Attack Next",
  "Deal Half HP",
  "Deal Set Damage",
  "Attack 2-5 Times Trap",
  "Fly Effect",
  "Attack 2 Times",
  "User Damaged If Miss",
  "Ignore Stat Changes",
  "Zero Crit Chance Broken",
  "User Takes Recoil Damage",
  "Enemy Confused",
  "Raise Attack Sharply",
  "Raise Defense Sharply",
  "Raise Speed Sharply",
  "Raise Special Sharply",
  "Raise Accuracy Sharply",
  "Raise Evasion Sharply",
  "Recover HP",
  "Transform Into Enemy",
  "Lower Enemy Attack Sharply",
  "Lower Enemy Defense Sharply",
  "Lower Enemy Speed Sharply",
  "Lower Enemy Special Sharply",
  "Lower Enemy Accuracy Sharply",
  "Lower Enemy Evasion Sharply",
  "Half Damage From Special",
  "Half Damage From Attack",
  "Enemy Poisoned",
  "Enemy Paralyzed",
  "Low Chance Lower Enemy Attack",
  "Low Chance Lower Enemy Defense",
  "Low Chance Lower Enemy Speed",
  "High Chance Lower Enemy Special",
  "Low Chance Lower Enemy Accuracy",
  "Low Chance Lower Enemy Evasion",
  "unused",
  "unused",
  "Low Chance Enemy Confused",
  "Attack 2 Times Chance Enemy Poison",
  "unused",
  "Create Substitute",
  "Recharge After Attack",
  "Attack Raised When Hit Lose Control",
  "Mime Opponents Move",
  "Use Random Move",
  "Steal HP Each Turn",
  "Move Has No Effect",
  "Disable Random Enemy Move"
];

const gscMoveAnimations = [
  "None",
  "POUND",
  "KARATE_CHOP",
  "DOUBLESLAP",
  "COMET_PUNCH",
  "MEGA_PUNCH",
  "PAY_DAY",
  "FIRE_PUNCH",
  "ICE_PUNCH",
  "THUNDERPUNCH",
  "SCRATCH",
  "VICEGRIP",
  "GUILLOTINE",
  "RAZOR_WIND",
  "SWORDS_DANCE",
  "CUT",
  "GUST",
  "WING_ATTACK",
  "WHIRLWIND",
  "FLY",
  "BIND",
  "SLAM",
  "VINE_WHIP",
  "STOMP",
  "DOUBLE_KICK",
  "MEGA_KICK",
  "JUMP_KICK",
  "ROLLING_KICK",
  "SAND_ATTACK",
  "HEADBUTT",
  "HORN_ATTACK",
  "FURY_ATTACK",
  "HORN_DRILL",
  "TACKLE",
  "BODY_SLAM",
  "WRAP",
  "TAKE_DOWN",
  "THRASH",
  "DOUBLE_EDGE",
  "TAIL_WHIP",
  "POISON_STING",
  "TWINEEDLE",
  "PIN_MISSILE",
  "LEER",
  "BITE",
  "GROWL",
  "ROAR",
  "SING",
  "SUPERSONIC",
  "SONICBOOM",
  "DISABLE",
  "ACID",
  "EMBER",
  "FLAMETHROWER",
  "MIST",
  "WATER_GUN",
  "HYDRO_PUMP",
  "SURF",
  "ICE_BEAM",
  "BLIZZARD",
  "PSYBEAM",
  "BUBBLEBEAM",
  "AURORA_BEAM",
  "HYPER_BEAM",
  "PECK",
  "DRILL_PECK",
  "SUBMISSION",
  "LOW_KICK",
  "COUNTER",
  "SEISMIC_TOSS",
  "STRENGTH",
  "ABSORB",
  "MEGA_DRAIN",
  "LEECH_SEED",
  "GROWTH",
  "RAZOR_LEAF",
  "SOLARBEAM",
  "POISONPOWDER",
  "STUN_SPORE",
  "SLEEP_POWDER",
  "PETAL_DANCE",
  "STRING_SHOT",
  "DRAGON_RAGE",
  "FIRE_SPIN",
  "THUNDERSHOCK",
  "THUNDERBOLT",
  "THUNDER_WAVE",
  "THUNDER",
  "ROCK_THROW",
  "EARTHQUAKE",
  "FISSURE",
  "DIG",
  "TOXIC",
  "CONFUSION",
  "PSYCHIC_M",
  "HYPNOSIS",
  "MEDITATE",
  "AGILITY",
  "QUICK_ATTACK",
  "RAGE",
  "TELEPORT",
  "NIGHT_SHADE",
  "MIMIC",
  "SCREECH",
  "DOUBLE_TEAM",
  "RECOVER",
  "HARDEN",
  "MINIMIZE",
  "SMOKESCREEN",
  "CONFUSE_RAY",
  "WITHDRAW",
  "DEFENSE_CURL",
  "BARRIER",
  "LIGHT_SCREEN",
  "HAZE",
  "REFLECT",
  "FOCUS_ENERGY",
  "BIDE",
  "METRONOME",
  "MIRROR_MOVE",
  "SELFDESTRUCT",
  "EGG_BOMB",
  "LICK",
  "SMOG",
  "SLUDGE",
  "BONE_CLUB",
  "FIRE_BLAST",
  "WATERFALL",
  "CLAMP",
  "SWIFT",
  "SKULL_BASH",
  "SPIKE_CANNON",
  "CONSTRICT",
  "AMNESIA",
  "KINESIS",
  "SOFTBOILED",
  "HI_JUMP_KICK",
  "GLARE",
  "DREAM_EATER",
  "POISON_GAS",
  "BARRAGE",
  "LEECH_LIFE",
  "LOVELY_KISS",
  "SKY_ATTACK",
  "TRANSFORM",
  "BUBBLE",
  "DIZZY_PUNCH",
  "SPORE",
  "FLASH",
  "PSYWAVE",
  "SPLASH",
  "ACID_ARMOR",
  "CRABHAMMER",
  "EXPLOSION",
  "FURY_SWIPES",
  "BONEMERANG",
  "REST",
  "ROCK_SLIDE",
  "HYPER_FANG",
  "SHARPEN",
  "CONVERSION",
  "TRI_ATTACK",
  "SUPER_FANG",
  "SLASH",
  "SUBSTITUTE",
  "STRUGGLE",
  "SKETCH",
  "TRIPLE_KICK",
  "THIEF",
  "SPIDER_WEB",
  "MIND_READER",
  "NIGHTMARE",
  "FLAME_WHEEL",
  "SNORE",
  "CURSE",
  "FLAIL",
  "CONVERSION2",
  "AEROBLAST",
  "COTTON_SPORE",
  "REVERSAL",
  "SPITE",
  "POWDER_SNOW",
  "PROTECT",
  "MACH_PUNCH",
  "SCARY_FACE",
  "FAINT_ATTACK",
  "SWEET_KISS",
  "BELLY_DRUM",
  "SLUDGE_BOMB",
  "MUD_SLAP",
  "OCTAZOOKA",
  "SPIKES",
  "ZAP_CANNON",
  "FORESIGHT",
  "DESTINY_BOND",
  "PERISH_SONG",
  "ICY_WIND",
  "DETECT",
  "BONE_RUSH",
  "LOCK_ON",
  "OUTRAGE",
  "SANDSTORM",
  "GIGA_DRAIN",
  "ENDURE",
  "CHARM",
  "ROLLOUT",
  "FALSE_SWIPE",
  "SWAGGER",
  "MILK_DRINK",
  "SPARK",
  "FURY_CUTTER",
  "STEEL_WING",
  "MEAN_LOOK",
  "ATTRACT",
  "SLEEP_TALK",
  "HEAL_BELL",
  "RETURN",
  "PRESENT",
  "FRUSTRATION",
  "SAFEGUARD",
  "PAIN_SPLIT",
  "SACRED_FIRE",
  "MAGNITUDE",
  "DYNAMICPUNCH",
  "MEGAHORN",
  "DRAGONBREATH",
  "BATON_PASS",
  "ENCORE",
  "PURSUIT",
  "RAPID_SPIN",
  "SWEET_SCENT",
  "IRON_TAIL",
  "METAL_CLAW",
  "VITAL_THROW",
  "MORNING_SUN",
  "SYNTHESIS",
  "MOONLIGHT",
  "HIDDEN_POWER",
  "CROSS_CHOP",
  "TWISTER",
  "RAIN_DANCE",
  "SUNNY_DAY",
  "CRUNCH",
  "MIRROR_COAT",
  "PSYCH_UP",
  "EXTREMESPEED",
  "ANCIENTPOWER",
  "SHADOW_BALL",
  "FUTURE_SIGHT",
  "ROCK_SMASH",
  "WHIRLPOOL",
  "BEAT_UP"
];

const gscMoveEffects = [
  "NORMAL HIT",
  "SLEEP",
  "POISON HIT",
  "LEECH HIT",
  "BURN HIT",
  "FREEZE HIT",
  "PARALYZE HIT",
  "EXPLOSION",
  "DREAM EATER",
  "MIRROR MOVE",
  "ATTACK UP",
  "DEFENSE UP",
  "SPEED UP",
  "SP ATK UP",
  "SP DEF UP",
  "ACCURACY UP",
  "EVASION UP",
  "ALWAYS HIT",
  "ATTACK DOWN",
  "DEFENSE DOWN",
  "SPEED DOWN",
  "SP ATK DOWN",
  "SP DEF DOWN",
  "ACCURACY DOWN",
  "EVASION DOWN",
  "HAZE",
  "BIDE",
  "RAMPAGE",
  "WHIRLWIND",
  "MULTI HIT",
  "CONVERSION",
  "FLINCH HIT",
  "HEAL",
  "TOXIC",
  "PAY DAY",
  "LIGHT SCREEN",
  "TRI ATTACK",
  "UNUSED 25",
  "OHKO",
  "RAZOR WIND",
  "SUPER FANG",
  "STATIC DAMAGE",
  "BIND",
  "UNUSED 2B",
  "DOUBLE HIT",
  "JUMP KICK",
  "MIST",
  "FOCUS ENERGY",
  "RECOIL HIT",
  "CONFUSE",
  "ATTACK UP 2",
  "DEFENSE UP 2",
  "SPEED UP 2",
  "SP ATK UP 2",
  "SP DEF UP 2",
  "ACCURACY UP 2",
  "EVASION UP 2",
  "TRANSFORM",
  "ATTACK DOWN 2",
  "DEFENSE DOWN 2",
  "SPEED DOWN 2",
  "SP ATK DOWN 2",
  "SP DEF DOWN 2",
  "ACCURACY DOWN 2",
  "EVASION DOWN 2",
  "REFLECT",
  "POISON",
  "PARALYZE",
  "ATTACK DOWN HIT",
  "DEFENSE DOWN HIT",
  "SPEED DOWN HIT",
  "SP ATK DOWN HIT",
  "SP DEF DOWN HIT",
  "ACCURACY DOWN HIT",
  "EVASION DOWN HIT",
  "SKY ATTACK",
  "CONFUSE HIT",
  "TWINEEDLE",
  "UNUSED 4E",
  "SUBSTITUTE",
  "HYPER BEAM",
  "RAGE",
  "MIMIC",
  "METRONOME",
  "LEECH SEED",
  "SPLASH",
  "DISABLE",
  "LEVEL DAMAGE",
  "PSYWAVE",
  "COUNTER",
  "ENCORE",
  "PAIN SPLIT",
  "SNORE",
  "CONVERSION2",
  "LOCK ON",
  "SKETCH",
  "DEFROST OPPONENT",
  "SLEEP TALK",
  "DESTINY BOND",
  "REVERSAL",
  "SPITE",
  "FALSE SWIPE",
  "HEAL BELL",
  "PRIORITY HIT",
  "TRIPLE KICK",
  "THIEF",
  "MEAN LOOK",
  "NIGHTMARE",
  "FLAME WHEEL",
  "CURSE",
  "UNUSED 6E",
  "PROTECT",
  "SPIKES",
  "FORESIGHT",
  "PERISH SONG",
  "SANDSTORM",
  "ENDURE",
  "ROLLOUT",
  "SWAGGER",
  "FURY CUTTER",
  "ATTRACT",
  "RETURN",
  "PRESENT",
  "FRUSTRATION",
  "SAFEGUARD",
  "SACRED FIRE",
  "MAGNITUDE",
  "BATON PASS",
  "PURSUIT",
  "RAPID SPIN",
  "UNUSED 82",
  "UNUSED 83",
  "MORNING SUN",
  "SYNTHESIS",
  "MOONLIGHT",
  "HIDDEN POWER",
  "RAIN DANCE",
  "SUNNY DAY",
  "STEEL WING",
  "METAL CLAW",
  "ANCIENTPOWER",
  "FAKE OUT",
  "BELLY DRUM",
  "PSYCH UP",
  "MIRROR COAT",
  "SKULL BASH",
  "TWISTER",
  "EARTHQUAKE",
  "FUTURE SIGHT",
  "GUST",
  "STOMP",
  "SOLARBEAM",
  "THUNDER",
  "TELEPORT",
  "BEAT UP",
  "FLY",
  "DEFENSE CURL"
];

const rbyEvolveTypes = {
  LEVEL: 1,
  STONE: 2,
  TRADE: 3
};

const gscEvolveTypes = {
  LEVEL: 1,
  STONE: 2,
  TRADE: 3,
  HAPPINESS: 4,
  STATS: 5
};

const rbyStones = {
  MOON_STONE: 10,
  FIRE_STONE: 32,
  THUNDER_STONE: 33,
  WATER_STONE: 34,
  LEAF_STONE: 47
};

const rbyGrowthRates = {
  Medium_Fast: 0,
  Medium_Slow: 3,
  Fast: 4,
  Slow: 5
};

const gscStones = {
  MOON_STONE: 8,
  FIRE_STONE: 22,
  THUNDER_STONE: 23,
  WATER_STONE: 24,
  LEAF_STONE: 34,
  SUN_STONE: 169
};

const gscHappiness = {
  ANYTIME: 1,
  MORN_DAY: 2,
  NIGHT: 3
};

const gscStats = {
  ATT_GT_DEF: 1,
  ATT_LT_DEF: 2,
  ATT_EQ_DEF: 3
};

const gscTradeItems = {
  KINGS_ROCK: 0x52,
  METAL_COAT: 0x8F,
  DRAGON_SCALE: 0x90,
  UP_GRADE: 0xAC,
  no_item: 0xFF
}

const gscGrowthRates = {
  MEDIUM_FAST: 0,
	SLIGHTLY_FAST: 1,
	SLIGHTLY_SLOW: 2,
	MEDIUM_SLOW: 3,
	FAST: 4,
	SLOW: 5
};

const rbyItems = {
  MASTER_BALL: 1,
  ULTRA_BALL: 2,
  GREAT_BALL: 3,
  POKE_BALL: 4,
  TOWN_MAP: 5,
  BICYCLE: 6,
  SURFBOAD: 7,
  SAFARI_BALL: 8,
  POKEDEX: 9,
  MOON_STONE: 10,
  ANTIDOTE: 11,
  BURN_HEAL: 12,
  ICE_HEAL: 13,
  AWAKENING: 14,
  PARLYZ_HEAL: 15,
  FULL_RESTORE: 16,
  MAX_POTION: 17,
  HYPER_POTION: 18,
  SUPER_POTION: 19,
  POTION: 20,
  BOULDER_BADGE: 21,
  CASCADE_BADGE: 22,
  THUNDER_BADGE: 23,
  RAINBOW_BADGE: 24,
  SOUL_BADGE: 25,
  MARSH_BADGE: 26,
  VOLCANO_BADGE: 27,
  EARTH_BADGE: 28,
  ESCAPE_ROPE: 29,
  REPEL: 30,
  OLD_AMBER: 31,
  FIRE_STONE: 32,
  THUNDER_STONE: 33,
  WATER_STONE: 34,
  HP_UP: 35,
  PROTEIN: 36,
  IRON: 37,
  CARBOS: 38,
  CALCIUM: 39,
  RARE_CANDY: 40,
  DOME_FOSSIL: 41,
  HELIX_FOSSIL: 42,
  SECRET_KEY: 43,
  UNUSED_ITEM: 44,
  BIKE_VOUCHER: 45,
  X_ACCURACY: 46,
  LEAF_STONE: 47,
  CARD_KEY: 48,
  NUGGET: 49,
  PP_UP_2: 50,
  POKE_DOLL: 51,
  FULL_HEAL: 52,
  REVIVE: 53,
  MAX_REVIVE: 54,
  GUARD_SPEC: 55,
  SUPER_REPEL: 56,
  MAX_REPEL: 57,
  DIRE_HIT: 58,
  COIN: 59,
  FRESH_WATER: 60,
  SODA_POP: 61,
  LEMONADE: 62,
  SS_TICKET: 63,
  GOLD_TEETH: 64,
  X_ATTACK: 65,
  X_DEFEND: 66,
  X_SPEED: 67,
  X_SPECIAL: 68,
  COIN_CASE: 69,
  OAKS_PARCEL: 70,
  ITEMFINDER: 71,
  SILPH_SCOPE: 72,
  POKE_FLUTE: 73,
  LIFT_KEY: 74,
  EXP_ALL: 75,
  OLD_ROD: 76,
  GOOD_ROD: 77,
  SUPER_ROD: 78,
  PP_UP: 79,
  ETHER: 80,
  MAX_ETHER: 81,
  ELIXER: 82,
  MAX_ELIXER: 83,
  TM_01: 201,
  TM_02: 202,
  TM_03: 203,
  TM_04: 204,
  TM_05: 205,
  TM_06: 206,
  TM_07: 207,
  TM_08: 208,
  TM_09: 209,
  TM_10: 210,
  TM_11: 211,
  TM_12: 212,
  TM_13: 213,
  TM_14: 214,
  TM_15: 215,
  TM_16: 216,
  TM_17: 217,
  TM_18: 218,
  TM_19: 219,
  TM_20: 220,
  TM_21: 221,
  TM_22: 222,
  TM_23: 223,
  TM_24: 224,
  TM_25: 225,
  TM_26: 226,
  TM_27: 227,
  TM_28: 228,
  TM_29: 229,
  TM_30: 230,
  TM_31: 231,
  TM_32: 232,
  TM_33: 233,
  TM_34: 234,
  TM_35: 235,
  TM_36: 236,
  TM_37: 237,
  TM_38: 238,
  TM_39: 239,
  TM_40: 240,
  TM_41: 241,
  TM_42: 242,
  TM_43: 243,
  TM_44: 244,
  TM_45: 245,
  TM_46: 246,
  TM_47: 247,
  TM_48: 248,
  TM_49: 249,
  TM_50: 250
};

//the actual number is 1/10th what is listed here.
const rbyDamageModifiers = {
  Zero: 0,
  Half: 5,
  Double: 20
};

//the actual number is 1/10th what is listed here.
const gscDamageModifiers = {
  Zero: 0,
  Half: 5,
  Double: 20
};

const rbyZoneNames = [
  "Route 1",
  "Route 2",
  "Route 22",
  "Viridian Forest",
  "Route 3",
  "MT. Moon 1",
  "MT. Moon B1",
  "MT. Moon B2",
  "Route 4",
  "Route 24",
  "Route 25",
  "Route 9",
  "Route 5",
  "Route 6",
  "Route 11",
  "Rock Tunnel 1",
  "Rock Tunnel 2",
  "Route 10",
  "Route 12",
  "Route 8",
  "Route 7",
  "Pokemon Tower 3",
  "Pokemon Tower 4",
  "Pokemon Tower 5",
  "Pokemon Tower 6",
  "Pokemon Tower 7",
  "Route 13",
  "Route 14",
  "Route 15",
  "Route 16",
  "Route 17",
  "Route 18",
  "Safari Zone Center",
  "Safari Zone 1",
  "Safari Zone 2",
  "Safari Zone 3",
  "Water Pokemon",
  "Seafoam Island 1",
  "Seafoam Island B1",
  "Seafoam Island B2",
  "Seafoam Island B3",
  "Seafoam Island B4",
  "Mansion 1",
  "Mansion 2",
  "Mansion 3",
  "Mansion B1",
  "Route 21 Grass",
  "Route 21 Surf",
  "Unknown Dungeon 1",
  "Unknown Dungeon 2",
  "Unknown Dungeon B1",
  "Power Plant",
  "Route 23",
  "Victory Road 2",
  "Victory Road 3",
  "Victory Road 1",
  "Digletts Cave"
];

const gsZoneNames = [
  "SPROUT_TOWER_2F",
  "SPROUT_TOWER_3F",
  "TIN_TOWER_2F",
  "TIN_TOWER_3F",
  "TIN_TOWER_4F",
  "TIN_TOWER_5F",
  "TIN_TOWER_6F",
  "TIN_TOWER_7F",
  "TIN_TOWER_8F",
  "TIN_TOWER_9F",
  "BURNED_TOWER_1F",
  "BURNED_TOWER_B1F",
  "NATIONAL_PARK",
  "RUINS_OF_ALPH_OUTSIDE",
  "RUINS_OF_ALPH_INNER_CHAMBER",
  "UNION_CAVE_1F",
  "UNION_CAVE_B1F",
  "UNION_CAVE_B2F",
  "SLOWPOKE_WELL_B1F",
  "SLOWPOKE_WELL_B2F",
  "ILEX_FOREST",
  "MOUNT_MORTAR_1F_OUTSIDE",
  "MOUNT_MORTAR_1F_INSIDE",
  "MOUNT_MORTAR_2F_INSIDE",
  "MOUNT_MORTAR_B1F",
  "ICE_PATH_1F",
  "ICE_PATH_B1F",
  "ICE_PATH_B2F_MAHOGANY_SIDE",
  "ICE_PATH_B2F_BLACKTHORN_SIDE",
  "ICE_PATH_B3F",
  "WHIRL_ISLAND_NW",
  "WHIRL_ISLAND_NE",
  "WHIRL_ISLAND_SW",
  "WHIRL_ISLAND_CAVE",
  "WHIRL_ISLAND_SE",
  "WHIRL_ISLAND_B1F",
  "WHIRL_ISLAND_B2F",
  "WHIRL_ISLAND_LUGIA_CHAMBER",
  "SILVER_CAVE_ROOM_1",
  "SILVER_CAVE_ROOM_2",
  "SILVER_CAVE_ROOM_3",
  "SILVER_CAVE_ITEM_ROOMS",
  "DARK_CAVE_VIOLET_ENTRANCE",
  "DARK_CAVE_BLACKTHORN_ENTRANCE",
  "ROUTE_29",
  "ROUTE_30",
  "ROUTE_31",
  "ROUTE_32",
  "ROUTE_33",
  "ROUTE_34",
  "ROUTE_35",
  "ROUTE_36",
  "ROUTE_37",
  "ROUTE_38",
  "ROUTE_39",
  "ROUTE_42",
  "ROUTE_43",
  "ROUTE_44",
  "ROUTE_45",
  "ROUTE_46",
  "SILVER_CAVE_OUTSIDE",
  "RUINS_OF_ALPH_OUTSIDE",
  "UNION_CAVE_1F",
  "UNION_CAVE_B1F",
  "UNION_CAVE_B2F",
  "SLOWPOKE_WELL_B1F",
  "SLOWPOKE_WELL_B2F",
  "ILEX_FOREST",
  "MOUNT_MORTAR_1F_OUTSIDE",
  "MOUNT_MORTAR_2F_INSIDE",
  "MOUNT_MORTAR_B1F",
  "WHIRL_ISLAND_SW",
  "WHIRL_ISLAND_B2F",
  "WHIRL_ISLAND_LUGIA_CHAMBER",
  "SILVER_CAVE_ROOM_2",
  "DARK_CAVE_VIOLET_ENTRANCE",
  "DARK_CAVE_BLACKTHORN_ENTRANCE",
  "DRAGONS_DEN_B1F",
  "ROUTE_30",
  "ROUTE_31",
  "ROUTE_32",
  "ROUTE_34",
  "ROUTE_35",
  "ROUTE_40",
  "ROUTE_41",
  "ROUTE_42",
  "ROUTE_43",
  "ROUTE_44",
  "ROUTE_45",
  "NEW_BARK_TOWN",
  "CHERRYGROVE_CITY",
  "VIOLET_CITY",
  "CIANWOOD_CITY",
  "OLIVINE_CITY",
  "ECRUTEAK_CITY",
  "LAKE_OF_RAGE",
  "BLACKTHORN_CITY",
  "SILVER_CAVE_OUTSIDE",
  "OLIVINE_PORT",
  "DIGLETTS_CAVE",
  "MOUNT_MOON",
  "ROCK_TUNNEL_1F",
  "ROCK_TUNNEL_B1F",
  "VICTORY_ROAD",
  "TOHJO_FALLS",
  "ROUTE_1",
  "ROUTE_2",
  "ROUTE_3",
  "ROUTE_4",
  "ROUTE_5",
  "ROUTE_6",
  "ROUTE_7",
  "ROUTE_8",
  "ROUTE_9",
  "ROUTE_10_NORTH",
  "ROUTE_11",
  "ROUTE_13",
  "ROUTE_14",
  "ROUTE_15",
  "ROUTE_16",
  "ROUTE_17",
  "ROUTE_18",
  "ROUTE_21",
  "ROUTE_22",
  "ROUTE_24",
  "ROUTE_25",
  "ROUTE_26",
  "ROUTE_27",
  "ROUTE_28",
  "ROUTE_4",
  "ROUTE_6",
  "ROUTE_9",
  "ROUTE_10_NORTH",
  "ROUTE_12",
  "ROUTE_13",
  "ROUTE_19",
  "ROUTE_20",
  "ROUTE_21",
  "ROUTE_22",
  "ROUTE_24",
  "ROUTE_25",
  "ROUTE_26",
  "ROUTE_27",
  "TOHJO_FALLS",
  "ROUTE_28",
  "PALLET_TOWN",
  "VIRIDIAN_CITY",
  "CERULEAN_CITY",
  "VERMILION_CITY",
  "CELADON_CITY",
  "FUCHSIA_CITY",
  "CINNABAR_ISLAND",
  "VERMILION_PORT"
];

//These are the chances of an encounter for each slot in a wild pokemon zone.
const rbyGrassEncChances = [20,20,15,10,10,10,5,5,4,1];

const gscGrassEncChances = [30, 30, 20, 10, 5, 4, 1];

const gscWaterEncChances = [60, 30, 10];

const rbTrainerNames = [
  "Youngster",
  "BugCatcher",
  "Lass",
  "Sailor",
  "JrTrainerM",
  "JrTrainerF",
  "Pokemaniac",
  "SuperNerd",
  "Hiker",
  "Biker",
  "Burglar",
  "Engineer",
  "Juggler",
  "Fisher",
  "Swimmer",
  "CueBall",
  "Gambler",
  "Beauty",
  "Psychic",
  "Rocker",
  "Juggler",
  "Tamer",
  "BirdKeeper",
  "Blackbelt",
  "Rival",
  "ProfOak",
  "Chief",
  "Scientist",
  "Giovanni",
  "Rocket",
  "CoolTrainerM",
  "CoolTrainerF",
  "Bruno",
  "Brock",
  "Misty",
  "Lt.Surge",
  "Erika",
  "Koga",
  "Blaine",
  "Sabrina",
  "Gentleman",
  "Rival",
  "Rival",
  "Lorelei",
  "Channeler",
  "Agatha",
  "Lance"
];

//this is the number of trainers in each group. This lets us know when to switch to the next group name.
const rbTrainerCounts = [13, 14, 18, 8, 9, 24, 7, 12, 14, 15, 9, 3, 0, 11, 15, 9, 7, 15, 4, 2, 8, 6, 17, 9, 9, 3, 0, 13, 3, 41, 10, 8, 1, 1, 1, 1, 1, 1, 1, 1, 5, 12, 3, 1, 24, 1, 1];

//these trainers aren't used in the game. We will mark them as unused so the user knows they can remove pokemon from their rosters to free up extra space.
const rbUnusedTrainers = [12, 24, 58, 65, 98, 99, 100, 134, 135, 136, 143, 186, 198, 214, 222, 234, 235, 258, 259, 260, 261, 298, 321, 323, 324, 325, 331, 333, 334, 335, 347, 365, 366, 367, 368, 371, 375, 377, 379];

const gsTrainerGroups = ["Falkner",
"Whitney",
"Bugsy",
"Morty",
"Pryce",
"Jasmine",
"Chuck",
"Clair",
"Rival1",
"PokemonProf",
"Will",
"PKMNTrainer",
"Bruno",
"Karen",
"Koga",
"Champion",
"Brock",
"Misty",
"LtSurge",
"Scientist",
"Erika",
"Youngster",
"Schoolboy",
"BirdKeeper",
"Lass",
"Janine",
"CooltrainerM",
"CooltrainerF",
"Beauty",
"Pokemaniac",
"GruntM",
"Gentleman",
"Skier",
"Teacher",
"Sabrina",
"BugCatcher",
"Fisher",
"SwimmerM",
"SwimmerF",
"Sailor",
"SuperNerd",
"Rival2",
"Guitarist",
"Hiker",
"Biker",
"Blaine",
"Burglar",
"Firebreather",
"Juggler",
"Blackbelt",
"ExecutiveM",
"Psychic",
"Picnicker",
"Camper",
"ExecutiveF",
"Sage",
"Medium",
"Boarder",
"PokefanM",
"KimonoGirl",
"Twins",
"PokefanF",
"Red",
"Blue",
"Officer",
"GruntF"];

//the number of trainers in each group. When loading this lets us know when to move to the next name.
const gsTrainerCounts = [1,1,1,1,1,1,1,1,15,0,1,3,1,1,1,1,1,1,1,5,1,12,18,19,15,1,19,20,16,13,31,5,2,3,1,14,22,21,19,12,12,6,2,20,9,1,3,8,5,9,4,12,21,19,2,9,7,3,12,6,8,5,1,1,2,5];

//Each trainer has a unique name in addition to their group name but for some trainers the names are the same i.e "Red Red".
//This is a list of trainers where it wouldn't make sense to display both names.
const gsUniqueGroupNameIds = [0,1,2,3,4,5,6,7,10,12,13,14,15,16,17,18,20,25,34,45,62,63];

const gsTrainerTypes = [
  "Normal",
  "Custom Moves",
  "Item",
  "Item and Moves"
];

const rbyShopNames = [
  "Viridian City",
  "Pewter City",
  "Cerulean City",
  "Bike Shop",
  "Vermilion City",
  "Lavender City",
  "Celadon Floor 2 Clerk 1",
  "Celadon Floor 2 Clerk 2",
  "Celadon Floor 4",
  "Celadon Floor 5 Clerk 1",
  "Celadon Floor 5 Clerk 2",
  "Fushia City",
  "unused",
  "Cinnabar Island",
  "Saffron City",
  "Indigo Plateau"
];

const gscShopNames = [
  "Cherrygrove",
  "Cherrygrove Dex",
  "Violet",
  "Azalea",
  "Cianwood",
  "Goldenrod 2F 1",
  "Goldenrod 2F 2",
  "Goldenrod 3F",
  "Goldenrod 4F",
  "Goldenrod 5F 1",
  "Goldenrod 5F 2",
  "Goldenrod 5F 3",
  "Goldenrod 5F 4",
  "Olivine",
  "Ecruteak",
  "Mahogany 1",
  "Mahogany 2",
  "Blackthorn",
  "Viridian",
  "Pewter",
  "Cerulean",
  "Lavender",
  "Vermilion",
  "Celadon 2F 1",
  "Celadon 2F 2",
  "Celadon 3F",
  "Celadon 4F",
  "Celadon 5F 1",
  "Celadon 5F 2",
  "Fuchsia",
  "Saffron",
  "MtMoon",
  "Indigo Plateau",
  "Underground",
  "Default Mart"
];

export const g3GrowthRates = {
  MEDIUM_FAST: 0,
	FASTEST: 1,
	SLOWEST: 2,
	MEDIUM_SLOW: 3,
	FAST: 4,
	SLOW: 5
};

export const g3MoveEffects = [
  "NORMAL_HIT",
  "SLEEP",
  "POISON_HIT",
  "ABSORB",
  "BURN_HIT",
  "FREEZE_HIT",
  "PARALYZE_HIT",
  "EXPLOSION",
  "DREAM_EATER",
  "MIRROR_MOVE",
  "ATTACK_UP",
  "DEFENSE_UP",
  "SPEED_UP",
  "SPECIAL_ATTACK_UP",
  "SPECIAL_DEFENSE_UP",
  "ACCURACY_UP",
  "EVASION_UP",
  "ALWAYS_HIT",
  "ATTACK_DOWN",
  "DEFENSE_DOWN",
  "SPEED_DOWN",
  "SP_ATT_DOWN unused",
  "SP_DEF_DOWN unused",
  "ACCURACY_DOWN",
  "EVASION_DOWN",
  "HAZE",
  "BIDE",
  "RAMPAGE",
  "ROAR",
  "MULTI_HIT",
  "CONVERSION",
  "FLINCH_HIT",
  "RESTORE_HP",
  "TOXIC",
  "PAY_DAY",
  "LIGHT_SCREEN",
  "TRI_ATTACK",
  "REST",
  "OHKO",
  "RAZOR_WIND",
  "SUPER_FANG",
  "DRAGON_RAGE",
  "TRAP",
  "HIGH_CRITICAL",
  "DOUBLE_HIT",
  "RECOIL_IF_MISS",
  "MIST",
  "FOCUS_ENERGY",
  "RECOIL",
  "CONFUSE",
  "ATTACK_UP_2",
  "DEFENSE_UP_2",
  "SPEED_UP_2",
  "SPECIAL_ATTACK_UP_2",
  "SPECIAL_DEFENSE_UP_2",
  "ACCURACY_UP_2",
  "EVASION_UP_2",
  "TRANSFORM",
  "ATTACK_DOWN_2",
  "DEFENSE_DOWN_2",
  "SPEED_DOWN_2",
  "SPECIAL_ATTACK_DOWN_2",
  "SPECIAL_DEFENSE_DOWN_2",
  "ACCURACY_DOWN_2",
  "EVASION_DOWN_2",
  "REFLECT",
  "POISON",
  "PARALYZE",
  "ATTACK_DOWN_HIT",
  "DEFENSE_DOWN_HIT",
  "SPEED_DOWN_HIT",
  "SPECIAL_ATTACK_DOWN_HIT",
  "SPECIAL_DEFENSE_DOWN_HIT",
  "ACCURACY_DOWN_HIT",
  "EVASION_DOWN_HIT",
  "SKY_ATTACK",
  "CONFUSE_HIT",
  "TWINEEDLE",
  "VITAL_THROW",
  "SUBSTITUTE",
  "RECHARGE",
  "RAGE",
  "MIMIC",
  "METRONOME",
  "LEECH_SEED",
  "SPLASH",
  "DISABLE",
  "LEVEL_DAMAGE",
  "PSYWAVE",
  "COUNTER",
  "ENCORE",
  "PAIN_SPLIT",
  "SNORE",
  "CONVERSION_2",
  "LOCK_ON",
  "SKETCH",
  "UNUSED_60",
  "SLEEP_TALK",
  "DESTINY_BOND",
  "FLAIL",
  "SPITE",
  "FALSE_SWIPE",
  "HEAL_BELL",
  "QUICK_ATTACK",
  "TRIPLE_KICK",
  "THIEF",
  "MEAN_LOOK",
  "NIGHTMARE",
  "MINIMIZE",
  "CURSE",
  "UNUSED_6E",
  "PROTECT",
  "SPIKES",
  "FORESIGHT",
  "PERISH_SONG",
  "SANDSTORM",
  "ENDURE",
  "ROLLOUT",
  "SWAGGER",
  "FURY_CUTTER",
  "ATTRACT",
  "RETURN",
  "PRESENT",
  "FRUSTRATION",
  "SAFEGUARD",
  "THAW_HIT",
  "MAGNITUDE",
  "BATON_PASS",
  "PURSUIT",
  "RAPID_SPIN",
  "SONICBOOM",
  "UNUSED_83",
  "MORNING_SUN",
  "SYNTHESIS",
  "MOONLIGHT",
  "HIDDEN_POWER",
  "RAIN_DANCE",
  "SUNNY_DAY",
  "DEFENSE_UP_HIT",
  "ATTACK_UP_HIT",
  "ALL_STATS_UP_HIT",
  "UNUSED_8D",
  "BELLY_DRUM",
  "PSYCH_UP",
  "MIRROR_COAT",
  "SKULL_BASH",
  "TWISTER",
  "EARTHQUAKE",
  "FUTURE_SIGHT",
  "GUST",
  "FLINCH_MINIMIZED_HIT",
  "SOLARBEAM",
  "THUNDER",
  "TELEPORT",
  "BEAT_UP",
  "SEMI_INVULNERABLE",
  "DEFENSE_CURL",
  "SOFTBOILED",
  "FAKE_OUT",
  "UPROAR",
  "STOCKPILE",
  "SPIT_UP",
  "SWALLOW",
  "UNUSED_A3",
  "HAIL",
  "TORMENT",
  "FLATTER",
  "WILL_O_WISP",
  "MEMENTO",
  "FACADE",
  "FOCUS_PUNCH",
  "SMELLINGSALT",
  "FOLLOW_ME",
  "NATURE_POWER",
  "CHARGE",
  "TAUNT",
  "HELPING_HAND",
  "TRICK",
  "ROLE_PLAY",
  "WISH",
  "ASSIST",
  "INGRAIN",
  "SUPERPOWER",
  "MAGIC_COAT",
  "RECYCLE",
  "REVENGE",
  "BRICK_BREAK",
  "YAWN",
  "KNOCK_OFF",
  "ENDEAVOR",
  "ERUPTION",
  "SKILL_SWAP",
  "IMPRISON",
  "REFRESH",
  "GRUDGE",
  "SNATCH",
  "LOW_KICK",
  "SECRET_POWER",
  "1/3 RECOIL DMG",
  "TEETER_DANCE",
  "BLAZE_KICK",
  "MUD_SPORT",
  "POISON_FANG",
  "WEATHER_BALL",
  "OVERHEAT",
  "TICKLE",
  "COSMIC_POWER",
  "SKY_UPPERCUT",
  "BULK_UP",
  "POISON_TAIL",
  "WATER_SPORT",
  "CALM_MIND",
  "DRAGON_DANCE",
  "CAMOUFLAGE"
];

export const g3MoveTargets = {
  SELECTED: 0,
  DEPENDS: 1,
  USER_OR_SELECTED: 2,
  RANDOM: 4,
  BOTH: 8,
  USER: 16,
  FOES_AND_ALLY: 32,
  OPPONENT_FIELD: 64
}

export const g3EvolveTypes = {
  FRIENDSHIP: 1,
  FRIENDSHIP_DAY: 2,
  FRIENDSHIP_NIGHT: 3,
  LEVEL: 4,
  TRADE: 5,
  TRADE_ITEM: 6,
  ITEM: 7,
  LEVEL_ATK_GT_DEF: 8,
  LEVEL_ATK_EQ_DEF: 9,
  LEVEL_ATK_LT_DEF: 10,
  LEVEL_SILCOON: 11,
  LEVEL_CASCOON: 12,
  LEVEL_NINJASK: 13,
  LEVEL_SHEDINJA: 14,
  BEAUTY: 15
}

export const g3Stones = {
  SUN_STONE: 93,
  MOON_STONE: 94,
  FIRE_STONE: 95,
  THUNDER_STONE: 96,
  WATER_STONE: 97,
  LEAF_STONE: 98
}

export const g3TradeItems = {
  KINGS_ROCK: 187,
  DEEP_SEA_TOOTH: 192,
  DEEP_SEA_SCALE: 193,
  METAL_COAT: 199,
  DRAGON_SCALE: 201,
  UP_GRADE: 218
}

export const g3GrassEncChances = [20,20,10,10,10,10,5,5,4,4,1,1];

export const g3WaterEncChances = [60, 30, 5, 4, 1];

export const g3FishingEncChances = [70, 30, 60, 20, 20, 40, 40, 15, 4, 1];

export const g3ZoneNames = [
  "SEVEN_ISLAND_TANOBY_RUINS_MONEAN_CHAMBER",
  "SEVEN_ISLAND_TANOBY_RUINS_LIPTOO_CHAMBER",
  "SEVEN_ISLAND_TANOBY_RUINS_WEEPTH_CHAMBER",
  "SEVEN_ISLAND_TANOBY_RUINS_DILFORD_CHAMBER",
  "SEVEN_ISLAND_TANOBY_RUINS_SCUFIB_CHAMBER",
  "SEVEN_ISLAND_TANOBY_RUINS_RIXY_CHAMBER",
  "SEVEN_ISLAND_TANOBY_RUINS_VIAPOIS_CHAMBER",
  "VIRIDIAN_FOREST",
  "MT_MOON_1F",
  "MT_MOON_B1F",
  "MT_MOON_B2F",
  "SSANNE_EXTERIOR",
  "DIGLETTS_CAVE_B1F",
  "VICTORY_ROAD_1F",
  "VICTORY_ROAD_2F",
  "VICTORY_ROAD_3F",
  "POKEMON_MANSION_1F",
  "POKEMON_MANSION_2F",
  "POKEMON_MANSION_3F",
  "POKEMON_MANSION_B1F",
  "SAFARI_ZONE_CENTER",
  "SAFARI_ZONE_EAST",
  "SAFARI_ZONE_NORTH",
  "SAFARI_ZONE_WEST",
  "CERULEAN_CAVE_1F",
  "CERULEAN_CAVE_2F",
  "CERULEAN_CAVE_B1F",
  "ROCK_TUNNEL_1F",
  "ROCK_TUNNEL_B1F",
  "SEAFOAM_ISLANDS_1F",
  "SEAFOAM_ISLANDS_B1F",
  "SEAFOAM_ISLANDS_B2F",
  "SEAFOAM_ISLANDS_B3F",
  "SEAFOAM_ISLANDS_B4F",
  "POKEMON_TOWER_3F",
  "POKEMON_TOWER_4F",
  "POKEMON_TOWER_5F",
  "POKEMON_TOWER_6F",
  "POKEMON_TOWER_7F",
  "POWER_PLANT",
  "MT_EMBER_EXTERIOR",
  "MT_EMBER_SUMMIT_PATH_1F",
  "MT_EMBER_SUMMIT_PATH_2F",
  "MT_EMBER_SUMMIT_PATH_3F",
  "MT_EMBER_RUBY_PATH_1F",
  "MT_EMBER_RUBY_PATH_B1F",
  "MT_EMBER_RUBY_PATH_B2F",
  "MT_EMBER_RUBY_PATH_B3F",
  "MT_EMBER_RUBY_PATH_B1F_STAIRS",
  "MT_EMBER_RUBY_PATH_B2F_STAIRS",
  "THREE_ISLAND_BERRY_FOREST",
  "FOUR_ISLAND_ICEFALL_CAVE_ENTRANCE",
  "FOUR_ISLAND_ICEFALL_CAVE_1F",
  "FOUR_ISLAND_ICEFALL_CAVE_B1F",
  "FOUR_ISLAND_ICEFALL_CAVE_BACK",
  "SIX_ISLAND_PATTERN_BUSH",
  "FIVE_ISLAND_LOST_CAVE_ROOM1",
  "FIVE_ISLAND_LOST_CAVE_ROOM2",
  "FIVE_ISLAND_LOST_CAVE_ROOM3",
  "FIVE_ISLAND_LOST_CAVE_ROOM4",
  "FIVE_ISLAND_LOST_CAVE_ROOM5",
  "FIVE_ISLAND_LOST_CAVE_ROOM6",
  "FIVE_ISLAND_LOST_CAVE_ROOM7",
  "FIVE_ISLAND_LOST_CAVE_ROOM8",
  "FIVE_ISLAND_LOST_CAVE_ROOM9",
  "FIVE_ISLAND_LOST_CAVE_ROOM10",
  "FIVE_ISLAND_LOST_CAVE_ROOM11",
  "FIVE_ISLAND_LOST_CAVE_ROOM12",
  "FIVE_ISLAND_LOST_CAVE_ROOM13",
  "FIVE_ISLAND_LOST_CAVE_ROOM14",
  "ONE_ISLAND_KINDLE_ROAD",
  "ONE_ISLAND_TREASURE_BEACH",
  "TWO_ISLAND_CAPE_BRINK",
  "THREE_ISLAND_BOND_BRIDGE",
  "THREE_ISLAND_PORT",
  "FIVE_ISLAND_RESORT_GORGEOUS",
  "FIVE_ISLAND_WATER_LABYRINTH",
  "FIVE_ISLAND_MEADOW",
  "FIVE_ISLAND_MEMORIAL_PILLAR",
  "SIX_ISLAND_OUTCAST_ISLAND",
  "SIX_ISLAND_GREEN_PATH",
  "SIX_ISLAND_WATER_PATH",
  "SIX_ISLAND_RUIN_VALLEY",
  "SEVEN_ISLAND_TRAINER_TOWER",
  "SEVEN_ISLAND_SEVAULT_CANYON_ENTRANCE",
  "SEVEN_ISLAND_SEVAULT_CANYON",
  "SEVEN_ISLAND_TANOBY_RUINS",
  "ROUTE1",
  "ROUTE2",
  "ROUTE3",
  "ROUTE4",
  "ROUTE5",
  "ROUTE6",
  "ROUTE7",
  "ROUTE8",
  "ROUTE9",
  "ROUTE10",
  "ROUTE11",
  "ROUTE12",
  "ROUTE13",
  "ROUTE14",
  "ROUTE15",
  "ROUTE16",
  "ROUTE17",
  "ROUTE18",
  "ROUTE19",
  "ROUTE20",
  "ROUTE21_NORTH",
  "ROUTE21_SOUTH",
  "ROUTE22",
  "ROUTE23",
  "ROUTE24",
  "ROUTE25",
  "PALLET_TOWN",
  "VIRIDIAN_CITY",
  "CERULEAN_CITY",
  "VERMILION_CITY",
  "CELADON_CITY",
  "FUCHSIA_CITY",
  "CINNABAR_ISLAND",
  "ONE_ISLAND",
  "FOUR_ISLAND",
  "FIVE_ISLAND",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SEVEN_ISLAND_TANOBY_RUINS_MONEAN_CHAMBER",
  "SEVEN_ISLAND_TANOBY_RUINS_LIPTOO_CHAMBER",
  "SEVEN_ISLAND_TANOBY_RUINS_WEEPTH_CHAMBER",
  "SEVEN_ISLAND_TANOBY_RUINS_DILFORD_CHAMBER",
  "SEVEN_ISLAND_TANOBY_RUINS_SCUFIB_CHAMBER",
  "SEVEN_ISLAND_TANOBY_RUINS_RIXY_CHAMBER",
  "SEVEN_ISLAND_TANOBY_RUINS_VIAPOIS_CHAMBER",
  "VIRIDIAN_FOREST",
  "MT_MOON_1F",
  "MT_MOON_B1F",
  "MT_MOON_B2F",
  "SSANNE_EXTERIOR",
  "DIGLETTS_CAVE_B1F",
  "VICTORY_ROAD_1F",
  "VICTORY_ROAD_2F",
  "VICTORY_ROAD_3F",
  "POKEMON_MANSION_1F",
  "POKEMON_MANSION_2F",
  "POKEMON_MANSION_3F",
  "POKEMON_MANSION_B1F",
  "SAFARI_ZONE_CENTER",
  "SAFARI_ZONE_EAST",
  "SAFARI_ZONE_NORTH",
  "SAFARI_ZONE_WEST",
  "CERULEAN_CAVE_1F",
  "CERULEAN_CAVE_2F",
  "CERULEAN_CAVE_B1F",
  "ROCK_TUNNEL_1F",
  "ROCK_TUNNEL_B1F",
  "SEAFOAM_ISLANDS_1F",
  "SEAFOAM_ISLANDS_B1F",
  "SEAFOAM_ISLANDS_B2F",
  "SEAFOAM_ISLANDS_B3F",
  "SEAFOAM_ISLANDS_B4F",
  "POKEMON_TOWER_3F",
  "POKEMON_TOWER_4F",
  "POKEMON_TOWER_5F",
  "POKEMON_TOWER_6F",
  "POKEMON_TOWER_7F",
  "POWER_PLANT",
  "MT_EMBER_EXTERIOR",
  "MT_EMBER_SUMMIT_PATH_1F",
  "MT_EMBER_SUMMIT_PATH_2F",
  "MT_EMBER_SUMMIT_PATH_3F",
  "MT_EMBER_RUBY_PATH_1F",
  "MT_EMBER_RUBY_PATH_B1F",
  "MT_EMBER_RUBY_PATH_B2F",
  "MT_EMBER_RUBY_PATH_B3F",
  "MT_EMBER_RUBY_PATH_B1F_STAIRS",
  "MT_EMBER_RUBY_PATH_B2F_STAIRS",
  "THREE_ISLAND_BERRY_FOREST",
  "FOUR_ISLAND_ICEFALL_CAVE_ENTRANCE",
  "FOUR_ISLAND_ICEFALL_CAVE_1F",
  "FOUR_ISLAND_ICEFALL_CAVE_B1F",
  "FOUR_ISLAND_ICEFALL_CAVE_BACK",
  "SIX_ISLAND_PATTERN_BUSH",
  "FIVE_ISLAND_LOST_CAVE_ROOM1",
  "FIVE_ISLAND_LOST_CAVE_ROOM2",
  "FIVE_ISLAND_LOST_CAVE_ROOM3",
  "FIVE_ISLAND_LOST_CAVE_ROOM4",
  "FIVE_ISLAND_LOST_CAVE_ROOM5",
  "FIVE_ISLAND_LOST_CAVE_ROOM6",
  "FIVE_ISLAND_LOST_CAVE_ROOM7",
  "FIVE_ISLAND_LOST_CAVE_ROOM8",
  "FIVE_ISLAND_LOST_CAVE_ROOM9",
  "FIVE_ISLAND_LOST_CAVE_ROOM10",
  "FIVE_ISLAND_LOST_CAVE_ROOM11",
  "FIVE_ISLAND_LOST_CAVE_ROOM12",
  "FIVE_ISLAND_LOST_CAVE_ROOM13",
  "FIVE_ISLAND_LOST_CAVE_ROOM14",
  "ONE_ISLAND_KINDLE_ROAD",
  "ONE_ISLAND_TREASURE_BEACH",
  "TWO_ISLAND_CAPE_BRINK",
  "THREE_ISLAND_BOND_BRIDGE",
  "THREE_ISLAND_PORT",
  "FIVE_ISLAND_RESORT_GORGEOUS",
  "FIVE_ISLAND_WATER_LABYRINTH",
  "FIVE_ISLAND_MEADOW",
  "FIVE_ISLAND_MEMORIAL_PILLAR",
  "SIX_ISLAND_OUTCAST_ISLAND",
  "SIX_ISLAND_GREEN_PATH",
  "SIX_ISLAND_WATER_PATH",
  "SIX_ISLAND_RUIN_VALLEY",
  "SEVEN_ISLAND_TRAINER_TOWER",
  "SEVEN_ISLAND_SEVAULT_CANYON_ENTRANCE",
  "SEVEN_ISLAND_SEVAULT_CANYON",
  "SEVEN_ISLAND_TANOBY_RUINS",
  "ROUTE1",
  "ROUTE2",
  "ROUTE3",
  "ROUTE4",
  "ROUTE5",
  "ROUTE6",
  "ROUTE7",
  "ROUTE8",
  "ROUTE9",
  "ROUTE10",
  "ROUTE11",
  "ROUTE12",
  "ROUTE13",
  "ROUTE14",
  "ROUTE15",
  "ROUTE16",
  "ROUTE17",
  "ROUTE18",
  "ROUTE19",
  "ROUTE20",
  "ROUTE21_NORTH",
  "ROUTE21_SOUTH",
  "ROUTE22",
  "ROUTE23",
  "ROUTE24",
  "ROUTE25",
  "PALLET_TOWN",
  "VIRIDIAN_CITY",
  "CERULEAN_CITY",
  "VERMILION_CITY",
  "CELADON_CITY",
  "FUCHSIA_CITY",
  "CINNABAR_ISLAND",
  "ONE_ISLAND",
  "FOUR_ISLAND",
  "FIVE_ISLAND",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE",
  "SIX_ISLAND_ALTERING_CAVE"
]

export {rbyDamageModifiers, gscDamageModifiers, rbygsLetters, rbyMoveAnimations, rbyMoveEffects, rbyGrowthRates,
  rbyEvolveTypes, rbyStones, rbyItems, rbyZoneNames, rbyGrassEncChances, rbTrainerNames, rbTrainerCounts, rbUnusedTrainers, rbyShopNames,
  gscMoveAnimations, gscMoveEffects, gscEvolveTypes, gscStones, gscHappiness, gscStats, gscTradeItems, gscGrowthRates,
  gsZoneNames, gscGrassEncChances, gscWaterEncChances, gsTrainerGroups, gsTrainerCounts, gsUniqueGroupNameIds, gsTrainerTypes, gscShopNames,
  getKeyByValue};
