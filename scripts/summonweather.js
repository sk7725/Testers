const Integer = java.lang.Integer;
const Float = java.lang.Float;

const weatherSpawner = extendContent(Block, "summonweather", {
});

weatherSpawner.config(Integer, (build, value) => {
  if(value >= 0){
    var weather = Vars.content.getByID(ContentType.weather, value - 1);
    if(build.enableLayering() || !weather.isActive()) weather.create(build.wIntensity(), build.wDuration());
  }
  else if(value == -1) build.clearWeather();
  else if(value == -2) build.setLayering(true);
  else if(value == -3) build.setLayering(false);
  else if(value == -4) build.addDuration(-60 * 30);
  else if(value == -5) build.addDuration(60 * 30);
});

weatherSpawner.config(Float, (build, value) => {
  if(value > 0){
    build.setIntensity(value);
  }
});

weatherSpawner.buildType = () => {
  return extend(Building, {
    _duration: Time.toMinutes,
    _intensity: 1,
    _layer: false,
    createWeatherButton(p, weather){
      p.button(weather.localizedName, Styles.clearPartialt, () => {
        this.configure(new Integer(weather.id + 1));
      }).width(160).height(40);
      p.row();
    },
    buildConfiguration(table){
      table.pane(Styles.smallPane, cons(p => {
        const weathers = Vars.content.getBy(ContentType.weather).toArray();
        for(var i=0; i<weathers.length; i++){
          this.createWeatherButton(p, weathers[i]);
        }
      })).height(160).width(160).top();
      table.row();
      table.table(Styles.black6, cons(t => {
        t.add().pad(5);
        t.row();

        t.add("$dialog.weather-duration").height(30);
        t.row();
        t.table(cons(td => {
          td.button("-", Styles.transt, () => {
            if(this._duration/Time.toMinutes > 0.6) this.configure(new Integer(-4));
          }).size(30);
          td.label(prov(() => this.formatMins(this._duration) + " [lightgray]"+Core.bundle.get("unit.minutes")+"[]")).width(90).height(30).padLeft(5).padRight(5);
          td.button("+", Styles.transt, () => {
            if(this._duration/Time.toMinutes < 14.9) this.configure(new Integer(-5));
          }).size(30);
        }))
        t.row();
        t.add().pad(5);
        t.row();

        t.add("$dialog.weather-intensity").height(30);
        t.row();
        t.table(cons(td => {
          td.label(prov(() => this._intensity + "")).width(110).height(30).padRight(10).padLeft(10);
          td.button(Icon.pencilSmall, Styles.emptyi, () => {
            //false inumeric to allow .
            Vars.ui.showTextInput("", "$dialog.short.set-intensity", 10, this._intensity + "", false, cons(t => {
              if(!isNaN(t * 1) && t >= 0){
                this.configure(new Float(Number(t)));
              }else{
                Vars.ui.showErrorMessage("$dialog.short.invalid-number");
              }
            }));
          }).size(30);
        }))
        t.row();
        t.add().pad(5);
        t.row();

        t.check("$dialog.weather-layer", 25, this._layer, c => {
          if(c != this._layer){
            if(c) this.configure(new Integer(-2));
            else this.configure(new Integer(-3));
          }
        }).width(160).height(30);
        t.row();
        t.add().pad(5);
      }));
      table.row();

      table.button("$dialog.weather-clear", Styles.clearPartialt, () => {
        this.configure(new Integer(-1));
      }).width(160).height(40);
    },
    clearWeather(){
      const weathers = Vars.content.getBy(ContentType.weather).toArray();
      for(var i=0; i<weathers.length; i++){
        while(weathers[i].isActive()){
          weathers[i].remove();
        }
      }
    },

    formatMins(ticks){
      var mins = ticks/Time.toMinutes;
      if(mins - Mathf.floorPositive(mins) < 0.1) return Mathf.floorPositive(mins);
      else return Mathf.floorPositive(mins*10)/10;
    },

    enableLayering(){
      return this._layer;
    },
    setLayering(a){
      this._layer = a;
    },
    wIntensity(){
      return this._intensity;
    },
    setIntensity(a){
      this._intensity = Mathf.floorPositive(a*100)/100;
    },
    wDuration(){
      return this._duration;
    },
    setDuration(a){
      this._duration = a;
    },
    addDuration(a){
      this._duration += a;
      if(this._duration < 0) this._duration = 0;
    },

    read(stream, version){
      this.super$read(stream, version);
      this._layer = stream.bool();
      this._duration = stream.s();
      this._intensity = stream.f();
    },
    write(stream){
      this.super$write(stream);
      stream.bool(this._layer);
      stream.s(this._duration);
      stream.f(this._intensity);
    },
  });
}
