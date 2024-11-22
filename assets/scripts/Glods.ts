import { _decorator, Component, Node,Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Glod')
export class Glod extends Component {
    @property(Node)
    private bgNode = null

    start() {
        this.startAnim()
    }

    update(deltaTime: number) {

    }

    startAnim(){
        const ani = this.bgNode.getComponent(Animation)
        ani.play()
    }
}


