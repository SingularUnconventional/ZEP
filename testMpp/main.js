const item = {
    Null : {
        name : 'Null',
        function : function (player) {
            player.sendMessage("아이템이 없습니다. 아이템을 얻으세요.", 0xfff899)
        }
    },
    cans_coke : {
        name : 'cans_coke',
        function : function (player) {
            App.sayToAll(`${player.name}가 맛있는 콜라를 마셨습니다.`); 
            delItem(player);
        }
    } ,
    cans_sprite : {
        name : 'cans_sprite',
        function : function (player) {
            App.sayToAll(`${player.name}가 맛있는 사이다를 마셨습니다.`); 
            delItem(player);
        }
    } ,
    cans_coffee : {
        name : 'cans_coffee',
        function : function (player) {
            App.sayToAll(`${player.name}가 맛있는 커피를 마셨습니다.`); 
            player.tag.Inventory.splice(player.tag.InventoryNow, 1);
            player.tag.InventoryNow = player.tag.InventoryNow%player.tag.Inventory.length;
            resetImage(player);
        }
    } ,
    cans_eyeOfPine : {
        name : 'cans_eyeOfPine',
        function : function (player) {
            App.sayToAll(`${player.name}가 솔의 눈을 마셨습니다.`); 
            delItem(player);
        }
    } ,
    potion_transparent : {
        name : 'potion_transparent',
        function : function (player) {
            if(player.hidden){
                player.sendMessage("투명화 상태가 해제되었습니다.", 0xfff899);
                player.hidden = false;
            }
            else {
                player.sendMessage("당신은 투명화 상태입니다. 재섭취 시 해제됩니다.", 0xfff899);
                player.hidden = true;
            }
            
	        player.sendUpdated();
            delItem(player);
        }
    } ,
    potion_speed : {
        name : 'potion_speed',
        function : function (player) {
            if(player.moveSpeed == 150){
                player.sendMessage("속도 강화가 해제되었습니다.", 0xfff899);
                player.moveSpeed = 80;
            }
            else{
                player.sendMessage("당신은 속도 강화 상태입니다. 재섭취 시 해제됩니다.", 0xfff899);
                player.moveSpeed = 150;
            }
            
	        player.sendUpdated();
            delItem(player);
        }
    } ,
    trash : {
        name : 'trash',
        function : function (player) {}
    } ,

}

function resetImage(player) {
    if(player.isMobile){
        player.tag.button.image = App.loadSpritesheet(`item_img/${player.tag.Inventory[player.tag.InventoryNow].name}.png`);
	    player.tag.button.sendUpdated();
	} else{
        player.tag.widget.sendMessage(player.tag.Inventory[player.tag.InventoryNow].name);
	}
}

function getItem(player, Item){
    player.tag.Inventory.push(Item);
    player.tag.InventoryNow = player.tag.Inventory.length-1;
    resetImage(player);
}

function delItem(player){
    player.tag.Inventory.splice(player.tag.InventoryNow, 1);
    player.tag.InventoryNow = player.tag.InventoryNow%player.tag.Inventory.length;
    resetImage(player);
}


// 플레이어가 입장할 때 동작하는 함수
App.onJoinPlayer.Add(function (player) {
    player.tag = {
		InventoryNow: 0,
		Inventory: [item.Null],
        button: App.addMobileButton(8, 145, -20, function (player) {
            player.tag.Inventory[player.tag.InventoryNow].function(player);
        })
	};  
    if(player.isMobile){
        player.tag.button.image = App.loadSpritesheet(`item_img/${player.tag.Inventory[player.tag.InventoryNow].name}.png`);
	    player.tag.button.sendUpdated();

        button2 = App.addMobileButton(8, 130, 40, function (player) {
            player.tag.InventoryNow = (player.tag.InventoryNow + 1)%player.tag.Inventory.length;
            player.tag.button.image = App.loadSpritesheet(`item_img/${player.tag.Inventory[player.tag.InventoryNow].name}.png`);
            player.tag.button.sendUpdated();
        });
        button2.image = App.loadSpritesheet("mobile_changeButtonImg.png");
	    button2.sendUpdated();

	} else{
        player.tag.widget = player.showWidget("inventory_widget.html", "sidebar", 150, 150);
        player.tag.widget.sendMessage(player.tag.Inventory[player.tag.InventoryNow].name);
	}
});


App.addOnKeyDown(69,function(player){
    player.tag.Inventory[player.tag.InventoryNow].function(player);
})
App.addOnKeyDown(82,function(player){
    player.tag.InventoryNow = (player.tag.InventoryNow + 1)%player.tag.Inventory.length;
    player.tag.widget.sendMessage(player.tag.Inventory[player.tag.InventoryNow].name);
})


App.onObjectTouched.Add(function (player, x, y, tileID, obj) {
    if (obj !== null) {
        switch (obj.param1){
            case "drink vending machine":
                player.showPrompt("자판기에는 콜라, 사이다, 커피, 솔의 눈이 있습니다.\n마시고 싶은 음료를 선택해 주세요.", function(inputText){
                    switch (inputText){
                        case "콜라": 
                            getItem(player, item.cans_coke);
                            break;
                        case "사이다":
                            getItem(player, item.cans_sprite);
                            break;
                        case "커피":
                            getItem(player, item.cans_coffee);
                            break;
                        case "솔의 눈":
                            getItem(player, item.cans_eyeOfPine);
                            break;
                        default: 
                            player.showAlert("그런 음료는 없어요..");
                            break;
                    }
                });
                break;
            case "wastebasket":
                if(player.tag.Inventory[player.tag.InventoryNow].name == "trash"){
                    player.sendMessage("쓰레기를 쓰레기통에 버렸습니다!", 0xfff899);
                    delItem(player);
                }
                break;
            }

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
    }
    else if(tileID == '80523685'){
        Map.putObject(x, y, null);
        getItem(player, item.trash);
    }
});


App.addOnKeyDown(81,function(p){
	if(App.displayRatio == 1){
		App.displayRatio = 5;
	}else{
		App.displayRatio = 1;
	}
	App.sendUpdated(); //* 앱의 Field값이 변경되면 App.sendUpdated()로 변경값을 적용
})