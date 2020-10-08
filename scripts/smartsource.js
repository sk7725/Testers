const edges = [[1, 0], [0, 1], [-1, 0], [0, -1]];

var itemCache = {};

const smartsource = extendContent(Block, "smartsource", {
  /*setBars(){
    this.super$setBars();
    this.bars.remove("items");
  },*/
  outputsItems(){
    return true;
  }
});

smartsource.buildType = () => {
  return extend(Building, {
    _proxItems: [],
    updateTile(){
      if(this._proxItems.length > 0){
        for(var i=0; i<this._proxItems.length; i++){
          this.items.set(this._proxItems[i], 1);
          //this.dump(this._proxItems[i]);
          this.offload(this._proxItems[i]);
        }
        this.items.clear();
      }
    },
    onProximityUpdate(){
      this.super$onProximityUpdate();

      //print("Prox Start:");
      this._proxItems = [];
      for(var i=0; i<4; i++){
        var otherBlock = Vars.world.build(this.tile.x + edges[i][0], this.tile.y + edges[i][1]);
        if(otherBlock == null || otherBlock.block.update == false || !otherBlock.block.consumes.has(ConsumeType.item)) continue;

        if(itemCache[otherBlock.block.name] != undefined){
          for(var j=0; j<itemCache[otherBlock.block.name].length; j++){
            /*if(this._proxItems.indexOf(itemCache[otherBlock.block.name][j]) < 0)*/ this._proxItems.push(itemCache[otherBlock.block.name][j]);
          }
          continue;
        }

        itemCache[otherBlock.block.name] = [];

        var otherCons = otherBlock.block.consumes.getItem();
        for(var k=0; k<otherCons.items.length; k++){
          var itemCons = otherCons.items[k].item;
          /*if(this._proxItems.indexOf(itemCons) < 0)*/ this._proxItems.push(itemCons);
          itemCache[otherBlock.block.name].push(itemCons);
        }
      }
      //print("ProxItems: "+this._proxItems);

      //print("h");
    }
  });
}
