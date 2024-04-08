import {world,ScoreboardIdentity,BlockLocation} from "@minecraft/server"
import {Rcode} from "./main.js"
//var worldD = world.getdimension("overworld")
var game = []
var move = []




export function movement(){
    world.events.entityHit.subscribe((hits) =>{
        var ent = hits.entity
        var entR = world.scoreboard.getObjective('room').getScore(ent.scoreboard)
        var entM = world.scoreboard.getObjective('mover').getScore(ent.scoreboard)
        var entT = world.scoreboard.getObjective(Rcode(entR)).getScore(ent.scoreboard)
        var scoreB = world.scoreboard.getObjective('board').getScores()
        var Ehit = hits.hitEntity
        var Bhit = hits.hitBlock
        var locR = world.scoreboard.getObjective('roomS').getScores()
        var saveL = undefined
        locR.forEach(LOCdet)
        function LOCdet(x4){
            if(x4.score == entR){
                saveL = x4.participant.getEntity()
            }
        }
        if(Ehit != undefined){
            var EhitX = Math.floor((Ehit.location.x - saveL.location.x + 1.5) / 2)
            var EhitZ = Math.floor((Ehit.location.z - saveL.location.x + 1.5) / 2)
        }
        if(Bhit != undefined){
            var BhitX = Math.floor((Bhit.x - saveL.location.x + 1.5) / 2)
            var BhitZ = Math.floor((Bhit.z - saveL.location.x + 1.5) / 2)
        }
        var BsumX = ((saveL.location.x - 0.5) + BhitX * 2).toFixed(1)
        var sumY = saveL.location.y + 1
        var BsumZ = ((saveL.location.z - 0.5) + BhitZ * 2).toFixed(1)
        var EsumX = ((saveL.location.x - 0.5) + EhitX * 2).toFixed(1)
        var EsumZ = ((saveL.location.z - 0.5) + EhitZ * 2).toFixed(1)
        var sucB = undefined
        //moving part
        if(entM == 1){
            if(Ehit != undefined){
                var hitT = world.scoreboard.getObjective(Rcode(entR)).getScore(Ehit.scoreboard)
                if(hitT == entT){
                    move.forEach(Mdet1)
                    function Mdet1(x3){
                        var x3T = world.scoreboard.getObjective(Rcode(entR)).getScore(x3.scoreboard)
                        if(x3T == entT){
                            move.splice(move.indexOf(x3),1)
                        }
                    }
                    move.push(Ehit)
                }
                else if(hitT != entT 
                    && hitT != undefined){
                    move.forEach(Mdet2)
                    function Mdet2(x4){
                        var x4T = world.scoreboard.getObjective(Rcode(entR)).getScore(x4.scoreboard)
                        if(x4T == entT){
                            var x4B = world.scoreboard.getObjective('board').getScore(x4.scoreboard)
                            var x4BX = Math.floor(x4B / 10)
                            var x4BZ = Math.floor(x4B % 10)
                            var locE = EhitX * 10 + EhitZ
                            if((x4.hasTag('king')) 
                            && (x4B != locE) 
                            && ((x4BX - 1) <= EhitX 
                            && EhitX <= (x4BX + 1)) 
                            && ((x4BZ - 1) <= EhitZ 
                            && EhitZ <= (x4BZ + 1))){
                                sucB = 1
                            }
                            else if((x4.hasTag('queen')) 
                            && (x4B != locE)
                             && (Math.abs(EhitX - x4BX) == Math.abs(EhitZ - x4BZ) 
                            || (EhitX - x4BX) == 0 
                            || (EhitZ - x4BZ) == 0)){
                                sucB = 1
                                scoreB.forEach(QdetE)
                                function QdetE(y1){
                                    if((y1.participant.getEntity() != x4)
                                     && (world.scoreboard.getObjective(Rcode(entR)).getScore(y1.participant.getEntity().scoreboard) == 1 
                                     || world.scoreboard.getObjective(Rcode(entR)).getScore(y1.participant.getEntity().scoreboard) == 2)){
                                        var y1X = Math.floor(y1.score / 10)
                                        var y1Z = Math.floor(y1.score % 10)
                                        if((y1X == EhitX 
                                            && (Math.abs(EhitZ - y1Z) < Math.abs(BhitZ - x4BZ))) 
                                         || (y1Z == EhitZ 
                                            && (Math.abs(BhitX - y1X) < Math.abs(BhitX - x4BX))) 
                                         || ((Math.abs(BhitX - y1X) == Math.abs(EhitZ - y1Z)) 
                                         && ((BhitX - y1X) * (BhitX - x4BX) > 0) 
                                         && ((EhitZ - y1Z) * (BhitZ - x4BZ) > 0) 
                                         && (Math.abs(BhitX - y1X) < Math.abs(BhitX - x4BX)) 
                                         && (Math.abs(EhitZ - y1Z) < Math.abs(BhitZ - x4BZ)))){
                                            sucB = 0
                                        }
                                    }
                                }
                            }
                            else if((x4.hasTag('bishop')) 
                            && (x4B != locE) 
                            && (Math.abs(EhitX - x4BX) == Math.abs(EhitZ - x4BZ))){
                                sucB = 1
                                scoreB.forEach(BdetE)
                                function BdetE(y2){
                                    if((y2.participant.getEntity() != x4) 
                                    && (world.scoreboard.getObjective(Rcode(entR)).getScore(y2.participant.getEntity().scoreboard) == 1 
                                    || world.scoreboard.getObjective(Rcode(entR)).getScore(y2.participant.getEntity().scoreboard) == 2)){
                                        var y2X = Math.floor(y2.score / 10)
                                        var y2Z = Math.floor(y2.score % 10)
                                        if(((Math.abs(BhitX - y2X) == Math.abs(EhitZ - y2Z)) 
                                        && ((BhitX - y2X) * (BhitX - x4BX) > 0) 
                                        && ((EhitZ - y2Z) * (BhitZ - x4BZ) > 0) 
                                        && (Math.abs(BhitX - y2X) < Math.abs(BhitX - x4BX)) 
                                        && (Math.abs(EhitZ - y2Z) < Math.abs(BhitZ - x4BZ)))){
                                            sucB = 0
                                        }
                                    }
                                }
                            }
                            else if((x4.hasTag('knight')) 
                            && (x4B != locE) 
                            && (((BhitX - x4BX) == 2 
                            || (BhitX - x4BX) == -2) 
                            && ((BhitZ - x4BZ) == 1 
                            || (BhitZ - x4BZ) == -1) 
                            || ((BhitX - x4BX) == 1 
                            || (BhitX - x4BX) == -1) 
                            && ((BhitZ - x4BZ) == 2 
                            || (BhitZ - x4BZ) == -2))){
                                sucB = 1
                            }
                            else if((x4.hasTag('rook')) 
                            && (x4B != locE) 
                            && ((EhitX - x4BX) == 0 
                            || (EhitZ - x4BZ) == 0)){
                                sucB = 1
                                scoreB.forEach(RdetE)
                                function RdetE(y3){
                                    if((y3.participant.getEntity() != x4) 
                                    && (world.scoreboard.getObjective(Rcode(entR)).getScore(y3.participant.getEntity().scoreboard) == 1 
                                    || world.scoreboard.getObjective(Rcode(entR)).getScore(y3.participant.getEntity().scoreboard) == 2)){
                                        var y3X = Math.floor(y3.score / 10)
                                        var y3Z = Math.floor(y3.score % 10)
                                        if((y3X == EhitX 
                                            && (Math.abs(EhitZ - y3Z) < Math.abs(BhitZ - x4BZ))) 
                                        || (y3Z == EhitZ 
                                            && (Math.abs(BhitX - y3X) < Math.abs(BhitX - x4BX)))){
                                            sucB = 0
                                        }
                                    }
                                }
                            }
                            else if((x4.hasTag('pawn'))){
                                var x4T = world.scoreboard.getObjective(Rcode(entR)).getScore(x4.scoreboard)
                                if((x4B != locE) 
                                && (x4T == 1) 
                                && (((EhitZ - x4BZ) == 1 
                                || (EhitZ - x4BZ) == -1) 
                                && (EhitX - x4BX) == 1)){
                                    sucB = 1
                                }
                                else if((x4B != locE) 
                                && (x4T == 2) 
                                && (((EhitZ - x4BZ) == 1 
                                || (EhitZ - x4BZ) == -1) 
                                && (EhitX - x4BX) == -1)){
                                    sucB = 1
                                }
                            }
                            else{
                                sucB = 0
                            }
                            if(sucB == 1){
                                var locE = EhitX * 10 + EhitZ
                                world.getDimension("overworld").runCommandAsync(`tag @e[tag=pawn,scores={board=${x4B}..${x4B}}] remove unmoved`)
                                world.getDimension("overworld").runCommandAsync(`tp @e[scores={board=${x4B}..${x4B}}] ${EsumX} ${sumY} ${EsumZ} `)
                                world.getDimension("overworld").runCommandAsync(`kill @e[scores={board=${locE}..${locE}}]`)
                                world.getDimension("overworld").runCommandAsync(`scoreboard players set "${x4.id}" board ${locE}`)
                                move.splice(move.indexOf(x4,1))
                            }
                            else{
                                world.getDimension("overworld").runCommandAsync(`tellraw @a {"rawtext":[{"text":"[err] connot move there 2"}]}`)
                            }
                        }
                    }
                }
            }
            var eptB = 1
            scoreB.forEach(NeptB)
            function NeptB(x5){
                var locB = BhitX * 10 + BhitZ
                if(world.scoreboard.getObjective(Rcode(entR)).getScore(x5.participant.getEntity().scoreboard) == 1 
                || world.scoreboard.getObjective(Rcode(entR)).getScore(x5.participant.getEntity().scoreboard) == 2){
                    if(x5.score == locB){
                        eptB = 0
                    }
                }
            }
            if(Bhit != undefined 
                && eptB == 1){
                move.forEach(Mdet3)
                function Mdet3(x6){
                    var x6T = world.scoreboard.getObjective(Rcode(entR)).getScore(x6.scoreboard)
                    if(BhitX > 0 
                        && BhitX < 9 
                        && BhitZ > 0 
                        && BhitZ < 9){
                        if(x6T == entT){
                            var x6B = world.scoreboard.getObjective('board').getScore(x6.scoreboard)
                            var x6BX = Math.floor(x6B / 10)
                            var x6BZ = Math.floor(x6B % 10)
                            var locB = BhitX * 10 + BhitZ
                            if((x6.hasTag('king')) 
                            && (x6B != locB) 
                            && ((x6BX - 1) <= BhitX 
                            && BhitX <= (x6BX + 1)) 
                            && ((x6BZ - 1) <= BhitZ 
                            && BhitZ <= (x6BZ + 1))){
                                sucB = 1
                            }
                            else if((x6.hasTag('queen')) 
                            && (x6B != locB) 
                            && (Math.abs(BhitX - x6BX) == Math.abs(BhitZ - x6BZ) 
                            || (BhitX - x6BX) == 0 
                            || (BhitZ - x6BZ) == 0)){
                                sucB = 1
                                scoreB.forEach(QdetB)
                                function QdetB(y4){
                                    if((y4.participant.getEntity() != x6) 
                                    && (world.scoreboard.getObjective(Rcode(entR)).getScore(y4.participant.getEntity().scoreboard) == 1 
                                    || world.scoreboard.getObjective(Rcode(entR)).getScore(y4.participant.getEntity().scoreboard) == 2)){
                                        var y4X = Math.floor(y4.score / 10)
                                        var y4Z = Math.floor(y4.score % 10)
                                        if((y4X == BhitX 
                                            && (Math.abs(BhitZ - y4Z) < Math.abs(BhitZ - x6BZ))) 
                                        || (y4Z == BhitZ 
                                            && (Math.abs(BhitX - y4X) < Math.abs(BhitX - x6BX))) 
                                        || ((Math.abs(BhitX - y4X) == Math.abs(BhitZ - y4Z)) 
                                        && ((BhitX - y4X) * (BhitX - x6BX) > 0) 
                                        && ((BhitZ - y4Z) * (BhitZ - x6BZ) > 0) 
                                        && (Math.abs(BhitX - y4X) < Math.abs(BhitX - x6BX)) 
                                        && (Math.abs(BhitZ - y4Z) < Math.abs(BhitZ - x6BZ)))){
                                            sucB = 0
                                        }
                                    }
                                }
                            }
                            else if((x6.hasTag('bishop')) 
                            && (x6B != locB) 
                            && (Math.abs(BhitX - x6BX) == Math.abs(BhitZ - x6BZ))){
                                sucB = 1
                                scoreB.forEach(BdetB)
                                function BdetB(y5){
                                    if((y5.participant.getEntity() != x6) 
                                    && (world.scoreboard.getObjective(Rcode(entR)).getScore(y5.participant.getEntity().scoreboard) == 1 
                                    || world.scoreboard.getObjective(Rcode(entR)).getScore(y5.participant.getEntity().scoreboard) == 2)){
                                        var y5X = Math.floor(y5.score / 10)
                                        var y5Z = Math.floor(y5.score % 10)
                                        if(((Math.abs(y5X - x6BX) == Math.abs(y5Z - x6BZ)) 
                                        && ((y5X - x6BX) * (BhitX - x6BX) > 0) 
                                        && ((y5Z - x6BZ) * (BhitZ - x6BZ) > 0) 
                                        && (Math.abs(y5X - x6BX) < Math.abs(BhitX - x6BX)) 
                                        && (Math.abs(y5Z - x6BZ) < Math.abs(BhitZ - x6BZ)))){
                                            sucB = 0
                                        }
                                    }
                                }
                            }
                            else if((x6.hasTag('knight')) 
                            && (x6B != locB) 
                            && (((BhitX - x6BX) == 2 
                            || (BhitX - x6BX) == -2) 
                            && ((BhitZ - x6BZ) == 1 
                            || (BhitZ - x6BZ) == -1) 
                            || ((BhitX - x6BX) == 1 
                            || (BhitX - x6BX) == -1) 
                            && ((BhitZ - x6BZ) == 2 
                            || (BhitZ - x6BZ) == -2))){
                                sucB = 1
                            }
                            else if((x6.hasTag('rook')) 
                            && (x6B != locB) 
                            && ((BhitX - x6BX) == 0 
                            || (BhitZ - x6BZ) == 0)){
                                sucB = 1
                                scoreB.forEach(RdetB)
                                function RdetB(y6){
                                    if((y6.participant.getEntity() != x6) 
                                    && (world.scoreboard.getObjective(Rcode(entR)).getScore(y6.participant.getEntity().scoreboard) == 1 
                                    || world.scoreboard.getObjective(Rcode(entR)).getScore(y6.participant.getEntity().scoreboard) == 2)){
                                        var y6X = Math.floor(y6.score / 10)
                                        var y6Z = Math.floor(y6.score % 10)
                                        if((y6X == BhitX 
                                            && (Math.abs(BhitZ - y6Z) < Math.abs(BhitZ - x6BZ))) 
                                        || (y6Z == BhitZ 
                                            && (Math.abs(BhitX - y6X) < Math.abs(BhitX - x6BX)))){
                                            sucB = 0
                                        }
                                    }
                                }
                            }
                            else if((x6.hasTag('pawn'))){
                                var x6T = world.scoreboard.getObjective(Rcode(entR)).getScore(x6.scoreboard)
                                if((x6.hasTag('unmoved')) 
                                && (x6T == 1) 
                                && ((BhitZ - x6BZ) == 0) 
                                && ((BhitX - x6BX) == 2)){
                                    sucB = 1
                                    scoreB.forEach(PdetB1)
                                function PdetB1(y7){
                                    if((y7.participant.getEntity() != x6) && (world.scoreboard.getObjective(Rcode(entR)).getScore(y7.participant.getEntity().scoreboard) == 1 
                                    || world.scoreboard.getObjective(Rcode(entR)).getScore(y7.participant.getEntity().scoreboard) == 2)){
                                        var y7X = Math.floor(y7.score / 10)
                                        var y7Z = Math.floor(y7.score % 10)
                                        if((y7Z == BhitZ 
                                            && (Math.abs(BhitX - y7X) < Math.abs(BhitX - x6BX)))){
                                            sucB = 0
                                        }
                                    }
                                }
                                }
                                else if((x6.hasTag('unmoved')) 
                                && (x6T == 2) 
                                && ((BhitZ - x6BZ) == 0) 
                                && ((BhitX - x6BX) == -2)){
                                    sucB = 1
                                    scoreB.forEach(PdetB2)
                                function PdetB2(y8){
                                    if((y8.participant.getEntity() != x6) 
                                    && (world.scoreboard.getObjective(Rcode(entR)).getScore(y8.participant.getEntity().scoreboard) == 1 
                                    || world.scoreboard.getObjective(Rcode(entR)).getScore(y8.participant.getEntity().scoreboard) == 2)){
                                        var y8X = Math.floor(y8.score / 10)
                                        var y8Z = Math.floor(y8.score % 10)
                                        if((y8Z == BhitZ 
                                            && (Math.abs(BhitX - y8X) < Math.abs(BhitX - x6BX)))){
                                            sucB = 0
                                        }
                                    }
                                }
                                }
                                else if((x6B != locB) 
                                && (x6T == 1) 
                                && ((BhitZ - x6BZ) == 0 
                                && (BhitX - x6BX) == 1)){
                                    sucB = 1
                                }
                                else if((x6B != locB) 
                                && (x6T == 2) 
                                && ((BhitZ - x6BZ) == 0 
                                && (BhitX - x6BX) == -1)){
                                    sucB = 1
                                }
                            }
                            else{
                                sucB = 0
                            }
                            if(sucB == 1){
                                var locB = BhitX * 10 + BhitZ
                                world.getDimension("overworld").runCommandAsync(`tag @e[tag=pawn,scores={board=${x6B}..${x6B}}] remove unmoved`)
                                world.getDimension("overworld").runCommandAsync(`tp @e[scores={board=${x6B}..${x6B}}] ${BsumX} ${sumY} ${BsumZ} `)
                                world.getDimension("overworld").runCommandAsync(`scoreboard players set "${x6.id}" board ${locB}`)
                                move.splice(move.indexOf(x6,1))
                            }
                            else{
                                world.getDimension("overworld").runCommandAsync(`tellraw @a {"rawtext":[{"text":"[err] connot move there 1"}]}`)
                            }
                        }  
                    }
                }
            }
        }
    })
}

/*
        if(entM == 1 && hitT == entT){
            
        if(Bhit != undefined){
            var BhitX = null
            var BhitZ = null
            var saveE = undefined

            move.forEach(Mexe)
            function Mexe(x6){
                
                
                
                
            }
        }*/
/*
if(x6T == entT && 0 < BhitX < 9 && 0 < BhitZ < 9){
                    var success = null
                    if(x6.hasTag('king') && x6BX - 1 >= BhitX >= x6BX + 1 && x6BZ -1 <= BhitZ <= x6BZ + 1){
                        success = 1
                    }
                    else if(x6.hasTag('queen') && (x6BX - BhitX) % 9 == 0 || (x6BX - BhitX) % 11 == 0 && (x6BZ - BhitZ) % 9 == 0 || (x6BZ - BhitZ) % 11 == 0){
                        success = 1
                    }
                    else{
                        success = 0
                    }
                    if(success == 1){
                        
                }
                */