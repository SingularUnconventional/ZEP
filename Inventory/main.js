const item = {
    starting_Note : {
        name : 'starting_Note',
        function : function (player) {
            player.showAlert(`
            자판기 : 자판기를 통해 원하는 음료를 마실 수 있어요.
            쓰레기 줍기 : 맵에 있는 쓰레기를 주워 쓰레기통에 버릴 수 있어요.
            스탬프 찍기 : 왼쪽에 있는 스탬프 앱을 열고 맵 곳곳에 숨겨신 스탬프들을 찾아보세요.
            물약 찾기 : 책을 좋아하시면 2가지의 물약을 찾을 수 있어요.
            숨겨진 미로 : 어딘가에 있으며, 쉽지는 않아요.
            퀴즈 방탈출 : 모둠원들끼리 머리를 맞대어 퀴즈를 풀고 방을 탈출하세요.

            기본 키
            이동 : WASD
            실행 : F
            인벤토리 전환 : R
            인벤토리 아이템 사용 : E
            공격 : Z
            앉기 : X
            `);
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
    if (player.storage == null)
    {
        player.storage = "starting_Note";
        player.save();
    }
    player.tag = {
		InventoryNow: 0,
		Inventory: [],
        button: App.addMobileButton(8, 145, -20, function (player) {
            player.tag.Inventory[player.tag.InventoryNow].function(player);
        })
	}; 

    for(st of player.storage.split('|')){
        player.tag.Inventory.push(item[st]);
    }

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

App.onLeavePlayer.Add(function(player){
    storage_ = [];
    for(st of player.tag.Inventory){
        storage_.push(st.name);
    }
    player.storage = storage_.join("|");
    player.save();
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