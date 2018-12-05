// pointDownだけを使うコードです
function main(param) {
	var scene = new g.Scene({game: g.game});
	scene.loaded.add(function() {
		var rect = new g.FilledRect({
			scene: scene,
			cssColor: "#ff0000",
			width: 32,
			height: 32,	// 末尾のカンマのつけ忘れに注意
			touchable: true	// これを忘れずに追加
		});
		// pointDownトリガーを利用してエンティティとポインティングデバイスの接触判定を行う
		rect.pointDown.add(function(e) {
			// 画面の大きさの左半分のどこかに移動させる
			rect.moveTo(
				g.game.random.get(0, g.game.width / 2 - rect.width),
				g.game.random.get(0, g.game.height - rect.height),
			);
			rect.modified();
		});
		rect.update.add(function () {
			// 以下のコードは毎フレーム実行されます。
			rect.x++;
			if (rect.x > g.game.width) rect.x = 0;
			rect.modified();
		});
		scene.append(rect);
	});
	g.game.pushScene(scene);
}

module.exports = main;
