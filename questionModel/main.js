let EscapePlayer = 0;


App.onJoinPlayer.Add(function (player) {
    player.tag = {
        remainingQuestions: ['1', '2', '3', '4', '5', '6'],
    }
    EscapePlayer++;
    for(let putTileEffect_IMPASSABLE_N of [90, 91, 92, 93, 94, 95, 96]){
        Map.putTileEffect(putTileEffect_IMPASSABLE_N, 9, TileEffectType.IMPASSABLE);
    }
});

App.onLeavePlayer.Add(function(player){
    EscapePlayer--;
});


App.onObjectTouched.Add(function (player, x, y, tileID, obj) {
    if(obj.param1[0] == '&')
    {
        question = obj.param1.split('|');
        player.showPrompt(question[1].replace(/&/g, '\n'), function(inputText){
            if (inputText == question[2]){
                player.tag.remainingQuestions = player.tag.remainingQuestions.filter((element) => element !== obj.text);
                if (player.tag.remainingQuestions.length == 0){
                    player.showAlert("당신은 모든 문제를 풀었어요.\n정답을 모둠원들과 공유해서 빠르게 탈출하세요.");
                    EscapePlayer--;
                    if(EscapePlayer == 0){
                        for(let putTileEffect_NONE_N of [90, 91, 92, 93, 94, 95, 96]){
                            Map.putTileEffect(putTileEffect_NONE_N, 9, TileEffectType.NONE);
                        }
                        player.showCustomLabel("모두가 정답을 풀었어요. 이제 출구가 열렸어요.");
                    }
                } else {
                    player.showAlert(`정답이에요!\n이제 ${player.tag.remainingQuestions.length}문제 남았어요.`);
                }
            }
            else if(inputText == ''){
                player.sendMessage("취소");
            }
            else{
                App.spawnPlayer(player.id, 93, 63);
                player.showAlert(`아쉽지만 틀렸어요..\n${player.tag.remainingQuestions.length}문제, 조금만 힘내봐요.`);
            }
        });
    }
});