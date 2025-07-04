import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const Share = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = useSelector((state) => state.users.currentUser);

  const submitArticle = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Zəhmət olmasa bütün sahələri doldurun.");
      return;
    }

    if (!currentUser) {
      toast.error("Məqalə paylaşmaq üçün əvvəlcə daxil olun.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5050/api/users/articles",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      toast.success("✅ Məqalə uğurla paylaşdı!", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });


      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Məqalə əlavə edilərkən xəta:", error);
      toast.error("❌ Məqalə əlavə edilərkən xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24">
      <div className="max-w-5xl mx-auto px-6">
        

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ✍️ Məqalə Yarat
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fikirlərinizi dünya ilə paylaşın və icmanın bir hissəsi olun
          </p>
        </div>


        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 mb-10">
          <div className="space-y-8">
            

            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-800">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                Məqalə Başlığı
              </label>
              <input
                type="text"
                placeholder="Məqalənizin cəlbedici başlığını yazın..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-gray-900 placeholder-gray-400 bg-gray-50"
              />
              <div className="text-sm text-gray-500">
                {title.length}/100 simvol
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-800">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                Məqalə Mətni
              </label>
              <textarea
                placeholder="Məqalənizin məzmununu ətraflı şəkildə yazın..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none text-gray-900 placeholder-gray-400 bg-gray-50 resize-none"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{content.length} simvol yazılıb</span>
                <span>Minimum 50 simvol tövsiyə olunur</span>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                onClick={submitArticle}
                disabled={!title.trim() || !content.trim() || loading}
                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-full shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform active:scale-95 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Paylaşılır...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="mr-2">🚀</span>
                    Məqaləni Paylaş
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>


        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-2xl mr-3">💡</span>
              Yazı Təlimatları
            </h3>
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <span className="text-blue-600 text-xl mr-3">📝</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Başlıq</h4>
                  <p className="text-gray-600 text-sm">Oxucuları cəlb edəcək və maraqlandıracaq başlıq seçin</p>
                </div>
              </div>
              <div className="flex items-start p-4 bg-green-50 rounded-lg">
                <span className="text-green-600 text-xl mr-3">📖</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Struktur</h4>
                  <p className="text-gray-600 text-sm">Məqalənizi paraqraflara bölün və oxunaqlı edin</p>
                </div>
              </div>
              <div className="flex items-start p-4 bg-purple-50 rounded-lg">
                <span className="text-purple-600 text-xl mr-3">⭐</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Keyfiyyət</h4>
                  <p className="text-gray-600 text-sm">Faydalı və orijinal məzmun paylaşın</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="pb-20"></div>
      </div>
    </div>
  );
};

export default Share;