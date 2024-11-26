import { _decorator, Collider2D, Component, Script,Contact2DType,Tween, input, Input, Node, tween, UITransform, Vec3 } from 'cc';
import { CUS_EVENT_TYPE, ITEM_VALUE } from '../utils/constant';
import { Game } from './Game';
const { ccclass, property } = _decorator;
@ccclass('Hook')
export class Hook extends Component {
    @property(Node)
    private hookContainer: Node = null;
    @property(Node)
    private hookRopeNode = null;
    @property(Node)
    private hookNode = null
    @property(Node)
    private gameNode: Node = null;
    @property(Node)
    private itemBgNode: Node = null;

    @property
    private rotateSpeed: number = 60;
    @property
    private maxRotateAngle: number = 45;


    private hookMaxLength = 800; // 钩子最大长度
    private hookCanRotate = true
    private ropeTween = null; // 绳子变长动画缓动
    private ropeTweenReverse = null // 绳子变短动画缓动
    private hookNodeInGoldsNodePos = new Vec3(0, 0, 0) // 钩子与金子容器节点的相对位置
    private ropeDuration = 1
    private timeScale = 0.5 //  ropeDuration 的时间缩放 1为正常，0.5为半速，大于1为加速

    start() {
        this.hookMaxLength = this.itemBgNode.getComponent(UITransform).height
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
        this.registerRopeTween()
        this.registerHookCollision()

    }


    update(deltaTime: number) {
        this.rotateHook(deltaTime)
    }


    onTouchStart() {
        this.hookLengthen()
        this.hookNodeInGoldsNodePos = this.hookNode.position.clone()
    }

    // 让钩子旋转
    rotateHook(dt) {
        if ( !this.hookCanRotate ) return
        if ( this.hookContainer.angle >= this.maxRotateAngle ) {
            this.rotateSpeed = -Math.abs(this.rotateSpeed);
        } else if ( this.hookContainer.angle <= -this.maxRotateAngle ) {
            this.rotateSpeed = Math.abs(this.rotateSpeed);
        }
        // console.log("旋转速度：",this.rotateSpeed)
        this.hookContainer.angle += this.rotateSpeed * dt;
    }

    // 注册动画缓动
    async registerRopeTween() {
        this.ropeTweenReverse = tween(this.hookRopeNode)
            .to(this.ropeDuration, { height: this.hookRopeNode.height })
            .call(() => {
                this.ropeTweenReverse.stop()
                this.hookCanRotate = true
            })

        this.ropeTween = tween(this.hookRopeNode)
            .call(() => {
                this.hookCanRotate = false
            })
            .to(this.ropeDuration, { height: this.hookMaxLength })
            .then(this.ropeTweenReverse)
            .call(() => {
                this.ropeTween.stop()
            })
    }

    // 注册碰撞监听
    registerHookCollision() {
        let collider = this.hookNode.getComponent(Collider2D);
        if ( collider ) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(hookNodeCollder, itemCollder) {
        this.pullBackItems(hookNodeCollder, itemCollder)
    }

    // 绳子拉长
    hookLengthen() {
        this.ropeTween.start()
    }
    // 绳子停止变长
    hookRopeStop() {
        this.ropeTween.pause()
    }

    // 抓到物品 拉回
    async pullBackItems(hookNodeCollder, itemCollder) {
        this.hookRopeStop()
        const itemInfo = ITEM_VALUE[itemCollder.node.name]
        if(itemInfo) {
            this.timeScale = itemInfo.timeScale
        }
        this.ropeTweenReverse
            .timeScale(this.timeScale)
            .start()
        tween(itemCollder.node)
            .call(() => {
                itemCollder.node.setParent(this.hookContainer,true)
                itemCollder.node.setRotation(hookNodeCollder.node.rotation)
            })
            .to(this.ropeDuration, { position: this.hookNodeInGoldsNodePos })
            .timeScale(this.timeScale)
            .call(() => {
                this.gameNode.getComponent(Game).calcScore(itemInfo.value)
                if(itemInfo.addTime) {
                    this.gameNode.getComponent(Game).addTime(itemInfo.addTime)
                }
            })
            .removeSelf()
            .start()
    }
}


