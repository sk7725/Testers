require("testers/readers");
require("testers/testerblocks");
require("testers/smartsource");
require("testers/unitspawner");
require("testers/summonweather");

//require("testers/shaderscreen");
require("testers/forceblock");

try{
  Vars.experimental = true;
}
catch(versionTooLow){}

print("Load Complete!");
