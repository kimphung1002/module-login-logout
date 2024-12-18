
import UserModel from "../models/user.js"
const Getuser=async(req,res)=>{
    try {
        const users=await UserModel.find()
         res.status(200).json({users})
    } catch (error) {
        res.status(500).json({message:"Lỗi máy chủ nội bộ"})
        console.log(error)
    }
}

const deletUser=async(req,res)=>{
    try {
        const userId=req.params.id
              const checkAdmin=await UserModel.findById(userId)

              if (checkAdmin.role =='admin') {
                return  res.status(409).json({message:"Bạn không thể xóa chính mình"})
              }
        const user=await UserModel.findByIdAndDelete(userId)
        if (!user) {
          return  res.status(404).json({message:"Không tìm thấy người dùng"})
        }
        res.status(200).json({message:"Xóa người dùng thành công ",user})
    } catch (error) {
        res.status(500).json({message:"Lỗi máy chủ nội bộ"})
        console.log(error)
    }
}

export {Getuser,deletUser}