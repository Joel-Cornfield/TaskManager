import React from 'react';
import useTasks from '../hooks/useTasks';
import ProfileImageUpload from '../components/ProfileImageUpload';
import Spinner from '../components/Spinner';

const Profile = () => {
    const { user, token, loadingUser } = useTasks();

    if (loadingUser) {
        return <Spinner message="Loading profile..." />;
    }

    if (!token || !user) {
        return <div>Please log in to view your profile</div>;
    }

    return (
      <div className="profile-page">
        <h1>Profile</h1>
        <div className="profile-content">
          <div className="profile-section profile-image-section">
            <h2>Profile Image</h2>
            {user.profile_image ? (
              <div className="current-profile-image">
                <img
                  src={`http://localhost:4000${user.profile_image}`}
                  alt='ProfileImage'
                  style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%'}}
                />
              </div>
            ) : (
              <div className="no-profile-image">
                  <div style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      background: '#ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      color: '#666'
                  }}>
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
              </div>
            )}
            
            <ProfileImageUpload />
          </div>
          <div className="profile-section profile-info-section">
            <h2>Account Information</h2>
            <div className="profile-info">
              <div className="info-area">
                <label>Name:</label>
                <p>{user.name || 'No name set...'}</p>
              </div>
              <div className="info-area">
                <label>Email:</label>
                <p>{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
};

export default Profile;