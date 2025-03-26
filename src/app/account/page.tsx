'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserData {
  email?: string;
  name?: string;
  phone?: string;
  loginMethod?: string;
  loginTime?: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Check authentication status
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/auth/login');
      return;
    }
    
    // Get user data if authenticated
    const userDataString = localStorage.getItem('authUser');
    if (userDataString) {
      try {
        const parsedData = JSON.parse(userDataString);
        setUserData(parsedData);
      } catch (error) {
        // Remove console.error for production
        // console.error('Error parsing user data:', error);
      }
    }
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [router]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Account</h1>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center mb-6">
              <div className="h-16 w-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-medium mx-auto sm:mx-0 sm:mr-4 mb-3 sm:mb-0">
                {userData?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{userData?.name || 'User'}</h2>
                <p className="text-sm text-gray-600">{userData?.email}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Email</p>
                  <p className="text-sm sm:text-base text-gray-900 break-words">{userData?.email || 'Not available'}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                  <p className="text-sm sm:text-base text-gray-900">{userData?.phone || 'Not available'}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Login Method</p>
                  <p className="text-sm sm:text-base text-gray-900 capitalize">{userData?.loginMethod || 'Password'}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Last Login</p>
                  <p className="text-sm sm:text-base text-gray-900">{userData?.loginTime ? formatDate(userData.loginTime) : 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
              <Link 
                href="/wishlist"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                My Wishlist
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('isAuthenticated');
                  localStorage.removeItem('authUser');
                  window.dispatchEvent(new Event('authUpdated'));
                  router.push('/auth/login');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 