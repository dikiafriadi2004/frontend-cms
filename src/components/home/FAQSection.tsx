'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useSettings } from '@/contexts/ApiContext';
import { getSiteName } from '@/lib/settings-helper';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { settings } = useSettings();

  const faqs = [
    {
      question: `Apa itu ${getSiteName(settings)} dan bagaimana cara kerjanya?`,
      answer: `${getSiteName(settings)} adalah platform yang memungkinkan Anda menjalankan berbagai layanan digital dan bisnis online. Sistem kami terhubung dengan berbagai provider untuk memastikan layanan yang cepat dan akurat.`
    },
    {
      question: "Berapa modal minimum untuk memulai bisnis digital?",
      answer: "Anda dapat memulai dengan modal minimum sesuai kebutuhan bisnis Anda. Modal ini akan digunakan untuk operasional dan dapat disesuaikan dengan skala bisnis yang diinginkan."
    },
    {
      question: `Apakah sistem ${getSiteName(settings)} aman dan terpercaya?`,
      answer: "Ya, sistem kami menggunakan enkripsi SSL dan berbagai lapisan keamanan untuk melindungi data dan transaksi Anda. Kami juga memiliki sertifikasi keamanan dan telah dipercaya oleh ribuan mitra di seluruh Indonesia."
    },
    {
      question: "Bagaimana cara mendapatkan dukungan teknis?",
      answer: "Tim support kami tersedia 24/7 melalui WhatsApp, email, dan live chat. Anda juga dapat mengakses dokumentasi lengkap dan video tutorial di dashboard aplikasi."
    },
    {
      question: "Apakah ada biaya bulanan atau biaya tersembunyi?",
      answer: "Tidak ada biaya bulanan atau biaya tersembunyi. Anda hanya perlu melakukan deposit untuk operasional bisnis. Semua fitur aplikasi dapat digunakan tanpa biaya tambahan."
    },
    {
      question: `Produk apa saja yang tersedia di ${getSiteName(settings)}?`,
      answer: "Kami menyediakan berbagai layanan digital, platform bisnis, solusi teknologi, aplikasi mobile, dan masih banyak lagi dengan kualitas terbaik dan harga yang kompetitif."
    },
    {
      question: "Bagaimana cara melakukan penarikan keuntungan?",
      answer: "Keuntungan dapat ditarik kapan saja melalui transfer bank dengan minimal penarikan Rp 50.000. Proses penarikan biasanya diproses dalam 1-24 jam pada hari kerja."
    },
    {
      question: "Apakah bisa menjadi reseller atau agen?",
      answer: "Ya, kami memiliki program kemitraan untuk reseller dan agen dengan benefit khusus seperti harga lebih murah, bonus, dan dukungan marketing. Hubungi tim kami untuk informasi lebih lanjut."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative">
      <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
        <div className="text-center mb-20">
          <div className="inline-flex items-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur-xl opacity-30"></div>
              <div className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold rounded-full shadow-2xl border border-white/20">
                <div className="w-2 h-2 bg-white/80 rounded-full mr-3 animate-pulse"></div>
                ❓ Pertanyaan yang Sering Diajukan
                <div className="ml-3 w-1 h-1 bg-white/60 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Jawaban untuk Semua Pertanyaan Anda
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Temukan jawaban untuk pertanyaan umum seputar {getSiteName(settings)} dan cara memulai bisnis digital
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/60"
            >
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-bold text-gray-900 pr-4 text-lg">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`w-6 h-6 text-gray-500 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;