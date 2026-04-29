import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfiles, createProfile, deleteProfile, exportProfiles } from '../api/profiles'
import { useAuth } from '../context/useAuth'
import styles from './ProfilesPage.module.css'

export default function ProfilesPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // pagination
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // filters
  const [filters, setFilters] = useState({
    gender: '',
    age_group: '',
    country_id: '',
    min_age: '',
    max_age: '',
    sort_by: '',
    order: 'desc',
  })

  // create profile
  const [createName, setCreateName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState(null)

  // export
  const [exporting, setExporting] = useState(false)

  const fetchProfiles = useCallback(() => {
    setLoading(true)
    setError(null)

    const params = { page, limit }
    if (filters.gender) params.gender = filters.gender
    if (filters.age_group) params.age_group = filters.age_group
    if (filters.country_id) params.country_id = filters.country_id
    if (filters.min_age) params.min_age = filters.min_age
    if (filters.max_age) params.max_age = filters.max_age
    if (filters.sort_by) params.sort_by = filters.sort_by
    if (filters.order) params.order = filters.order

    getProfiles(params)
      .then((res) => {
        setProfiles(res.data.data)
        setTotal(res.data.total)
        setTotalPages(res.data.total_pages)
      })
      .catch(() => setError('Failed to load profiles'))
      .finally(() => setLoading(false))
  }, [page, limit, filters])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    setPage(1)
  }

  const handleClearFilters = () => {
    setFilters({
      gender: '',
      age_group: '',
      country_id: '',
      min_age: '',
      max_age: '',
      sort_by: '',
      order: 'desc',
    })
    setPage(1)
  }

  const handleCreate = async () => {
    if (!createName.trim()) return
    setCreating(true)
    setCreateError(null)
    try {
      await createProfile(createName.trim())
      setCreateName('')
      fetchProfiles()
    } catch (e) {
      setCreateError(e.response?.data?.detail?.message || 'Failed to create profile')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this profile?')) return
    try {
      await deleteProfile(id)
      fetchProfiles()
    } catch {
      alert('Failed to delete profile')
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const params = {}
      if (filters.gender) params.gender = filters.gender
      if (filters.age_group) params.age_group = filters.age_group
      if (filters.country_id) params.country_id = filters.country_id

      const res = await exportProfiles(params)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `profiles_${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Profiles</h1>
          <p className={styles.subtitle}>{total.toLocaleString()} total profiles</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.exportBtn}
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Create profile — admin only */}
      {isAdmin && (
        <div className={styles.createBox}>
          <input
            className={styles.createInput}
            type="text"
            placeholder="Enter a name to create a profile..."
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <button
            className={styles.createBtn}
            onClick={handleCreate}
            disabled={creating || !createName.trim()}
          >
            {creating ? 'Creating...' : '+ Create'}
          </button>
          {createError && <p className={styles.createError}>{createError}</p>}
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <select name="gender" value={filters.gender} onChange={handleFilterChange} className={styles.select}>
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select name="age_group" value={filters.age_group} onChange={handleFilterChange} className={styles.select}>
          <option value="">All Age Groups</option>
          <option value="child">Child</option>
          <option value="teenager">Teenager</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>

        <input
          name="country_id"
          value={filters.country_id}
          onChange={handleFilterChange}
          placeholder="Country code (e.g. NG)"
          className={styles.input}
          maxLength={2}
        />

        <input
          name="min_age"
          value={filters.min_age}
          onChange={handleFilterChange}
          placeholder="Min age"
          type="number"
          className={styles.inputSmall}
        />

        <input
          name="max_age"
          value={filters.max_age}
          onChange={handleFilterChange}
          placeholder="Max age"
          type="number"
          className={styles.inputSmall}
        />

        <select name="sort_by" value={filters.sort_by} onChange={handleFilterChange} className={styles.select}>
          <option value="">Sort by</option>
          <option value="age">Age</option>
          <option value="created_at">Created</option>
          <option value="gender_probability">Gender %</option>
        </select>

        <select name="order" value={filters.order} onChange={handleFilterChange} className={styles.select}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>

        <button className={styles.clearBtn} onClick={handleClearFilters}>
          Clear
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.loading}>Loading profiles...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : profiles.length === 0 ? (
        <div className={styles.empty}>No profiles found</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Age Group</th>
                <th>Country</th>
                <th>Created</th>
                {isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr
                  key={p.id}
                  className={styles.row}
                  onClick={() => navigate(`/profiles/${p.id}`)}
                >
                  <td className={styles.nameCell}>{p.name}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[p.gender]}`}>
                      {p.gender}
                    </span>
                  </td>
                  <td>{p.age}</td>
                  <td>{p.age_group}</td>
                  <td>{p.country_name} <span className={styles.code}>({p.country_id})</span></td>
                  <td className={styles.date}>
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  {isAdmin && (
                    <td>
                      <button
                        className={styles.deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(p.id)
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}

    </div>
  )
}