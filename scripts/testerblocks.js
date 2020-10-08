const Integer = java.lang.Integer;

const testerjs = extendContent(MessageBlock, "testerjs", {
});

testerjs.config(Integer, (build, value) => {
  if(value != 1) return;
  try{
    (() => eval(build.message.toString()))();
    build.noError();
  }
  catch(err){
    build.setError(err);
  }
});

testerjs.buildType = () => {
  return extendContent(MessageBlock.MessageBuild, testerjs, {
    _haserr: false,
    _err: "",
    buildConfiguration(table){
      this.super$buildConfiguration(table);
      table.button(Icon.star, () => {
        this.configure(new Integer(1));
      }).size(40);
    },

    setError(err){
      this._err = err;
      this._haserr = true;
    },
    noError(){
      this._haserr = false;
    },

    draw(){
      this.super$draw();
      if(this._haserr){
        Draw.z(Layer.endPixeled);
        testerjs.drawPlaceText(this._err, this.tile.x, this.tile.y, false);
        Draw.reset();
      }
    },
    updateTableAlign(table){
      if(!this._haserr) this.super$updateTableAlign(table);
      else{
        const pos = Core.input.mouseScreen(this.x + Vars.tilesize / 2 + 1, this.y);
        table.setPosition(pos.x, pos.y, Align.left);
      }
    }
  });
}


const testerdraw = extendContent(MessageBlock, "testerdraw", {
});

testerdraw.buildType = () => {
  return extendContent(MessageBlock.MessageBuild, testerdraw, {
    _haserr: false,
    _err: "",

    setError(err){
      this._err = err;
      this._haserr = true;
    },
    noError(){
      this._haserr = false;
    },

    draw(){
      if(this.message == null || this.message.length() == 0){
        this.super$draw();
        if(this._haserr){
          Draw.z(Layer.endPixeled);
          testerdraw.drawPlaceText(this._err, this.tile.x, this.tile.y, false);
          Draw.reset();
        }
        return;
      }

      if(this._haserr){
        this.super$draw();
        Draw.z(Layer.endPixeled);
        testerdraw.drawPlaceText(this._err, this.tile.x, this.tile.y, false);
        Draw.reset();
      }

      try{
        (() => eval(this.message.toString()))();
        this._haserr = false;
      }
      catch(err){
        this._err = err;
        this._haserr = true;
      }
    },
    updateTableAlign(table){
      if(!this._haserr) this.super$updateTableAlign(table);
      else{
        const pos = Core.input.mouseScreen(this.x + Vars.tilesize / 2 + 1, this.y);
        table.setPosition(pos.x, pos.y, Align.left);
      }
    }
  });
}


const testerdrawclear = extendContent(MessageBlock, "testerdrawclear", {
});

testerdrawclear.buildType = () => {
  return extendContent(MessageBlock.MessageBuild, testerdrawclear, {
    _haserr: false,
    _err: "",

    setError(err){
      this._err = err;
      this._haserr = true;
    },
    noError(){
      this._haserr = false;
    },

    draw(){
      if(this.message == null || this.message.length() == 0){
        this.super$draw();
        if(this._haserr){
          Draw.z(Layer.endPixeled);
          testerdrawclear.drawPlaceText(this._err, this.tile.x, this.tile.y, false);
          Draw.reset();
        }
        return;
      }

      if(this._haserr){
        this.super$draw();
        Draw.z(Layer.endPixeled);
        testerdrawclear.drawPlaceText(this._err, this.tile.x, this.tile.y, false);
        Draw.reset();
      }

      try{
        (() => eval(this.message.toString()))();
        this._haserr = false;
      }
      catch(err){
        this._err = err;
        this._haserr = true;
      }
    },
    updateTableAlign(table){
      if(!this._haserr) this.super$updateTableAlign(table);
      else{
        const pos = Core.input.mouseScreen(this.x + Vars.tilesize / 2 + 1, this.y);
        table.setPosition(pos.x, pos.y, Align.left);
      }
    }
  });
}


const testertable = extendContent(MessageBlock, "testertable", {
  init(){
    this.super$init();
    this.dialog = new BaseDialog("Dialog");
    this.dialog.addCloseButton();
  }
});

testertable.buildType = () => {
  return extendContent(MessageBlock.MessageBuild, testertable, {
    _haserr: false,
    _err: "",
    buildConfiguration(table){
      this.super$buildConfiguration(table);
      const tbutton = table.button(Icon.star, () => {
        testertable.dialog.cont.clear();
        var cont = testertable.dialog.cont;//to be used in the eval

        try{
          (() => eval(this.message.toString()))();
          testertable.dialog.show();
          this._haserr = false;
        }
        catch(err){
          this._err = err;
          this._haserr = true;
        }
      }).size(40).get();
      tbutton.setDisabled(Vars.net.active());//some players may try to stick working, non-visual code in this block wtf
    },

    setError(err){
      this._err = err;
      this._haserr = true;
    },
    noError(){
      this._haserr = false;
    },

    draw(){
      this.super$draw();
      if(this._haserr){
        Draw.z(Layer.endPixeled);
        testertable.drawPlaceText(this._err, this.tile.x, this.tile.y, false);
        Draw.reset();
      }
    },
    updateTableAlign(table){
      if(!this._haserr) this.super$updateTableAlign(table);
      else{
        const pos = Core.input.mouseScreen(this.x + Vars.tilesize / 2 + 1, this.y);
        table.setPosition(pos.x, pos.y, Align.left);
      }
    }
  });
}


const evalFx = new Effect(30, e => {
  if(e.data == null || !e.data.text || !e.data.parent) return;
  try{
    (() => eval(e.data.text))();
  }
  catch(err){
    if(e.data.parent.isValid()) e.data.parent.setError(err);
  }
});

const evalFxLong = new Effect(90, e => {
  if(e.data == null || !e.data.text || !e.data.parent) return;
  try{
    (() => eval(e.data.text))();
  }
  catch(err){
    if(e.data.parent.isValid()) e.data.parent.setError(err);
  }
});

const testerfx = extendContent(MessageBlock, "testerfx", {
});

testerfx.config(Integer, (build, value) => {
  if(value == 1){
    build.noError();
    if(build.getLength()) evalFxLong.at(build.x, build.y, 0, Color.white, {
      parent: build,
      text: build.message.toString()
    });
    else evalFx.at(build.x, build.y, 0, Color.white, {
      parent: build,
      text: build.message.toString()
    });
  }
  else if(value == 2){
    build.toggleLength();
  }
});

testerfx.buildType = () => {
  return extendContent(MessageBlock.MessageBuild, testerfx, {
    _haserr: false,
    _err: "",
    _long: false,
    buildConfiguration(table){
      this.super$buildConfiguration(table);
      const lbutton = table.button((this._long)?Icon.commandRally:Icon.commandRallySmall, () => {
        lbutton.replaceImage(new Image((!this._long)?Icon.commandRally:Icon.commandRallySmall));
        this.configure(new Integer(2));
      }).size(40).get();
      table.button(Icon.star, () => {
        this.configure(new Integer(1));
      }).size(40);
    },

    toggleLength(){
      this._long = !this._long;
    },
    getLength(){
      return this._long;
    },
    setError(err){
      this._err = err;
      this._haserr = true;
    },
    noError(){
      this._haserr = false;
    },

    read(stream, version) {
      this.super$read(stream, version);
      this._long = stream.bool();
    },
    write(stream) {
      this.super$write(stream);
      stream.bool(this._long);
    },

    draw(){
      this.super$draw();
      if(this._haserr){
        Draw.z(Layer.endPixeled);
        testerfx.drawPlaceText(this._err, this.tile.x, this.tile.y, false);
        Draw.reset();
      }
    },
    updateTableAlign(table){
      if(!this._haserr) this.super$updateTableAlign(table);
      else{
        const pos = Core.input.mouseScreen(this.x + Vars.tilesize / 2 + 1, this.y);
        table.setPosition(pos.x, pos.y, Align.left);
      }
    }
  });
}
