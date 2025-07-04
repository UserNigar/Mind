import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/users");
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("İstifadəçilər yüklənə bilmədi:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">👥 İstifadəçilər</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Platformdakı bütün istifadəçiləri kəşf edin və onlarla əlaqə saxlayın
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">
          <div className="mb-10">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xl">🔍</span>
              </div>
              <input
                type="text"
                placeholder="İstifadəçi adı axtar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-gray-900 placeholder-gray-400 bg-gray-50"
              />
            </div>
            <div className="text-center mt-4">
              <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                📊 {filteredUsers.length} istifadəçi tapıldı
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-8xl mb-6">👤</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                  Heç bir istifadəçi tapılmadı
                </h3>
                <p className="text-gray-500 text-lg">
                  Axtarış kriteriyalarınızı dəyişərək yenidən cəhd edin
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredUsers.map((user, index) => (
                  <div
                    key={user._id}
                    className="group bg-gray-50 rounded-2xl p-6 border border-gray-200 transform transition-all duration-300"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <img
                            src={
                              user.photo
                                ? `http://localhost:5050/photos/${user.photo}`
                                : "/default-profile.png"
                            }
                            alt="Profil şəkli"
                            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {user.username}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            📅 Qeydiyyat: {new Date(user.createdAt).toLocaleDateString("az-AZ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
   
                        <button
                          onClick={() => navigate(`/user/${user._id}`)} 
                          className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium text-sm"
                        >
                          Profilə bax
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredUsers.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-gray-500">Bütün istifadəçilər göstərildi</p>
            </div>
          )}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="text-4xl mb-4">👥</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{users.length}</div>
            <div className="text-gray-600">Ümumi İstifadəçi</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{filteredUsers.length}</div>
            <div className="text-gray-600">Axtarış Nəticəsi</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {search ? "Aktiv" : "Passiv"}
            </div>
            <div className="text-gray-600">Axtarış Statusu</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default UserList;
