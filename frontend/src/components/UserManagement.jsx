import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [error, setError] = useState('')
  const [sortConfig, setSortConfig] = useState({
    key: 'last_login',
    direction: 'desc',
  })
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      if (a[key] === null) return 1
      if (b[key] === null) return -1

      if (
        key === 'last_login' ||
        key === 'last_activity' ||
        key === 'created_at'
      ) {
        return direction === 'asc'
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key])
      }

      return direction === 'asc'
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key])
    })
  }

  const handleSort = key => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
    setUsers(sortData(users, key, direction))
  }

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem('token')
        navigate('/login')
        return
      }

      const data = await response.json()
      setUsers(sortData(data, sortConfig.key, sortConfig.direction))
    } catch (error) {
      setError('Failed to fetch users')
    }
  }, [navigate, sortConfig.direction, sortConfig.key])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSelectAll = e => {
    if (e.target.checked) {
      setSelectedUsers(users.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (e, userId) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    }
  }

  const handleAction = async (action, status = null) => {
    if (selectedUsers.length === 0) return

    try {
      const token = localStorage.getItem('token')
      const endpoint =
        action === 'delete' ? '/api/users/delete' : '/api/users/status'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          ...(status && { status }),
        }),
      })

      if (response.status === 401) {
        localStorage.removeItem('token')
        navigate('/login')
        return
      }

      await fetchUsers()
      setSelectedUsers([])
    } catch (error) {
      setError(`Failed to ${action} users`)
    }
  }

  const formatDate = date => {
    return date ? new Date(date).toLocaleString() : 'Never'
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3 d-flex gap-2">
        <button
          className="btn btn-warning"
          onClick={() => handleAction('update', 'blocked')}
          disabled={selectedUsers.length === 0}
        >
          Block
        </button>
        <button
          className="btn btn-success"
          onClick={() => handleAction('update', 'active')}
          disabled={selectedUsers.length === 0}
        >
          <i className="bi bi-unlock"></i>
        </button>
        <button
          className="btn btn-danger"
          onClick={() => handleAction('delete')}
          disabled={selectedUsers.length === 0}
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    users.length > 0 && selectedUsers.length === users.length
                  }
                />
              </th>
              <th
                onClick={() => handleSort('name')}
                style={{ cursor: 'pointer' }}
              >
                Name{' '}
                {sortConfig.key === 'name' && (
                  <i
                    className={`bi bi-arrow-${
                      sortConfig.direction === 'asc' ? 'up' : 'down'
                    }`}
                  />
                )}
              </th>
              <th
                onClick={() => handleSort('email')}
                style={{ cursor: 'pointer' }}
              >
                Email{' '}
                {sortConfig.key === 'email' && (
                  <i
                    className={`bi bi-arrow-${
                      sortConfig.direction === 'asc' ? 'up' : 'down'
                    }`}
                  />
                )}
              </th>
              <th
                onClick={() => handleSort('last_login')}
                style={{ cursor: 'pointer' }}
              >
                Last Login{' '}
                {sortConfig.key === 'last_login' && (
                  <i
                    className={`bi bi-arrow-${
                      sortConfig.direction === 'asc' ? 'up' : 'down'
                    }`}
                  />
                )}
              </th>
              <th
                onClick={() => handleSort('last_activity')}
                style={{ cursor: 'pointer' }}
              >
                Last Activity{' '}
                {sortConfig.key === 'last_activity' && (
                  <i
                    className={`bi bi-arrow-${
                      sortConfig.direction === 'asc' ? 'up' : 'down'
                    }`}
                  />
                )}
              </th>
              <th
                onClick={() => handleSort('status')}
                style={{ cursor: 'pointer' }}
              >
                Status{' '}
                {sortConfig.key === 'status' && (
                  <i
                    className={`bi bi-arrow-${
                      sortConfig.direction === 'asc' ? 'up' : 'down'
                    }`}
                  />
                )}
              </th>
              <th
                onClick={() => handleSort('created_at')}
                style={{ cursor: 'pointer' }}
              >
                Created At{' '}
                {sortConfig.key === 'created_at' && (
                  <i
                    className={`bi bi-arrow-${
                      sortConfig.direction === 'asc' ? 'up' : 'down'
                    }`}
                  />
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={e => handleSelectUser(e, user.id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{formatDate(user.last_login)}</td>
                <td>{formatDate(user.last_activity)}</td>
                <td>
                  <span
                    className={`badge ${
                      user.status === 'active'
                        ? 'bg-success'
                        : user.status === 'blocked'
                        ? 'bg-warning'
                        : 'bg-danger'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>{formatDate(user.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement
