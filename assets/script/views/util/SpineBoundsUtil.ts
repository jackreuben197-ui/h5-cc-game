/**
 * Spine 包围盒测量工具（图鉴表情动画归一化用）。
 * 可靠量法：在【已激活】的 sp.Skeleton 上，setAnimation 后延迟一帧，再沿一个动画循环
 * 多次推进采样包围盒取最大。调用方需先 setAnimation，再 scheduleOnce(cb,0) 后调用。
 */
export interface SpineBounds {
    szX: number;
    szY: number;
    offX: number;
    offY: number;
    /** 较大边长度，0 表示量不到 */
    max: number;
}

/** 取动画循环时长（秒）；取不到返回 1 */
export function getAnimDuration(sk: sp.Skeleton, animName: string): number {
    try {
        const rd: any = (sk as any).skeletonData && (sk as any).skeletonData.getRuntimeData ? (sk as any).skeletonData.getRuntimeData() : null;
        const anim = rd && rd.findAnimation ? rd.findAnimation(animName) : null;
        if (anim && anim.duration > 0) return anim.duration;
    } catch (e) {}
    return 1;
}

/** 在已激活组件上沿一个动画循环采样包围盒取最大。须在 setAnimation + 延迟一帧后调用。 */
export function sampleLiveBounds(sk: sp.Skeleton, dur: number): SpineBounds {
    let szX = 0,
        szY = 0,
        offX = 0,
        offY = 0;
    try {
        const core: any = (sk as any)._skeleton;
        if (core && core.getBounds) {
            const mk = () => ({
                x: 0,
                y: 0,
                set(a: number, b: number) {
                    this.x = a;
                    this.y = b;
                }
            });
            const steps = 16;
            const d = dur > 0 ? dur : 1;
            for (let s = 0; s <= steps; s++) {
                try {
                    if (s > 0) (sk as any).update(d / steps);
                    core.updateWorldTransform();
                    const off = mk(),
                        sz = mk();
                    core.getBounds(off, sz, []);
                    if (sz.x > 0 && sz.y > 0 && sz.x * sz.y > szX * szY) {
                        szX = sz.x;
                        szY = sz.y;
                        offX = off.x;
                        offY = off.y;
                    }
                } catch (e) {}
            }
        }
    } catch (e) {}
    return { szX, szY, offX, offY, max: Math.max(szX, szY) };
}
