import React, { useState } from 'react';
import useTasks from '../hooks/useTasks';

const ProfileImageUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const { uploadProfileImage, user, dispatch } = useTasks();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file type
            if (!selectedFile.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }
            // Validate file size (5MB max)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await uploadProfileImage(formData);

            // Update user state with new profile image
            dispatch({
                type: 'SET_USER',
                payload: {
                    ...user,
                    profile_image: response.profile_image
                }
            });

            setFile(null);
            alert('Profile image uploaded successfully!');
        } catch (error) {
            console.error('Profile upload error:', error);
            setError(
                error?.response?.data?.message || error?.message || 'Upload failed'
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="profile-image-upload">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
            />
            {file && (
                <div className="file-preview">
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                </div>
            )}
            <button
                onClick={handleUpload}
                disabled={!file || uploading}
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default ProfileImageUpload;
