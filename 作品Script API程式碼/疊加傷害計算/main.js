import { world, system, ItemStack } from "@minecraft/server";
//import { MinecraftItemTypes } from '@minecraft/vanilla-data';

const World = world.getDimension("overworld")


world.afterEvents.entityHitEntity.subscribe((event) => {
    const {damagingEntity, hitEntity} = event;
    world.scoreboard.getObjective('infTick').setScore(hitEntity, 10);
    let comboDmg = world.scoreboard.getObjective('comboDmg').getScore(hitEntity)? world.scoreboard.getObjective('comboDmg').getScore(hitEntity) : 0;
    let velocity = damagingEntity.getVelocity();
    hitEntity.applyDamage(comboDmg+1)
    hitEntity.applyKnockback(velocity.x, velocity.z, 0.6, 0.15)
    world.scoreboard.getObjective('comboDmg').setScore(hitEntity, comboDmg+1);
});

system.runInterval(() => {
    World.runCommand(`scoreboard players remove @e[scores={infTick=1..}] infTick 1`)
    World.runCommand(`scoreboard players set @e[scores={infTick=0..0}] comboDmg 0`)
},1)