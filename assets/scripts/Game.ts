import { _decorator, Tween,Label,Component, find,instantiate, Node, Prefab, UITransform, Vec3,math } from 'cc';
import { showDebug } from "db://assets/utils/debug";
import { randomInt } from "db://assets/utils/utils";
import { alert, DescType } from "./components/Alert"

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
    private hookContainerNode = null
    @property(Node)
    private goldsNode = null
    @property(Node)
    private itemContainer: Node = null // 金子（物品）容器
    @property(Node)
    private scoreNode = null; // 得分节点
    @property(Node)
    private targetScoreNode: Node = null // 目标分数节点
    @property(Node)
    private countdownNode: Node = null // 计时节点

    @property({ type: Boolean })
    private isDebug = false;

    private countdown = 1
    private score = 0
    private targetScore = 100
    private countdownTimer = null

    start() {
        showDebug(this.isDebug)
        this.createGoldNodes(10)
        this.initScore()
        this.initCountDown()

    }

    update(deltaTime: number) {

    }

    initScore() {
        this.setScore()
        this.targetScoreNode.getComponent(Label).string = `目标金额：$${this.targetScore}`
        this.countdownNode.getComponent(Label).string = `倒计时：${this.countdown}s`
    }

    setScore() {
        this.scoreNode.getComponent(Label).string = `获得金额：$${this.score}`
    }
    initCountDown() {
        if(this.countdownTimer) return
        this.countdownTimer = setInterval(() => {
            this.countdown--
            this.countdownNode.getComponent(Label).string = `倒计时：${this.countdown}s`
            if(this.countdown <= 0) {
                clearInterval(this.countdownTimer)
                this.checkScoreIsEnough()
            }
        },1000)
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
            const x = randomInt(100 - this.itemContainer.getComponent(UITransform).width / 2, -100 + this.itemContainer.getComponent(UITransform).width / 2)
            const y = randomInt(-200, -this.itemContainer.getComponent(UITransform).height + 200)
            let position = new Vec3(x, y, 0)
            let itemNode = randomInt(0, 10) < 5 ? this.createRockPrefab(position) : this.createGoldPrefab(position, prefabItem)
            this.goldsNode.addChild(itemNode)
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

    calcScore(score:number) {
        this.score += score
        this.setScore()
    }

    addTime(time) {
        this.countdown += time
        this.countdownNode.getComponent(Label).string = `倒计时：${this.countdown}s`
    }

    checkScoreIsEnough() {
        Tween.stopAll()
        this.hookContainerNode?.getComponent("Hook")?.handleHookCanRotate(false)
        if(this.score < this.targetScore) {
            this.openPopup(DescType.FAIL)
        } else if(this.score >= this.targetScore) {
            this.openPopup(DescType.SUCCESS)
        }
    }

    openPopup(descType: DescType) {
        const alertScript = find("popup",this.node).getComponent(alert)
        alertScript.setScoreText(this.score)
        alertScript.setTargetScoreText(this.targetScore)
        alertScript.setDescText(descType)
        alertScript.openPopup()

    }


}


