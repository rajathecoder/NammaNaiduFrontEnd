import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../../admin/services/api/admin.api';
import { getApiUrl } from '../../../config/api.config';

interface UserProfileData {
  id: number;
  accountId: string;
  userCode: string;
  name: string;
  gender: string;
  age: number;
  email?: string;
  mobile: string;
  dateOfBirth: string;
  personalInfo: {
    height: string;
    physicalStatus: string;
    maritalStatus: string;
    religion: string;
    caste: string;
    subcaste: string;
    dosham: string;
  };
  professionalInfo: {
    education: string;
    employmentType: string;
    occupation: string;
    annualIncome: string;
  };
  familyInfo: {
    familyStatus: string;
    familyType: string;
    familyValues: string;
    aboutFamily: string;
    fatherName: string;
    motherName: string;
    siblings: string;
  };
  partnerPreferences: {
    ageRange: string;
    heightRange: string;
    religion: string;
    caste: string;
    education: string;
    location: string;
  };
  photos: string[];
  activityLog: Array<{
    date: string;
    action: string;
    description: string;
  }>;
  verified: boolean;
  status: 'Active' | 'Inactive';
}

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [horoscopeData, setHoroscopeData] = useState<{
    rasi: string | null;
    natchathiram: string | null;
    birthPlace: string | null;
    birthTime: string | null;
  } | null>(null);
  const [familyData, setFamilyData] = useState<{
    fatherName: string | null;
    fatherOccupation: string | null;
    fatherStatus: string | null;
    motherName: string | null;
    motherOccupation: string | null;
    motherStatus: string | null;
    siblings: Array<{ name: string; gender: string; occupation?: string }>;
  } | null>(null);
  const [hobbiesData, setHobbiesData] = useState<{
    hobbies: string[];
    musicGenres: string[];
    bookTypes: string[];
    movieTypes: string[];
    sports: string[];
    cuisines: string[];
    languages: string[];
  } | null>(null);
  const [loadingHoroscope, setLoadingHoroscope] = useState(false);
  const [loadingFamily, setLoadingFamily] = useState(false);
  const [loadingHobbies, setLoadingHobbies] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError('No authentication token found. Please login again.');
          setLoading(false);
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        if (!id) {
          setError('User ID is missing');
          setLoading(false);
          return;
        }

        const response = await adminApi.getUserById(parseInt(id), token);

        if (response.message && (response.message.includes('Token is not valid') || response.message.includes('authorization denied'))) {
          setError('Your session has expired. Please login again.');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('adminInfo');
          localStorage.removeItem('adminRole');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          setLoading(false);
          return;
        }

        if (response.success && response.data) {
          const userData = response.data;
          const basicDetail = userData.basicDetail || {};

          // Calculate age from dateOfBirth
          let age: number | undefined;
          if (basicDetail.dateOfBirth || userData.dateOfBirth) {
            const birthDate = new Date(basicDetail.dateOfBirth || userData.dateOfBirth);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
          }

          const transformedUser: UserProfileData = {
            id: userData.id,
            accountId: userData.accountId,
            userCode: userData.userCode || `NN#${String(userData.id).padStart(5, '0')}`,
            name: userData.name || 'Unknown',
            gender: userData.gender || 'Not specified',
            age: age || 0,
            email: userData.email,
            mobile: userData.phone || userData.mobile || 'Not provided',
            dateOfBirth: basicDetail.dateOfBirth || userData.dateOfBirth || '',
            personalInfo: {
              height: basicDetail.height || 'Not provided',
              physicalStatus: basicDetail.physicalStatus || 'Not provided',
              maritalStatus: basicDetail.maritalStatus || 'Not provided',
              religion: basicDetail.religion || 'Not provided',
              caste: basicDetail.caste || 'Not provided',
              subcaste: basicDetail.subcaste || 'Not provided',
              dosham: basicDetail.dosham || 'Not provided',
            },
            professionalInfo: {
              education: basicDetail.education || 'Not provided',
              employmentType: basicDetail.employmentType || 'Not provided',
              occupation: basicDetail.occupation || 'Not provided',
              annualIncome: basicDetail.annualIncome || 'Not provided',
            },
            familyInfo: {
              familyStatus: basicDetail.familyStatus || '-',
              familyType: basicDetail.familyType || '-',
              familyValues: basicDetail.familyValues || '-',
              aboutFamily: basicDetail.aboutFamily || '-',
              fatherName: 'Not available', // This field might not be in the model
              motherName: 'Not available', // This field might not be in the model
              siblings: 'Not available', // This field might not be in the model
            },
            partnerPreferences: {
              ageRange: 'Not available', // This would need a separate preferences model
              heightRange: 'Not available',
              religion: 'Not available',
              caste: 'Not available',
              education: 'Not available',
              location: 'Not available',
            },
            photos: userData.photos || [], // Extract photos from response
            activityLog: [], // Activity log would need a separate model/endpoint
            verified: userData.profileveriffied === 1 || userData.verified === true || false,
            status: userData.isActive === false ? 'Inactive' : 'Active',
          };

          setUser(transformedUser);
        } else {
          setError(response.message || 'Failed to fetch user data');
        }
      } catch (error: any) {
        console.error('Error fetching user:', error);
        setError(error.message || 'Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Fetch horoscope data
  useEffect(() => {
    const fetchHoroscopeData = async () => {
      if (!user?.accountId) return;
      
      try {
        setLoadingHoroscope(true);
        const token = localStorage.getItem('adminToken');
        if (!token) return;

        const response = await fetch(getApiUrl(`/api/admin/users/${user.accountId}/horoscope`), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setHoroscopeData({
              rasi: data.data.rasi,
              natchathiram: data.data.natchathiram,
              birthPlace: data.data.birthPlace,
              birthTime: data.data.birthTime,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching horoscope data:', error);
      } finally {
        setLoadingHoroscope(false);
      }
    };

    if (user?.accountId && activeTab === 'horoscope') {
      fetchHoroscopeData();
    }
  }, [user?.accountId, activeTab]);

  // Fetch family data
  useEffect(() => {
    const fetchFamilyData = async () => {
      if (!user?.accountId) return;
      
      try {
        setLoadingFamily(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.error('No admin token found');
          return;
        }

        const apiUrl = getApiUrl(`/api/admin/users/${user.accountId}/family`);
        console.log('Fetching family data from:', apiUrl, 'for accountId:', user.accountId);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Family data response:', data);
          if (data.success) {
            // Set familyData even if all values are null
            setFamilyData({
              fatherName: data.data?.fatherName || null,
              fatherOccupation: data.data?.fatherOccupation || null,
              fatherStatus: data.data?.fatherStatus || null,
              motherName: data.data?.motherName || null,
              motherOccupation: data.data?.motherOccupation || null,
              motherStatus: data.data?.motherStatus || null,
              siblings: data.data?.siblings || [],
            });
          } else {
            console.warn('Family data response not successful:', data);
            // Set empty data structure so UI can show "Not provided"
            setFamilyData({
              fatherName: null,
              fatherOccupation: null,
              fatherStatus: null,
              motherName: null,
              motherOccupation: null,
              motherStatus: null,
              siblings: [],
            });
          }
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          console.error('Failed to fetch family data:', response.status, errorData);
          // Set empty data structure on error
          setFamilyData({
            fatherName: null,
            fatherOccupation: null,
            fatherStatus: null,
            motherName: null,
            motherOccupation: null,
            motherStatus: null,
            siblings: [],
          });
        }
      } catch (error) {
        console.error('Error fetching family data:', error);
      } finally {
        setLoadingFamily(false);
      }
    };

    if (user?.accountId && activeTab === 'family') {
      fetchFamilyData();
    }
  }, [user?.accountId, activeTab]);

  // Fetch hobbies data
  useEffect(() => {
    const fetchHobbiesData = async () => {
      if (!user?.accountId) return;
      
      try {
        setLoadingHobbies(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.error('No admin token found');
          return;
        }

        const apiUrl = getApiUrl(`/api/admin/users/${user.accountId}/hobbies`);
        console.log('Fetching hobbies data from:', apiUrl, 'for accountId:', user.accountId);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Hobbies data response:', data);
          if (data.success) {
            // Always set hobbiesData, even if arrays are empty
            setHobbiesData({
              hobbies: data.data?.hobbies || [],
              musicGenres: data.data?.musicGenres || [],
              bookTypes: data.data?.bookTypes || [],
              movieTypes: data.data?.movieTypes || [],
              sports: data.data?.sports || [],
              cuisines: data.data?.cuisines || [],
              languages: data.data?.languages || [],
            });
          } else {
            console.warn('Hobbies data response not successful:', data);
            // Set empty data structure so UI can show empty state
            setHobbiesData({
              hobbies: [],
              musicGenres: [],
              bookTypes: [],
              movieTypes: [],
              sports: [],
              cuisines: [],
              languages: [],
            });
          }
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          console.error('Failed to fetch hobbies data:', response.status, errorData);
          // Set empty data structure on error
          setHobbiesData({
            hobbies: [],
            musicGenres: [],
            bookTypes: [],
            movieTypes: [],
            sports: [],
            cuisines: [],
            languages: [],
          });
        }
      } catch (error) {
        console.error('Error fetching hobbies data:', error);
        // Set empty data structure on exception
        setHobbiesData({
          hobbies: [],
          musicGenres: [],
          bookTypes: [],
          movieTypes: [],
          sports: [],
          cuisines: [],
          languages: [],
        });
      } finally {
        setLoadingHobbies(false);
      }
    };

    if (user?.accountId && activeTab === 'hobbies') {
      fetchHobbiesData();
    }
  }, [user?.accountId, activeTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading user profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>←</span> Back
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {user.userCode}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status}
                  </span>
                  {user.verified && (
                    <span className="px-3 py-1 bg-green-100 text-green-900 text-sm font-medium rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/admin/users/${user.id}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ✏️ Edit Profile
              </Link>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                🚫 Block User
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'personal', label: 'Personal Info' },
              { id: 'professional', label: 'Professional Info' },
              { id: 'horoscope', label: 'Horoscope Data' },
              { id: 'family', label: 'Family Info' },
              { id: 'hobbies', label: 'Hobbies & Interests' },
              { id: 'preferences', label: 'Partner Preferences' },
              { id: 'photos', label: `Photos (${user.photos.length})` },
              { id: 'activity', label: 'Activity Log' },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'personal' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <p className="text-gray-900">{user.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <p className="text-gray-900">{user.age} years</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <p className="text-gray-900">{user.dateOfBirth}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <p className="text-gray-900">{user.personalInfo.height}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Physical Status</label>
                  <p className="text-gray-900">{user.personalInfo.physicalStatus}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <p className="text-gray-900">{user.personalInfo.maritalStatus}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <p className="text-gray-900">{user.personalInfo.religion}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caste</label>
                  <p className="text-gray-900">{user.personalInfo.caste}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub-caste</label>
                  <p className="text-gray-900">{user.personalInfo.subcaste}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosham</label>
                  <p className="text-gray-900">{user.personalInfo.dosham}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <p className="text-gray-900">{user.mobile}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{user.email || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'professional' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Professional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <p className="text-gray-900">{user.professionalInfo.education}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <p className="text-gray-900">{user.professionalInfo.employmentType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <p className="text-gray-900">{user.professionalInfo.occupation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
                  <p className="text-gray-900">{user.professionalInfo.annualIncome}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'horoscope' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Horoscope Data</h2>
              {loadingHoroscope ? (
                <div className="text-center py-12">
                  <div className="text-gray-600">Loading horoscope data...</div>
                </div>
              ) : horoscopeData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rasi</label>
                    <p className="text-gray-900">{horoscopeData.rasi || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Natchathiram</label>
                    <p className="text-gray-900">{horoscopeData.natchathiram || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                    <p className="text-gray-900">{horoscopeData.birthPlace || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Time</label>
                    <p className="text-gray-900">{horoscopeData.birthTime || 'Not provided'}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No horoscope data available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'family' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Family Information</h2>
              
              {/* Basic Details Family Information */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Family Details (Basic Info)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Family Status</label>
                    <p className="text-gray-900">{user.familyInfo.familyStatus}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Family Type</label>
                    <p className="text-gray-900">{user.familyInfo.familyType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Family Values</label>
                    <p className="text-gray-900">{user.familyInfo.familyValues}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">About My Family</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{user.familyInfo.aboutFamily}</p>
                  </div>
                </div>
              </div>

              {loadingFamily ? (
                <div className="text-center py-12">
                  <div className="text-gray-600">Loading family data...</div>
                </div>
              ) : familyData !== null ? (
                <div className="space-y-6">
                  {/* Father Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Father Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                        <p className="text-gray-900">{familyData.fatherName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Father's Occupation</label>
                        <p className="text-gray-900">{familyData.fatherOccupation || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Father's Status</label>
                        <p className="text-gray-900">
                          {familyData.fatherStatus === 'late' ? (
                            <span className="text-red-600 font-medium">Late</span>
                          ) : familyData.fatherStatus === 'alive' ? (
                            <span className="text-green-600 font-medium">Alive</span>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mother Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Mother Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                        <p className="text-gray-900">{familyData.motherName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Occupation</label>
                        <p className="text-gray-900">{familyData.motherOccupation || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Status</label>
                        <p className="text-gray-900">
                          {familyData.motherStatus === 'late' ? (
                            <span className="text-red-600 font-medium">Late</span>
                          ) : familyData.motherStatus === 'alive' ? (
                            <span className="text-green-600 font-medium">Alive</span>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Siblings */}
                  {familyData.siblings && familyData.siblings.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Siblings</h3>
                      <div className="space-y-4">
                        {familyData.siblings.map((sibling, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <p className="text-gray-900">{sibling.name}</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <p className="text-gray-900">{sibling.gender}</p>
                              </div>
                              {sibling.occupation && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                  <p className="text-gray-900">{sibling.occupation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No family data available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'hobbies' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Hobbies & Interests</h2>
              {loadingHobbies ? (
                <div className="text-center py-12">
                  <div className="text-gray-600">Loading hobbies data...</div>
                </div>
              ) : hobbiesData !== null ? (
                <div className="space-y-8">
                  {/* Hobbies & Interests */}
                  {hobbiesData.hobbies && hobbiesData.hobbies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Hobbies & Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {hobbiesData.hobbies.map((hobby, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-green-100 text-green-900 rounded-full text-sm font-medium"
                          >
                            {hobby}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Music Genres */}
                  {hobbiesData.musicGenres && hobbiesData.musicGenres.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Music Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {hobbiesData.musicGenres.map((genre, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Book Types */}
                  {hobbiesData.bookTypes && hobbiesData.bookTypes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Book Types</h3>
                      <div className="flex flex-wrap gap-2">
                        {hobbiesData.bookTypes.map((book, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                          >
                            {book}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Movie Types */}
                  {hobbiesData.movieTypes && hobbiesData.movieTypes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Movie Types</h3>
                      <div className="flex flex-wrap gap-2">
                        {hobbiesData.movieTypes.map((movie, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                          >
                            {movie}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sports */}
                  {hobbiesData.sports && hobbiesData.sports.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sports & Fitness</h3>
                      <div className="flex flex-wrap gap-2">
                        {hobbiesData.sports.map((sport, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                          >
                            {sport}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cuisines */}
                  {hobbiesData.cuisines && hobbiesData.cuisines.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Favorite Cuisines</h3>
                      <div className="flex flex-wrap gap-2">
                        {hobbiesData.cuisines.map((cuisine, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
                          >
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {hobbiesData.languages && hobbiesData.languages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Spoken Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {hobbiesData.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {(!hobbiesData.hobbies || hobbiesData.hobbies.length === 0) &&
                   (!hobbiesData.musicGenres || hobbiesData.musicGenres.length === 0) &&
                   (!hobbiesData.bookTypes || hobbiesData.bookTypes.length === 0) &&
                   (!hobbiesData.movieTypes || hobbiesData.movieTypes.length === 0) &&
                   (!hobbiesData.sports || hobbiesData.sports.length === 0) &&
                   (!hobbiesData.cuisines || hobbiesData.cuisines.length === 0) &&
                   (!hobbiesData.languages || hobbiesData.languages.length === 0) && (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No hobbies or interests added yet</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No hobbies data available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Partner Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                  <p className="text-gray-900">{user.partnerPreferences.ageRange} years</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height Range</label>
                  <p className="text-gray-900">{user.partnerPreferences.heightRange}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <p className="text-gray-900">{user.partnerPreferences.religion}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caste</label>
                  <p className="text-gray-900">{user.partnerPreferences.caste}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <p className="text-gray-900">{user.partnerPreferences.education}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Location</label>
                  <p className="text-gray-900">{user.partnerPreferences.location}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Uploaded Photos</h2>
              {user.photos.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📷</span>
                  <p className="text-gray-600">No photos uploaded yet</p>
                </div>
              ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {user.photos.map((photo, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="relative aspect-square bg-gray-100">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full flex flex-col items-center justify-center"><span class="text-4xl mb-2">📷</span><p class="text-sm text-gray-500">Image not available</p></div>';
                            }
                          }}
                        />
                    </div>
                      <div className="p-3 bg-white">
                        <p className="text-xs text-gray-600 mb-2 text-center">Photo {index + 1}</p>
                    <div className="flex gap-2">
                          <button
                            onClick={() => window.open(photo, '_blank')}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                        View
                      </button>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}


          {activeTab === 'activity' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Log</h2>
              <div className="space-y-4">
                {user.activityLog.map((activity, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="text-sm text-gray-500 mb-1">{activity.date}</div>
                    <div className="font-medium text-gray-900 mb-1">{activity.action}</div>
                    <div className="text-sm text-gray-600">{activity.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;


