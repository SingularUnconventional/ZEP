let a = null;
let bud = 0;
//특정 숫자 제시하면 그 숫자를 빨리 맞추는 사람 승리
App.addOnKeyDown(82, function(player){
    if(player.tileY == 10)
    {
        if(bud == 0) a += player.tileX - 10;
        if(bud == 1) a -= player.tileX - 10;
        if(bud == 2) a *= player.tileX - 10;
        if(bud == 3) a /= player.tileX - 10;
    }
        
    if(player.tileY == 12)
    {
        if(player.tileX == 10) bud = 0;
        if(player.tileX == 12) bud = 2;

        if(player.tileX == 19)
        {
            App.sayToAll(`값은 : ${a}`); 
            a = 0;
            bud = 0;
        }
    }
    if(player.tileY == 13)
    {
        if(player.tileX == 10) bud = 1;
        if(player.tileX == 12) bud = 3;
    }
	
});


let number = 0;
let blueman_dance = App.loadSpritesheet("testBoll.png", 64, 64, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 8);
App.addOnKeyDown(80, function(player){
    Map.putObject(x, y, blueman_dance[0]);
});