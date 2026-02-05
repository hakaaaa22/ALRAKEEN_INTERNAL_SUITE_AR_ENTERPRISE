import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main(){
  const email="admin@alrakeen.local"; const pw="Admin@1234";
  const hash=await bcrypt.hash(pw,10);
  await prisma.user.upsert({where:{email},update:{},create:{name:"Khaled Admin",email,password:hash,role:"ADMIN"}});
  console.log("Seed done:", email, pw);
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(async()=>{await prisma.$disconnect()});
