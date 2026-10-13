import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  SUBJECT_LIST,
  calculateSubjectFinalScore,
  calculateStudentOverallFinalScore,
  calculateStudentTotalFinalScore,
} from '../../constants/subjects';
import { Badge } from '../common/Badge';
import { KopSurat } from '../common/KopSurat';
import {
  GraduationCap,
  Printer,
  FileText,
  BookMarked,
  CheckCircle,
  Search,
  Building,
  School,
  Award,
  Download,
  Users,
} from 'lucide-react';

export const DiplomaManagementView: React.FC = () => {
  const {
    students,
    schoolProfile,
    subjects,
    diplomaRecords,
    updateDiplomaRecord,
    selectedStudentForSKHU,
    setSelectedStudentForSKHU,
    updateStudent,
    showToast,
  } = useApp();

  type TabKey = 'skhu' | 'sk-kelulusan' | 'blangko' | 'serah-terima' | 'register' | 'perpisahan';
  const [activeTab, setActiveTab] = useState<TabKey>('skhu');
  const [search, setSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    selectedStudentForSKHU?.id || students[0]?.id || ''
  );

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handlePrintDocument = () => {
    window.print();
  };

  const handleDeliveryUpdate = (id: string, date: string, recipient: string) => {
    updateStudent(id, {
      tanggalAmbilIjazah: date,
      penerimaIjazah: recipient,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Penerbitan Transkrip Nilai, SK Kelulusan & Pengelolaan Ijazah
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Cetak format resmi Transkrip Nilai, SK Kelulusan, Laporan Blangko, dan Buku Serah Terima
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintDocument}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-colors"
          >
            <Printer className="h-4 w-4" />
            Cetak Dokumen Terpilih
          </button>
        </div>
      </div>

      {/* Navigation Sub Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        {[
          { key: 'skhu', label: 'Transkrip Nilai', icon: FileText },
          { key: 'sk-kelulusan', label: 'Surat Keputusan (SK) Kelulusan', icon: Award },
          { key: 'blangko', label: 'Laporan Blangko Ijazah', icon: BookMarked },
          { key: 'serah-terima', label: 'Buku Serah Terima Ijazah', icon: CheckCircle },
          { key: 'register', label: 'Register No. Ijazah & Surat', icon: BookMarked },
          { key: 'perpisahan', label: 'Daftar Hadir Perpisahan', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. CETAK TRANSKRIP NILAI RESMI */}
      {activeTab === 'skhu' && (
        <div className="space-y-6">
          {/* Student Selector Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 shrink-0">
                Pilih Peserta Didik:
              </span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full sm:w-80 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.noPeserta} - {s.nama} ({s.ruang})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-zinc-500 font-medium">
              Format Resmi Transkrip Nilai Siswa SDN 006 Sungai Buluh
            </div>
          </div>

          {/* Official Printable Transkrip Nilai / SKHU Sheet */}
          <div className="mx-auto max-w-4xl rounded-2xl border-2 border-zinc-300 bg-white p-8 sm:p-12 shadow-md dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 print:border-none print:shadow-none print:p-0">
            {/* Kop Surat Resmi */}
            <KopSurat schoolProfile={schoolProfile} />

            {/* Document Title */}
            <div className="text-center my-6">
              <h3 className="text-base font-extrabold uppercase underline tracking-wider">
                TRANSKRIP NILAI
              </h3>
              <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                Nomor: {currentStudent.noSuratTranskrip || `421.2 / SDN-006 / TRANSKRIP / ${schoolProfile.tahunPelajaran.replace('/', '-')} / ${currentStudent.noMeja.toString().padStart(3, '0')}`}
              </p>
            </div>

            {/* Student & School Identity Form */}
            <div className="rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 p-4 border border-zinc-200 dark:border-zinc-700 text-xs mb-6">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-700/50">
                  <tr>
                    <td className="w-56 sm:w-64 py-1.5 text-zinc-600 dark:text-zinc-400 font-medium">Satuan Pendidikan</td>
                    <td className="w-4 py-1.5">:</td>
                    <td className="py-1.5 font-bold text-zinc-950 dark:text-zinc-50 uppercase">{schoolProfile.namaSekolah}</td>
                  </tr>
                  <tr>
                    <td className="w-56 sm:w-64 py-1.5 text-zinc-600 dark:text-zinc-400 font-medium">Nomor Pokok Sekolah Nasional</td>
                    <td className="w-4 py-1.5">:</td>
                    <td className="py-1.5 font-mono font-medium">{schoolProfile.npsn}</td>
                  </tr>
                  <tr>
                    <td className="w-56 sm:w-64 py-1.5 text-zinc-600 dark:text-zinc-400 font-medium">Nama Siswa</td>
                    <td className="w-4 py-1.5">:</td>
                    <td className="py-1.5 font-extrabold uppercase text-zinc-950 dark:text-zinc-50">{currentStudent.nama}</td>
                  </tr>
                  <tr>
                    <td className="w-56 sm:w-64 py-1.5 text-zinc-600 dark:text-zinc-400 font-medium">Tempat Tanggal Lahir</td>
                    <td className="w-4 py-1.5">:</td>
                    <td className="py-1.5 font-medium">{currentStudent.tempatLahir}, {currentStudent.tanggalLahir}</td>
                  </tr>
                  <tr>
                    <td className="w-56 sm:w-64 py-1.5 text-zinc-600 dark:text-zinc-400 font-medium">Nomor Induk Siswa Nasional</td>
                    <td className="w-4 py-1.5">:</td>
                    <td className="py-1.5 font-mono font-medium">{currentStudent.nisn}</td>
                  </tr>
                  <tr>
                    <td className="w-56 sm:w-64 py-1.5 text-zinc-600 dark:text-zinc-400 font-medium">Nomor Ijazah</td>
                    <td className="w-4 py-1.5">:</td>
                    <td className="py-1.5 font-mono font-bold text-zinc-900 dark:text-zinc-100">{currentStudent.noSeriIjazah || '-'}</td>
                  </tr>
                  <tr>
                    <td className="w-56 sm:w-64 py-1.5 text-zinc-600 dark:text-zinc-400 font-medium">Tanggal kelulusan</td>
                    <td className="w-4 py-1.5">:</td>
                    <td className="py-1.5 font-medium">{schoolProfile.tanggalKelulusan}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table of Grades */}
            <div className="overflow-x-auto rounded-xl border border-zinc-300 dark:border-zinc-700 mb-6">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold border-b border-zinc-300 dark:border-zinc-700">
                  <tr>
                    <th className="p-2.5 w-12 text-center border-r border-zinc-300 dark:border-zinc-700">No</th>
                    <th className="p-2.5 min-w-[240px] border-r border-zinc-300 dark:border-zinc-700">
                      Mata Pelajaran (Kurikulum 2013)
                    </th>
                    <th className="p-2.5 text-center w-28">
                      Nilai
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {subjects.map((sub, idx) => {
                    const na = calculateSubjectFinalScore(currentStudent, sub.key, schoolProfile);

                    return (
                      <tr key={sub.key} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="p-2.5 text-center font-medium border-r border-zinc-200 dark:border-zinc-700">
                          {idx + 1}
                        </td>
                        <td className="p-2.5 font-medium text-zinc-900 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-700">
                          {sub.name}
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-800 dark:text-emerald-400">
                          {na.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t-2 border-zinc-300 bg-zinc-50 dark:bg-zinc-800/60 font-bold">
                  <tr>
                    <td colSpan={2} className="p-2.5 text-right uppercase border-r border-zinc-300 dark:border-zinc-700">
                      Jumlah / Total Nilai :
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-800 dark:text-emerald-300">
                      {calculateStudentTotalFinalScore(currentStudent, schoolProfile, subjects).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="p-2.5 text-right uppercase border-r border-zinc-300 dark:border-zinc-700">
                      Rata-Rata Nilai :
                    </td>
                    <td className="p-2.5 text-center font-mono font-extrabold text-sm text-emerald-800 dark:text-emerald-300">
                      {calculateStudentOverallFinalScore(currentStudent, schoolProfile, subjects).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Tanda Tangan Kepala Sekolah */}
            <div className="flex justify-end pt-6 text-xs break-inside-avoid">
              <div className="w-72 text-right space-y-1">
                <p>Sungai Buluh, {schoolProfile.tanggalKelulusan}</p>
                <p className="font-semibold">Kepala Sekolah SDN 006 Sungai Buluh,</p>
                <div className="h-16"></div>
                <p className="font-extrabold underline text-sm uppercase">
                  {schoolProfile.kepalaSekolah}
                </p>
                <p className="pt-0.5 text-zinc-700 dark:text-zinc-300 font-normal">
                  NIP. {schoolProfile.nipKepalaSekolah}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SURAT KEPUTUSAN KELULUSAN RESMI */}
      {activeTab === 'sk-kelulusan' && (
        <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-200 bg-white p-8 sm:p-12 shadow-md dark:border-zinc-800 dark:bg-zinc-900 space-y-6 text-xs text-zinc-900 dark:text-zinc-100 leading-relaxed font-serif print:border-none print:shadow-none print:p-0">
          {/* Kop Surat Resmi SK Kelulusan */}
          <KopSurat schoolProfile={schoolProfile} />

          <div className="text-center space-y-1 pt-2 pb-2">
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
              K E P U T U S A N
            </h3>
            <h4 className="text-xs sm:text-sm font-bold uppercase text-zinc-900 dark:text-zinc-100">
              KEPALA SEKOLAH DASAR NEGERI 006 SUNGAI BULUH
            </h4>
            <p className="font-mono font-bold text-xs text-zinc-600 dark:text-zinc-400">
              NOMOR : 422/KPTS/SDN-006/SB/VI/2026/041
            </p>
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-widest">T E N T A N G</p>
              <p className="text-xs sm:text-sm font-extrabold uppercase text-emerald-900 dark:text-emerald-400 max-w-xl mx-auto">
                PENETAPAN KELULUSAN PESERTA DIDIK KELAS VI TAHUN PELAJARAN {schoolProfile.tahunPelajaran}
              </p>
            </div>
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wide">
                DENGAN RAHMAT TUHAN YANG MAHA ESA
              </p>
              <p className="text-xs font-bold uppercase">
                KEPALA SEKOLAH DASAR NEGERI 006 SUNGAI BULUH,
              </p>
            </div>
          </div>

          {/* Konsideran SK Kelulusan */}
          <div className="space-y-3 leading-relaxed text-justify">
            <div className="flex items-start">
              <div className="w-28 sm:w-32 shrink-0 font-bold">Menimbang</div>
              <div className="w-4 shrink-0 font-bold">:</div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-start">
                  <span className="w-5 shrink-0">a.</span>
                  <span className="flex-1">
                    Bahwa dalam rangka mengakhiri proses pembelajaran dan pelaksanaan ujian sekolah bagi peserta didik kelas VI SD Negeri 006 Sungai Buluh Tahun Pelajaran {schoolProfile.tahunPelajaran}, perlu ditetapkan kelulusan peserta didik;
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="w-5 shrink-0">b.</span>
                  <span className="flex-1">
                    Bahwa peserta didik yang dinyatakan lulus telah memenuhi kriteria dan persyaratan kelulusan yang telah ditentukan oleh satuan pendidikan sesuai dengan ketentuan peraturan perundang-undangan yang berlaku;
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="w-5 shrink-0">c.</span>
                  <span className="flex-1">
                    Bahwa berdasarkan pertimbangan sebagaimana dimaksud pada huruf a dan huruf b di atas, perlu menetapkan Keputusan Kepala Sekolah tentang Penetapan Kelulusan Peserta Didik Kelas VI SD Negeri 006 Sungai Buluh Tahun Pelajaran {schoolProfile.tahunPelajaran}.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-28 sm:w-32 shrink-0 font-bold">Mengingat</div>
              <div className="w-4 shrink-0 font-bold">:</div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-start">
                  <span className="w-5 shrink-0">1.</span>
                  <span className="flex-1">
                    Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional (Lembaran Negara Republik Indonesia Tahun 2003 Nomor 78, Tambahan Lembaran Negara Republik Indonesia Nomor 4301);
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="w-5 shrink-0">2.</span>
                  <span className="flex-1">
                    Peraturan Pemerintah Nomor 19 Tahun 2005 tentang Standar Nasional Pendidikan, sebagaimana telah diubah beberapa kali terakhir dengan Peraturan Pemerintah Nomor 4 Tahun 2022;
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="w-5 shrink-0">3.</span>
                  <span className="flex-1">
                    Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 9 Tahun 2022 tentang Evaluasi Sistem Pendidikan oleh Pemerintah Pusat dan Pemerintah Daerah terhadap Pendidikan Anak Usia Dini, Pendidikan Dasar, dan Pendidikan Menengah;
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="w-5 shrink-0">4.</span>
                  <span className="flex-1">
                    Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 21 Tahun 2022 tentang Standar Penilaian Pendidikan pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah (Berita Negara Republik Indonesia Tahun 2022 Nomor 460).
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-28 sm:w-32 shrink-0 font-bold">Memperhatikan</div>
              <div className="w-4 shrink-0 font-bold">:</div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-start">
                  <span className="w-5 shrink-0">1.</span>
                  <span className="flex-1">
                    Kriteria Kelulusan Peserta Didik Kelas VI SD Negeri 006 Sungai Buluh Tahun Pelajaran {schoolProfile.tahunPelajaran};
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="w-5 shrink-0">2.</span>
                  <span className="flex-1">
                    Hasil Rapat Dewan Guru SD Negeri 006 Sungai Buluh tanggal {schoolProfile.tanggalKelulusan} tentang Penetapan Kelulusan Peserta Didik Kelas VI Tahun Pelajaran {schoolProfile.tahunPelajaran}.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Diktum MEMUTUSKAN */}
          <div className="text-center font-bold pt-2 pb-1 tracking-widest text-xs sm:text-sm">
            M E M U T U S K A N :
          </div>

          <div className="space-y-2">
            <div className="flex items-start">
              <div className="w-28 sm:w-32 shrink-0 font-bold">Menetapkan</div>
              <div className="w-4 shrink-0 font-bold">:</div>
              <div className="flex-1 font-bold uppercase">
                KEPUTUSAN KEPALA SEKOLAH DASAR NEGERI 006 SUNGAI BULUH TENTANG PENETAPAN KELULUSAN PESERTA DIDIK KELAS VI TAHUN PELAJARAN {schoolProfile.tahunPelajaran}.
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-28 sm:w-32 shrink-0 font-bold">KESATU</div>
              <div className="w-4 shrink-0 font-bold">:</div>
              <div className="flex-1">
                Nama-nama peserta didik Kelas VI Tahun Pelajaran {schoolProfile.tahunPelajaran} yang berjumlah {students.length} orang, sebagaimana tercantum dalam Lampiran Surat Keputusan ini berdasarkan hasil Rekapitulasi Nilai Akhir ({schoolProfile.bobotRapor}% Rapor + {schoolProfile.bobotUS}% Ujian Sekolah), dinyatakan <b>LULUS (100%)</b> dari SD Negeri 006 Sungai Buluh;
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-28 sm:w-32 shrink-0 font-bold">KEDUA</div>
              <div className="w-4 shrink-0 font-bold">:</div>
              <div className="flex-1">
                Peserta didik yang dinyatakan lulus sebagaimana dimaksud dalam Diktum KESATU berhak memperoleh Surat Keterangan Lulus (SKL) / SKHU Sementara dan Ijazah sesuai dengan ketentuan perundang-undangan yang berlaku;
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-28 sm:w-32 shrink-0 font-bold">KETIGA</div>
              <div className="w-4 shrink-0 font-bold">:</div>
              <div className="flex-1">
                Segala biaya yang timbul akibat diterbitkannya Keputusan ini dibebankan pada anggaran yang sesuai;
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-28 sm:w-32 shrink-0 font-bold">KEEMPAT</div>
              <div className="w-4 shrink-0 font-bold">:</div>
              <div className="flex-1">
                Keputusan ini mulai berlaku sejak tanggal ditetapkan, dengan ketentuan apabila di kemudian hari terdapat kekeliruan dalam keputusan ini akan diadakan perbaikan sebagaimana mestinya.
              </div>
            </div>
          </div>

          {/* Titimangsa & Tanda Tangan */}
          <div className="flex justify-end pt-6 break-inside-avoid">
            <div className="w-72 space-y-1 text-xs">
              <div className="grid grid-cols-5">
                <span className="col-span-2">Ditetapkan di</span>
                <span className="col-span-3">: {schoolProfile.tempatCetak || 'Sungai Buluh'}</span>
              </div>
              <div className="grid grid-cols-5">
                <span className="col-span-2">Pada Tanggal</span>
                <span className="col-span-3">: {schoolProfile.tanggalKelulusan}</span>
              </div>
              <div className="pt-2 font-bold">Kepala SD Negeri 006 Sungai Buluh,</div>
              <div className="h-20"></div>
              <div className="font-bold underline uppercase">{schoolProfile.kepalaSekolah}</div>
              <div className="pt-0.5 text-zinc-900 dark:text-zinc-200 tracking-normal font-normal">
                NIP. {schoolProfile.nipKepalaSekolah}
              </div>
            </div>
          </div>

          {/* Tembusan Resmi SK */}
          <div className="pt-6 border-t border-zinc-300 dark:border-zinc-700 mt-6 text-[11px] break-inside-avoid">
            <div className="font-bold mb-1">Tembusan disampaikan kepada Yth :</div>
            <ol className="list-decimal pl-5 space-y-0.5 text-zinc-800 dark:text-zinc-300">
              <li>Kepala Dinas Pendidikan Kepemudaan dan Olahraga Kab. Kuantan Singingi;</li>
              <li>Koordinator Wilayah Bidang Pendidikan Kec. Singingi Hilir;</li>
              <li>Ketua Komite SD Negeri 006 Sungai Buluh;</li>
              <li>Yang bersangkutan untuk diketahui;</li>
              <li>Arsip Sekolah.</li>
            </ol>
          </div>

          {/* LAMPIRAN RESMI SK KELULUSAN DENGAN REKAPITULASI NILAI AKHIR */}
          <div className="pt-8 border-t-2 border-black dark:border-zinc-300 mt-8 space-y-3 break-before-page">
            <div className="text-center space-y-1">
              <p className="text-[11px] font-bold uppercase">
                LAMPIRAN KEPUTUSAN KEPALA SEKOLAH DASAR NEGERI 006 SUNGAI BULUH
              </p>
              <p className="font-mono text-[10px]">
                NOMOR : 422/KPTS/SDN-006/SB/VI/2026/041
              </p>
              <p className="text-xs font-extrabold uppercase">
                DAFTAR PESERTA DIDIK KELAS VI YANG DINYATAKAN LULUS & REKAP NILAI AKHIR
              </p>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                Tahun Pelajaran {schoolProfile.tahunPelajaran} • Kriteria Kelulusan Nilai Minimal: {schoolProfile.kkmKelulusan}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border border-black dark:border-zinc-600 border-collapse">
                <thead>
                  <tr className="bg-zinc-100 dark:bg-zinc-800 font-bold border-b border-black dark:border-zinc-600">
                    <th className="p-1.5 w-8 text-center border-r border-black dark:border-zinc-600">No</th>
                    <th className="p-1.5 min-w-[100px] border-r border-black dark:border-zinc-600">No. Peserta</th>
                    <th className="p-1.5 min-w-[80px] border-r border-black dark:border-zinc-600">NISN</th>
                    <th className="p-1.5 min-w-[170px] border-r border-black dark:border-zinc-600">Nama Lengkap</th>
                    <th className="p-1.5 text-center w-8 border-r border-black dark:border-zinc-600">L/P</th>
                    <th className="p-1.5 text-center w-16 border-r border-black dark:border-zinc-600">Total NA</th>
                    <th className="p-1.5 text-center w-16 border-r border-black dark:border-zinc-600">Rata NA</th>
                    <th className="p-1.5 text-center min-w-[80px]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => {
                    const totalNA = calculateStudentTotalFinalScore(s, schoolProfile, subjects);
                    const avgNA = calculateStudentOverallFinalScore(s, schoolProfile, subjects);
                    return (
                      <tr key={s.id} className="border-b border-black dark:border-zinc-700 h-6 break-inside-avoid">
                        <td className="p-1 text-center font-bold border-r border-black dark:border-zinc-600">{idx + 1}</td>
                        <td className="p-1 font-mono border-r border-black dark:border-zinc-600">{s.noPeserta}</td>
                        <td className="p-1 font-mono border-r border-black dark:border-zinc-600">{s.nisn}</td>
                        <td className="p-1 font-bold uppercase border-r border-black dark:border-zinc-600">{s.nama}</td>
                        <td className="p-1 text-center border-r border-black dark:border-zinc-600">{s.jenisKelamin}</td>
                        <td className="p-1 text-center font-mono font-bold border-r border-black dark:border-zinc-600">{totalNA.toFixed(1)}</td>
                        <td className="p-1 text-center font-mono font-bold text-emerald-800 dark:text-emerald-400 border-r border-black dark:border-zinc-600">{avgNA.toFixed(2)}</td>
                        <td className="p-1 text-center font-bold text-emerald-800 dark:text-emerald-400">LULUS</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Titimangsa Lampiran */}
            <div className="flex justify-end pt-4 break-inside-avoid">
              <div className="w-64 space-y-1 text-xs">
                <div>Sungai Buluh, {schoolProfile.tanggalKelulusan}</div>
                <div className="font-bold">Kepala SD Negeri 006 Sungai Buluh,</div>
                <div className="h-16"></div>
                <div className="font-bold underline uppercase">{schoolProfile.kepalaSekolah}</div>
                <div className="pt-0.5 text-zinc-900 dark:text-zinc-200 tracking-normal font-normal">
                  NIP. {schoolProfile.nipKepalaSekolah}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. LAPORAN PENGGUNAAN BLANGKO IJAZAH */}
      {activeTab === 'blangko' && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Laporan Penggunaan Blangko Ijazah SDN 006 Sungai Buluh
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Pencatatan nomor seri blangko ijazah yang diterima dari Dinas Pendidikan Kab. Kuantan Singingi
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-zinc-200 dark:border-zinc-700">
              <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-700 dark:text-zinc-300">
                <tr>
                  <th className="p-3">Tahun Pelajaran</th>
                  <th className="p-3 text-center">Jumlah Diterima</th>
                  <th className="p-3 text-center">Terpakai</th>
                  <th className="p-3 text-center">Rusak</th>
                  <th className="p-3 text-center">Sisa</th>
                  <th className="p-3">Nomor Seri Awal s.d. Akhir</th>
                  <th className="p-3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {diplomaRecords.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 font-bold text-emerald-800 dark:text-emerald-400">
                      {rec.tahunPelajaran}
                    </td>
                    <td className="p-3 text-center font-mono font-bold">{rec.jumlahDiterima} lbr</td>
                    <td className="p-3 text-center font-mono text-green-600 font-bold">{rec.terpakai} lbr</td>
                    <td className="p-3 text-center font-mono text-rose-600 font-bold">{rec.rusak} lbr</td>
                    <td className="p-3 text-center font-mono text-amber-600 font-bold">{rec.sisa} lbr</td>
                    <td className="p-3 font-mono text-zinc-700 dark:text-zinc-300">
                      <div>{rec.seriAwal}</div>
                      <div className="text-zinc-400">s.d. {rec.seriAkhir}</div>
                    </td>
                    <td className="p-3 text-zinc-600 dark:text-zinc-400">{rec.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. BUKU SERAH TERIMA IJAZAH & SKHU */}
      {activeTab === 'serah-terima' && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Buku Ekspedisi Serah Terima Ijazah & SKHU
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Tanda bukti penerimaan fisik ijazah asli oleh orang tua / wali murid
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-zinc-200 dark:border-zinc-700">
              <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-700 dark:text-zinc-300">
                <tr>
                  <th className="p-3 w-10 text-center">No</th>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3">No. Seri Ijazah</th>
                  <th className="p-3">Tanggal Penyerahan</th>
                  <th className="p-3">Penerima (Orang Tua/Wali)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {students.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 text-center font-bold text-zinc-500">{idx + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">{s.nama}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">NISN: {s.nisn}</div>
                    </td>
                    <td className="p-3 font-mono font-semibold text-emerald-800 dark:text-emerald-400">
                      {s.noSeriIjazah || '-'}
                    </td>
                    <td className="p-3 font-medium text-zinc-700 dark:text-zinc-300">
                      {s.tanggalAmbilIjazah || 'Belum Diambil'}
                    </td>
                    <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200">
                      {s.penerimaIjazah || `${s.namaAyah} (Orang Tua)`}
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="emerald" size="sm">
                        Sudah Diserahkan
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. BUKU REGISTER NOMOR IJAZAH & SURAT RESMI */}
      {activeTab === 'register' && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Buku Register Nomor Ijazah, SK Kelulusan & Transkrip SKHU
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Buku kendali penomoran dokumen resmi kelulusan siswa kelas VI SDN 006 Sungai Buluh
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-700 dark:text-zinc-300">
                <tr>
                  <th className="p-3 w-10 text-center">No</th>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3">No. Peserta</th>
                  <th className="p-3">NISN</th>
                  <th className="p-3">No. Ijazah</th>
                  <th className="p-3">No. Surat Kelulusan (SKL)</th>
                  <th className="p-3">No. Surat Transkrip Nilai (SKHU)</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {students.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3 text-center font-bold text-zinc-500">{idx + 1}</td>
                    <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">{s.nama}</td>
                    <td className="p-3 font-mono text-zinc-600 dark:text-zinc-400">{s.noPeserta}</td>
                    <td className="p-3 font-mono text-zinc-600 dark:text-zinc-400">{s.nisn}</td>
                    <td className="p-3 font-mono font-bold text-emerald-800 dark:text-emerald-300">
                      {s.noSeriIjazah || '-'}
                    </td>
                    <td className="p-3 font-mono text-zinc-700 dark:text-zinc-300">
                      {s.noSuratKelulusan || '-'}
                    </td>
                    <td className="p-3 font-mono text-zinc-700 dark:text-zinc-300">
                      {s.noSuratTranskrip || '-'}
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="emerald" size="sm">
                        {s.statusKelulusan}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. DAFTAR HADIR ACARA PERPISAHAN SISWA KELAS 6 */}
      {activeTab === 'perpisahan' && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="text-center border-b pb-4 border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-extrabold uppercase text-zinc-900 dark:text-zinc-50">
              DAFTAR HADIR ACARA PERPISAHAN SISWA SISWI KELAS VI
            </h3>
            <p className="text-xs text-zinc-500 font-semibold mt-1">
              SDN 006 SUNGAI BULUH • TAHUN PELAJARAN {schoolProfile.tahunPelajaran}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-zinc-300 dark:border-zinc-700">
              <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold border-b border-zinc-300 dark:border-zinc-700">
                <tr>
                  <th className="p-2.5 w-10 text-center border-r border-zinc-300">No</th>
                  <th className="p-2.5 min-w-[200px] border-r border-zinc-300">Nama Siswa</th>
                  <th className="p-2.5 min-w-[180px] border-r border-zinc-300">Nama Orang Tua / Wali</th>
                  <th className="p-2.5 text-center w-28 border-r border-zinc-300">Tanda Tangan Siswa</th>
                  <th className="p-2.5 text-center w-28 border-r border-zinc-300">Tanda Tangan Wali</th>
                  <th className="p-2.5 text-center w-16">Ket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {students.map((s, idx) => (
                  <tr key={s.id} className="h-10">
                    <td className="p-2 text-center font-bold border-r border-zinc-200">{idx + 1}</td>
                    <td className="p-2 font-bold uppercase border-r border-zinc-200">{s.nama}</td>
                    <td className="p-2 text-zinc-700 dark:text-zinc-300 border-r border-zinc-200">{s.namaAyah}</td>
                    <td className="p-2 border-r border-zinc-200 text-center text-[10px] text-zinc-400">
                      {idx + 1}. .........
                    </td>
                    <td className="p-2 border-r border-zinc-200 text-center text-[10px] text-zinc-400">
                      {idx + 1}. .........
                    </td>
                    <td className="p-2 text-center font-bold text-emerald-700 text-[10px]">Hadir</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
