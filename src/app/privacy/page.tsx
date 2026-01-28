import { generatePrivacyMetadata } from '@/lib/metadata';
import { fetchPageContent } from '@/lib/api';
import { notFound } from 'next/navigation';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export async function generateMetadata() {
  return await generatePrivacyMetadata();
}

const PrivacyPage = async () => {
  try {
    // Try to fetch privacy policy content from API
    const pageContent = await fetchPageContent('privacy-policy') || await fetchPageContent('privacy');
    
    if (pageContent) {
      // Use API content with DynamicPageRenderer
      return <DynamicPageRenderer pageContent={pageContent} />;
    }
    
    // If no API content, create fallback content structure
    const fallbackContent = {
      id: 'privacy-policy',
      title: 'Kebijakan Privasi',
      slug: 'privacy-policy',
      description: 'Kebijakan privasi mengenai pengumpulan, penggunaan, dan perlindungan data pribadi pengguna.',
      content: {
        html: `
          <p class="text-sm text-gray-600 mb-6">Terakhir diperbarui: 1 Januari 2024</p>
          
          <p class="mb-6">
            Kami berkomitmen untuk melindungi privasi dan keamanan informasi pribadi Anda. 
            Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda.
          </p>

          <h2>Informasi yang Kami Kumpulkan</h2>
          <p>Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:</p>
          <ul>
            <li>Informasi Akun: Nama, email, nomor telepon, dan alamat saat Anda mendaftar</li>
            <li>Informasi Transaksi: Detail pembayaran dan riwayat transaksi digital</li>
            <li>Informasi Komunikasi: Pesan yang Anda kirim melalui formulir kontak</li>
            <li>Informasi Teknis: Alamat IP, jenis browser, dan data penggunaan aplikasi</li>
          </ul>

          <h2>Bagaimana Kami Menggunakan Informasi</h2>
          <p>Informasi yang kami kumpulkan digunakan untuk:</p>
          <ul>
            <li>Menyediakan dan memelihara layanan digital</li>
            <li>Memproses transaksi dan pembayaran</li>
            <li>Memberikan dukungan pelanggan yang responsif</li>
            <li>Mengirim notifikasi penting terkait akun dan layanan</li>
            <li>Meningkatkan keamanan dan mencegah penipuan</li>
            <li>Menganalisis penggunaan untuk perbaikan layanan</li>
          </ul>

          <h2>Keamanan Data</h2>
          <p>Kami menerapkan langkah-langkah keamanan yang ketat untuk melindungi informasi Anda:</p>
          <ul>
            <li>Enkripsi SSL: Semua data ditransmisikan dengan enkripsi SSL 256-bit</li>
            <li>Firewall Berlapis: Sistem keamanan berlapis untuk mencegah akses tidak sah</li>
            <li>Monitoring 24/7: Pemantauan keamanan sistem secara real-time</li>
            <li>Backup Rutin: Pencadangan data secara berkala untuk mencegah kehilangan</li>
            <li>Akses Terbatas: Hanya personel yang berwenang yang dapat mengakses data</li>
          </ul>

          <h2>Berbagi Informasi dengan Pihak Ketiga</h2>
          <p>Kami tidak menjual atau menyewakan informasi pribadi Anda. Namun, kami dapat berbagi informasi dalam situasi berikut:</p>
          <ul>
            <li>Penyedia Layanan: Partner terpercaya yang membantu operasional (payment gateway, SMS gateway)</li>
            <li>Kepatuhan Hukum: Jika diwajibkan oleh hukum atau proses pengadilan</li>
            <li>Keamanan: Untuk mencegah penipuan atau aktivitas ilegal</li>
            <li>Persetujuan: Dengan persetujuan eksplisit dari Anda</li>
          </ul>

          <h2>Hak-Hak Anda</h2>
          <p>Sebagai pengguna, Anda memiliki hak-hak berikut:</p>
          <ul>
            <li>Akses: Meminta salinan data pribadi yang kami miliki tentang Anda</li>
            <li>Koreksi: Meminta perbaikan data yang tidak akurat atau tidak lengkap</li>
            <li>Penghapusan: Meminta penghapusan data pribadi dalam kondisi tertentu</li>
            <li>Portabilitas: Meminta transfer data ke penyedia layanan lain</li>
            <li>Keberatan: Menolak pemrosesan data untuk tujuan tertentu</li>
            <li>Penarikan Persetujuan: Menarik persetujuan kapan saja</li>
          </ul>

          <h2>Cookies dan Teknologi Pelacakan</h2>
          <p>Kami menggunakan cookies dan teknologi serupa untuk:</p>
          <ul>
            <li>Menjaga sesi login Anda tetap aktif</li>
            <li>Mengingat preferensi dan pengaturan</li>
            <li>Menganalisis pola penggunaan website</li>
            <li>Memberikan pengalaman yang dipersonalisasi</li>
          </ul>

          <h2>Retensi Data</h2>
          <p>Kami menyimpan data pribadi Anda selama:</p>
          <ul>
            <li>Data Akun: Selama akun aktif dan 2 tahun setelah penutupan akun</li>
            <li>Data Transaksi: 7 tahun sesuai ketentuan perpajakan dan audit</li>
            <li>Data Komunikasi: 3 tahun untuk keperluan dukungan pelanggan</li>
            <li>Data Log: 1 tahun untuk keperluan keamanan dan troubleshooting</li>
          </ul>

          <h2>Perubahan Kebijakan Privasi</h2>
          <p>Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diberitahukan melalui:</p>
          <ul>
            <li>Email notifikasi ke alamat email terdaftar</li>
            <li>Pemberitahuan di dashboard akun Anda</li>
            <li>Pengumuman di website resmi</li>
          </ul>

          <h2>Hubungi Kami</h2>
          <p>Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi:</p>
          
          <div class="bg-gray-50 rounded-lg p-6 mt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Kontak Privasi</h4>
                <div class="space-y-2 text-sm">
                  <div><span class="font-medium">Email:</span> privacy@example.com</div>
                  <div><span class="font-medium">Telepon:</span> +62 123 456 789</div>
                  <div><span class="font-medium">WhatsApp:</span> +62 123 456 789</div>
                </div>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Alamat Kantor</h4>
                <div class="text-sm text-gray-700">
                  Jl. Teknologi No. 123<br />
                  Jakarta Selatan 12345<br />
                  Indonesia
                </div>
                <div class="text-sm text-gray-600 mt-2">
                  <span class="font-medium">Jam Operasional:</span><br />
                  Senin - Jumat, 09:00 - 17:00 WIB
                </div>
              </div>
            </div>
          </div>
        `,
        sections: []
      },
      template: 'privacy' as const,
      isActive: true,
      isPublished: true,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return <DynamicPageRenderer pageContent={fallbackContent} />;
  } catch (error) {
    console.error('Failed to load privacy page:', error);
    notFound();
  }
};

export default PrivacyPage;