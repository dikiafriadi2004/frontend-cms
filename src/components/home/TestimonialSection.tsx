'use client';

import { useSettings } from '@/contexts/ApiContext';
import { getSiteName } from '@/lib/settings-helper';

const TestimonialSection = () => {
  const { settings } = useSettings();
  const siteName = getSiteName(settings);

  const testimonials = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "Pemilik Bisnis Digital Jakarta",
      content: `Gila! Sejak pakai ${siteName}, omzet naik 300%! Dari yang dulu cuma 5 juta sebulan, sekarang bisa 20 juta lebih. Sistemnya stabil banget, transaksi cepet, customer service responsif. Pokoknya recommended banget deh!`,
      rating: 5,
      avatar: "BS",
      profit: "Rp 20M/bulan",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      role: "Reseller Digital Surabaya",
      content: "Awalnya ragu, tapi setelah coba ternyata beneran bagus! Interface gampang dipake, laporan lengkap, harga kompetitif. Yang paling suka, margin keuntungannya gede banget. Sekarang udah bisa beli mobil dari hasil jualan digital!",
      rating: 5,
      avatar: "SN",
      profit: "Rp 15M/bulan",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      name: "Ahmad Wijaya",
      role: "Distributor Digital Bandung",
      content: `2 tahun pake ${siteName}, never disappointed! Sistem jarang down, support 24/7 beneran fast response, produk lengkap dan fitur canggih. Bisnis makin berkembang, sekarang udah punya 50+ mitra. Thanks ${siteName}!`,
      rating: 5,
      avatar: "AW",
      profit: "Rp 35M/bulan",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-24 relative">
      <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
        <div className="text-center mb-20">
          <div className="inline-flex items-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-full blur-xl opacity-30"></div>
              <div className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-2xl border border-white/20">
                <div className="w-2 h-2 bg-white/80 rounded-full mr-3 animate-pulse"></div>
                💬 Testimoni Real dari Mitra Sukses
                <div className="ml-3 w-1 h-1 bg-white/60 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Mereka Sudah Merasakan Keuntungan Berlipat!
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            15,000+ mitra telah membuktikan kesuksesan bisnis mereka bersama {siteName}. 
            Saatnya giliran Anda merasakan profit jutaan rupiah!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative"
            >
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/60 transform group-hover:-translate-y-4 transition-all duration-700">
                <div className="p-8">
                  {/* Rating */}
                  <div className="flex items-center mb-6">
                    {renderStars(testimonial.rating)}
                    <span className="ml-2 text-sm text-gray-500 font-medium">5.0</span>
                  </div>

                  {/* Content */}
                  <blockquote className="text-gray-700 mb-8 leading-relaxed text-sm">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                    
                    {/* Profit Badge */}
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      💰 {testimonial.profit}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div className="group">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/60 transform group-hover:-translate-y-4 transition-all duration-700 p-8">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">15K+</div>
              <div className="text-gray-600 font-medium">Mitra Aktif</div>
              <div className="text-xs text-green-600 font-semibold mt-1">↗️ +500 bulan ini</div>
            </div>
          </div>
          <div className="group">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/60 transform group-hover:-translate-y-4 transition-all duration-700 p-8">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600 font-medium">Uptime</div>
              <div className="text-xs text-green-600 font-semibold mt-1">🔥 Sistem Stabil</div>
            </div>
          </div>
          <div className="group">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/60 transform group-hover:-translate-y-4 transition-all duration-700 p-8">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">2M+</div>
              <div className="text-gray-600 font-medium">Transaksi/Bulan</div>
              <div className="text-xs text-green-600 font-semibold mt-1">⚡ Super Fast</div>
            </div>
          </div>
          <div className="group">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/60 transform group-hover:-translate-y-4 transition-all duration-700 p-8">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support</div>
              <div className="text-xs text-green-600 font-semibold mt-1">💬 Always Ready</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;