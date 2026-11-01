'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatRupiah } from '@/lib/utils'
import {
  Package,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  X,
  Tag,
  DollarSign,
  Sparkles,
} from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface UnitItem {
  id: string
  categoryId: string
  name: string
  slug: string
  description?: string | null
  dailyRate: number
  depositAmount: number
  operationalStatus: string
  isActive: boolean
  isFeatured: boolean
  category: { id: string; name: string; slug: string }
  images: { id: string; imageUrl: string }[]
  _count?: { bookings: number }
}

interface UnitManagerProps {
  initialUnits: UnitItem[]
  categories: Category[]
}

export default function UnitManager({ initialUnits, categories }: UnitManagerProps) {
  const router = useRouter()
  const [units, setUnits] = useState<UnitItem[]>(initialUnits)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Form State for Add Unit
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState(categories[0]?.id || '')
  const [formDailyRate, setFormDailyRate] = useState('100000')
  const [formDeposit, setFormDeposit] = useState('50000')
  const [formDescription, setFormDescription] = useState('')
  const [formImageUrl, setFormImageUrl] = useState('')
  const [formFacilities, setFormFacilities] = useState('')
  const [formIsFeatured, setFormIsFeatured] = useState(false)

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<UnitItem | null>(null)
  const [editName, setEditName] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editDailyRate, setEditDailyRate] = useState('')
  const [editDeposit, setEditDeposit] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editFacilities, setEditFacilities] = useState('')
  const [editIsFeatured, setEditIsFeatured] = useState(false)

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleteConfirmName, setDeleteConfirmName] = useState('')

  const filteredUnits = units.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !filterCategory || u.category.slug === filterCategory
    return matchSearch && matchCategory
  })

  // Change Operational Status
  const handleStatusChange = async (unitId: string, newStatus: string) => {
    setLoadingAction(unitId)
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/admin/units/${unitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationalStatus: newStatus }),
      })
      if (!res.ok) throw new Error('Gagal memperbarui status unit')
      setUnits((prev) =>
        prev.map((u) => (u.id === unitId ? { ...u, operationalStatus: newStatus } : u))
      )
      router.refresh()
    } catch (err: unknown) {
      setErrorMsg((err as Error).message)
    } finally {
      setLoadingAction(null)
    }
  }

  // Toggle Active Status
  const handleToggleActive = async (unitId: string, currentActive: boolean) => {
    setLoadingAction(unitId)
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/admin/units/${unitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      })
      if (!res.ok) throw new Error('Gagal mengubah status aktif')
      setUnits((prev) =>
        prev.map((u) => (u.id === unitId ? { ...u, isActive: !currentActive } : u))
      )
      router.refresh()
    } catch (err: unknown) {
      setErrorMsg((err as Error).message)
    } finally {
      setLoadingAction(null)
    }
  }

  // Handle Create Unit
  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingAction('create')
    setErrorMsg(null)

    try {
      const facilitiesArray = formFacilities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const payload = {
        name: formName,
        categoryId: formCategory,
        dailyRate: parseFloat(formDailyRate),
        depositAmount: parseFloat(formDeposit || '0'),
        description: formDescription,
        facilities: facilitiesArray,
        isFeatured: formIsFeatured,
        operationalStatus: 'AVAILABLE',
        isActive: true,
        images: formImageUrl
          ? [{ imageUrl: formImageUrl, altText: formName, sortOrder: 0 }]
          : [
              {
                imageUrl:
                  'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
                altText: formName,
                sortOrder: 0,
              },
            ],
      }

      const res = await fetch('/api/admin/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menambahkan unit')

      setUnits((prev) => [data, ...prev])
      setIsAddOpen(false)
      // Reset form
      setFormName('')
      setFormDescription('')
      setFormImageUrl('')
      setFormFacilities('')
      setFormDailyRate('100000')
      setFormDeposit('50000')
      router.refresh()
    } catch (err: unknown) {
      setErrorMsg((err as Error).message)
    } finally {
      setLoadingAction(null)
    }
  }

  // Open Edit Modal
  const openEditModal = (unit: UnitItem) => {
    setEditingUnit(unit)
    setEditName(unit.name)
    setEditCategory(unit.categoryId)
    setEditDailyRate(String(unit.dailyRate))
    setEditDeposit(String(unit.depositAmount))
    setEditDescription(unit.description || '')
    setEditImageUrl(unit.images[0]?.imageUrl || '')
    setEditIsFeatured(unit.isFeatured)
    setEditFacilities('')
    setIsEditOpen(true)
    setErrorMsg(null)
  }

  // Handle Update Unit
  const handleUpdateUnit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUnit) return
    setLoadingAction('edit')
    setErrorMsg(null)

    try {
      const payload: Record<string, unknown> = {
        name: editName,
        categoryId: editCategory,
        dailyRate: parseFloat(editDailyRate),
        depositAmount: parseFloat(editDeposit || '0'),
        description: editDescription,
        isFeatured: editIsFeatured,
      }

      if (editFacilities.trim()) {
        payload.facilities = editFacilities
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      }

      if (editImageUrl.trim()) {
        payload.images = [{ imageUrl: editImageUrl, altText: editName, sortOrder: 0 }]
      }

      const res = await fetch(`/api/admin/units/${editingUnit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal memperbarui unit')

      // Update local state with new values
      setUnits((prev) =>
        prev.map((u) =>
          u.id === editingUnit.id
            ? {
                ...u,
                name: editName,
                categoryId: editCategory,
                category: categories.find((c) => c.id === editCategory) || u.category,
                dailyRate: parseFloat(editDailyRate),
                depositAmount: parseFloat(editDeposit || '0'),
                description: editDescription,
                isFeatured: editIsFeatured,
                images: editImageUrl.trim()
                  ? [{ id: u.images[0]?.id || 'new', imageUrl: editImageUrl }]
                  : u.images,
              }
            : u
        )
      )

      setIsEditOpen(false)
      setEditingUnit(null)
      router.refresh()
    } catch (err: unknown) {
      setErrorMsg((err as Error).message)
    } finally {
      setLoadingAction(null)
    }
  }

  // Open Delete Confirm
  const openDeleteConfirm = (unitId: string, unitName: string) => {
    setDeleteConfirmId(unitId)
    setDeleteConfirmName(unitName)
    setErrorMsg(null)
  }

  // Handle Delete (Archive) Unit
  const handleDeleteUnit = async () => {
    if (!deleteConfirmId) return
    setLoadingAction('delete-' + deleteConfirmId)
    setErrorMsg(null)

    try {
      const res = await fetch(`/api/admin/units/${deleteConfirmId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menghapus unit')
      }

      setUnits((prev) => prev.filter((u) => u.id !== deleteConfirmId))
      setDeleteConfirmId(null)
      setDeleteConfirmName('')
      router.refresh()
    } catch (err: unknown) {
      setErrorMsg((err as Error).message)
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Manajemen Unit Rental</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar seluruh barang dan kendaraan yang dapat disewa oleh pelanggan
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Unit Baru
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Units Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wider border-b border-slate-100 font-semibold">
              <tr>
                <th className="py-3.5 px-6">Unit</th>
                <th className="py-3.5 px-6">Kategori</th>
                <th className="py-3.5 px-6">Tarif Sewa/Hari</th>
                <th className="py-3.5 px-6">Status Operasional</th>
                <th className="py-3.5 px-6">Katalog Publik</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada unit yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUnits.map((u) => {
                  const mainImage = u.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=200&q=80'
                  const isLoading = loadingAction === u.id

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 relative shrink-0 border border-slate-200">
                            <Image
                              src={mainImage}
                              alt={u.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                              {u.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              /{u.slug}
                            </div>
                            {u.isFeatured && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5">
                                <Sparkles className="w-2.5 h-2.5" /> Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                          {u.category?.name}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                          {formatRupiah(u.dailyRate)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Deposit: {formatRupiah(u.depositAmount)}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <select
                          disabled={isLoading}
                          value={u.operationalStatus}
                          onChange={(e) => handleStatusChange(u.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none transition-colors ${
                            u.operationalStatus === 'AVAILABLE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : u.operationalStatus === 'MAINTENANCE'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <option value="AVAILABLE">Tersedia (AVAILABLE)</option>
                          <option value="MAINTENANCE">Perbaikan (MAINTENANCE)</option>
                          <option value="RETIRED">Nonaktif (RETIRED)</option>
                        </select>
                      </td>

                      <td className="py-4 px-6">
                        <button
                          disabled={isLoading}
                          onClick={() => handleToggleActive(u.id, u.isActive)}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all ${
                            u.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {u.isActive ? 'Tampil di Web' : 'Disembunyikan'}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/unit/${u.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors"
                            title="Lihat halaman publik"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Lihat
                          </Link>
                          <button
                            onClick={() => openEditModal(u)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition-colors"
                            title="Edit unit"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(u.id, u.name)}
                            disabled={isLoading || loadingAction === 'delete-' + u.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50"
                            title="Hapus unit"
                          >
                            {loadingAction === 'delete-' + u.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Unit */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" /> Tambah Unit Rental Baru
              </h2>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Unit Rental *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Speaker Aktif 15 Inch Wireless"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tarif Sewa Per Hari (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={formDailyRate}
                    onChange={(e) => setFormDailyRate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Uang Jaminan / Deposit (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formDeposit}
                    onChange={(e) => setFormDeposit(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Foto Utama
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan kondisi, fungsi, atau fitur utama unit..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fasilitas / Kelengkapan (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kabel AUX, Mic Cadangan, Tripod Stand"
                  value={formFacilities}
                  onChange={(e) => setFormFacilities(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
                />
                <label htmlFor="featured-check" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Tampilkan sebagai unit rekomendasi utama (Featured)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingAction === 'create'}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 flex items-center gap-2"
                >
                  {loadingAction === 'create' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    'Simpan Unit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Unit */}
      {isEditOpen && editingUnit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-500" /> Edit Unit Rental
              </h2>
              <button
                onClick={() => { setIsEditOpen(false); setEditingUnit(null) }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                <span>{errorMsg}</span>
                <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-800">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <form onSubmit={handleUpdateUnit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Unit Rental *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tarif Sewa Per Hari (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={editDailyRate}
                    onChange={(e) => setEditDailyRate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Uang Jaminan / Deposit (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editDeposit}
                    onChange={(e) => setEditDeposit(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Foto Utama (kosongkan jika tidak diubah)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan kondisi, fungsi, atau fitur utama unit..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fasilitas / Kelengkapan Baru (Pisahkan dengan koma, kosongkan jika tidak diubah)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kabel AUX, Mic Cadangan, Tripod Stand"
                  value={editFacilities}
                  onChange={(e) => setEditFacilities(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-featured-check"
                  checked={editIsFeatured}
                  onChange={(e) => setEditIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-500 focus:ring-blue-400"
                />
                <label htmlFor="edit-featured-check" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Tampilkan sebagai unit rekomendasi utama (Featured)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsEditOpen(false); setEditingUnit(null) }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingAction === 'edit'}
                  className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-60"
                >
                  {loadingAction === 'edit' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus Unit Ini?</h3>
                <p className="text-xs text-slate-500 mt-1.5">
                  Unit <span className="font-semibold text-slate-700">&ldquo;{deleteConfirmName}&rdquo;</span> akan diarsipkan dan tidak muncul di katalog publik. Data booking yang sudah ada tetap tersimpan.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteConfirmId(null); setDeleteConfirmName(''); setErrorMsg(null) }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteUnit}
                disabled={loadingAction === 'delete-' + deleteConfirmId}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
              >
                {loadingAction === 'delete-' + deleteConfirmId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> Ya, Hapus
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
