require("testers/readers");
require("testers/testerblocks");
require("testers/smartsource");
require("testers/unitspawner");
require("testers/summonweather");

require("testers/forceblock");

try{
  Vars.addCliffButton = true;
}
catch(versionTooLow){}

print("Load Complete!");
