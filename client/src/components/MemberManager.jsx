import React, { useEffect, useState } from 'react';
import useTasks from '../hooks/useTasks';

const MemberManager = ({ workspaceId, workspaceMembers }) => {
  const [members, setMembers] = useState(workspaceMembers || []);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [error, setError] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  const {
    fetchWorkspaceMembers,
    addWorkspaceMember,
    removeWorkspaceMember
  } = useTasks();

  const loadMembers = async () => {
    try {
      const data = await fetchWorkspaceMembers(workspaceId);
      setMembers(data);
    } catch (err) {
      console.error('Error loading members:', err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    try {
      await addWorkspaceMember(workspaceId, newMemberEmail);
      setNewMemberEmail('');
      setShowAddMember(false);
      await loadMembers();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member?')) return;

    try {
      await removeWorkspaceMember(workspaceId, memberId);
      await loadMembers();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <div className="member-manager">
      <div className="members-header">
        <h3>Members</h3>
        <button
          type="button"
          onClick={() => setShowAddMember(!showAddMember)}
          className="add-member-btn"
        >
          +
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* ✅ This form is now valid (not nested anymore) */}
      {showAddMember && (
        <form onSubmit={handleAddMember} className="add-member-form">
          <input
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
          <button type="submit">Add</button>
          <button
            type="button"
            onClick={() => setShowAddMember(false)}
          >
            Cancel
          </button>
        </form>
      )}

      <div className="members-list">
        {members.map(member => (
          <div key={member.id} className="member-item">
            <span>
              {member.name || member.email} ({member.role})
            </span>

            {member.role !== 'owner' && (
              <button
                type="button"
                onClick={() => handleRemoveMember(member.id)}
                className="remove-member-btn"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberManager;