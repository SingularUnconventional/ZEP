const lest = [
    "11109 이루기",
    "누렁이"
];

// 플레이어가 입장할 때 동작하는 함수
App.onJoinPlayer.Add(function (player) {
    for(le in lest)
    {
        if(player.name == lest[le])
        {
            lest.splice(le, 1);
        }
    }
    
});

App.onObjectTouched.Add(function (player) {
    player.tag = {
		widget: null,
	};

	player.tag.widget = player.showWidget("sample.html", "top", 600, 500);
    player.tag.widget.sendMessage({ text: lest });
	player.tag.widget.onMessage.Add(function (player, msg) {
		// 위젯에서 App으로 'type: close'라는 메시지를 보내면 위젯을 파괴함
		if (msg.type == "close") {
			player.showCenterLabel("위젯이 닫혔습니다.");
			player.tag.widget.destroy();
			player.tag.widget = null;
		}
	});
});