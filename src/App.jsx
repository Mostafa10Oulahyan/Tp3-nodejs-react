import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'https://tp3-nodejs-rest-api.vercel.app/api/v1/members'

function App() {
  const [members, setMembers] = useState([])
  const [newMemberName, setNewMemberName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [searchId, setSearchId] = useState('')
  const [maxResults, setMaxResults] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  // Fetch all members
  const fetchMembers = async (max = '') => {
    setLoading(true)
    try {
      const url = max ? `${API_URL}?max=${max}` : API_URL
      const response = await fetch(url)
      const data = await response.json()

      if (data.status === 'success') {
        setMembers(data.result)
        setMessage({ text: 'Members loaded successfully', type: 'success' })
      } else {
        setMessage({ text: data.message || 'Failed to load members', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: 'Error fetching members: ' + error.message, type: 'error' })
    }
    setLoading(false)
  }

  // Fetch member by ID
  const fetchMemberById = async (id) => {
    if (!id) {
      setMessage({ text: 'Please enter a member ID', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/${id}`)
      const data = await response.json()

      if (data.status === 'success') {
        setMembers([data.result])
        setMessage({ text: 'Member found', type: 'success' })
      } else {
        setMessage({ text: data.message || 'Member not found', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: 'Error fetching member: ' + error.message, type: 'error' })
    }
    setLoading(false)
  }

  // Add new member
  const addMember = async (e) => {
    e.preventDefault()
    if (!newMemberName.trim()) {
      setMessage({ text: 'Please enter a name', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newMemberName }),
      })
      const data = await response.json()

      if (data.status === 'success') {
        setMessage({ text: 'Member added successfully', type: 'success' })
        setNewMemberName('')
        fetchMembers()
      } else {
        setMessage({ text: data.message || 'Failed to add member', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: 'Error adding member: ' + error.message, type: 'error' })
    }
    setLoading(false)
  }

  // Update member
  const updateMember = async (id) => {
    if (!editingName.trim()) {
      setMessage({ text: 'Please enter a name', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingName }),
      })
      const data = await response.json()

      if (data.status === 'success') {
        setMessage({ text: 'Member updated successfully', type: 'success' })
        setEditingId(null)
        setEditingName('')
        fetchMembers()
      } else {
        setMessage({ text: data.message || 'Failed to update member', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: 'Error updating member: ' + error.message, type: 'error' })
    }
    setLoading(false)
  }

  // Delete member
  const deleteMember = async (id) => {
    if (!confirm('Are you sure you want to delete this member?')) return

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.status === 'success') {
        setMessage({ text: 'Member deleted successfully', type: 'success' })
        fetchMembers()
      } else {
        setMessage({ text: data.message || 'Failed to delete member', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: 'Error deleting member: ' + error.message, type: 'error' })
    }
    setLoading(false)
  }

  // Start editing
  const startEdit = (member) => {
    setEditingId(member.id)
    setEditingName(member.name)
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  // Load members on mount
  useEffect(() => {
    fetchMembers()
  }, [])

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Members Management System</h1>
        <p className="api-url">API: {API_URL}</p>
      </header>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}

      <div className="container">
        {/* Add Member Form */}
        <section className="card">
          <h2>Add New Member</h2>
          <form onSubmit={addMember} className="add-form">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Enter member name"
              className="input"
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Add Member
            </button>
          </form>
        </section>

        {/* Search and Filter */}
        <section className="card">
          <h2>Search Members</h2>
          <div className="search-controls">
            <div className="search-group">
              <input
                type="number"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter member ID"
                className="input"
              />
              <button
                onClick={() => fetchMemberById(searchId)}
                className="btn btn-secondary"
                disabled={loading}
              >
                Search by ID
              </button>
            </div>
            <div className="search-group">
              <input
                type="number"
                value={maxResults}
                onChange={(e) => setMaxResults(e.target.value)}
                placeholder="Max results"
                className="input"
                min="1"
              />
              <button
                onClick={() => fetchMembers(maxResults)}
                className="btn btn-secondary"
                disabled={loading}
              >
                Limit Results
              </button>
            </div>
            <button
              onClick={() => {
                setSearchId('')
                setMaxResults('')
                fetchMembers()
              }}
              className="btn btn-secondary"
              disabled={loading}
            >
              Show All
            </button>
          </div>
        </section>

        {/* Members List */}
        <section className="card">
          <h2>Members List ({members.length})</h2>
          {members.length === 0 ? (
            <p className="empty-message">No members found. Add one to get started!</p>
          ) : (
            <div className="members-list">
              {members.map((member) => (
                <div key={member.id} className="member-item">
                  {editingId === member.id ? (
                    <div className="edit-form">
                      <span className="member-id">ID: {member.id}</span>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="input"
                      />
                      <div className="button-group">
                        <button
                          onClick={() => updateMember(member.id)}
                          className="btn btn-success"
                          disabled={loading}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn btn-secondary"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="member-info">
                      <div className="member-details">
                        <span className="member-id">ID: {member.id}</span>
                        <span className="member-name">{member.name}</span>
                      </div>
                      <div className="button-group">
                        <button
                          onClick={() => startEdit(member)}
                          className="btn btn-warning"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMember(member.id)}
                          className="btn btn-danger"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
