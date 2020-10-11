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


const readertile = extendContent(MessageBlock, "readertile", {
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

readertile.buildType = () => {
  return extendContent(MessageBlock.MessageBuild, readertile, {
    readTile(){
      var front = this.tile.getNearby(this.rotation);
      if(front != null) this.configure(front.toString());
    },
    buildConfiguration(table){
      table.button(Icon.refreshSmall, () => {
        this.readTile();
      }).size(40);
    },
    placed(){
      this.super$placed();
      //note: only is called on the host
      if(!Vars.net.client()){
        this.readTile();
      }
    },
    draw(){
      Draw.rect(readertile.region, this.x, this.y);
      Draw.rect(readertile.topRegion, this.x, this.y, this.rotation * 90);
    }
  });
}


const Integer = java.lang.Integer;

const readerbuild = extendContent(MessageBlock, "readerbuild", {
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

readerbuild.config(Integer, (build, value) => {
  if(value != 1) return;
  build.readTile();
});

readerbuild.buildType = () => {
  return extendContent(MessageBlock.MessageBuild, readerbuild, {
    readTile(){
      var front = this.front();
      if(front == null) return;
      var str = "";
      const arr = Object.keys(front);
      //print(arr);
      arr.sort();
      for(var i=0; i<arr.length; i++){
        //print(arr[i]);
        if(arr[i] === ""){
          //print("Ignored: Empty String");
          continue;
        }
        try{
          if((typeof front[arr[i]]) === "function"){
            //print("Ignored: Function");
            continue;
          };
          str += arr[i];
          str += (front[arr[i]] == null)?(": [lightgray]null[]"):(((typeof front[arr[i]]) === "object")?": [coral]" + front[arr[i]] + "[]":": [accent]" + front[arr[i]] + "[]");
          if(i < arr.length - 1) str += "\n";
        }
        catch(ignore){
          //print("Ignored "+arr[i]);
          //print(ignore);
        }
      }
      //print(str);

      this.message.ensureCapacity(str.length);
      this.message.setLength(0);
      for(var i=0; i<str.length; i++){
        this.message.append(str.charAt(i));
      }
    },
    buildConfiguration(table){
      table.button(Icon.refreshSmall, () => {
        this.configure(new Integer(1))
      }).size(40);
    },
    placed(){
      this.readTile();
      this.super$placed();
      //note: only is called on the host
    },
    draw(){
      Draw.rect(readerbuild.region, this.x, this.y);
      Draw.rect(readerbuild.topRegion, this.x, this.y, this.rotation * 90);
    }
  });
}
