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
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-4xl w-full bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <img src={images} alt="İllustrasiya" className="w-56 h-56 object-contain" />
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Xoş gəlmisiniz!</h2>
              <p className="text-gray-600 mb-6">Daxil olun və ya qeydiyyatdan keçin</p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <button onClick={() => navigate("/login")} className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Daxil ol
                </button>
                <button onClick={() => navigate("/register")} className="px-5 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50">
                  Qeydiyyat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-75px)] mt-[72px] bg-gray-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Profil Redaktəsi</h1>
            <p className="text-sm text-gray-500">Məlumatlarınızı yeniləyin</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-200 mb-4">
                <img
                  src={currentUser.photo ? `http://localhost:5050/photos/${currentUser.photo}` : "/default-profile.png"}
                  alt={currentUser.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
              <button
                onClick={() => photoInputRef.current.click()}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
              >
                📸 Şəkli dəyiş
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {["username", "name", "surname", "email"].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm text-gray-700 mb-1">
                    {field === "username" ? "İstifadəçi adı" :
                     field === "name" ? "Ad" :
                     field === "surname" ? "Soyad" : "Email"}
                  </label>
                  <div className="relative">
                    <input
                      id={field}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      value={formData[field]}
                      onChange={handleInputChange}
                      placeholder={`${field} daxil edin`}
                      className={`w-full px-4 py-2 bg-gray-50 text-gray-900 rounded-md border ${
                        field === "username" && usernameTaken ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {field === "username" && formData.username && (
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg ${
                        usernameTaken ? "text-red-500" : "text-green-500"
                      }`}>
                        {usernameTaken ? "❌" : "✅"}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={usernameTaken || isLoading}
                className={`w-full py-2 rounded-md text-white font-semibold transition-all ${
                  usernameTaken || isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isLoading ? "Yenilənir..." : "💾 Yadda saxla"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
