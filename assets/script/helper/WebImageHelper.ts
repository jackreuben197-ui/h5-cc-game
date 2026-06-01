// /*
//  * @Author: xfj
//  * @Date: 2023-02-23 09:06:00
//  * @description:
//  * @LastEditors:
//  * @LastEditTime: 2023-03-08 19:10:51
//  * @FilePath: /pokerqueen/assets/script/helper/WebImageHelper.ts
//  */
// const { ccclass, property } = cc._decorator;
// @ccclass
//     private static mUrlTexture: Map<string, cc.SpriteFrame> = new Map(); //key=后缀,value=SpriteFrame
//     public static SetHeadImage(rawImage: cc.Sprite, url: string, defaultImage: cc.SpriteFrame = null): void {
//         let spriteFrame = this.mUrlTexture.get(url);
//         if (spriteFrame) {
//             rawImage.spriteFrame = spriteFrame;
//         } else {
//             rawImage.spriteFrame = defaultImage || AssetContext.getAsset('default_avatar_r');
//             if (url == null || url == '' || url == '-1' || ~url.indexOf('awanptesting.com')) return;
//             cc.assetManager.loadRemote(url, { ext: '.png' }, (err, asset: cc.Texture2D) => {
//                 // 设置packable为false,用于防止图片被打包
//                 asset.packable = false;
//                 if (err) {
//                 } else {
//                     let spriteframe = new cc.SpriteFrame(asset);
//                     rawImage.spriteFrame = spriteframe;
//                     this.mUrlTexture.set(url, spriteframe);
//                 }
//             });
//         }
//     }
//     public static SetUrlImage(rawImage: cc.Sprite, url: string, defaultImage: cc.SpriteFrame = null) {
//         return new Promise<void>((resolve, reject) => {
//             let spriteFrame = this.mUrlTexture.get(url);
//             if (spriteFrame) {
//                 rawImage.spriteFrame = spriteFrame;
//                 resolve();
//             } else {
//                 defaultImage && (rawImage.spriteFrame = defaultImage);
//                 if (url == null || url == '' || url == '-1' || ~url.indexOf('awanptesting.com')) return;
//                 cc.assetManager.loadRemote(url, { ext: '.png' }, (err, asset: cc.Texture2D) => {
//                     if (err) {
//                     } else {
//                         let spriteframe = new cc.SpriteFrame(asset);
//                         rawImage.spriteFrame = spriteframe;
//                         this.mUrlTexture.set(url, spriteframe);
//                         resolve();
//                     }
//                 });
//             }
//         });
//     }
//     public static loadRemoteSprite(url: string, sprite: cc.Sprite) {
//         return new Promise((relove, reject) => {
//             cc.assetManager.loadRemote(url, { ext: '.png' }, (error, texture: any) => {
//                 if (error || !texture) {
//                     if (error) {
//                         console.log('loadRemoteSprite', error);
//                         reject();
//                         return;
//                     }
//                     // console.log("loadRemote ===> " + error ? error.stack : "no texture!")
//                     reject(error);
//                 }
//                 let spriteFrame = new cc.SpriteFrame(texture);
//                 sprite.spriteFrame = spriteFrame;
//                 relove('');
//             });
//         });
//     }
//     /**
//      * @method 设置图片合适大小 取大
//      */
//     public static setImageSize(iamge: cc.Sprite, max_w: number, max_h: number): void {
//         let size = iamge.node.getContentSize();
//         let scale_w = max_w / size.width;
//         let scale_h = max_h / size.height;
//         let scale = scale_w < scale_h ? scale_h : scale_w;
//         iamge.node.scale = scale;
//     }
//     // //大写后缀映射小写
//     private static CapitalURLMap = [
//         ['.JPG', '.jpg'],
//         ['.PNG', '.png'],
//         ['.WEBP', '.webp']
//     ];
//     //格式化地址 JPG->jpg
//     private static GetExt(url: string) {
//         if (url) {
//             this.CapitalURLMap.forEach(item => {
//                 if (url.includes(item[0])) {
//                     //url = url.replace(item[0], item[1]);
//                 }
//             });
//         }
//         return url;
//     }
// }
// export default class WebImageHelper {
