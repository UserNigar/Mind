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

      // ✅ Uğurlu toast bildirişi
      toast.success("✅ Məqalə uğurla paylaşdı!", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });

      // Sahələri sıfırla
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
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Məqalə yarat
            </h1>
            <p className="text-gray-600">
              Yeni məqalənizi yazın və icma ilə paylaşın
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlıq
              </label>
              <input
                type="text"
                placeholder="Məqalənizin başlığını daxil edin..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Məqalə mətni
              </label>
              <textarea
                placeholder="Məqalənizin mətnini yazın..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-900 placeholder-gray-500 resize-vertical"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={submitArticle}
                disabled={!title.trim() || !content.trim() || loading}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Paylaşılır..." : "Məqaləni paylaş"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Yazı təlimatları
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Başlığınız oxucuları cəlb edəcək şəkildə olsun</span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Məqalənizi paraqraflara bölün və oxunaqlı edin</span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Mövzunuza uyğun və faydalı məlumat paylaşın</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
