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
    App.getStorage(function () {
    let appStorage = JSON.parse(App.storage);
    if(player.isMobile){
        player.tag.button.image = App.loadSpritesheet(`item_img/${appStorage[player.id][player.tag.InventoryNow].name}.png`);
	    player.tag.button.sendUpdated();
	} else{
        player.tag.widget.sendMessage(appStorage[player.id][player.tag.InventoryNow].name);
	}
});
}

function getItem(player, Item){
    App.getStorage(function () {
		let appStorage = JSON.parse(App.storage);
		appStorage[player.id].push(Item);
        player.tag.InventoryNow = appStorage[player.id].length-1;

        App.setStorage(JSON.stringify(appStorage));
    });
    resetImage(player);
}

function delItem(player){
    App.getStorage(function () {
		let appStorage = JSON.parse(App.storage);
		appStorage[player.id].splice(player.tag.InventoryNow, 1);
		
        player.tag.InventoryNow = player.tag.InventoryNow%appStorage[player.id].length;
        App.setStorage(JSON.stringify(appStorage));
	});
    resetImage(player);
}


App.onStart.Add(function(){
	if(App.storage == null){
		App.setStorage(JSON.stringify({}))
	}
})

// 플레이어가 입장할 때 동작하는 함수
App.onJoinPlayer.Add(function (player) {
    App.getStorage(function () {
    let appStorage = JSON.parse(App.storage);

    if(!(player.id in appStorage[player.id])){
        appStorage[player.id] = [item.Null];
    }
    
    player.tag = {
		InventoryNow: 0,
		Inventory: [item.Null],
        button: App.addMobileButton(8, 145, -20, function (player) {
            appStorage[player.id][player.tag.InventoryNow].function(player);
        })
	};  
    if(player.isMobile){
        player.tag.button.image = App.loadSpritesheet(`item_img/${appStorage[player.id][player.tag.InventoryNow].name}.png`);
	    player.tag.button.sendUpdated();

        button2 = App.addMobileButton(8, 130, 40, function (player) {
            player.tag.InventoryNow = (player.tag.InventoryNow + 1)%appStorage[player.id].length;
            player.tag.button.image = App.loadSpritesheet(`item_img/${appStorage[player.id][player.tag.InventoryNow].name}.png`);
            player.tag.button.sendUpdated();
        });
        button2.image = App.loadSpritesheet("mobile_changeButtonImg.png");
	    button2.sendUpdated();

	} else{
        player.tag.widget = player.showWidget("inventory_widget.html", "sidebar", 150, 150);
        player.tag.widget.sendMessage(appStorage[player.id][player.tag.InventoryNow].name);
	}

    App.setStorage(JSON.stringify(appStorage));
    });
});


App.addOnKeyDown(69,function(player){
    App.getStorage(function (player) {
    let appStorage = JSON.parse(App.storage);
    App.sayToAll(appStorage[player.id][player.tag.InventoryNow]); 
    appStorage[player.id][player.tag.InventoryNow].function(player);
    });
})
App.addOnKeyDown(82,function(player){
    App.getStorage(function () {
    let appStorage = JSON.parse(App.storage);
    player.tag.InventoryNow = (player.tag.InventoryNow + 1)%appStorage[player.id].length;
    player.tag.widget.sendMessage(appStorage[player.id][player.tag.InventoryNow].name);
    });
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
                App.getStorage(function () {
                let appStorage = JSON.parse(App.storage);
                if(appStorage[player.id][player.tag.InventoryNow].name == "trash"){
                    player.sendMessage("쓰레기를 쓰레기통에 버렸습니다!", 0xfff899);
                    delItem(player);
                }
                });
                break;
            case "transparent potion":
                getItem(player, item.potion_transparent);
                break;
            case "speed potion":
                getItem(player, item.potion_speed);
                break;
            }
    }
    else if(tileID == '80523685'){
        Map.putObject(x, y, null);
        getItem(player, item.trash);
    }
});