import { useState } from 'react';

function Register() {
  const [form, setForm] = useState({ name: '', password: '' });

  const handleRegister = async () => {
    const res = await fetch('https://exp-log-api.onrender.com/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (res.ok) {
      alert('✅ 註冊成功！請登入');
    } else {
      alert('❌ ' + data.error);
    }
  };

  return (
    <div>
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <button onClick={handleRegister}>註冊</button>
    </div>
  );
}

export default Register;
