const rbygsLetters = new Map([
            [ 84, "Poke"],
            [ 127, " " ],
            [ 128, "A"],
            [ 129, "B" ],
            [ 130, "C" ],
            [ 131, "D" ],
            [ 132, "E" ],
            [ 133, "F" ],
            [ 134, "G" ],
            [ 135, "H" ],
            [ 136, "I" ],
            [ 137, "J" ],
            [ 138, "K" ],
            [ 139, "L" ],
            [ 140, "M"],
            [ 141, "N" ],
            [ 142, "O" ],
            [ 143, "P" ],
            [ 144, "Q" ],
            [ 145, "R" ],
            [ 146, "S" ],
            [ 147, "T" ],
            [ 148, "U" ],
            [ 149, "V" ],
            [ 150, "W" ],
            [ 151, "X" ],
            [ 152, "Y"],
            [ 153, "Z" ],
            [ 186, "E" ],
            [ 227, "-" ],
            [ 230, "?" ],
            [ 232, "." ],
            [ 224, "'" ],
            [ 239, "M" ],
            [ 245, "F" ],
            [ 246, "0" ],
            [ 247, "1" ],
            [ 248, "2" ],
            [ 249, "3" ],
            [ 250, "4" ],
            [ 251, "5" ],
            [ 252, "6" ],
            [ 253, "7" ],
            [ 254, "8" ],
            [ 255, "9" ]
]);

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
  "Low Chance Enemy Confused",
  "Attack 2 Times Chance Enemy Poison",
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
  No_Effect: 0,
  Half_Damage: 5,
  Double_Damage: 20
};

//the actual number is 1/10th what is listed here.
const gscDamageModifiers = {
  No_Effect: 0,
  Half_Damage: 5,
  Normal_Damage: 10,
  More_Damage: 15,
  Double_Damage: 20
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
  "OLIVINE_PORT",
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
  "TOHJO_FALLS",
  "VERMILION_PORT",
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
  "ROUTE_28",
  "PALLET_TOWN",
  "VIRIDIAN_CITY",
  "CERULEAN_CITY",
  "VERMILION_CITY",
  "CELADON_CITY",
  "FUCHSIA_CITY",
  "CINNABAR_ISLAND"
];

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

//these trainers aren't in the game. We will mark them as unused so the user knows they can remove pokemon from their rosters to free up extra space.
const rbUnusedTrainers = [12, 24, 58, 65, 98, 99, 100, 134, 135, 136, 143, 186, 198, 214, 222, 234, 235, 258, 259, 260, 261, 298, 321, 323, 324, 325, 331, 333, 334, 335, 347, 365, 366, 367, 368, 371, 375, 377, 379];

//
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

const gsTrainerCounts = [1,1,1,1,1,1,1,1,15,0,1,3,1,1,1,1,1,1,1,5,1,12,18,19,15,1,19,20,16,13,31,5,2,3,1,14,22,21,19,12,12,6,2,20,9,1,3,8,5,9,4,12,21,19,2,9,7,3,12,6,8,5,1,1,2,5];

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

export {rbyDamageModifiers, gscDamageModifiers, rbygsLetters, rbyMoveAnimations, rbyMoveEffects, rbyGrowthRates,
  rbyEvolveTypes, rbyStones, rbyItems, rbyZoneNames, rbyGrassEncChances, rbTrainerNames, rbTrainerCounts, rbUnusedTrainers, rbyShopNames, 
  gscMoveAnimations, gscMoveEffects, gscEvolveTypes, gscStones, gscHappiness, gscStats, gscGrowthRates,
  gsZoneNames, gscGrassEncChances, gscWaterEncChances, gsTrainerGroups, gsTrainerCounts, gsUniqueGroupNameIds, gsTrainerTypes, gscShopNames};
