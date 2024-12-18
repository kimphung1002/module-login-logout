import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom'; // Thêm để chuyển hướng
import { useDispatch } from 'react-redux'
import { SetUser } from '../redux/AuthSlice';

export default function OAuth() {
    const navigate = useNavigate();
    const dispatch=useDispatch()
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);


            const res = await fetch('http://localhost:5000/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                }),
            });

            const response = await res;

            if (response.status === 200) {
                const data = await response.json();
                const userInfo = await result.user;
                const token = userInfo.getIdToken();
                const expireTime = new Date(new Date().getTime() + 3600000); // 1 giờ
                document.cookie = "token=" + token + "; expires=" + expireTime;
                dispatch(SetUser({...data, ...{"name": userInfo.displayName}}));
                // Chuyển hướng dựa trên vai trò
                if (data.role === 'admin') {
                    navigate('/admin'); // Trang admin
                } else {
                    navigate('/'); // Trang người dùng bình thường
                }
            } else {
                console.log(response);
                console.log('Login failed:', data.message);
            }
        } catch (error) {
            console.log('Could not login with Google', error);
        }
    };

    return (
        <button type='button' onClick={handleGoogleClick} className="oauth-button">
            Tiếp tục với Google
        </button>
    );
}
