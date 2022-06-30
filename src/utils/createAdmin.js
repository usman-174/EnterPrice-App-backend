import bcryptjs from "bcryptjs";

const makeAdmin = async(User)=>{
    const user= new User({email:"admin@admin.com",role:"admin",username:"admin123"})
    user.password = bcryptjs.hashSync("admin")
    await user.save()
}
export {makeAdmin}