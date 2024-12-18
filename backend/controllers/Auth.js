import UserModel from "../models/user.js"; // Đảm bảo import đúng model UserModel
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existUser = await UserModel.findOne({ email });
        if (existUser) {
            return res.status(401).json({ success: false, message: "Người dùng này đã tồn tại" });
        }
        const hashedPassword = await bcryptjs.hashSync(password, 10);
        const newUser = new UserModel({
            name, email, password: hashedPassword
        });

        await newUser.save();
        res.status(200).json({ message: "Người dùng đăng ký thành công", newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "internal server error" });
        console.log(error);
    }
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETE);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000, // 1 hour
        });
        res.status(200).json({ success: true, message: "Đăng nhập thành công", user, token });

    } catch (error) {
        res.status(500).json({ success: false, message: "internal server error" });
        console.log(error);
    }
};

const Logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "Người dùng đăng xuất thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: "internal server error" });
        console.log(error);
    }
};

const CheckUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
        console.log(error);
    }
};

const google = async (req, res, next) => {
    try {
        // Kiểm tra xem người dùng đã tồn tại trong hệ thống hay chưa
        const user = await UserModel.findOne({ email: req.body.email });

        if (user) {
            // Nếu người dùng đã tồn tại, tạo JWT token và trả về thông tin người dùng
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE);
            const { password: hashedPassword, ...rest } = user._doc;
            const expiryDate = new Date(Date.now() + 3600000); // 1 hour
            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    expires: expiryDate,
                })
                .status(200)
                .json(rest);
        } else {
            // Nếu người dùng chưa tồn tại, tạo tài khoản mới
            const generatedName = req.body.name || req.body.email.split('@')[0]; // Lấy phần tên từ email nếu không có tên
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            console.log(generatedName);
            const newUser = new UserModel({
                name: generatedName,  // Sử dụng tên người dùng từ email
                email: req.body.email,
                password: hashedPassword,
            });

            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRETE);
            const { password: hashedPassword2, ...rest } = newUser._doc;
            const expiryDate = new Date(Date.now() + 3600000); // 1 hour
            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    expires: expiryDate,
                })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        console.error("Error during Google login: ", error); // Log chi tiết lỗi
        return res.status(500).json({ message: "Login failed: " + error.message });
    }
};


export { register, Login, Logout, CheckUser, google };
