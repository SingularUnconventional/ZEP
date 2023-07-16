App.onObjectTouched.Add(function (player, x, y, tileID, obj) {
    if(obj.param1[0] == '&')
    {
        question = obj.param1.split('|');
        player.showPrompt(question[1].replace(/&/g, '\n'), function(inputText){
            if (inputText == question[2]){
                player.showAlert("정답이에요!");
            }
            else{
                player.showAlert("아쉽지만 틀렸어요..");
            }
        });
    }
});