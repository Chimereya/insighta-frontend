import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchProfiles } from '../api/profiles'
import styles from './SearchPage.module.css'

const SUGGESTIONS = [
  'young males from nigeria',
  'adult females from the US',
  'senior males',
  'teenagers from canada',
  'young adults from the UK',
]

export default function SearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const handleSearch = async (q = query, p = 1) => {
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const res = await searchProfiles(q.trim(), { page: p, limit: 10 })
      setResults(res.data.data)
      setTotal(res.data.total)
      setTotalPages(res.data.total_pages)
      setPage(p)
      setQuery(q)
    } catch (e) {
      const msg = e.response?.data?.detail?.message || 'Search failed'
      setError(msg)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestion = (s) => {
    setQuery(s)
    handleSearch(s, 1)
  }

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1 className={styles.title}>Natural Language Search</h1>
        <p className={styles.subtitle}>
          Describe who you're looking for in plain English
        </p>
      </div>

      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          className={styles.input}
          type="text"
          placeholder='e.g. "young males from nigeria"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query, 1)}
          autoFocus
        />
        <button
          className={styles.searchBtn}
          onClick={() => handleSearch(query, 1)}
          disabled={loading || !query.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Suggestions */}
      {!searched && (
        <div className={styles.suggestions}>
          <p className={styles.suggestLabel}>Try these:</p>
          <div className={styles.chips}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className={styles.chip}
                onClick={() => handleSuggestion(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {searched && (
        <div className={styles.results}>
          {loading ? (
            <div className={styles.state}>Searching...</div>
          ) : error ? (
            <div className={`${styles.state} ${styles.errorState}`}>
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className={styles.state}>No profiles matched your query</div>
          ) : (
            <>
              <p className={styles.resultCount}>
                {total.toLocaleString()} result{total !== 1 ? 's' : ''} for{' '}
                <span className={styles.queryText}>"{query}"</span>
              </p>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Age Group</th>
                      <th>Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((p) => (
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
                        <td>
                          {p.country_name}{' '}
                          <span className={styles.code}>({p.country_id})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageBtn}
                    onClick={() => handleSearch(query, page - 1)}
                    disabled={page === 1}
                  >
                    ← Prev
                  </button>
                  <span className={styles.pageInfo}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className={styles.pageBtn}
                    onClick={() => handleSearch(query, page + 1)}
                    disabled={page === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

    </div>
  )
}