const Integer = java.lang.Integer;

this.global.tmpCont = [];
this.global.tmpFx = [];
var t = this;

function linesStr(first, len, now){
  var str = "[lightgray]";
  for(var i=0; i<len; i++){
    if(i+first == now) str += "[accent]";
    str += (i+first+1)+"";
    if(i+first == now) str += "[]";
    if(i<len-1) str+="\n";
  }
  return str+"[]";
}

function makeCodeScreen(build, table, maxtext, maxlines, block){
  table.button(Icon.pencil, () => {
    var dialog = new BaseDialog("@editmessage");
    dialog.setFillParent(false);
    var l = dialog.cont.add(new Label(prov(() => linesStr(a.getFirstLineShowing(), a.getLinesShowing(), a.getCursorLine())+""))).padBottom(20).get();
    l.setAlignment(Align.right);
    var a = dialog.cont.add(new TextArea(build.message.toString().replace(/\r/g, "\n"))).size(1000, Core.graphics.getHeight() - 120).get();

    a.setFilter((textField, c) => {
      if(c == '\n'){
        var count = 0;
        for(var i = 0; i < textField.getText().length; i++){
          if(textField.getText().charAt(i) == '\n'){
              count++;
          }
        }
        return count < maxlines;
      }
      return true;
    });

    a.setMaxLength(maxtext);
    dialog.buttons.button("@ok", Icon.save, () => {
      build.configure(a.getText());
      dialog.hide();
    }).grow();
    dialog.buttons.button("@uiscale.cancel", Icon.left, () => {
      dialog.hide();
    }).size(210, 64);

    dialog.update(() => {
      if(build.tile.block() != block){
        dialog.hide();
      }
    });

    dialog.show();
    build.deselect();
  }).size(40);
}

const testerjs = extendContent(MessageBlock, "testerjs", {
});

testerjs.config(Integer, (build, value) => {
  if(value != 1) return;
  const ret = Vars.mods.getScripts().runConsole(build.message.toString());
  if(ret.indexOf("Error") > -1) build.criticalError(ret);
  else if(ret != "undefined" && ret != undefined) build.setError(ret);
  else build.noError();
  /*
  try{
    Vars.mods.getScripts().runConsole(build.message.toString());
    build.noError();
  }
  catch(err){
    build.setError(err);
  }*/
});

testerjs.buildType = () => {
  return extendContent(MessageBlock.MessageBuild, testerjs, {
    _haserr: false,
    _err: "",
    _crit: false,
    buildConfiguration(table){
      if(Vars.mobile) this.super$buildConfiguration(table);
      else makeCodeScreen(this, table, testerjs.maxTextLength, testerjs.maxNewlines, testerjs);
      table.button(Icon.star, () => {
        this.configure(new Integer(1));
      }).size(40);
    },

    setError(err){
      this._err = err;
      this._haserr = true;
      this._crit = false;
    },
    criticalError(err){
      this._err = err;
      this._haserr = true;
      this._crit = true;
    },
    noError(){
      this._haserr = false;
    },

    draw(){
      this.super$draw();
      if(this._haserr){
        Draw.z(Layer.endPixeled);
        testerjs.drawPlaceText(this._err, this.tile.x, this.tile.y, !this._crit);
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

    buildConfiguration(table){
      if(Vars.mobile) this.super$buildConfiguration(table);
      else makeCodeScreen(this, table, testerdraw.maxTextLength, testerdraw.maxNewlines, testerdraw);
    },

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

    buildConfiguration(table){
      if(Vars.mobile) this.super$buildConfiguration(table);
      else makeCodeScreen(this, table, testerdrawclear.maxTextLength, testerdrawclear.maxNewlines, testerdrawclear);
    },

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
  load(){
    this.super$load();
    this.dialog = new BaseDialog("Dialog");
    this.dialog.addCloseButton();
  }
});

testertable.config(Integer, (build, value) => {
  if(value == 2){
    build.toggleMode();
  }
});

testertable.buildType = () => {
  return extendContent(MessageBlock.MessageBuild, testertable, {
    _haserr: false,
    _err: "",
    _buildmode: false,
    buildConfiguration(table){
      if(this._buildmode){
        if(Vars.net.active()){
          table.add("[red]Cannot display custom table in multiplayer![]");
          table.row();
          table.image().pad(2).width(130).height(4).color(Color.red);
          table.row();
        }
        else{
          table.table(cons(table2 => {
            t.global.tmpCont[this.id] = table2;
            const ret = Vars.mods.getScripts().runConsole("var table = this.global.tmpCont["+this.id+"];\n"+this.message.toString());
            if(ret.indexOf("Error") > -1 || ret.indexOf("Exception") > -1){
              this._err = ret;
              this._haserr = true;
            }
            else{
              this._haserr = false;
            }
          }));
          table.row();
          table.image().pad(2).width(130).height(4).color(Pal.accent);
          table.row();
        }
      }
      if(this._buildmode){
        table.table(cons(table3 => {
          if(Vars.mobile) this.super$buildConfiguration(table3);
          else makeCodeScreen(this, table3, testertable.maxTextLength, testertable.maxNewlines, testertable);
          table3.button(Icon.refresh, () => {
            Vars.control.input.frag.config.hideConfig();
            this.configure(new Integer(2));
          }).size(40);
        }));
        return;
      }
      if(Vars.mobile) this.super$buildConfiguration(table);
      else makeCodeScreen(this, table, testertable.maxTextLength, testertable.maxNewlines, testertable);
      table.button(Icon.refresh, () => {
        Vars.control.input.frag.config.hideConfig();
        this.configure(new Integer(2));
      }).size(40);
      const tbutton = table.button(Icon.star, () => {
        testertable.dialog.cont.clear();
        //var cont = testertable.dialog.cont;//to be used in the eval
        t.global.tmpCont[this.id] = testertable.dialog.cont;
        const ret = Vars.mods.getScripts().runConsole("var cont = this.global.tmpCont["+this.id+"];\n"+this.message.toString());
        if(ret.indexOf("Error") > -1 || ret.indexOf("Exception") > -1){
          this._err = ret;
          this._haserr = true;
        }
        else{
          testertable.dialog.show();
          this._haserr = false;
        }
        /*
        try{
          (() => eval(this.message.toString()))();
          testertable.dialog.show();
          this._haserr = false;
        }
        catch(err){
          this._err = err;
          this._haserr = true;
        }*/
      }).size(40).get();
      tbutton.setDisabled(Vars.net.active());//some players may try to stick working, non-visual code in this block wtf
    },
    drawSelect(){
      if(!this._buildmode) this.super$drawSelect();
    },

    read(stream, version){
      this.super$read(stream, version);
      this._buildmode = stream.bool();
    },
    write(stream){
      this.super$write(stream);
      stream.bool(this._buildmode);
    },

    toggleMode(){
      this._buildmode = !this._buildmode;
    },
    getMode(){
      return this._buildmode;
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
      if(this._buildmode){
        const pos = Core.input.mouseScreen(this.x, this.y - Vars.tilesize / 2 - 1);
        table.setPosition(pos.x, pos.y, Align.top);
      }
      else if(!this._haserr) this.super$updateTableAlign(table);
      else{
        const pos = Core.input.mouseScreen(this.x + Vars.tilesize / 2 + 1, this.y);
        table.setPosition(pos.x, pos.y, Align.left);
      }
    }
  });
}


const evalFx = new Effect(30, e => {
  if(e.data == null || !e.data.text || !e.data.parent) return;
  evalStr(e.data.text, e);
});

const evalFxLong = new Effect(90, e => {
  if(e.data == null || !e.data.text || !e.data.parent) return;
  evalStr(e.data.text, e);
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

function evalStr(str, e){
  t.global.tmpFx[e.id] = e;
  const ret = Vars.mods.getScripts().runConsole("var e = this.global.tmpFx["+e.id+"];\n"+str);
  if(ret.indexOf("Error") > -1 || ret.indexOf("Exception") > -1){
    if(e.data.parent.isValid()) e.data.parent.setError(ret);
    return true;
  }
  return false;
}

testerfx.buildType = () => {
  return extendContent(MessageBlock.MessageBuild, testerfx, {
    _haserr: false,
    _err: "",
    _long: false,
    buildConfiguration(table){
      if(Vars.mobile) this.super$buildConfiguration(table);
      else makeCodeScreen(this, table, testerfx.maxTextLength, testerfx.maxNewlines, testerfx);
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
