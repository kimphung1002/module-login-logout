import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { post } from '../services/ApiEndpoint'
import  { toast } from 'react-hot-toast';
import {useDispatch,useSelector } from 'react-redux'
import { SetUser } from '../redux/AuthSlice';
import OAuth from '../components/OAuth';
export default function Login() {
 const user=useSelector((state)=> {
  console.log(JSON.stringify(state));
  return state.Auth;
});
 console.log(user)
   const dispatch=useDispatch()
    const [email,setEmail]=useState('')
    const navigate=useNavigate()
    const [password,setPassword]=useState('')

       const handleSubmit= async(e)=>{
        e.preventDefault();
          console.log(email,password)
          try {
              const request= await post('/api/auth/login',{email,password})
              const reponse= request.data 

              if (request.status==200) {
                if (reponse.user.role =='admin') {
                  navigate('/admin')
                }else if (reponse.user.role =='user') {
                   navigate('/')
                }
                toast.success(reponse.message);
                dispatch(SetUser(reponse.user))
              }
              console.log(reponse)
          } catch (error) {
            console.log(error)
          }
       }
  return (
    <>

        <div className='login-container'>
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
                <div className='input-group'>
                    <label htmlFor="Email">Email</label>
                    <input type="email" name="" id="email" 
                        onChange={(e)=>setEmail(e.target.value)} placeholder='Nhập địa chỉ email của bạn '
                    />
                </div>
                <div className='input-group'>
                    <label htmlFor="passowrd">Mật khẩu</label>
                    <input type="password" name=""
                      onChange={(e)=>setPassword(e.target.value)} id="password" placeholder='Nhập mật khẩu của bạn'/>
                </div>
                <button type='submit'>Đăng nhập</button>
                <OAuth/>
                <p className='register-link'>
                Chưa đăng ký? <Link to={'/register'}>Đăng ký tại đây</Link>
                </p>
            </form>
        </div>




    </>
  )
}