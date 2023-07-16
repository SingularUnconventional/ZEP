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
            player.tag.Inventory.splice(player.tag.InventoryNow, 1);
            player.tag.InventoryNow = player.tag.InventoryNow%player.tag.Inventory.length;
            resetImage(player);
        }
    } ,
    cans_sprite : {
        name : 'cans_sprite',
        function : function (player) {
            App.sayToAll(`${player.name}가 맛있는 사이다를 마셨습니다.`); 
            player.tag.Inventory.splice(player.tag.InventoryNow, 1);
            player.tag.InventoryNow = player.tag.InventoryNow%player.tag.Inventory.length;
            resetImage(player);
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
            player.tag.Inventory.splice(player.tag.InventoryNow, 1);
            player.tag.InventoryNow = player.tag.InventoryNow%player.tag.Inventory.length;
            resetImage(player);
        }
    } ,
    view_restriction : {
        name : 'cans_coke',
        function : function (player) {
            App.sayToAll(`${player.name}가 들어왔습니다.`); 
        }
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
            button.image = App.loadSpritesheet(`item_img/${player.tag.Inventory[player.tag.InventoryNow].name}.png`);
            button.sendUpdated();
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
    if (obj.param1 == "drink vending machine"){
        player.showPrompt("자판기에는 콜라, 사이다, 커피, 솔의 눈이 있습니다.\n마시고 싶은 음료를 선택해 주세요.", function(inputText){
            if(inputText == "콜라"){
                player.tag.Inventory.push(item.cans_coke);
                player.tag.InventoryNow = player.tag.Inventory.length-1;
                resetImage(player);
            } else 
            if(inputText == "사이다"){
                player.tag.Inventory.push(item.cans_sprite);
                player.tag.InventoryNow = player.tag.Inventory.length-1;
                resetImage(player);
            } else 
            if(inputText == "커피"){
                player.tag.Inventory.push(item.cans_coffee);
                player.tag.InventoryNow = player.tag.Inventory.length-1;
                resetImage(player);
            } else 
            if(inputText == "솔의 눈"){
                player.tag.Inventory.push(item.cans_eyeOfPine);
                player.tag.InventoryNow = player.tag.Inventory.length-1;
                resetImage(player);
            }
            else player.showAlert("그런 음료는 없어요..");
        }
        )
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
});


App.addOnKeyDown(81,function(p){
	if(App.displayRatio == 1){
		App.displayRatio = 5;
	}else{
		App.displayRatio = 1;
	}
	App.sendUpdated(); //* 앱의 Field값이 변경되면 App.sendUpdated()로 변경값을 적용
})