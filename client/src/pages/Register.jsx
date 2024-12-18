import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { post } from '../services/ApiEndpoint'
import { toast } from 'react-hot-toast';
import OAuth from '../components/OAuth';
export default function Register() {
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')


  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
     const request= await post('/api/auth/register',{name,email,password})
     const reposne=request.data
     if (request.status==200) {
          toast.success(reposne.message)
     }
     console.log(reposne)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
          <div className='register-container'>
            <h2>Đăng ký</h2>
               <form action="" onSubmit={handleSubmit}>
               <div className='input-group'>
                <label htmlFor="username">Tên người dùng</label>
                <input type="text"
                onChange={(e)=> setName(e.target.value)} name="" id="username" placeholder='Nhập tên của bạn'/>
               </div>
               <div className='input-group'>
                <label htmlFor="email">Emaiil</label>
                <input type="email" name="" onChange={(e)=>setEmail(e.target.value)} id="email" placeholder='Nhập địa chỉ email của bạn'/>
               </div>
               <div className='input-group'>
                <label htmlFor="password">Mật khẩu</label>
                <input type="password" onChange={(e)=>setPassword(e.target.value)} name="" id="password" placeholder='Vui lòng nhập mật khẩu an toàn'/>
               </div>
               <button type='submit'>Đăng ký</button>
               <OAuth/>
               <p className='register-link'>
               Bạn đã có tài khoản? <Link to={'/login'}>Đăng nhập tại đây</Link>
                </p>
               </form>
          </div>




    </>
  )
}