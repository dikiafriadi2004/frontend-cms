'use client';

import { useSettings } from '@/contexts/ApiContext';
import { useState } from 'react';

const ContactPageClient = () => {
  const { settings, companySettings } = useSettings();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_CMS_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBaseUrl}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setShowAlert(true);
        
        // Track successful form submission
        import('@/lib/analytics').then(({ trackContactFormSubmit }) => {
          trackContactFormSubmit();
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: ''
        });
        // Auto hide alert after 5 seconds
        setTimeout(() => {
          setShowAlert(false);
          setSubmitStatus('idle');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.message || 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      setErrorMessage('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Success Alert Notification */}
      {showAlert && submitStatus === 'success' && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-white border border-green-200 rounded-xl shadow-2xl p-4 max-w-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">Pesan Terkirim!</h4>
                <p className="text-sm text-gray-600 mt-1">Tim kami akan segera menghubungi Anda.</p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-4">
                <span className="inline-block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Hubungi
                </span>
                <span className="inline-block mx-4 text-gray-300">&</span>
                <span className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Tim Kami
                </span>
              </h1>
              
              <div className="flex items-center justify-center mt-6 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-32"></div>
                <div className="mx-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent w-32"></div>
              </div>
            </div>

            <div className="relative">
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 leading-relaxed max-w-4xl mx-auto font-light">
                Tim 
                <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> expert kami</span> siap membantu dengan 
                <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> dukungan teknis</span>,
                <br className="hidden md:block" />
                <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> konsultasi bisnis</span>, dan solusi terbaik untuk bisnis digital Anda
              </p>
              
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-24">
        <div className="relative max-w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="relative">
                {/* Modern Card Design */}
                <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Hubungi Kami</h3>
                        <p className="text-blue-100 text-sm">Kami siap membantu kebutuhan bisnis Anda</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Content */}
                  <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Error Message */}
                      {submitStatus === 'error' && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="text-red-700 font-medium">{errorMessage}</p>
                          </div>
                        </div>
                      )}

                      {/* Form Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Nama Lengkap <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                              placeholder="Masukkan nama lengkap"
                            />
                          </div>
                        </div>
                        
                        {/* Email Field */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                              placeholder="nama@email.com"
                            />
                          </div>
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Nomor Telepon <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                              placeholder="+62 821 8511 9002"
                            />
                          </div>
                        </div>

                        {/* Company Field */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Perusahaan
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                              placeholder="Nama perusahaan (opsional)"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Subject Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Subjek <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                            placeholder="Pertanyaan tentang layanan digital"
                          />
                        </div>
                      </div>
                      
                      {/* Message Field */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Pesan <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-4 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={5}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 resize-none"
                            placeholder="Tulis pesan Anda di sini..."
                          ></textarea>
                        </div>
                      </div>
                      
                      {/* Submit Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform shadow-lg ${
                            isSubmitting
                              ? 'bg-gray-400 cursor-not-allowed text-white'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]'
                          }`}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center space-x-3">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Mengirim Pesan...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              <span>Kirim Pesan</span>
                            </div>
                          )}
                        </button>
                      </div>

                      {/* Form Footer */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span>Data Anda aman dan terlindungi</span>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/60">
                <div className="p-8 lg:p-10">
                  <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-8">
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Kontak Cepat
                    </span>
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Email */}
                    {settings?.contact?.email && (
                      <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-blue-50/50 transition-all duration-300">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-gray-900 mb-2">Email</h4>
                          <a href={`mailto:${settings.contact.email}`} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                            {settings.contact.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    {settings?.contact?.phone && (
                      <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-green-50/50 transition-all duration-300">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-gray-900 mb-2">Telepon</h4>
                          <a href={`tel:${settings.contact.phone}`} className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                            {settings.contact.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* WhatsApp */}
                    {settings?.contact?.whatsapp && (
                      <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-green-50/50 transition-all duration-300">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-gray-900 mb-2">WhatsApp</h4>
                          <a 
                            href={`https://wa.me/${settings.contact.whatsapp.replace(/[^0-9]/g, '')}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 font-semibold hover:text-green-700 transition-colors"
                          >
                            {settings.contact.whatsapp}
                          </a>
                          <p className="text-sm text-gray-500 font-medium mt-1">Chat langsung dengan tim support</p>
                        </div>
                      </div>
                    )}

                    {/* Address */}
                    {settings?.contact?.address && (
                      <div className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-red-50/50 transition-all duration-300">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-gray-900 mb-2">Alamat Kantor</h4>
                          <p className="text-red-600 font-semibold">
                            {settings.contact.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              {companySettings?.business_hours && (
                <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/60">
                  <div className="p-8 lg:p-10">
                    <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-8">
                      <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Jam Operasional
                      </span>
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-4 border-b border-gray-100">
                        <span className="text-gray-600 font-bold">Jam Kerja</span>
                        <span className="text-gray-900 font-black">{companySettings.business_hours}</span>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-black text-blue-800 mb-2">Support 24/7</p>
                          <p className="text-sm text-blue-700 leading-relaxed font-medium">
                            Tim technical support kami tersedia 24 jam melalui WhatsApp dan email untuk masalah urgent.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Response Time */}
              <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative p-8 lg:p-10 text-white">
                  <h3 className="text-2xl lg:text-3xl font-black mb-8">Response Time</h3>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                      <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg"></div>
                      <span className="text-white font-bold">Email: 2-4 jam</span>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                      <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg"></div>
                      <span className="text-white font-bold">WhatsApp: 5-15 menit</span>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                      <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
                      <span className="text-white font-bold">Telepon: Langsung</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPageClient;