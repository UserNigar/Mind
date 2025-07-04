import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import images from "../../../assets/Illustration@2x.png";
import { updateUser, getUsers } from "../../../Redux/UserSlice";

const EditPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const photoInputRef = useRef(null);

  const users = useSelector((state) => state.users.users);
  const currentUser = useSelector((state) => state.users.currentUser);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
  });
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        name: currentUser.name || "",
        surname: currentUser.surname || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (!formData.username) {
      setUsernameTaken(false);
      return;
    }
    const isTaken = users.some(
      (user) =>
        user.username.toLowerCase() === formData.username.toLowerCase() &&
        user._id !== currentUser?._id
    );
    setUsernameTaken(isTaken);
  }, [formData.username, users, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usernameTaken) {
      toast.error("Bu istifadəçi adı artıq mövcuddur!");
      return;
    }

    setIsLoading(true);
    const updatedData = {
      username: formData.username,
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
    };

    dispatch(updateUser({ id: currentUser._id, updatedData }))
      .unwrap()
      .then(() => toast.success("Məlumatlar uğurla yeniləndi"))
      .catch(() => toast.error("Məlumatlar yenilənərkən xəta baş verdi"))
      .finally(() => setIsLoading(false));
  };

  const handlePhotoChange = () => {
    const file = photoInputRef.current.files[0];
    if (!file) return toast.error("Zəhmət olmasa şəkil seçin!");

    const form = new FormData();
    form.append("photo", file);

    dispatch(updateUser({ id: currentUser._id, updatedData: form }))
      .unwrap()
      .then(() => toast.success("Şəkil uğurla yeniləndi"))
      .catch(() => toast.error("Xəta baş verdi"));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-5xl w-full bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <img src={images} alt="İllustrasiya" className="w-full max-w-md mx-auto object-contain" />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Xoş gəlmisiniz!
              </h2>
              <p className="text-lg text-gray-600 mb-8">Profil redaktəsi üçün daxil olun və ya qeydiyyatdan keçin</p>
              
              <div className="space-y-4">
                <div className="flex gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => navigate("/login")} 
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    🔑 Daxil ol
                  </button>
                  <button 
                    onClick={() => navigate("/register")} 
                    className="px-8 py-3 bg-white border-2 border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    📝 Qeydiyyat
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Təhlükəsiz giriş
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    Sürətli qeydiyyat
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Şəxsi məlumatlar
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                    Asan idarəetmə
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-12 px-4">

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Profil Redaktəsi
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Məlumatlarınızı yeniləyin və profilinizi fərdiləşdirin
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>


        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 h-fit">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl mx-auto relative">
                    <img
                      src={currentUser.photo ? `http://localhost:5050/photos/${currentUser.photo}` : "/default-profile.png"}
                      alt={currentUser.username}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentUser.name} {currentUser.surname}
                </h3>
                <p className="text-gray-500 mb-6">@{currentUser.username}</p>
                
                <input 
                  type="file" 
                  ref={photoInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handlePhotoChange} 
                />
                <button
                  onClick={() => photoInputRef.current.click()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  📸 Şəkli dəyiş
                </button>
              </div>
            </div>


            <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Profil məlumatları</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-sm">👤</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-sm font-medium text-gray-800">Aktiv istifadəçi</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Doğrulama</p>
                    <p className="text-sm font-medium text-gray-800">Təsdiqlənmiş</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-sm">🔒</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Təhlükəsizlik</p>
                    <p className="text-sm font-medium text-gray-800">Qorunmuş</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Şəxsi məlumatlar</h2>
                <p className="text-gray-600">Aşağıdakı sahələri doldurub məlumatlarınızı yeniləyin</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { field: "username", label: "İstifadəçi adı", icon: "👤", type: "text" },
                    { field: "email", label: "Email", icon: "📧", type: "email" },
                    { field: "name", label: "Ad", icon: "👨", type: "text" },
                    { field: "surname", label: "Soyad", icon: "👨‍👩‍👧", type: "text" }
                  ].map(({ field, label, icon, type }) => (
                    <div key={field} className="space-y-2">
                      <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                        {icon} {label}
                      </label>
                      <div className="relative">
                        <input
                          id={field}
                          name={field}
                          type={type}
                          value={formData[field]}
                          onChange={handleInputChange}
                          placeholder={`${label} daxil edin`}
                          className={`w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border-2 ${
                            field === "username" && usernameTaken 
                              ? "border-red-300 focus:border-red-500" 
                              : "border-gray-200 focus:border-blue-500"
                          } focus:outline-none focus:ring-0 transition-all duration-200`}
                        />
                        {field === "username" && formData.username && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                              usernameTaken ? "bg-red-500" : "bg-green-500"
                            }`}>
                              {usernameTaken ? "✕" : "✓"}
                            </div>
                          </div>
                        )}
                      </div>
                      {field === "username" && usernameTaken && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <span>⚠️</span> Bu istifadəçi adı artıq mövcuddur
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={usernameTaken || isLoading}
                    className={`w-full py-4 rounded-xl text-white font-semibold transition-all duration-200 transform ${
                      usernameTaken || isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg"
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Yenilənir...
                      </span>
                    ) : (
                      "💾 Dəyişiklikləri yadda saxla"
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">📋 Məlumat və tövsiyələr</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h5 className="font-medium text-blue-800 mb-2">🔒 Təhlükəsizlik</h5>
                  <p className="text-sm text-blue-600">Güclü parol istifadə edin və məlumatlarınızı qoruyun</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <h5 className="font-medium text-green-800 mb-2">📧 Email doğrulaması</h5>
                  <p className="text-sm text-green-600">Email ünvanınızı düzgün daxil etdiyinizə əmin olun</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h5 className="font-medium text-purple-800 mb-2">👤 İstifadəçi adı</h5>
                  <p className="text-sm text-purple-600">Unikal və yadda qalan istifadəçi adı seçin</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl">
                  <h5 className="font-medium text-orange-800 mb-2">📸 Profil şəkli</h5>
                  <p className="text-sm text-orange-600">Keyfiyyətli və uyğun şəkil yükləyin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;