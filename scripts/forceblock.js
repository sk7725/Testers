const breakEffect = new Effect(40, e => {
  Draw.color(e.color);
  Lines.stroke(3 * e.fout());
  Lines.square(e.x, e.y, 4 + e.fin());
});

const smallEffect = new Effect(60, e => {
  Draw.z(Layer.shields);
  Draw.color(e.color);
  Fill.rect(e.x, e.y, e.fout() * Vars.tilesize, e.fout() * Vars.tilesize);
});

const rectEffect = new Effect(60, e => {
  Draw.z(Layer.shields);
  Draw.color(e.color);
  Lines.stroke(1.5);
  Draw.alpha(0.09);
  Fill.rect(e.x, e.y, e.fout() * Vars.tilesize, e.fout() * Vars.tilesize);
  Draw.alpha(1);
  Lines.square(e.x, e.y, e.fout() * Vars.tilesize / 2);
});

const forceblock = extendContent(Wall, "forceblock", {
});

forceblock.buildType = () => {
  return extendContent(Wall.WallBuild, forceblock, {
    _warmup: 0,
    updateTile(){
      this.super$updateTile();
      if(this._warmup < 1){
        this._warmup += Time.delta * 0.05;
        if(this._warmup > 1) this._warmup = 1;
      }
      else{
        if(this.healthf() < 1) this.heal(0.2 * Time.delta);
      }
      if(this.hit > 0) this.hit -= 0.2 * Time.delta;
    },
    draw(){
      Draw.z(Layer.shields);
      Draw.color(this.team.color, Color.white, this.hit);
      if(Core.settings.getBool("animatedshields")){
        Fill.rect(this.x, this.y, this._warmup * Vars.tilesize, this._warmup * Vars.tilesize);
      }
      else{
        Lines.stroke(1.5);
        Draw.alpha(0.09 + Mathf.clamp(0.08 * this.hit));
        Fill.rect(this.x, this.y, this._warmup * Vars.tilesize, this._warmup * Vars.tilesize);
        Draw.alpha(1);
        Lines.square(this.x, this.y, this._warmup * Vars.tilesize / 2);
      }
      Draw.reset();
    },
    onDestroyed(){
      breakEffect.at(this.x, this.y, this.team.color);
      if(Core.settings.getBool("animatedshields")) smallEffect.at(this.x, this.y, this.team.color);
      else rectEffect.at(this.x, this.y, this.team.color);
    },
    drawCracks(){
      return;
      //h
    }
  });
}
