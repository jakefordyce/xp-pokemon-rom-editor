# Pokemon ROM Editor

This is a rewrite of my original Pokemon ROM editor [link here](https://github.com/jakefordyce/PokemonROMEditor)

## Supported ROMS

Red (.gb)

Blue (.gb)

Yellow (.gbc)

Gold (.gbc)

Silver (.gbc)

FireRed (.gba)

LeafGreen (.gba)

This is only for the 1.1 versions of Firered and Leafgreen right now. The plan is to add 1.0 support in the future.

I got tons of my info from:

https://github.com/pret/pokered

https://github.com/pret/pokeyellow

https://github.com/pret/pokecrystal

https://github.com/pret/pokegold

https://github.com/pret/pokefirered

https://www.pokecommunity.com/showthread.php?p=6737744

https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Red_and_Blue:ROM_map

https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Gold_and_Silver:ROM_map

Running from source code:

Requires NPM 16
clone repo
npm install

to run:
yarn electron-dev

to create application
yarn electron-pack

If working on a Mac or Linux you'll need to change the electron-pack script in the package.json to use -m instead of -w
"electron-pack": "electron-builder build -m"
