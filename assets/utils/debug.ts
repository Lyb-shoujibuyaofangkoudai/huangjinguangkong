import { _decorator, Component,PhysicsSystem2D,EPhysics2DDrawFlags, Collider2D,Contact2DType,Node, Vec3,tween,input,Input } from 'cc';
// 显示物理调试信息
export function showDebug(isDebug = true) {
    if ( isDebug ) {
        PhysicsSystem2D.instance.debugDrawFlags =
            EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;
    } else {
        // 关闭调试区域
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.None;
    }
}
