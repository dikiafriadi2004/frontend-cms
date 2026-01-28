const FeaturesSection = () => {
  const features = [
    {
      title: "Transaksi Lightning Fast ⚡",
      description: "Proses transaksi digital dalam 2 detik! Sistem optimized untuk kecepatan maksimal dan kepuasan pelanggan."
    },
    {
      title: "Keamanan Bank Level 🛡️",
      description: "Sistem keamanan berlapis dengan enkripsi SSL 256-bit, monitoring 24/7, dan proteksi fraud detection."
    },
    {
      title: "Multi Provider Lengkap 🏢",
      description: "Terhubung dengan 50+ provider utama. Telkomsel, Indosat, XL, Tri, Smartfren, dan semua operator tersedia!"
    },
    {
      title: "Dashboard Analytics Pro 📊",
      description: "Laporan real-time dengan grafik interaktif, analisis profit, tracking performa, dan insight bisnis mendalam."
    },
    {
      title: "Support 24/7 Premium 🎧",
      description: "Tim expert siap membantu kapan saja via WhatsApp, Telegram, dan Live Chat. Response time < 5 menit!"
    },
    {
      title: "Profit Maksimal 💰",
      description: "Margin keuntungan 30-50% dengan harga paling kompetitif. Bonus cashback, reward, dan program affiliate!"
    }
  ];

  return (
    <section id="features" className="py-24 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
        <div className="text-center mb-20">
          <div className="inline-flex items-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-xl opacity-30"></div>
              <div className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-full shadow-2xl border border-white/20">
                <div className="w-2 h-2 bg-white/80 rounded-full mr-3 animate-pulse"></div>
                ✨ Kenapa 15,000+ Mitra Memilih Kami?
                <div className="ml-3 w-1 h-1 bg-white/60 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Fitur Super Lengkap untuk Bisnis Anda
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Platform all-in-one dengan teknologi terdepan untuk memaksimalkan profit dan mempermudah operasional bisnis digital Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/60 transform group-hover:-translate-y-4 transition-all duration-700">
                <div className="p-8">
                  <div className="mb-6 transform group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;