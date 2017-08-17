/*[]*/
/*CLASS*/
/*SINGLETON*/
function Score(name, value){
	this.name = name;
	this.value = value;
};
function create(){
	players = [
		new Score("Fachtna Hrolf",10),
		new Score("Senán Fabio",14),
		new Score("Bartolomeo Zopyros",106),
		new Score("Jadran Nevan",104),
		new Score("Bjartr Shikoba",50),
	];
	return players;
};
function sortPlayers(count){
	if (count > 0){
		players.sort(function(p1,p2){
			return p1.value - p2.value;
		});
		count--;
		sortPlayers(count);
	}
};
this.getPlayers = function(cbFound){
	var players = create();
	cache.set("playerScoreIndex", players.length);
	enumerate(players, this, function(player, cbCon, cbRemove, cbBreak){
		cache.get("playerScoreIndex", function(_index){
			if (_index > 0){
				_index--;
				cache.set("playerScoreIndex", _index);
				cbFound(player);
				cbBreak();
				cbRemove();
			}
		});
	});
};

this.reset = function(){
	create();
};
