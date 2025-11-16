import {$} from 'bun'

export default async(santai: string[])=>{
    if (santai.length == 0) {
        console.log("tidak ada yang bisa di terima");
        process.exit(1)
    }
    try {
        const data  = santai[0]
        console.log(`yang akan di clone`);
        
        await $`git clone ${data}`
    } catch (error) {
        console.log("ada yang salah");
        
    }finally{
        process.exit(1)
    }
}