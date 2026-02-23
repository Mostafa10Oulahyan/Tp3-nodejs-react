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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Members Hub</h1>
              <p className="text-xs text-slate-500 font-medium">Management System</p>
            </div>
          </div>
          <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-600 truncate max-w-[200px] sm:max-w-xs" title={API_URL}>{API_URL}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 shadow-sm transition-all duration-300 ${message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
            {message.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            <p className="font-medium text-sm">{message.text}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium text-slate-700">Processing...</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 space-y-6">

            {/* Add Member Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  Add New Member
                </h2>
              </div>
              <div className="p-5">
                <form onSubmit={addMember} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    Create Member
                  </button>
                </form>
              </div>
            </div>

            {/* Search & Filter Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  Search & Filter
                </h2>
              </div>
              <div className="p-5 space-y-5">
                {/* Search by ID */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Find by ID</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      placeholder="ID number"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                    <button
                      onClick={() => fetchMemberById(searchId)}
                      disabled={loading}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-xl transition-colors shadow-sm disabled:opacity-70 whitespace-nowrap"
                    >
                      Search
                    </button>
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Limit Results */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Limit Results</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={maxResults}
                      onChange={(e) => setMaxResults(e.target.value)}
                      placeholder="Max items"
                      min="1"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                    <button
                      onClick={() => fetchMembers(maxResults)}
                      disabled={loading}
                      className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors shadow-sm disabled:opacity-70 whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSearchId('')
                    setMaxResults('')
                    fetchMembers()
                  }}
                  disabled={loading}
                  className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Reset & Show All
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Directory
                </h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">
                  {members.length} {members.length === 1 ? 'Member' : 'Members'}
                </span>
              </div>

              <div className="p-6 flex-1">
                {members.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-1">No members found</h3>
                    <p className="text-slate-500 text-sm max-w-sm">Get started by adding a new member using the form on the left.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div key={member.id} className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                        {editingId === member.id ? (
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="flex items-center gap-3 flex-1 w-full">
                              <span className="flex-shrink-0 w-10 h-10 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-lg flex items-center justify-center border border-indigo-100">
                                #{member.id}
                              </span>
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="w-full px-3 py-2 bg-white border-2 border-indigo-500 rounded-lg focus:outline-none text-sm font-medium text-slate-900"
                                autoFocus
                              />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button
                                onClick={() => updateMember(member.id)}
                                disabled={loading}
                                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={loading}
                                className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                              <span className="flex-shrink-0 w-10 h-10 bg-slate-100 text-slate-600 font-bold text-sm rounded-lg flex items-center justify-center border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
                                #{member.id}
                              </span>
                              <div>
                                <h3 className="font-semibold text-slate-900">{member.name}</h3>
                                <p className="text-xs text-slate-500">Member ID: {member.id}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => startEdit(member)}
                                disabled={loading}
                                className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Edit
                              </button>
                              <button
                                onClick={() => deleteMember(member.id)}
                                disabled={loading}
                                className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-rose-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
