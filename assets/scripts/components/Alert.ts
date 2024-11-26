import { _decorator, Component, Node,Animation,Label,Color, director } from 'cc';
const { ccclass, property } = _decorator;

export enum DescType {
    SUCCESS,
    FAIL
}

@ccclass('alert')
export class alert extends Component {
    @property(Node)
    popupNode: Node = null; // 假设popupNode是你的弹窗节点
    @property(Node)
    private scoreNode = null
    @property(Node)
    private targetScoreNode = null
    @property(Node)
    private descNode = null


    start() {
        this.popupNode.active = false;
    }

    update(deltaTime: number) {

    }

    openPopup() {
        console.log("打开弹窗")
        if (!this.popupNode) {
            console.error('Popup node is not assigned!');
            return;
        }

        this.popupNode.active = true;
        const anim = this.popupNode.getComponent(Animation);
        if (anim) {
            anim.play();
        } else {
            console.error('Animation component not found on popup node!');
        }
    }
    setScoreText(score) {
        this.scoreNode.getComponent(Label).string = `$${score}`
    }
    setTargetScoreText(targetScore) {
        this.targetScoreNode.getComponent(Label).string = `$${targetScore}`
    }
    setDescText(descType: DescType) {
        this.descNode.getComponent(Label).string = descType === DescType.SUCCESS ? "挑战成功！" : "挑战失败！"
        this.descNode.getComponent(Label).color = descType === DescType.SUCCESS? Color.GREEN : Color.RED
    }

    handleConfirm(e,str) {
        console.log("确认",e,str)
        director.loadScene("Game")
    }
    handleCancel(e,str) {
        console.log("取消",e,str)
    }
}


