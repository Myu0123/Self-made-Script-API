import { world, BlockPermutation, system , GameMode} from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";

async function desync(ticks) {
  for (let i = 0; i < ticks; i++) await null;
  return true;
}
const blocks = ["white_concrete","orange_concrete","magenta_concrete","light_blue_concrete",
"yellow_concrete","lime_concrete","pink_concrete","gray_concrete",
"light_gray_concrete","cyan_concrete","purple_concrete","blue_concrete",
"brown_concrete","green_concrete","red_concrete","black_concrete"]
const block = ["白色","橙色","洋紅色","淺藍色","黃色","淺綠色","粉紅色","灰色","淺灰色","青色","紫色","藍色","棕色","綠色","紅色","黑色"]

export function builditems(){
  world.beforeEvents.itemUse.subscribe(async (eventItem) => {
    const { itemStack, source } = eventItem;
    if (itemStack.typeId == "build:terrain") {
      eventItem.cancel = true;
      await desync();
      terrain(source)
    }
    if(itemStack.typeId === "build:brush"){
        eventItem.cancel = true;
        await desync();
        brushusing(source)
    }
  });
}

export function Yadjust(){
    world.afterEvents.entityHitEntity.subscribe((hit) => {
        let Ehit = hit.hitEntity
        if(Ehit.typeId == "build:terrain"){
            let Edmg = hit.damagingEntity
            let EcoeY = world.scoreboard.getObjective('coeY').getScore(Edmg)
            let EhorR = world.scoreboard.getObjective('HorR').getScore(Edmg)
            let EposY = null
            if(Edmg.hasTag("build:Abs")){
                EposY = EcoeY/100 > 320 ? 320 : EcoeY/100
                EposY = EposY < -64 ? -64 : EposY
            }
            else{
                EposY = EcoeY/100 + Ehit.location.y > 320 ? 320 : EcoeY/100 + Ehit.location.y
                EposY = EposY < -64 ? -64 : EposY
            }
            Ehit.runCommand(`scoreboard players set @s diffY ${Math.round((EposY-Edmg.location.y)*100)}`)
            Ehit.runCommand(`scoreboard players set @s HorD ${EhorR**2}`)
            Ehit.runCommand(`tp @s ~ ${EposY} ~`)
        }
    })
}
function terrain(player){
  if(player.isBusy == true) return;
  const form0 = new ActionFormData()
  .title("地形製作選項")
  .body("請選擇您要使用的功能")
  .button("地基生成")
  .button("筆刷工具")
  .button("繪點工具");
  player.isBusy = true;
  form0.show(player).then((response) => {
    player.isBusy = false;
    if(response.selection === 0){baseset(player)}
    if(response.selection === 1){brushset(player)}
    if(response.selection === 2){pointset(player)}
  })
}

function baseset(player){
    const form10 = new ActionFormData()
  .title("地基生成工具")
  .body("此功能用來快速生成粗製地形\n• 點擊 「地基方塊」 可以調整高度\n• 若 「地基方塊」 生成不完全,請進行重製\n※ 請注意! 不要多人同時使用此功能")
  .button("生成地基方塊")
  .button("調參係數設定")
  .button("地基填滿")
  .button("清除地基方塊");
  form10.show(player).then((response) => {
    if (response.selection === 0){
        if(player.runCommand(`testfor @e[type=build:terrain]`).successCount == 0){basegene(player)}
        else{player.runCommand(`msg @s 已存在地基方塊`)}
    }
    else if(response.selection === 1){coesetting(player)}
    else if(response.selection === 2){
        if(player.runCommand(`testfor @e[type=build:terrain]`).successCount == 0){player.runCommand(`msg @s 未存在地基方塊`)}
        else{basefill(player)}
    }
    else if(response.selection === 3){world.getDimension("overworld").runCommandAsync(`function build-reset`)}
  });
}

function basegene(player){
    let Xini = String(Math.floor(player.location.x))
    let Yini = String(Math.floor(player.location.y))
    let Zini = String(Math.floor(player.location.z))
    const form11 = new ModalFormData()
    .title("地基方塊生成")
    .textField("X初始座標", Xini, Xini)
    .textField("Y初始座標", Yini, Yini)
    .textField("Z初始座標", Zini, Zini)
    .slider("正X向間距(4格/區)", 1, 65, 4, 1)
    .slider("正Z向間距(4格/區)", 1, 65, 4, 1);
    form11.show(player).then((response) => {
        if(player.runCommand(`testfor @e[type=build:terrain]`).successCount != 0) {
            player.runCommand(`msg @s 已存在地基方塊`)
            return;
        }
        let Xpos = Math.floor(Number(response.formValues[0]))
        let Ypos = Math.floor(Number(response.formValues[1]))
        let Zpos = Math.floor(Number(response.formValues[2]))
        world.getDimension("overworld").runCommandAsync(`summon build:filler initial ${Xpos+0.5} ${Ypos} ${Zpos+0.5}`)
        world.getDimension("overworld").runCommandAsync(`scoreboard players set @e[type=build:filler,name=initial] "Xstep" ${response.formValues[3]}`)
        world.getDimension("overworld").runCommandAsync(`scoreboard players set @e[type=build:filler,name=initial] "Zstep" ${response.formValues[4]}`)
        world.getDimension("overworld").runCommandAsync(`scoreboard players set @e[type=build:filler,name=initial] "Xmove" ${response.formValues[3]}`)
        world.getDimension("overworld").runCommandAsync(`execute @e[type=build:filler,name=initial] ~~~ summon build:builder vX ~~~`)
        for(let i = 1; i <= response.formValues[3]; i +=4){
            world.getDimension("overworld").runCommandAsync(`execute @e[type=build:builder,name=vX] ~~~ summon build:builder`)
            world.getDimension("overworld").runCommandAsync(`execute @e[type=build:builder,name=vX] ~~~ scoreboard players set @e[type=build:builder,name=!vX,r=1] "Zmove" ${response.formValues[4]}`)
            world.getDimension("overworld").runCommandAsync(`execute @e[type=build:builder,name=vX] ~~~ tp @s ~4~~`)
        }
        world.getDimension("overworld").runCommandAsync(`kill @e[type=build:builder,name=vX]`)
    })
}
/*system.runInterval(() => {
    world.scoreboard.getObjective('Zmove').getScores().forEach(i => {
        let ent = i.participant.getEntity()
        if(ent.runCommand(`testfor @s[type=build:builder]`).successCount != 0){
            ent.runCommand(`execute @s[scores={Zmove=1..}] ~~~ summon build:terrain`)
            ent.runCommand(`scoreboard players set @e[type=build:terrain,r=1] "HorM" 0`)
            ent.runCommand(`tp @s[scores={Zmove=1..}] ~~~4`)
            ent.runCommand(`scoreboard players remove @s[scores={Zmove=1..}] Zmove 4`)
            ent.runCommand(`kill @s[scores={Zmove=..0}]`)
        }
    })
}, 2);*/
function coesetting(player){
    let coeY = String(world.scoreboard.getObjective('coeY').getScore(player)/100)
    let HorR = world.scoreboard.getObjective('HorR').getScore(player)
    const form12 = new ModalFormData()
    .title("調參係數設定")
    .textField("Y移動至", coeY, coeY)
    .toggle("相對座標/絕對座標", player.hasTag("build:Abs"))
    .slider("水平率R(R*R=H*D)", 0, 10, 1, HorR);
    form12.show(player).then((response) => {
        player.runCommand(`scoreboard players set @s coeY ${Math.round(Number(response.formValues[0]*100))}`)
        if(response.formValues[1] === true){player.runCommand(`tag @s add build:Abs`)}
        else{player.runCommand(`tag @s remove build:Abs`)}
        player.runCommand(`scoreboard players set @s HorR ${response.formValues[2]}`)
    })
}
system.runInterval(() => {
    world.getDimension("overworld").getEntities({
        type: "build:terrain", 
        scoreOptions: [{
            objective: "HorD",
            minScore: 1
        }]
    }).forEach((entI) => {
        let entIM = world.scoreboard.getObjective('HorM').getScore(entI)
        let entID = world.scoreboard.getObjective('HorD').getScore(entI)
        let entIY = entI.location.y
        world.getDimension("overworld").getEntities({
            type: "build:terrain"
        }).forEach((entJ) => {
            let distance = Math.sqrt((entJ.location.x-entI.location.x)**2 + (entJ.location.z-entI.location.z)**2)
            if(distance > entIM && distance <= entIM+1){
                let entJY = entJ.location.y
                entJ.runCommand(`tp @s ~ ${Math.floor((entJY*(entIM+1)/entID + entIY*(entID-entIM-1)/entID)*100)/100} ~`)
            }
        })
        if(entIM+1 >= entID){
            entI.runCommand(`scoreboard players set @s HorM 0`)
            entI.runCommand(`scoreboard players set @s HorD 0`)
        }
        else{
            entI.runCommand(`scoreboard players add @s HorM 1`)
        }
        
    })
}, 2);

function basefill(player){
    let test = {"a":["test","test"]}
    const form13 = new ModalFormData()
    .title("地基填滿")
    .dropdown("test", test["a"]);
    form13.show(player).then((response) => {
        world.getDimension("overworld").runCommandAsync(`tag @e[type=build:filler] add run`)
    })
}
system.runInterval(() => {
    world.getDimension("overworld").getEntities({type: "build:filler", tags: ["run"]}).forEach((entI) => {
        let x = 1
        let y = [entI.location.y,null,null,null,null]
        let z = 1
        world.getDimension("overworld").getEntities({type: "build:terrain"}).forEach((entJ) => {
            if(entJ.location.x - entI.location.x == 0 && entJ.location.z - entI.location.z == 0){
                y[1] = entJ.location.y
            }
            else if(entJ.location.x - entI.location.x == 4 && entJ.location.z - entI.location.z == 0){
                x = 4
                y[2] = entJ.location.y
            }
            else if(entJ.location.x - entI.location.x == 0 && entJ.location.z - entI.location.z == 4){
                z = 4
                y[3] = entJ.location.y
            }
            else if(entJ.location.x - entI.location.x == 4 && entJ.location.z - entI.location.z == 4){
                y[4] = entJ.location.y
            }
        })
        if(entI.runCommand(`testfor @s[scores={Xmove=1..,Zstep=1..}]`).successCount != 0){
            for(let k=0; k<x; k++){
                for(let l=0; l<z; l++){
                    let ty = Math.round(y[1]*(1-k/x)*(1-l/z)+y[2]*(k/x)*(1-l/z)+y[3]*(1-k/x)*(l/z)+y[4]*(k/x)*(l/z))
                    entI.runCommand(`fill ~${k} ${Math.round(y[0])} ~${l} ~${k} ${ty} ~${l} white_concrete replace air`)
                }
            }
        }
        entI.runCommand(`kill @e[type=build:terrain,x=~,y=-64,z=~,dx=1,dy=385,dz=1]`)
        entI.runCommand(`kill @s[scores={Xmove=..1,Zstep=..1}]`)
        if(entI.runCommand(`testfor @s[scores={Xmove=2..}]`).successCount != 0){
            entI.runCommand(`tp @s ~4~~`)
            entI.runCommand(`scoreboard players remove @s Xmove 4`)
        }
        else if(entI.runCommand(`testfor @s[scores={Xmove=..1,Zstep=2..}]`).successCount != 0){
            let entIx = world.scoreboard.getObjective('Xstep').getScore(entI.id)
            entI.runCommand(`tp @s ~${-entIx+1}~~4`)
            entI.runCommand(`scoreboard players remove @s Zstep 4`) 
            entI.runCommand(`scoreboard players operation @s Xmove = @s Xstep`)
        }   
    })
}, 4);

function brushset(player){
    const form20 = new ActionFormData()
    .title("筆刷工具")
    .body("此功能用來編輯地形細節\n• 「筆刷設定」 的選項將套用到所有模式\n※ 送出模式設定才會套用該模式")
    .button("筆刷設定")
    .button("替換模式(油漆)")
    .button("填充模式(遮罩)")
    .button("隨機模式(平面)")
    .button("隨機模式(立體)");
    form20.show(player).then((response) => {
      if (response.selection === 0){brushsetting(player)}
      if (response.selection === 1){brushmode1(player)}
      if (response.selection === 3){brushmode3(player)}
    })
  }
function brushsetting(player){
    const form21 = new ModalFormData()
    .title("筆刷設定")
    .slider("筆刷最遠距離", 1, 64, 1 ,world.scoreboard.getObjective('brushMD').getScore(player))
    .slider("尺寸半徑", 1, 8, 1 ,world.scoreboard.getObjective('brushSIZE').getScore(player))
    .toggle("穿透方塊", player.hasTag("build:Thr"))
    .toggle("單點/連點", !player.hasTag("build:Sing"));
    form21.show(player).then((response) => {
        player.runCommand(`scoreboard players set @s brushMD ${response.formValues[0]}`)
        player.runCommand(`scoreboard players set @s brushSIZE ${response.formValues[1]}`)
        if (response.formValues[2] === true){player.runCommand(`tag @s add build:Thr`)}
        else{player.runCommand(`tag @s remove build:Thr`)}
        if (response.formValues[3] === true){player.runCommand(`tag @s remove build:Sing`)}
        else{player.runCommand(`tag @s add build:Sing`)}
    })
}
system.runInterval(() => {
    world.getAllPlayers().forEach((entI) => {
        if(entI.runCommand(`testfor @s[hasitem={item=build:brush,location=slot.weapon.mainhand}]`).successCount != 0){
            var Vblock = entI.getBlockFromViewDirection({maxDistance:world.scoreboard.getObjective('brushMD').getScore(entI)})
            if(entI.hasTag("build:Thr") === true || Vblock === undefined) {
                entI.runCommand(`particle minecraft:endrod ^^^${world.scoreboard.getObjective('brushMD').getScore(entI)}`)
                entI.runCommand(`tag @s remove brush:col`)
            }
            else{
                var VblockP = [Vblock.block.location.x,Vblock.block.location.y,Vblock.block.location.z]
                entI.runCommand(`particle minecraft:endrod ${VblockP[0]} ${VblockP[1]+0.5} ${VblockP[2]}`)
                entI.runCommand(`tag @s add brush:col`)
            }
        }
        else{
            entI.runCommand(`tag @s remove brush:using`)
            entI.runCommand(`tag @s remove brush:col`)
        }
        if(entI.hasTag("brush:point") || entI.hasTag("brush:using")){
            let size = world.scoreboard.getObjective('brushSIZE').getScore(entI)-1
            if(world.scoreboard.getObjective('brushmode').getScore(entI) == 1){
                let block0 = world.scoreboard.getObjective('brushCOLOR0').getScore(entI)
                let block1 = world.scoreboard.getObjective('brushCOLOR1').getScore(entI)
                if(entI.hasTag("brush:col")){entI.runCommand(`fill ${VblockP[0]+size} ${VblockP[1]+size} ${VblockP[2]+size} ${VblockP[0]-size} ${VblockP[1]-size} ${VblockP[2]-size} ${blocks[block0]} replace ${blocks[block1]}`)}
                else{entI.runCommand(`execute @s ^^^${world.scoreboard.getObjective('brushMD').getScore(entI)} fill ~${size} ~${size} ~${size} ~-${size} ~-${size} ~-${size} ${blocks[block0]} replace ${blocks[block1]}`)}
            }
            else if(world.scoreboard.getObjective('brushmode').getScore(entI) == 3){
                let j = 0
                let rdX = null
                let rdY = null
                let rdZ = null
                const list = []
                entI.getTags().forEach(input =>{
                    const match = input.match(/RDreplace{([^{}]+)}/);
                    if(match){
                        match[1].split(',').forEach(pair => {
                        const [key, value] = pair.split(':').map(part => part.trim());   
                        if (/^[\u4e00-\u9fa5]+$/.test(key) && /^\d+$/.test(value)){
                            list.push([key, value]);
                        }
                        else if(/^[\u4e00-\u9fa5]+$/.test(key) && value == undefined){
                            list.push([key]);
                        }
                    });
                    }
                })
                function random1(){
                    rdX = Math.floor(Math.random() * size*2+1) - size
                    rdY = Math.floor(Math.random() * size*2+1) - size
                    rdZ = Math.floor(Math.random() * size*2+1) - size
                    if(entI.hasTag("brush:col")){
                        if(j<=4 && entI.runCommand(`testforblock ${VblockP[0]+rdX} ${VblockP[1]+rdY} ${VblockP[2]+rdZ} ${blocks[block.indexOf(list[6][0])]}`).successCount == 0){
                            j++
                            random1()
                                
                        }
                    }
                    else{
                        if(j<=4 && entI.runCommand(`execute @s ^^^${world.scoreboard.getObjective('brushMD').getScore(entI)} testforblock ~${rdX} ~${rdY} ~${rdZ} ${blocks[block.indexOf(list[6][0])]}`).successCount == 0){
                            j++
                            random1()
                        }
                    }
                }
                random1()
                let rdN = Math.floor(Math.random()*(parseInt(list[0][1])+parseInt(list[1][1])+parseInt(list[2][1])+parseInt(list[3][1])+parseInt(list[4][1])+parseInt(list[5][1])))
                let curN = 0
                let rdB = null
                for(let i=0; i<=5; i++){
                    curN += parseInt(list[i][1])
                    if(rdN < curN){
                        rdB = blocks[block.indexOf(list[i][0])]
                        break;
                    }
                }
                if(entI.hasTag("brush:col")){
                    entI.runCommand(`particle minecraft:soul_particle ${VblockP[0]+rdX} ${VblockP[1]+rdY} ${VblockP[2]+rdZ}`)
                    entI.runCommand(`fill ${VblockP[0]+rdX} ${VblockP[1]+rdY} ${VblockP[2]+rdZ} ${VblockP[0]+rdX} ${VblockP[1]+rdY} ${VblockP[2]+rdZ} ${rdB} replace ${blocks[block.indexOf(list[6][0])]}`)
                }
                else{
                    entI.runCommand(`execute @s ^^^${world.scoreboard.getObjective('brushMD').getScore(entI)} fill ~${rdX} ~${rdY} ~${rdZ} ~${rdX} ~${rdY} ~${rdZ} ${rdB} replace ${blocks[block.indexOf(list[6][0])]}`)
                }
            }
            entI.runCommand(`tag @s remove brush:point`)
        }
    })
}, 2);
function brushmode1(player){
    const form22 = new ModalFormData()
    .title("替換模式(油漆)")
    .dropdown("目標顏色", block, world.scoreboard.getObjective('brushCOLOR0').getScore(player))
    .dropdown("取代顏色", block, world.scoreboard.getObjective('brushCOLOR1').getScore(player));
    form22.show(player).then((response) => {
        player.runCommand(`scoreboard players set @s brushmode 1`)
        player.runCommand(`scoreboard players set @s brushCOLOR0 ${response.formValues[0]}`)
        player.runCommand(`scoreboard players set @s brushCOLOR1 ${response.formValues[1]}`)
    })
}
function brushmode3(player){
    const resultList = [];
    let err = 0
    player.getTags().forEach(input =>{
        const match = input.match(/RDreplace{([^{}]+)}/);
        if(match){
            match[1].split(',').forEach(pair => {
            const [key, value] = pair.split(':').map(part => part.trim());
            
            if (/^[\u4e00-\u9fa5]+$/.test(key) && /^\d+$/.test(value)){
                resultList.push([key, value]);
            }
            else if(/^[\u4e00-\u9fa5]+$/.test(key) && value == undefined){
                resultList.push([key]);
            }
            if(isNaN(value) && value != undefined){
                err = 1
                player.runCommand(`say err`)
            }
        });
        player.runCommand(`say ${input}`);
        }
    })
    if(resultList.length == 0){player.runCommand(`tag @s add "RDreplace{白色:0,白色:0,白色:0,白色:0,白色:0,白色:0,白色}"`)}
    const form24 = new ModalFormData()
    .dropdown("目標顏色1", block, block.indexOf(resultList[0][0]))
    .textField("比重1", resultList[0][1], resultList[0][1])
    .dropdown("目標顏色2", block, block.indexOf(resultList[1][0]))
    .textField("比重2", resultList[1][1], resultList[1][1])
    .dropdown("目標顏色3", block, block.indexOf(resultList[2][0]))
    .textField("比重3", resultList[2][1], resultList[2][1])
    .dropdown("目標顏色4", block, block.indexOf(resultList[3][0]))
    .textField("比重4", resultList[3][1], resultList[3][1])
    .dropdown("目標顏色5", block, block.indexOf(resultList[4][0]))
    .textField("比重5", resultList[4][1], resultList[4][1])
    .dropdown("目標顏色6", block, block.indexOf(resultList[5][0]))
    .textField("比重6", resultList[5][1], resultList[5][1])
    .dropdown("取代顏色", block, block.indexOf(resultList[6][0]))
    form24.show(player).then((response) => {
        player.runCommand(`scoreboard players set @s brushmode 3`)
        player.runCommand(`say ${response.formValues[11]}`)
        let rps = []
        for(let i=0; i<=12; i+=2){
            if(response.formValues[i]>15){rps.push("白色")}
            else{rps.push(block[response.formValues[i]])}
            if((isNaN(response.formValues[i+1]) || response.formValues[i+1] < 0) && i != 12){err = 1}
            else{rps.push(Number(response.formValues[i+1])) }
            
        }
        if(err == 0){
            player.runCommand(`tag @s remove "RDreplace{${resultList[0][0]}:${resultList[0][1]},${resultList[1][0]}:${resultList[1][1]},${resultList[2][0]}:${resultList[2][1]},${resultList[3][0]}:${resultList[3][1]},${resultList[4][0]}:${resultList[4][1]},${resultList[5][0]}:${resultList[5][1]},${resultList[6][0]}}"`)
            player.runCommand(`tag @s add "RDreplace{${rps[0]}:${rps[1]},${rps[2]}:${rps[3]},${rps[4]}:${rps[5]},${rps[6]}:${rps[7]},${rps[8]}:${rps[9]},${rps[10]}:${rps[11]},${rps[12]}}"`)
        }
    })

}
function brushusing(player){
    if(player.hasTag("build:Sing")){
        player.runCommand(`tag @s add brush:point`)
    }
    else{
        if(player.hasTag("brush:using")){
            player.runCommand(`tag @s remove brush:using`)
        }
        else{
            player.runCommand(`tag @s add brush:using`)
        }
    }
}
function pointset(player){
    const form30 = new ActionFormData()
    .title("繪點工具")
    .body("此功能用來生成特殊形狀\n• 請自己手動生成 「繪點方塊」 \n• 點擊 「繪點方塊」 可以調整其位置\n※ 過多的 「繪點方塊」 可能會產生卡頓")
    .button("形狀生成")
    .button("步進函數生成");
    form30.show(player).then((response) => {
      if (response.selection === 0){
      }
    })
}
