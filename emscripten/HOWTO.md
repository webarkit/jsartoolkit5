How to update the emscripten build from the ARToolKit sources.
==============================================================

1. artoolkit5 is linked as a git submodule. Do the following:
	1. git submodule init
	2. git submodule update
2. From the root of the repository, execute the following:
	* source PATH_TO_EMSCRIPTEN/emsdk_env.sh && emconfigure ./configure && node tools/makem.js


