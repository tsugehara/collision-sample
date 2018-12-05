function main(param) {
	var scene = new g.Scene({game: g.game});
	scene.loaded.add(function() {
		function generateRect(x, y) {
			// 半分より右かを判定
			var right = x > g.game.width / 2 + 16;
			var rect = new g.FilledRect({
				scene: scene,
				// 半分より右なら青、左なら赤
				cssColor: right ? "#0000ff" : "#ff0000",
				x: x - 16,
				y: y - 16,
				width: 32,
				height: 32,
				tag: {
					right: right
				}
			});
			return rect;
		}

		// 任意の場所をタップしたら四角を生成する
		scene.pointDownCapture.add(function(e) {
			var rect = generateRect(e.point.x, e.point.y);
			scene.append(rect);
		});

		// 接触判定と当たり判定を毎フレーム実施する
		scene.update.add(function() {
			// 全エンティティの接触を検査
			for (var i = 0; i < scene.children.length - 1; i++) {
				var current = scene.children[i];
				var damage = 0;
				// 接触していればで判定
				for (var j = i + 1; j < scene.children.length; j++) {
					// Note: ここでtag.rightが同一であればスキップとかやってもよい
					// CollisionモジュールのintersectAreasで接触判定
					var target = scene.children[j];
					if (g.Collision.intersectAreas(current, target)) {
						// 検査対象と接触しているエンティティは削除
						var distanceByCenter = g.Util.distance(
							current.x + current.width / 2,
							current.y + current.height / 2,
							target.x + target.width / 2,
							target.y + target.height / 2
						);
						// 接触した距離の大きさに応じてダメージを計算
						var currentDamage = 32 - distanceByCenter;
						// ダメージが無ければ処理を中断
						if (currentDamage < 1) continue;
						// 元の4分の1以上の近さであれば致命傷とする
						if (distanceByCenter < 8) {
							currentDamage = 32;
						}
						damage += currentDamage;
						// ダメージ分大きさを小さくする
						target.width -= currentDamage;
						target.height -= currentDamage;
						// 一定以上大きさが小さくなっていたら削除
						if (target.width < 4) {
							target.destroy();
							j--;
						}
					}
				}
				if (damage > 0) {
					// 検査対象は累計ダメージを減算
					current.width -= damage;
					current.height -= damage;
					// 一定以上大きさが小さくなっていたら削除
					if (current.width < 4) {
						current.destroy();
						// destroyを呼ぶとchildrenからも削除されるのでiを1減らす
						i--;
					}
				}
			}
			// 残ったエンティティだけ移動させる
			scene.children.forEach(function(rect) {
				// 半分より右なら左に進み、左なら右に進む
				rect.x += rect.tag.right ? -1 : 1;
				rect.modified();
				// 画面からはみ出たら削除
				if (rect.x > g.game.width) {
					rect.destroy();
				} else if (rect.x < -32) {
					rect.destroy();
				}
			});
		});
	});
	g.game.pushScene(scene);
}

module.exports = main;
