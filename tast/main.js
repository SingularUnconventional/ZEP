let a = 0;
let b = 0;
//특정 숫자 제시하면 그 숫자를 빨리 맞추는 사람 승리
App.addOnKeyDown(82, function(player){
    if(player.tileY == 10)
        b = player.tileX - 10;
    if(player.tileY == 12)
    {
        if(player.tileX == 10)
            a += b;

        if(player.tileX == 12)
            a *= b;

        if(player.tileX == 19)
        {
            App.sayToAll(`값은 : ${a}`); 
            a = 0;
        }
    }
    if(player.tileY == 13)
    {
        if(player.tileX == 10)
            a -= b;

        if(player.tileX == 12)
            a /= b;
    }
	
});