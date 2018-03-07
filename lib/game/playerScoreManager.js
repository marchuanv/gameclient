function PlayerScoreManager(playerScoreManager){

	function Score(name, value){
		this.name = name;
		this.value = value;
	};

	this.createPlayerScore = function(name){
		cache.set("currentPlayer", new Score(name, 0), null, true);
	};

	this.getCurrentPlayerScore = function(cbPlayerScore){
		cache.get("currentPlayer", function(playerScore){
			cbPlayerScore(playerScore);
		});
	};

	this.reset = function(){
		create();
	};
}