const weatherSpawner = extendContent(Block, "summonweather", {
});

weatherSpawner.buildType = () => {
  return extend(Building, {
    createWeatherButton(p, weather){
      p.button(weather.localizedName, Styles.clearPartialt, () => {
        weather.create();
      }).width(160).height(40);
      p.row();
    },
    buildConfiguration(table){
      table.pane(Styles.smallPane, cons(p => {
        const weathers = Vars.content.getBy(ContentType.weather).toArray();
        for(var i=0; i<weathers.length; i++){
          this.createWeatherButton(p, weathers[i]);
        }
      })).height(160).top();
    }
  });
}
