const unitSpawner = extendContent(MessageBlock, "summonunit", {});
unitSpawner.size = 1;
unitSpawner.solid = false;
unitSpawner.requirements = ItemStack.with(Items.copper, 2, Items.lead, 4);
unitSpawner.buildVisibility = BuildVisibility.sandboxOnly;
unitSpawner.category = Category.logic;
unitSpawner.configurable = true;
unitSpawner.buildType = () => {
	const ent = extendContent(MessageBlock.MessageBuild, unitSpawner, {
    _uiMode: 0,
    _prevMode: 0,
		init(tile, team, shouldAdd, rotation){
			if(!this.initialized){
				this.create(tile.block(), team);
			}else{
				//Useless, but I don't want to remove it.
				if(this.block.hasPower){
					this.power.graph = new PowerGraph();
					this.power.graph.add();
				};
			};
			this.rotation = rotation;
			this.tile = tile;

			this.setUnit(UnitTypes.dagger.id);
			this.setTeam(team.id);

			this.set(tile.drawx(), tile.drawy());
			if(shouldAdd) this.add();

			this.created();
			return this;
			//print("Default Unit: " + this.getUnit() + "; Team: " + this.getTeam());
		},

		placed(){
			this.super$placed();

			this.setUnitX(this.getX());
			this.setUnitY(this.getY());
			print("X: " + this.getUnitX() + " Y: " + this.getUnitY());
		},

		draw(){
			this.super$draw();

      Draw.z(Layer.overlayUI);
			Draw.alpha(0.35);
			Draw.mixcol(this.getTeam().color, 1);
			Draw.rect(this.getUnit().icon(Cicon.full), this.getUnitX(), this.getUnitY());
			Draw.reset();
		},

    drawSelect(){
      //remove text for now
      Draw.z(Layer.overlayUI);
			Draw.alpha(0.35);
			Draw.mixcol(this.getTeam().color, 1);
			Draw.rect(this.getUnit().icon(Cicon.full), this.getUnitX(), this.getUnitY());
			Draw.reset();
    },

    updateTableAlign(table){
      const pos = Core.input.mouseScreen(this.x, this.y - Vars.tilesize / 2 - 1);
      table.setPosition(pos.x, pos.y, Align.top);
    },

		buildConfiguration(table){
      //unitsSmall
      table.button("$dialog.name.unit-option", Styles.clearPartialt, () => {
				this.unitDialog();
			}).height(40).width(170).get();

      table.row();

      table.table(cons(opt => {
        var bg = [null, null, null];
        bg[0] = opt.button(Icon.units, Styles.clearToggleTransi, () => {
  				this._uiMode = 0;
          bg[0].setChecked(true);
          bg[1].setChecked(false);
          bg[2].setChecked(false);
  			}).size(40).get();
        bg[1] = opt.button(Icon.modeSurvival, Styles.clearToggleTransi, () => {
  				this._uiMode = 1;
          bg[0].setChecked(false);
          bg[1].setChecked(true);
          bg[2].setChecked(false);
  			}).size(40).get();
        bg[2] = opt.button(Icon.grid, Styles.clearToggleTransi, () => {
          this._prevMode = this._uiMode;
  				this._uiMode = 2;
          bg[0].setChecked(false);
          bg[1].setChecked(false);
          bg[2].setChecked(true);
  			}).size(40).get();
        bg[this._uiMode].setChecked(true);

        Styles.clearTransi.imageUpColor = Color.green;
        opt.button(Icon.add, Styles.clearTransi, () => {
  				this.spawnUnit(this.getUnit(), this.getTeam(), this.getUnitX(), this.getUnitY());
  			}).width(50).height(40);
        Styles.clearTransi.imageUpColor = Color.white;
      }));

      const s0 = new Table(cons(t => {
        t.visibility = boolp(() => this._uiMode == 0);
        ItemSelection.buildTable(t, Vars.content.units(), prov(() => this.getUnit()), cons(u => {
          if(u != null) this.setUnit(u.id);
        }));
      }));
      const s1 = new Table(cons(t => {
        t.visibility = boolp(() => this._uiMode == 1);
        t.pane(Styles.smallPane, cons(p => {
          for(var i=0 ;i<4; i++){
            for(var ii=i*4; ii<i*4+4; ii++){
              this.addColorButton(p, Team.all[ii]);
            }
            if(i < 3) p.row();
          }
          p.top();
        })).top().height(80).align(Align.top);
        t.top();
      }));
      //s1.setHeight(540);
      const s2 = new Table(cons(tb => {
        tb.visibility = boolp(() => this._uiMode == 2);
        tb.table(Styles.black6, cons(t => {
          t.add().pad(2.5);
          t.row();
          t.add(new Label(prov(() => "X: "+this.getUnitX()/Vars.tilesize)));
          t.button("-", Styles.transt, () => {
            if(this.getUnitX() - Vars.tilesize >= 0) this.setUnitX(this.getUnitX() - Vars.tilesize);
          }).size(30);
          t.button("+", Styles.transt, () => {
            if(this.getUnitX() + Vars.tilesize < Vars.world.width() * Vars.tilesize) this.setUnitX(this.getUnitX() + Vars.tilesize);
          }).size(30);
          t.row();
          t.add().pad(5);
          t.row();
          t.add(new Label(prov(() => "Y: "+this.getUnitY()/Vars.tilesize)));
          t.button("-", Styles.transt, () => {
            if(this.getUnitY() - Vars.tilesize >= 0) this.setUnitY(this.getUnitY() - Vars.tilesize);
          }).size(30);
          t.button("+", Styles.transt, () => {
            if(this.getUnitY() + Vars.tilesize < Vars.world.height() * Vars.tilesize) this.setUnitY(this.getUnitY() + Vars.tilesize);
          }).size(30);
          t.row();
          t.add().pad(2.5);
          t.top();
        })).height(80).width(170);
        tb.top();
      }));

      table.row();
      table.stack(s0, s1, s2).align(Align.top).top();
		},

    addColorButton(table, team){
        var button = table.button(Tex.whiteui, Styles.clearToggleTransi, 24, () => {
            //print(i);
            this.setTeam(team.id);
        }).size(40).get();
        button.update(() => {
            button.setChecked(team.id == this.getTeam().id);
        });
        button.getStyle().imageUpColor = team.color;
    },

		unitDialog(){
			var dialog = new BaseDialog("$dialog.name.unit-config");
			var cont = dialog.cont;

			cont.table(cons(t => {
				t.top().margin(6);
				t.add("$dialog.title.select-unit").growX().center().color(Pal.accent);
				t.row();
				t.image().fillX().height(3).pad(4).color(Pal.accent);
			})).width(800).center().row();

			cont.pane(cons(p => {
				var ru = 0;
				var units = Vars.content.units();

				units.each(cons(u => {
					p.button(cons(b => {
						b.left();
						b.image(u.icon(Cicon.medium)).size(40).padRight(2);
						b.add(u.localizedName);
					}), () => {
						this.setUnit(u.id);
					}).margin(12).fillX();

					if(++ru % 3 == 0) p.row();
				}));
			})).width(800).height(540).top().center().row();

			cont.table(cons(i => {
				i.table(cons(t => {
					t.button("$dialog.title.select-team", Icon.modeSurvival, () => {
						this.teamDialog();
					}).width(220).pad(4).growY();

					t.button("$dialog.title.select-position", Icon.grid, () => {
						this.posDialog();
					}).width(220).pad(4).growY();
				}));
			})).width(360).bottom().center();

			dialog.addCloseButton();
			dialog.show();
		},

		teamDialog(){
			var dialog = new BaseDialog("$dialog.title.select-team");
			var cont = dialog.cont;

			cont.table(cons(t => {
				t.top().margin(6);
				t.add("$dialog.info.base-teams").growX().color(Pal.accent);
				t.row();
				t.image().fillX().height(3).pad(4).color(Pal.accent);
			})).width(320).center().row();

			cont.pane(cons(p => {
				var rt = 0;
				var teams = Team.baseTeams;

				for(var i in teams){
					var team = teams[i];

					this.addTeamButton(p, team);
					if(++rt % 3 == 0) p.row();
				};
			})).width(320).center().row();

			cont.table(cons(t => {
				t.top().margin(6);
				t.add("$dialog.info.all-teams").growX().color(Pal.accent);
				t.row();
				t.image().fillX().height(3).pad(4).color(Pal.accent);
			})).width(320).center().row();

			cont.pane(cons(p => {
				var rt = 0;
				var teams = Team.all;

				for(var i in teams){
					var team = teams[i];

					this.addTeamButton(p, team);
					if(++rt % 3 == 0) p.row();
				};
			})).width(320).height(220).center().row();

			cont.table(cons(t => {
				t.top().margin(6);
				t.add("$dialog.short.others").growX().color(Pal.accent);
				t.row();
				t.image().fillX().height(3).pad(4).color(Pal.accent);
			})).width(320).center().row();

			cont.table(cons(t => {
				t.button("$dialog.info.reset-team", () => {
					this.setTeam(this.team.id);
				}).growX().height(54).pad(4).row();

				t.button("$dialog.info.set-team-id", () => {
					Vars.ui.showTextInput("", "$dialog.short.set-id", 8, this.getTeam().id, true, cons(t => {
						if(Team.get(t) != null){
							this.setTeam(t);
						}else{
							Vars.ui.showErrorMessage("$dialog.short.invalid-id");
						}
					}));
				}).growX().height(54).pad(4);
			})).width(300);

			dialog.addCloseButton();
			dialog.show();
		},

		posDialog(){
			var dialog = new BaseDialog("$dialog.title.select-position");
			var cont = dialog.cont;

			cont.table(cons( t => {
				t.button("$dialog.info.reset-position", () => {
					this.setUnitX(this.getX());
					this.setUnitY(this.getY());
				}).growX().height(54).pad(4);
			})).width(300).center().row();

			cont.table(cons(t => {
				t.top().margin(6);
				t.add("$dialog.info.custom-position").growX().color(Pal.accent);
				t.row();
				t.image().fillX().height(3).pad(4).color(Pal.accent);
			})).width(320).center().row();

			cont.table(cons(t => {
				var worldX = Vars.world.width();
				var worldY = Vars.world.height();

				t.button("$dialog.short.set-x", () => {
					Vars.ui.showTextInput("", "X:", 4, (this.getUnitX() / Vars.tilesize), true, cons(x => {
						if(x <= worldX){
							this.setUnitX(x * Vars.tilesize);
						}else{
							Vars.ui.showInfo("$dialog.error.invalid-pos");
						};
					}));
				}).growX().height(54).pad(4).row();

				t.button("$dialog.short.set-y", () => {
					Vars.ui.showTextInput("", "Y:", 4, (this.getUnitY() / Vars.tilesize), true, cons(y => {
						if(y <= worldY){
							this.setUnitY(y * Vars.tilesize);
						}else{
							Vars.ui.showInfo("$dialog.error.invalid-pos");
						};
					}));
				}).growX().height(54).pad(4);
			})).width(300).center();

			dialog.addCloseButton();
			dialog.show();
		},

		addTeamButton(p, team){
			p.button(cons(b => {
				b.left();
				b.image().size(40).pad(2).color(team.color);
			}), () => {
				this.setTeam(team.id);
			}).pad(2);
		},

		spawnUnit(unit, team, x, y){ //There is no ${}
			var teamColor = "[#" + team.color + "]";

			unit.spawn(team, x, y);
			//this.configure("Created unit " + teamColor + unit.localizedName + "[] at " + (x / Vars.tilesize) + ", " + (y / Vars.tilesize));
		},

		writeBase(write){
			this.super$writeBase(write);

			write.s(this._unit);
			write.s(this._team);

			write.s(this._unitX);
			write.s(this._unitY);
		},

		readBase(read){
			this.super$readBase(read);

			this._unit = read.s();
			this._team = read.s();

			this._unitX = read.s();
			this._unitY = read.s();
		},

		setUnit(id){
			this._unit = id;
		},

		getUnit(){
			return Vars.content.getByID(ContentType.unit, this._unit);
		},

		setTeam(id){
			this._team = id;
		},

		getTeam(){
			return Team.get(this._team);
		},

		setUnitX(pos){
			this._unitX = pos;
		},

		getUnitX(){
			return this._unitX;
		},

		setUnitY(pos){
			this._unitY = pos;
		},

		getUnitY(){
			return this._unitY;
		}
	});
	return ent;
};
