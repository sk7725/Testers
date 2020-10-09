const readerpos = extendContent(MessageBlock, "readerpos", {
  load(){
    this.super$load();
    this.topRegion = Core.atlas.find("testers-reader-arrow");
  },
  drawRequestRegion(req, list){
    const scl = Vars.tilesize * req.animScale;
    Draw.rect(this.region, req.drawx(), req.drawy(), scl, scl);
    Draw.rect(this.topRegion, req.drawx(), req.drawy(), scl, scl, req.rotation * 90);
  }
});

readerpos.buildType = () => {
  return extendContent(MessageBlock.MessageBuild, readerpos, {
    buildConfiguration(table){
      return;
      //h
    },
    placed(){
      this.super$placed();
      //note: only is called on the host
      if(!Vars.net.client()){
        this.configure("Tile: [accent]("+this.tile.x+", "+this.tile.y+")[]\nWorld: [sky]("+this.x+", "+this.y+")[]\nFacing: [royal]"+this.rotation+"[]");
      }
    },
    draw(){
      Draw.rect(readerpos.region, this.x, this.y);
      Draw.rect(readerpos.topRegion, this.x, this.y, this.rotation * 90);
    }
  });
}
