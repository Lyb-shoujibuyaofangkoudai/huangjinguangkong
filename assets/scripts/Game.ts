import { _decorator, Component, instantiate, Node, Prefab, UITransform, Vec3,math } from 'cc';
import { showDebug } from "db://assets/utils/debug";
import { randomInt } from "db://assets/utils/utils";

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property({ type: Prefab })
    private goldPrefab0 = null
    @property({ type: Prefab })
    private goldPrefab1 = null
    @property({ type: Prefab })
    private goldPrefab2 = null
    @property({ type: Prefab })
    private rockPrefab = null
    @property(Node)
    private itemContainer: Node = null // 金子（物品）容器

    @property({ type: Boolean })
    private isDebug = false;

    start() {
        showDebug(this.isDebug)
        this.createGoldNodes(10)
    }

    update(deltaTime: number) {

    }

//     随机生成N个金子节点
    createGoldNodes(n: number) {
        const map = {
            0: this.goldPrefab0,
            1: this.goldPrefab1,
            2: this.goldPrefab2
        }
        for ( let i = 0; i < n; i++ ) {
            const prefabItem = map[randomInt(0, 10) % 3]
            const x = randomInt(50 - this.itemContainer.getComponent(UITransform).width / 2, -50 + this.itemContainer.getComponent(UITransform).width / 2)
            const y = randomInt(-200, -this.itemContainer.getComponent(UITransform).height + 200)
            let position = new Vec3(x, y, 0)
            let itemNode = randomInt(0, 10) < 5 ? this.createRockPrefab(position) : this.createGoldPrefab(position, prefabItem)
            this.node.addChild(itemNode)
        }
    }


    createGoldPrefab(position, goldItem) {
        let goldNode = instantiate(goldItem)
        goldNode.setPosition(position)
        return goldNode
    }

    createRockPrefab(position) {
        const rock = instantiate(this.rockPrefab)
        const prefabItemWidth = rock.getComponent(UITransform).width
        const prefabItemHeight = rock.getComponent(UITransform).height
        position = new Vec3(position.x > 0 ? position.x + prefabItemWidth : position.x - prefabItemWidth, randomInt(0, 10) < 5 ? position.y + prefabItemHeight : position.y - prefabItemHeight, 0)
        rock.setPosition(position)
        return rock
    }


}


