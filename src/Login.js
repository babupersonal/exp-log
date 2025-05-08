import { useState } from 'react';

function Login({ onLogin }) {
  const [form, setForm] = useState({ name: '', password: '' });

  const handleLogin = async () => {
    const res = await fetch('https://exp-log-api.onrender.com/api/login', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      onLogin(); // 讓 App 切到主頁
    } else {
      alert('登入失敗');
    }
  };

  return (
    <div>
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <button onClick={handleLogin}>登入</button>
    </div>
  );
}

export default Login;
