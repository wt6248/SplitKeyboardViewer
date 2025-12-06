import { useState, useMemo } from 'react'
import './App.css'

interface Keyboard {
  id: number
  name: string
  keyCount: string
  brand: string
}

function App() {
  const [keyboards, setKeyboards] = useState<Keyboard[]>([])
  const [formData, setFormData] = useState({
    name: '',
    keyCount: '',
    brand: ''
  })
  const [selectedKeyCountFilters, setSelectedKeyCountFilters] = useState<Set<string>>(new Set())

  const uniqueKeyCounts = useMemo(() => {
    const keyCounts = keyboards.map(kb => kb.keyCount).filter(Boolean)
    return Array.from(new Set(keyCounts)).sort()
  }, [keyboards])

  const filteredKeyboards = useMemo(() => {
    if (selectedKeyCountFilters.size === 0) {
      return keyboards
    }
    return keyboards.filter(kb => selectedKeyCountFilters.has(kb.keyCount))
  }, [keyboards, selectedKeyCountFilters])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.keyCount && formData.brand) {
      const newKeyboard: Keyboard = {
        id: Date.now(),
        ...formData
      }
      setKeyboards(prev => [...prev, newKeyboard])
      setFormData({
        name: '',
        keyCount: '',
        brand: ''
      })
    }
  }

  const handleFilterToggle = (keyCount: string) => {
    setSelectedKeyCountFilters(prev => {
      const newFilters = new Set(prev)
      if (newFilters.has(keyCount)) {
        newFilters.delete(keyCount)
      } else {
        newFilters.add(keyCount)
      }
      return newFilters
    })
  }

  const handleDeleteKeyboard = (id: number) => {
    setKeyboards(prev => prev.filter(kb => kb.id !== id))
  }

  return (
    <div className="app-container">
      <h1>스플릿 키보드 관리</h1>

      <div className="form-section">
        <h2>키보드 추가</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">키보드 이름:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="예: Corne Cherry"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="keyCount">키 개수:</label>
            <input
              type="text"
              id="keyCount"
              name="keyCount"
              value={formData.keyCount}
              onChange={handleInputChange}
              placeholder="예: 42"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="brand">브랜드:</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="예: Foostan"
              required
            />
          </div>

          <button type="submit">추가</button>
        </form>
      </div>

      {uniqueKeyCounts.length > 0 && (
        <div className="filter-section">
          <h2>키 개수 필터</h2>
          <div className="filter-options">
            {uniqueKeyCounts.map(keyCount => (
              <label key={keyCount} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedKeyCountFilters.has(keyCount)}
                  onChange={() => handleFilterToggle(keyCount)}
                />
                {keyCount}키
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="keyboard-list">
        <h2>키보드 목록 ({filteredKeyboards.length})</h2>
        {filteredKeyboards.length === 0 ? (
          <p className="empty-message">등록된 키보드가 없습니다.</p>
        ) : (
          <div className="keyboard-grid">
            {filteredKeyboards.map(keyboard => (
              <div key={keyboard.id} className="keyboard-card">
                <h3>{keyboard.name}</h3>
                <p>키 개수: {keyboard.keyCount}키</p>
                <p>브랜드: {keyboard.brand}</p>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteKeyboard(keyboard.id)}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
