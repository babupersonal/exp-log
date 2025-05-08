import { useEffect, useState } from "react";
import './App.css';
import Login from './Login';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  // 取得使用者資料
  useEffect(() => {
    if (!isLoggedIn) return;

    fetch('https://exp-log-api.onrender.com/api/user')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => {
        console.error("使用者資料讀取失敗", err);
        setIsLoggedIn(false); // 若 token 失效，自動登出
      });
  }, [isLoggedIn]);

  // 自動累積 EXP
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetch('https://exp-log-api.onrender.com/api/user/exp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 加上 token 認證（如果後端有實作）
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ addExp: 10 })
      })
      .then(() => fetch('https://exp-log-api.onrender.com/api/user'))
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("自動累積失敗", err));
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  // 未登入時顯示登入畫面
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // 使用者資料還沒載入
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="text-center">載入中...</div>
      </div>
    );
  }

  // 登入成功後顯示主頁面
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🧙 RPG EXP 儀表板</h1>
        <div className="bg-gray-800 rounded-2xl p-4 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold">角色資訊</h2>
          <p className="mt-2">🎖️ {user.name} - Lv. {user.level}</p>
          <div className="w-full bg-gray-700 rounded-full h-4 mt-2 overflow-hidden">
            <div
              className="bg-green-400 h-full transition-all duration-500"
              style={{ width: `${(user.exp / user.nextLevelExp) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">{user.exp} / {user.nextLevelExp} EXP</p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">技能熟練度</h2>
          {user.skills.map((skill, index) => (
            <div key={index} className="mb-4">
              <p>{skill.name}</p>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-1 overflow-hidden">
                <div
                  className={`${skill.color} h-full transition-all duration-500`}
                  style={{ width: `${Math.min(skill.exp, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm">{skill.exp} EXP</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
