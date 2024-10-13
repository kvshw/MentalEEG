import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { auth, storage } from '../firebase';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { user, updateUserInfo } = useContext(UserContext);
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.displayName || '');
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setMessage('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
        await updateEmail(auth.currentUser, email);
        
        if (photo) {
          const storageRef = ref(storage, `profile_photos/${auth.currentUser.uid}`);
          const uploadResult = await uploadBytes(storageRef, photo);
          const downloadURL = await getDownloadURL(uploadResult.ref);
          
          await updateProfile(auth.currentUser, { photoURL: downloadURL });
          setPhotoURL(downloadURL);
          updateUserInfo({ displayName: name, photoURL: downloadURL, email });
        } else {
          updateUserInfo({ displayName: name, email });
        }
        
        setMessage('Profile updated successfully');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h2>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
            Change Password
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <input
              type="file"
              id="photo"
              onChange={handlePhotoChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-orange-50 file:text-orange-700
                hover:file:bg-orange-100"
            />
          </div>
          {photoURL && (
            <div className="mt-2">
              <img src={photoURL} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
            </div>
          )}
          <button type="submit" className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
            Update Profile
          </button>
        </form>
      </div>

      {message && (
        <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-md">
          {message}
        </div>
      )}
    </div>
  );
};

export default Settings;