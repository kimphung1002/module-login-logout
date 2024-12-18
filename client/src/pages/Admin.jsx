import React, { useEffect, useState } from 'react';
import { deleteUser, get } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';

export default function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const GetUsers = async () => {
      try {
        const request = await get('/api/admin/getuser');
        const response = request.data;
        if (request.status === 200) {
          setUsers(response.users || []);
        }
      } catch (error) {
        console.log(error);
      }
    };
    GetUsers();
  }, []);

  const handleDelet = async (id) => {
    try {
      const request = await deleteUser(`/api/admin/delet/${id}`);
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
        setUsers(users.filter(user => user._id !== id)); // Cập nhật danh sách
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className='admin-container'>
      <h2>Danh sách người dùng</h2>
      <table>
        <thead>
          <tr>
            <th>Tên tài khoản</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((elem, index) => (
              <tr key={index}>
                <td>{elem.name}</td>
                <td>{elem.email}</td>
                <td>
                  <button onClick={() => handleDelet(elem._id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Không có người dùng nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
