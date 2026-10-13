import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  SUBJECT_LIST,
  calculateSubjectRaporAverage,
  calculateSubjectUSScore,
  calculateSubjectFinalScore,
  calculateStudentOverallFinalScore,
  calculateStudentTotalFinalScore,
  numberToWordsIndonesian,
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
              Penerbitan SKHU, SK Kelulusan & Pengelolaan Ijazah
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Cetak format resmi Surat Keterangan Hasil Ujian Sementara, Laporan Blangko, dan Buku Serah Terima
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
          { key: 'skhu', label: 'Cetak SKHU Sementara', icon: FileText },
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

      {/* 1. CETAK SKHU / TRANSKRIP NILAI RESMI */}
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
              Format Resmi Transkrip Nilai SKHU SDN 006 Sungai Buluh
            </div>
          </div>

          {/* Official Printable SKHU Sheet */}
          <div className="mx-auto max-w-4xl rounded-2xl border-2 border-zinc-300 bg-white p-8 sm:p-12 shadow-md dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 print:border-none print:shadow-none print:p-0">
            {/* Kop Surat Resmi */}
            <KopSurat schoolProfile={schoolProfile} />

            {/* Document Title */}
            <div className="text-center my-6">
              <h3 className="text-base font-extrabold uppercase underline tracking-wider">
                SURAT KETERANGAN HASIL UJIAN (SKHU) SEMENTARA
              </h3>
              <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                Nomor: {currentStudent.noSuratTranskrip || `421.2 / SDN-006 / SKHU / ${schoolProfile.tahunPelajaran.replace('/', '-')} / ${currentStudent.noMeja.toString().padStart(3, '0')}`}
              </p>
            </div>

            {/* Intro text */}
            <p className="text-xs leading-relaxed mb-4">
              Yang bertanda tangan di bawah ini, Kepala Sekolah Dasar Negeri 006 Sungai Buluh, Kecamatan Singingi Hilir, Kabupaten Kuantan Singingi, menerangkan bahwa:
            </p>

            {/* Student Biodata */}
            <div className="rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 p-4 border border-zinc-200 dark:border-zinc-700 text-xs mb-6 space-y-1.5">
              <div className="grid grid-cols-4 gap-2">
                <span className="text-zinc-500 font-medium">Nama Peserta Didik</span>
                <span className="col-span-3 font-extrabold uppercase text-zinc-950 dark:text-zinc-50">
                  : {currentStudent.nama}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className="text-zinc-500 font-medium">Tempat, Tanggal Lahir</span>
                <span className="col-span-3 font-medium">
                  : {currentStudent.tempatLahir}, {currentStudent.tanggalLahir}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className="text-zinc-500 font-medium">Nama Orang Tua / Wali</span>
                <span className="col-span-3 font-medium">: {currentStudent.namaAyah}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className="text-zinc-500 font-medium">Nomor Induk Siswa (NIS)</span>
                <span className="col-span-3 font-mono font-medium">: {currentStudent.nis}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className="text-zinc-500 font-medium">Nomor Induk Siswa Nasional (NISN)</span>
                <span className="col-span-3 font-mono font-medium">: {currentStudent.nisn}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className="text-zinc-500 font-medium">Nomor Peserta Ujian</span>
                <span className="col-span-3 font-mono font-extrabold text-emerald-800 dark:text-emerald-400">
                  : {currentStudent.noPeserta}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className="text-zinc-500 font-medium">Nomor Ijazah</span>
                <span className="col-span-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  : {currentStudent.noSeriIjazah || '-'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className="text-zinc-500 font-medium">Nomor SK Kelulusan</span>
                <span className="col-span-3 font-mono font-medium text-emerald-800 dark:text-emerald-400">
                  : {currentStudent.noSuratKelulusan || '-'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className="text-zinc-500 font-medium">Sekolah Asal</span>
                <span className="col-span-3 font-medium">: SDN 006 SUNGAI BULUH</span>
              </div>
            </div>

            {/* Statement */}
            <p className="text-xs leading-relaxed mb-4">
              Berdasarkan hasil Ujian Sekolah dan pemenuhan seluruh kriteria kelulusan, yang bersangkutan dinyatakan:
            </p>

            <div className="text-center my-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-xl">
              <span className="text-sm font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300">
                L U L U S
              </span>
            </div>

            <p className="text-xs mb-3 font-medium">
              dengan perolehan nilai sebagai berikut:
            </p>

            {/* Table of Grades */}
            <div className="overflow-x-auto rounded-xl border border-zinc-300 dark:border-zinc-700 mb-6">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold border-b border-zinc-300 dark:border-zinc-700">
                  <tr>
                    <th className="p-2.5 w-10 text-center border-r border-zinc-300 dark:border-zinc-700">No</th>
                    <th className="p-2.5 min-w-[200px] border-r border-zinc-300 dark:border-zinc-700">
                      Mata Pelajaran (Kurikulum 2013)
                    </th>
                    <th className="p-2.5 text-center w-24 border-r border-zinc-300 dark:border-zinc-700">
                      Rata Rapor
                    </th>
                    <th className="p-2.5 text-center w-24 border-r border-zinc-300 dark:border-zinc-700">
                      Ujian Sekolah
                    </th>
                    <th className="p-2.5 text-center w-24 border-r border-zinc-300 dark:border-zinc-700">
                      Nilai Akhir
                    </th>
                    <th className="p-2.5 min-w-[180px]">Nilai Terbilang (Huruf)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {subjects.map((sub, idx) => {
                    const rAvg = calculateSubjectRaporAverage(currentStudent, sub.key);
                    const usScore = calculateSubjectUSScore(currentStudent, sub.key);
                    const na = calculateSubjectFinalScore(currentStudent, sub.key, schoolProfile);
                    const words = numberToWordsIndonesian(na);

                    return (
                      <tr key={sub.key} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="p-2 text-center font-medium border-r border-zinc-200 dark:border-zinc-700">
                          {idx + 1}
                        </td>
                        <td className="p-2 font-medium text-zinc-900 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-700">
                          {sub.name}
                        </td>
                        <td className="p-2 text-center font-mono border-r border-zinc-200 dark:border-zinc-700">
                          {rAvg.toFixed(2)}
                        </td>
                        <td className="p-2 text-center font-mono border-r border-zinc-200 dark:border-zinc-700">
                          {usScore.toFixed(2)}
                        </td>
                        <td className="p-2 text-center font-mono font-bold text-emerald-800 dark:text-emerald-400 border-r border-zinc-200 dark:border-zinc-700">
                          {na.toFixed(2)}
                        </td>
                        <td className="p-2 text-[11px] text-zinc-600 dark:text-zinc-300 italic">
                          {words}
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
                    <td colSpan={2} className="border-r border-zinc-300 dark:border-zinc-700"></td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-800 dark:text-emerald-300 border-r border-zinc-300 dark:border-zinc-700">
                      {calculateStudentTotalFinalScore(currentStudent, schoolProfile, subjects).toFixed(2)}
                    </td>
                    <td className="p-2.5 text-[11px] italic">
                      {numberToWordsIndonesian(calculateStudentTotalFinalScore(currentStudent, schoolProfile, subjects))}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="p-2.5 text-right uppercase border-r border-zinc-300 dark:border-zinc-700">
                      Rata-Rata Nilai Akhir :
                    </td>
                    <td colSpan={2} className="border-r border-zinc-300 dark:border-zinc-700"></td>
                    <td className="p-2.5 text-center font-mono font-extrabold text-sm text-emerald-800 dark:text-emerald-300 border-r border-zinc-300 dark:border-zinc-700">
                      {calculateStudentOverallFinalScore(currentStudent, schoolProfile, subjects).toFixed(2)}
                    </td>
                    <td className="p-2.5 text-[11px] italic">
                      {numberToWordsIndonesian(calculateStudentOverallFinalScore(currentStudent, schoolProfile, subjects))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Signatures & Stamp area */}
            <div className="grid grid-cols-2 pt-6 text-xs gap-8 items-end">
              <div className="flex flex-col items-center">
                <div className="relative flex h-30 w-24 items-center justify-center rounded border-2 border-zinc-800 bg-zinc-100 p-0.5 text-center overflow-hidden shadow-xs dark:bg-zinc-800">
                  {currentStudent.foto ? (
                    <>
                      <img
                        src={currentStudent.foto}
                        alt={currentStudent.nama}
                        className="h-full w-full object-cover rounded"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="h-16 w-16 rounded-full border-2 border-blue-900/40 -rotate-12 flex flex-col items-center justify-center bg-blue-900/10 text-[8px] font-extrabold text-blue-950/70 p-1">
                          <span>CAP TIGA</span>
                          <span>JARI</span>
                          <span className="text-[6px]">SDN 006</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className="text-[10px] font-bold text-zinc-400">
                      PAS FOTO<br />3 X 4<br />CAP TIGA JARI
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right space-y-1">
                <p>Sungai Buluh, {schoolProfile.tanggalKelulusan}</p>
                <p className="font-semibold">Kepala Sekolah SDN 006 Sungai Buluh,</p>
                <div className="h-16"></div>
                <p className="font-extrabold underline text-sm uppercase">
                  {schoolProfile.kepalaSekolah}
                </p>
                <p className="font-mono text-zinc-600 dark:text-zinc-400">
                  NIP. {schoolProfile.nipKepalaSekolah}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SURAT KEPUTUSAN KELULUSAN RESMI */}
      {activeTab === 'sk-kelulusan' && (
        <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-200 bg-white p-8 sm:p-12 shadow-md dark:border-zinc-800 dark:bg-zinc-900 space-y-6 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
          {/* Kop Surat Resmi SK Kelulusan */}
          <KopSurat schoolProfile={schoolProfile} />

          <div className="text-center space-y-1">
            <h3 className="text-sm font-extrabold uppercase">
              KEPUTUSAN KEPALA {schoolProfile.namaSekolah}
            </h3>
            <p className="font-mono font-bold text-zinc-500">
              NOMOR: 421.2 / SDN-006 / SK-LULUS / 2026 / 042
            </p>
            <p className="font-bold text-emerald-800 dark:text-emerald-400 uppercase">
              TENTANG PENETAPAN KELULUSAN PESERTA DIDIK KELAS VI TAHUN PELAJARAN {schoolProfile.tahunPelajaran}
            </p>
          </div>

          <div className="space-y-3">
            <p>
              <b>Menimbang:</b> Bahwa dalam rangka penetapan kelulusan peserta didik kelas VI tahun pelajaran {schoolProfile.tahunPelajaran}, perlu menetapkan Surat Keputusan Kepala Sekolah tentang kelulusan peserta didik SDN 006 Sungai Buluh.
            </p>
            <p>
              <b>Mengingat:</b> Permendikbudristek tentang Standar Kelulusan dan Juknis Penyelenggaraan Ujian Sekolah Dasar Kabupaten Kuantan Singingi.
            </p>
            <p>
              <b>Memperhatikan:</b> Rapat Dewan Guru SDN 006 Sungai Buluh pada tanggal 8 Juni 2026 tentang kriteria kelulusan.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800 p-4 border border-zinc-200 dark:border-zinc-700 space-y-2">
            <h4 className="font-bold uppercase text-emerald-800 dark:text-emerald-400 text-center">
              MEMUTUSKAN:
            </h4>
            <p>
              <b>PERTAMA:</b> Menetapkan kelulusan bagi {students.length} peserta didik kelas VI SDN 006 Sungai Buluh sebagaimana terlampir dalam daftar rekapitulasi nilai akhir.
            </p>
            <p>
              <b>KEDUA:</b> Peserta didik yang dinyatakan <b>LULUS</b> berhak menerima Ijazah dan Surat Keterangan Hasil Ujian (SKHU) untuk dipergunakan melanjutkan pendidikan ke jenjang SMP/MTs sederajat.
            </p>
          </div>

          <div className="grid grid-cols-2 pt-6">
            <div></div>
            <div className="text-right">
              <p>Ditetapkan di: Sungai Buluh</p>
              <p>Pada tanggal: {schoolProfile.tanggalKelulusan}</p>
              <p className="font-bold mt-2">Kepala SDN 006 Sungai Buluh,</p>
              <div className="h-16"></div>
              <p className="font-bold underline uppercase">{schoolProfile.kepalaSekolah}</p>
              <p className="font-mono text-zinc-500">NIP. {schoolProfile.nipKepalaSekolah}</p>
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
