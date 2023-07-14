let playersAtendance = [];

// 플레이어가 입장할 때 동작하는 함수
App.onJoinPlayer.Add(function (player) {
    App.sayToAll(App.players); 
    for(let le in lest_)
    {
        
        if(player == playersAtendance[le])
        {
            //esesL--lest.splice(le, 1);
        }
    }
    
});

App.onObjectTouched.Add(function (player) {
    player.tag = {
		widget: null,
	};

	player.tag.widget = player.showWidget("sample.html", "top", 600, 500);
    player.tag.widget.sendMessage(playersAtendance);
	player.tag.widget.onMessage.Add(function (player, msg) {
		// 위젯에서 App으로 'type: close'라는 메시지를 보내면 위젯을 파괴함
		if (msg.type == "close") {
			player.tag.widget.destroy();
			player.tag.widget = null;
		}
        if (msg.type == "reset") {
            playersAtendance = App.players; 
        }
	});
});