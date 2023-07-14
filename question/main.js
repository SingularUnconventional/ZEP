question = [
    {
        input: "가장 귀여운 동물", 
        output: 
        [
            "강아지",
            "고양이",
            "뱀",
            "사자"
        ],
        answer: 1
    },
    {
    input: "Malala의 아버지는 어떤 일을 하였나요?", 
    output: 
    [
        "스쿨버스를 운영하였다.",
        "선생님이고, 소녀들이 다니는 학교를 운영했다.",
        "Malala와 함께 연설했다.",
        "소년들이 다니는 학교를 운영했다.",
        "Malala를 총으로 쐈다."
    ],
    answer: 1
    },
    {
        input: "버스를 타고 집에 가던 중 Malala에게 일어난 일로 알맞는 것은?", 
        output: 
        [
            "Malala의 친구가 총에 맞았다.",
            "Malala의 오른쪽 면 머리에 총알이 날아왔다.",
            "총을 든 남자가 Malala를 찾았다.",
            "총에 맞고 깨어나지 못했다."
        ],
        answer: 2
        },
        {
            input: "'Malala에게 아버지는 어떤 존재였나요?'", 
            output: 
            [
                "열정",
                "공포",
                "영감",
                "안타까운 존재",
                "걱정되는 존재"
            ],
            answer: 2
            },
        
]

App.onJoinPlayer.Add(function (player) {
    player.tag = {
		widget: null,
        number: 0
	};
});



App.onObjectTouched.Add(function (player) {

    if(!player.tag.widget){
        player.tag.widget = player.showWidget("main.html", "top", 600, 500);
        player.tag.widget.sendMessage(question[player.tag.number]);
    }
	player.tag.widget.onMessage.Add(function (player, msg) {
		// 위젯에서 App으로 'type: close'라는 메시지를 보내면 위젯을 파괴함
		if (msg.type == "close") {
			player.tag.widget.destroy();
			player.tag.widget = null;
		} else {
            if(question[player.tag.number].answer == msg.type) {
                player.showCenterLabel("정답!"); 
                player.tag.number = (player.tag.number + 1)%question.length;
            } else {
                player.showCenterLabel("오답.."); 
            }
            player.tag.widget.destroy();
			player.tag.widget = null;
        }
	});
});