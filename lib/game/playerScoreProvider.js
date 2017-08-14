/*[]*/
/*CLASS*/
/*SINGLETON*/
function Score(name, value){
	this.name = name;
	this.value = value;
};

var players = [];
function create(){
	players = [
		new Score("Fachtna Hrolf",10),
		new Score("Senán Fabio",14),
		new Score("Bartolomeo Zopyros",106),
		new Score("Jadran Nevan",104),
		new Score("Bjartr Shikoba",50),
	];
	players.sort(function(p1,p2){
		return p1.value - p2.value;
	});
};
create();

this.getSortedPlayers = function(cbFound){
	cbFound(players);
};

this.reset = function(){
	create();
};
