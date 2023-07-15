//인벤토리
const item = {
    Null : function (player) {
        player.sendMessage("아이템이 없습니다. 아이템을 얻으세요.", 0xfff899)
    },
    view_restriction : function (player) {
        App.sayToAll(`${player.name}가 들어왔습니다.`); 
    }
}

// 플레이어가 입장할 때 동작하는 함수
App.onJoinPlayer.Add(function (player) {
    player.tag = {
		InventoryNow: 0,
		Inventory: [item.Null],
	};
    if(player.isMobile){
		button = App.addMobileButton(8, 145, 75, function (player) {
            player.tag.Inventory[player.tag.InventoryNow](player);
        });
	} else{
        player.tag.widget = player.showWidget("inventory_widget.html", "sidebar", 100, 100);
	}
});