import { prisma } from "@/lib/db";
import { currentUser, getRequestIp } from "@/lib/auth";
export async function audit(action:string, entity:string, entityId?:string, meta?:any){ const u=await currentUser(); const ip=getRequestIp(); await prisma.auditLog.create({data:{actorId:u?.id??null,action,entity,entityId:entityId??null,meta:meta?JSON.stringify(meta).slice(0,8000):null,ip:ip||null}}); }
