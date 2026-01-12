import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_ENDPOINTS } from '../../config/api.config';
import useMasterData from '../../hooks/useMasterData';
import Header from '../../components/layout/Header';
import Loading from '../../components/common/Loading';
import { getAuthData } from '../../utils/auth';
import verifiedBadge from '../../assets/images/verified-badge.png';
import HobbiesModal from '../../pages/HomePage/components/HobbiesModal/HobbiesModal';
import HoroscopeModal from '../../pages/HomePage/components/HoroscopeModal';
import FamilyDetailsModal from '../../pages/HomePage/components/FamilyDetailsModal';
import PhotoUploadModal from '../../pages/HomePage/components/PhotoUploadModal';
import { useImageUtils } from '../../pages/HomePage/hooks/useImageUtils';
import type { HobbyTab, HobbySelections, ShowMoreStates, HoroscopeData, FamilyData, Sibling, PhotoUpload, ProofPhoto } from '../../pages/HomePage/types';

interface PostOffice {
    Name: string;
    Description: string | null;
    BranchType: string;
    DeliveryStatus: string;
    Circle: string;
    District: string;
    Division: string;
    Region: string;
    Block: string;
    State: string;
    Country: string;
    Pincode: string;
}

interface PincodeResponse {
    Message: string;
    Status: string;
    PostOffice: PostOffice[];
}

interface BasicDetail {
    dateOfBirth?: string;
    height?: string;
    physicalStatus?: string;
    maritalStatus?: string;
    religion?: string;
    caste?: string;
    subcaste?: string;
    willingToMarryFromAnyCaste?: boolean;
    dosham?: string;
    country?: string;
    state?: string;
    city?: string;
    education?: string;
    employmentType?: string;
    occupation?: string;
    currency?: string;
    annualIncome?: string;
    familyStatus?: string;
    pincode?: string;
    district?: string;
}

interface UserProfile {
    id: number;
    accountId: string;
    userCode: string;
    name: string;
    email?: string;
    phone?: string;
    gender?: string;
    profileFor?: string;
    countryCode?: string;
    totalprofileview?: number;
    profileveriffied?: number;
    basicDetail?: BasicDetail;
}

const MyProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editData, setEditData] = useState<UserProfile | null>(null);
    const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
    const [loadingPincode, setLoadingPincode] = useState(false);
    const [pincodeError, setPincodeError] = useState<string | null>(null);
    const [userPhotos, setUserPhotos] = useState<{ photo1link?: string; photo2link?: string; photo3link?: string; photo4link?: string; photo5link?: string; prooflink?: string } | null>(null);
    const [showPhotoEditModal, setShowPhotoEditModal] = useState(false);
    const [editingPhotos, setEditingPhotos] = useState<Array<{ photoplacement: number; photobase64?: string; preview: string; isNew?: boolean; isDeleted?: boolean }>>([]);
    const [editingProofPhoto, setEditingProofPhoto] = useState<{ base64: string; preview: string } | null>(null);
    const [uploadingPhotos, setUploadingPhotos] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'horoscope' | 'family' | 'images' | 'hobbies'>('basic');
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
    const [showHoroscopeModal, setShowHoroscopeModal] = useState(false);
    const [editingHoroscopeData, setEditingHoroscopeData] = useState<HoroscopeData>({
        rasi: '',
        natchathiram: '',
        birthPlace: '',
        birthTime: '',
    });
    const [editingFamilyData, setEditingFamilyData] = useState<{
        fatherName: string;
        fatherOccupation: string;
        fatherStatus: 'alive' | 'late';
        motherName: string;
        motherOccupation: string;
        motherStatus: 'alive' | 'late';
        siblings: Array<{ name: string; gender: string; occupation?: string }>;
    }>({
        fatherName: '',
        fatherOccupation: '',
        fatherStatus: 'alive',
        motherName: '',
        motherOccupation: '',
        motherStatus: 'alive',
        siblings: [],
    });
    const [newSibling, setNewSibling] = useState<{ name: string; gender: string; occupation?: string }>({
        name: '',
        gender: '',
        occupation: '',
    });
    const [showHobbiesModal, setShowHobbiesModal] = useState(false);
    const [activeHobbyTab, setActiveHobbyTab] = useState<HobbyTab>('hobbies');
    const [hobbySelections, setHobbySelections] = useState<HobbySelections>({
        hobbies: new Set(),
        musicGenres: new Set(),
        bookTypes: new Set(),
        movieTypes: new Set(),
        sports: new Set(),
        cuisines: new Set(),
        languages: new Set(),
    });
    const [showMoreStates, setShowMoreStates] = useState<ShowMoreStates>({
        hobbies: false,
        music: false,
        books: false,
        movies: false,
        sports: false,
        cuisines: false,
        languages: false,
    });
    const [showFamilyModal, setShowFamilyModal] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [personPhotos, setPersonPhotos] = useState<PhotoUpload[]>([]);
    const [proofPhoto, setProofPhoto] = useState<ProofPhoto | null>(null);
    
    // Use image utilities hook
    const { fileToBase64 } = useImageUtils();

    // Fetch Master Data
    const { masters, loading: mastersLoading } = useMasterData([
        'religion',
        'caste',
        'education',
        'employment-type',
        'occupation',
        'income-currency',
        'income-range',
        'location'
    ]);

    const religionOptions = masters.religion ?? [];
    const casteOptions = masters.caste ?? [];
    const educationOptions = masters.education ?? [];
    const employmentTypeOptions = masters['employment-type'] ?? [];
    const occupationOptions = masters.occupation ?? [];
    const currencyOptions = masters['income-currency'] ?? [];
    const incomeRangeOptions = masters['income-range'] ?? [];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchUserPhotosForAccount = async (accountId: string) => {
        try {
            const authData = getAuthData();
            if (!authData?.token || !accountId) {
                return;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.GET_PHOTOS(accountId)), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    const photoLinks: any = {};
                    if (data.data.personphoto && Array.isArray(data.data.personphoto)) {
                        data.data.personphoto.forEach((photo: any) => {
                            const placement = photo.photoplacement;
                            const linkKey = `photo${placement}link` as keyof typeof photoLinks;
                            photoLinks[linkKey] = photo[linkKey];
                        });
                    }
                    if (data.data.prooflink) {
                        photoLinks.prooflink = data.data.prooflink;
                    }
                    setUserPhotos(photoLinks);
                }
            }
        } catch (error) {
            console.error('Error fetching user photos:', error);
        }
    };

    const fetchHoroscopeDetails = async () => {
        try {
            const authData = getAuthData();
            if (!authData?.token) {
                return;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.HOROSCOPE), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
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
            console.error('Error fetching horoscope details:', error);
        }
    };

    const fetchFamilyDetails = async () => {
        try {
            const authData = getAuthData();
            if (!authData?.token) {
                return;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.FAMILY), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    setFamilyData({
                        fatherName: data.data.fatherName,
                        fatherOccupation: data.data.fatherOccupation,
                        fatherStatus: data.data.fatherStatus,
                        motherName: data.data.motherName,
                        motherOccupation: data.data.motherOccupation,
                        motherStatus: data.data.motherStatus,
                        siblings: data.data.siblings || [],
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching family details:', error);
        }
    };

    const fetchHobbies = async () => {
        try {
            const authData = getAuthData();
            if (!authData?.token) {
                return;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.HOBBIES), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    setHobbiesData({
                        hobbies: data.data.hobbies || [],
                        musicGenres: data.data.musicGenres || [],
                        bookTypes: data.data.bookTypes || [],
                        movieTypes: data.data.movieTypes || [],
                        sports: data.data.sports || [],
                        cuisines: data.data.cuisines || [],
                        languages: data.data.languages || [],
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching hobbies:', error);
        }
    };

    // Horoscope edit handlers
    const handleEditHoroscope = () => {
        setEditingHoroscopeData({
            rasi: horoscopeData?.rasi || '',
            natchathiram: horoscopeData?.natchathiram || '',
            birthPlace: horoscopeData?.birthPlace || '',
            birthTime: horoscopeData?.birthTime || '',
        });
        setShowHoroscopeModal(true);
    };

    const handleHoroscopeChange = (data: HoroscopeData) => {
        setEditingHoroscopeData(data);
    };

    const handleSaveHoroscope = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const authData = getAuthData();
            if (!authData?.token) {
                navigate('/login');
                return;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.HOROSCOPE), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify(editingHoroscopeData)
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setHoroscopeData({
                    rasi: editingHoroscopeData.rasi || null,
                    natchathiram: editingHoroscopeData.natchathiram || null,
                    birthPlace: editingHoroscopeData.birthPlace || null,
                    birthTime: editingHoroscopeData.birthTime || null,
                });
                setShowHoroscopeModal(false);
                alert('Horoscope details saved successfully!');
            } else {
                alert(data.message || 'Failed to save horoscope details');
            }
        } catch (error) {
            console.error('Error saving horoscope:', error);
            alert('Failed to save horoscope details. Please try again.');
        }
    };

    // Family edit handlers
    const handleEditFamily = () => {
        setEditingFamilyData({
            fatherName: familyData?.fatherName || '',
            fatherOccupation: familyData?.fatherOccupation || '',
            fatherStatus: (familyData?.fatherStatus as 'alive' | 'late') || 'alive',
            motherName: familyData?.motherName || '',
            motherOccupation: familyData?.motherOccupation || '',
            motherStatus: (familyData?.motherStatus as 'alive' | 'late') || 'alive',
            siblings: familyData?.siblings || [],
        });
        setNewSibling({ name: '', gender: '', occupation: '' });
        setShowFamilyModal(true);
    };

    const handleFamilyChange = (data: FamilyData) => {
        setEditingFamilyData(data);
    };

    const handleSiblingChange = (sibling: Sibling) => {
        setNewSibling(sibling);
    };

    const handleAddSibling = () => {
        if (!newSibling.name || !newSibling.gender) {
            alert('Please fill in sibling name and gender');
            return;
        }
        setEditingFamilyData({
            ...editingFamilyData,
            siblings: [...editingFamilyData.siblings, { ...newSibling }],
        });
        setNewSibling({ name: '', gender: '', occupation: '' });
    };

    const handleRemoveSibling = (index: number) => {
        setEditingFamilyData({
            ...editingFamilyData,
            siblings: editingFamilyData.siblings.filter((_, i) => i !== index),
        });
    };

    const handleSaveFamily = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const authData = getAuthData();
            if (!authData?.token) {
                navigate('/login');
                return;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.FAMILY), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify(editingFamilyData)
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setFamilyData({
                    fatherName: editingFamilyData.fatherName || null,
                    fatherOccupation: editingFamilyData.fatherOccupation || null,
                    fatherStatus: editingFamilyData.fatherStatus || null,
                    motherName: editingFamilyData.motherName || null,
                    motherOccupation: editingFamilyData.motherOccupation || null,
                    motherStatus: editingFamilyData.motherStatus || null,
                    siblings: editingFamilyData.siblings || [],
                });
                setShowFamilyModal(false);
                alert('Family details saved successfully!');
            } else {
                alert(data.message || 'Failed to save family details');
            }
        } catch (error) {
            console.error('Error saving family:', error);
            alert('Failed to save family details. Please try again.');
        }
    };

    // Hobbies edit handlers
    const handleEditHobbies = () => {
        setHobbySelections({
            hobbies: new Set(hobbiesData?.hobbies || []),
            musicGenres: new Set(hobbiesData?.musicGenres || []),
            bookTypes: new Set(hobbiesData?.bookTypes || []),
            movieTypes: new Set(hobbiesData?.movieTypes || []),
            sports: new Set(hobbiesData?.sports || []),
            cuisines: new Set(hobbiesData?.cuisines || []),
            languages: new Set(hobbiesData?.languages || []),
        });
        setShowHobbiesModal(true);
    };

    const handleToggleHobbySelection = (item: string, category: 'hobbies' | 'music' | 'books' | 'movies' | 'sports' | 'cuisines' | 'languages') => {
        setHobbySelections(prev => {
            const newSelections = { ...prev };
            const categoryKey = category === 'hobbies' ? 'hobbies' :
                               category === 'music' ? 'musicGenres' :
                               category === 'books' ? 'bookTypes' :
                               category === 'movies' ? 'movieTypes' :
                               category === 'sports' ? 'sports' :
                               category === 'cuisines' ? 'cuisines' : 'languages';
            
            const currentSet = new Set(newSelections[categoryKey]);
            if (currentSet.has(item)) {
                currentSet.delete(item);
            } else {
                currentSet.add(item);
            }
            return { ...newSelections, [categoryKey]: currentSet };
        });
    };

    const handleToggleShowMore = (category: keyof ShowMoreStates) => {
        setShowMoreStates(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const handleSaveHobbies = async () => {
        try {
            const authData = getAuthData();
            if (!authData?.token) {
                navigate('/login');
                return;
            }

            const hobbiesPayload = {
                hobbies: Array.from(hobbySelections.hobbies),
                musicGenres: Array.from(hobbySelections.musicGenres),
                bookTypes: Array.from(hobbySelections.bookTypes),
                movieTypes: Array.from(hobbySelections.movieTypes),
                sports: Array.from(hobbySelections.sports),
                cuisines: Array.from(hobbySelections.cuisines),
                languages: Array.from(hobbySelections.languages),
            };

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.HOBBIES), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify(hobbiesPayload)
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setHobbiesData({
                    hobbies: hobbiesPayload.hobbies,
                    musicGenres: hobbiesPayload.musicGenres,
                    bookTypes: hobbiesPayload.bookTypes,
                    movieTypes: hobbiesPayload.movieTypes,
                    sports: hobbiesPayload.sports,
                    cuisines: hobbiesPayload.cuisines,
                    languages: hobbiesPayload.languages,
                });
                setShowHobbiesModal(false);
                alert('Hobbies & Interests saved successfully!');
            } else {
                alert(data.message || 'Failed to save hobbies');
            }
        } catch (error) {
            console.error('Error saving hobbies:', error);
            alert('Failed to save hobbies. Please try again.');
        }
    };

    // Photo upload handlers
    const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size is too large. Please upload an image smaller than 10MB.');
            return;
        }

        if (personPhotos.length >= 5) {
            alert('Maximum 5 photos allowed');
            return;
        }

        try {
            const base64 = await fileToBase64(file, true);
            const nextPlacement = personPhotos.length + 1;
            const newPhoto: PhotoUpload = { photoplacement: nextPlacement, photobase64: base64, preview: base64 };
            setPersonPhotos([...personPhotos, newPhoto]);
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Failed to process image. Please try again.');
        }
    };

    const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size is too large. Please upload an image smaller than 10MB.');
            return;
        }

        try {
            const base64 = await fileToBase64(file, true);
            setProofPhoto({ base64, preview: base64 });
        } catch (error) {
            console.error('Error processing proof image:', error);
            alert('Failed to process image. Please try again.');
        }
    };

    const handleRemovePhoto = (placement: number) => {
        setPersonPhotos(personPhotos.filter(p => p.photoplacement !== placement).map((p, idx) => ({
            ...p,
            photoplacement: idx + 1
        })));
    };

    const handlePhotoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (personPhotos.length === 0 && !proofPhoto) {
            alert('Please upload at least one photo');
            return;
        }

        try {
            setUploadingPhotos(true);
            const authData = getAuthData();
            if (!authData?.token) {
                navigate('/login');
                return;
            }

            const requestBody: any = {
                personid: authData.accountId,
                personphoto: personPhotos.map(p => ({
                    photoplacement: p.photoplacement,
                    photopath: '',
                    photobase64: p.photobase64,
                })),
            };

            if (proofPhoto) {
                requestBody.proofpath = '';
                requestBody.proofbase64 = proofPhoto.base64;
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.UPLOAD_PHOTOS), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            if (response.ok && data.success) {
                alert('Photos uploaded successfully!');
                setShowPhotoModal(false);
                setPersonPhotos([]);
                setProofPhoto(null);
                // Refresh photos
                if (authData.accountId) {
                    fetchUserPhotosForAccount(authData.accountId);
                }
            } else {
                alert(data.message || 'Failed to upload photos');
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
            alert('Failed to upload photos. Please try again.');
        } finally {
            setUploadingPhotos(false);
        }
    };

    const handleAddPhotos = async () => {
        // Initialize with existing photos if any
        if (userPhotos) {
            const existingPhotos: PhotoUpload[] = [];
            for (let i = 1; i <= 5; i++) {
                const photoKey = `photo${i}link` as keyof typeof userPhotos;
                const photoUrl = userPhotos[photoKey];
                if (photoUrl) {
                    existingPhotos.push({
                        photoplacement: i,
                        photobase64: '',
                        preview: photoUrl
                    });
                }
            }
            setPersonPhotos(existingPhotos);
        }
        setShowPhotoModal(true);
    };


    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, placement?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size is too large. Please upload an image smaller than 10MB.');
            return;
        }

        try {
            const base64 = await fileToBase64(file, true);
            
            if (placement) {
                // Replace existing photo at this placement
                setEditingPhotos(prev => prev.map(p => 
                    p.photoplacement === placement 
                        ? { ...p, photobase64: base64, preview: base64, isNew: true, isDeleted: false }
                        : p
                ));
            } else {
                // Add new photo - find next available placement
                const existingPlacements = editingPhotos.map(p => p.photoplacement);
                let nextPlacement = 1;
                for (let i = 1; i <= 5; i++) {
                    if (!existingPlacements.includes(i)) {
                        nextPlacement = i;
                        break;
                    }
                }
                
                if (editingPhotos.length >= 5) {
                    alert('Maximum 5 photos allowed');
                    return;
                }

                setEditingPhotos(prev => [...prev, {
                    photoplacement: nextPlacement,
                    photobase64: base64,
                    preview: base64,
                    isNew: true,
                    isDeleted: false
                }]);
            }
            
            e.target.value = '';
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Failed to process image. Please try again.');
        }
    };

    const handleRemovePhotoEdit = (placement: number) => {
        setEditingPhotos(prev => prev.filter(p => p.photoplacement !== placement));
    };

    const handlePhotoSave = async () => {
        if (editingPhotos.length === 0) {
            alert('Please add at least one photo');
            return;
        }

        try {
            setUploadingPhotos(true);
            const authData = getAuthData();
            if (!authData?.token || !profile?.accountId) {
                alert('Please login to continue');
                return;
            }

            // Use existing proof photo if no new one was uploaded
            let proofBase64 = '';
            if (editingProofPhoto?.base64) {
                proofBase64 = editingProofPhoto.base64;
            } else if (userPhotos?.prooflink) {
                // Convert existing proof to base64 if needed
                try {
                    proofBase64 = await urlToBase64(userPhotos.prooflink);
                } catch (error) {
                    console.error('Error converting existing proof to base64:', error);
                    alert('Error processing existing proof photo. Please try again.');
                    setUploadingPhotos(false);
                    return;
                }
            }

            // If still no proof, we need to get it from the existing record
            if (!proofBase64) {
                // Fetch existing proof from API
                try {
                    const existingPhotosResponse = await fetch(getApiUrl(API_ENDPOINTS.USERS.GET_PHOTOS(profile.accountId)), {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authData.token}`
                        }
                    });
                    if (existingPhotosResponse.ok) {
                        const existingData = await existingPhotosResponse.json();
                        if (existingData.success && existingData.data?.prooflink) {
                            proofBase64 = await urlToBase64(existingData.data.prooflink);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching existing proof:', error);
                }
            }

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.UPLOAD_PHOTOS), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    personid: profile.accountId,
                    personphoto: editingPhotos
                        .filter(p => p.photobase64) // Only include photos with base64
                        .map(p => ({
                            photoplacement: p.photoplacement,
                            photobase64: p.photobase64 || '',
                            photopath: ''
                        })),
                    proofbase64: proofBase64,
                    proofpath: ''
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('Photos updated successfully!');
                setShowPhotoEditModal(false);
                // Refresh photos
                await fetchUserPhotosForAccount(profile.accountId);
            } else {
                alert(data.message || 'Failed to update photos');
            }
        } catch (error) {
            console.error('Error updating photos:', error);
            alert('Failed to update photos. Please try again.');
        } finally {
            setUploadingPhotos(false);
        }
    };


    const fetchProfile = async () => {
        try {
            const authData = getAuthData();
            if (!authData?.token) {
                navigate('/login');
                return;
            }
            const token = authData.token;

            setLoading(true);
            setError(null);

            const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.PROFILE), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success && data.data) {
                setProfile(data.data);
                setEditData(data.data);
                // Fetch photos after profile is loaded
                if (data.data.accountId) {
                    fetchUserPhotosForAccount(data.data.accountId);
                    fetchHoroscopeDetails();
                    fetchFamilyDetails();
                    fetchHobbies();
                }
            } else {
                setError(data.message || 'Failed to fetch profile');
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        setIsEditing(true);
        setEditData(profile ? { ...profile } : null);
        // Initialize photo editing state
        await initializePhotoEditing();
    };

    const urlToBase64 = async (url: string): Promise<string> => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting URL to base64:', error);
            throw error;
        }
    };

    const initializePhotoEditing = async () => {
        // Convert existing photos to editing format
        const photos: Array<{ photoplacement: number; preview: string; photobase64?: string; isNew?: boolean; isDeleted?: boolean }> = [];
        if (userPhotos) {
            for (let i = 1; i <= 5; i++) {
                const photoKey = `photo${i}link` as keyof typeof userPhotos;
                const photoUrl = userPhotos[photoKey];
                if (photoUrl) {
                    try {
                        // Convert existing photo URL to base64 for editing
                        const base64 = await urlToBase64(photoUrl);
                        photos.push({
                            photoplacement: i,
                            preview: photoUrl,
                            photobase64: base64,
                            isNew: false,
                            isDeleted: false
                        });
                    } catch (error) {
                        // If conversion fails, still add photo but without base64 (user will need to re-upload)
                        photos.push({
                            photoplacement: i,
                            preview: photoUrl,
                            isNew: false,
                            isDeleted: false
                        });
                    }
                }
            }
        }
        setEditingPhotos(photos);
        // Store existing proof photo for later use (but don't show in UI)
        if (userPhotos?.prooflink) {
            try {
                const proofBase64 = await urlToBase64(userPhotos.prooflink);
                setEditingProofPhoto({ base64: proofBase64, preview: userPhotos.prooflink });
            } catch (error) {
                // Store the URL even if conversion fails - we'll convert it when saving
                setEditingProofPhoto({ base64: '', preview: userPhotos.prooflink });
            }
        } else {
            setEditingProofPhoto(null);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(profile ? { ...profile } : null);
        setShowPhotoEditModal(false);
        setEditingPhotos([]);
        setEditingProofPhoto(null);
    };

    const handleInputChange = (field: string, value: any, isBasicDetail: boolean = false) => {
        if (!editData) return;

        if (isBasicDetail) {
            const updatedBasicDetail: BasicDetail = {
                ...(editData.basicDetail || {}),
                [field]: value
            };

            // Reset dependent fields when parent changes
            if (field === 'country') {
                updatedBasicDetail.state = '';
                updatedBasicDetail.city = '';
            } else if (field === 'state') {
                updatedBasicDetail.city = '';
            }

            setEditData({
                ...editData,
                basicDetail: updatedBasicDetail
            });

            // Fetch pincode details when pincode is entered
            if (field === 'pincode' && value && value.length === 6 && /^\d{6}$/.test(value)) {
                fetchPincodeDetails(value);
            } else if (field === 'pincode' && value.length === 0) {
                // Reset when pincode is cleared
                setPostOffices([]);
                setPincodeError(null);
            }
        } else {
            setEditData({
                ...editData,
                [field]: value
            });
        }
    };

    const fetchPincodeDetails = async (pincode: string) => {
        setLoadingPincode(true);
        setPincodeError(null);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data: PincodeResponse[] = await response.json();
            
            if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
                const postOffices = data[0].PostOffice;
                setPostOffices(postOffices);
                
                // Auto-fill district, state, country from first post office
                if (postOffices[0] && editData) {
                    const updatedBasicDetail: BasicDetail = {
                        ...(editData.basicDetail || {}),
                        district: postOffices[0].District,
                        state: postOffices[0].State,
                        country: postOffices[0].Country,
                        pincode: pincode
                    };
                    
                    // Auto-select first post office name as city if not already set
                    if (!updatedBasicDetail.city && postOffices[0].Name) {
                        updatedBasicDetail.city = postOffices[0].Name;
                    }
                    
                    setEditData({
                        ...editData,
                        basicDetail: updatedBasicDetail
                    });
                }
            } else {
                setPincodeError('Invalid pincode or no data found');
                setPostOffices([]);
            }
        } catch (error) {
            console.error('Error fetching pincode details:', error);
            setPincodeError('Failed to fetch pincode details');
            setPostOffices([]);
        } finally {
            setLoadingPincode(false);
        }
    };

    const handleDateChange = (dateString: string) => {
        if (!editData) return;
        setEditData({
            ...editData,
            basicDetail: {
                ...(editData.basicDetail || {}),
                dateOfBirth: dateString
            } as BasicDetail
        });
    };

    const handleSave = async () => {
        if (!editData) return;

        try {
            setSaving(true);
            const authData = getAuthData();
            if (!authData?.token) {
                navigate('/login');
                return;
            }
            const token = authData.token;

            // Update User profile (name, phone)
            const userUpdateResponse = await fetch(getApiUrl(API_ENDPOINTS.USERS.UPDATE_PROFILE), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: editData.name,
                    phone: editData.phone
                })
            });

            const userUpdateData = await userUpdateResponse.json();
            if (!userUpdateData.success) {
                alert(userUpdateData.message || 'Failed to update profile');
                setSaving(false);
                return;
            }

            // Update Basic Details if they exist
            if (editData.basicDetail) {
                const dateOfBirth = editData.basicDetail.dateOfBirth;
                let dobDay, dobMonth, dobYear;
                
                if (dateOfBirth) {
                    const date = new Date(dateOfBirth);
                    dobDay = date.getDate();
                    dobMonth = date.getMonth() + 1;
                    dobYear = date.getFullYear();
                }

                const basicDetailsResponse = await fetch(getApiUrl(API_ENDPOINTS.USERS.BASIC_DETAILS), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        email: editData.email,
                        dobDay,
                        dobMonth,
                        dobYear,
                        dateOfBirth,
                        height: editData.basicDetail.height,
                        physicalStatus: editData.basicDetail.physicalStatus,
                        maritalStatus: editData.basicDetail.maritalStatus,
                        religion: editData.basicDetail.religion,
                        caste: editData.basicDetail.caste,
                        subcaste: editData.basicDetail.subcaste,
                        willingToMarryFromAnyCaste: editData.basicDetail.willingToMarryFromAnyCaste,
                        dosham: editData.basicDetail.dosham,
                        country: editData.basicDetail.country,
                        state: editData.basicDetail.state,
                        city: editData.basicDetail.city,
                        education: editData.basicDetail.education,
                        employmentType: editData.basicDetail.employmentType,
                        occupation: editData.basicDetail.occupation,
                        currency: editData.basicDetail.currency,
                        annualIncome: editData.basicDetail.annualIncome,
                        familyStatus: editData.basicDetail.familyStatus,
                        pincode: editData.basicDetail.pincode,
                        district: editData.basicDetail.district
                    })
                });

                const basicDetailsData = await basicDetailsResponse.json();
                if (!basicDetailsData.success) {
                    alert(basicDetailsData.message || 'Failed to update basic details');
                    setSaving(false);
                    return;
                }
            }

            // Refresh profile data
            await fetchProfile();
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <div className="max-w-7xl mx-auto p-6">
                    <Loading message="Loading profile..." size="medium" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <div className="max-w-[1200px] mx-auto p-8">
                    <div className="bg-white rounded-xl p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                        <p className="text-red-600 mb-4">{error}</p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={fetchProfile} className="py-2 px-6 bg-[#ff6b35] text-white rounded-md font-semibold cursor-pointer transition-colors duration-300 hover:bg-[#e55a2b]">Retry</button>
                            <button onClick={() => navigate('/home')} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-md font-semibold cursor-pointer transition-colors duration-300 hover:bg-gray-300">Back to Home</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            {/* Main Content */}
            <div className="max-w-[1200px] mx-auto p-8">
                {/* Top Navigation Buttons */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
                    >
                        <span>←</span>
                        <span>Back to Home</span>
                    </button>
                    <button
                        onClick={() => {
                            fetchProfile();
                            fetchHoroscopeDetails();
                            fetchFamilyDetails();
                            if (profile?.accountId) {
                                fetchUserPhotosForAccount(profile.accountId);
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
                        disabled={loading}
                    >
                        <span>🔄</span>
                        <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-8 pb-8 border-b-2 border-gray-100 mb-8">
                        <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#c44569] flex items-center justify-center text-white font-semibold text-5xl flex-shrink-0 overflow-hidden">
                            {userPhotos?.photo1link ? (
                                <img 
                                    src={userPhotos.photo1link} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{(isEditing ? editData : profile)?.name?.charAt(0) || 'U'}</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl font-bold text-gray-800 m-0">{(isEditing ? editData : profile)?.name || 'User'}</h1>
                                    {!isEditing && profile?.profileveriffied === 1 && (
                                        <div className="flex items-center gap-1.5">
                                            <img src={verifiedBadge} alt="Verified" className="w-5 h-5" />
                                            <span className="text-sm font-semibold text-blue-600">Verified</span>
                                        </div>
                                    )}
                                </div>
                                {!isEditing && (
                                    <button onClick={handleEdit} className="py-2 px-4 bg-gray-100 text-gray-700 rounded-md font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-200" title="Edit Profile">
                                        ✏️ Edit
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-600 mb-1">Member ID: {profile?.userCode || 'N/A'}</p>
                            <p className="text-gray-600">Account ID: {profile?.accountId || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm mb-6">
                        <div className="flex border-b border-gray-200">
                            <button
                                className={`px-6 py-4 font-semibold transition-colors duration-200 border-b-2 ${
                                    activeTab === 'basic'
                                        ? 'border-[#FB34AA] text-[#FB34AA]'
                                        : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                                onClick={() => setActiveTab('basic')}
                            >
                                Basic Information
                            </button>
                            <button
                                className={`px-6 py-4 font-semibold transition-colors duration-200 border-b-2 ${
                                    activeTab === 'horoscope'
                                        ? 'border-[#FB34AA] text-[#FB34AA]'
                                        : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                                onClick={() => setActiveTab('horoscope')}
                            >
                                Horoscope Details
                            </button>
                            <button
                                className={`px-6 py-4 font-semibold transition-colors duration-200 border-b-2 ${
                                    activeTab === 'family'
                                        ? 'border-[#FB34AA] text-[#FB34AA]'
                                        : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                                onClick={() => setActiveTab('family')}
                            >
                                Family Details
                            </button>
                            <button
                                className={`px-6 py-4 font-semibold transition-colors duration-200 border-b-2 ${
                                    activeTab === 'images'
                                        ? 'border-[#FB34AA] text-[#FB34AA]'
                                        : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                                onClick={() => setActiveTab('images')}
                            >
                                My Images
                            </button>
                            <button
                                className={`px-6 py-4 font-semibold transition-colors duration-200 border-b-2 ${
                                    activeTab === 'hobbies'
                                        ? 'border-[#FB34AA] text-[#FB34AA]'
                                        : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                                onClick={() => setActiveTab('hobbies')}
                            >
                                Hobbies & Interests
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'basic' && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                        value={editData?.name || ''}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                    />
                                ) : (
                                    <p className="text-gray-800 py-2.5">{profile?.name || 'Not provided'}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                        value={editData?.email || ''}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                ) : (
                                    <p className="text-gray-800 py-2.5">{profile?.email || 'Not provided'}</p>
                                )}
                            </div>

                            <div className="detail-item">
                                <label className="detail-label">Phone</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        className="detail-input"
                                        value={editData?.phone || ''}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                ) : (
                                    <p className="detail-value">{profile?.phone || 'Not provided'}</p>
                                )}
                            </div>

                            <div className="detail-item">
                                <label className="detail-label">Country Code</label>
                                <p className="detail-value">{profile?.countryCode || 'Not provided'}</p>
                            </div>

                            <div className="detail-item">
                                <label className="detail-label">Gender</label>
                                <p className="detail-value">{profile?.gender || 'Not provided'}</p>
                            </div>

                            <div className="detail-item">
                                <label className="detail-label">Profile For</label>
                                <p className="detail-value">{profile?.profileFor || 'Not provided'}</p>
                            </div>

                            <div className="detail-item">
                                <label className="detail-label">Total Profile Views</label>
                                <p className="detail-value">{profile?.totalprofileview || 0}</p>
                            </div>

                            <div className="detail-item">
                                <label className="detail-label">Profile Verified</label>
                                <p className="detail-value">
                                    {profile?.profileveriffied === 1 ? (
                                        <span className="verified-badge">✓ Verified</span>
                                    ) : (
                                        <span className="not-verified-badge">Not Verified</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Personal & Religious Details */}
                        {profile?.basicDetail && (
                            <>
                                <div className="mb-8 mt-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal & Religious Details</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                className="detail-input"
                                                value={editData?.basicDetail?.dateOfBirth ? editData.basicDetail.dateOfBirth.split('T')[0] : ''}
                                                onChange={(e) => handleDateChange(e.target.value)}
                                            />
                                        ) : (
                                            <p className="detail-value">
                                                {profile.basicDetail.dateOfBirth 
                                                    ? new Date(profile.basicDetail.dateOfBirth).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })
                                                    : 'Not provided'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Height</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                                value={editData?.basicDetail?.height || ''}
                                                onChange={(e) => handleInputChange('height', e.target.value, true)}
                                                placeholder="e.g., 5' 9&quot;"
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.height || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Physical Status</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                                value={editData?.basicDetail?.physicalStatus || ''}
                                                onChange={(e) => handleInputChange('physicalStatus', e.target.value, true)}
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.physicalStatus || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Marital Status</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                                value={editData?.basicDetail?.maritalStatus || ''}
                                                onChange={(e) => handleInputChange('maritalStatus', e.target.value, true)}
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.maritalStatus || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Religion</label>
                                        {isEditing ? (
                                            <>
                                                <select
                                                    className="detail-input"
                                                    value={editData?.basicDetail?.religion || ''}
                                                    onChange={(e) => handleInputChange('religion', e.target.value, true)}
                                                    disabled={mastersLoading}
                                                >
                                                    <option value="">Select Religion</option>
                                                    {religionOptions.map((option) => (
                                                        <option key={option.id} value={option.name}>
                                                            {option.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {mastersLoading && <p className="masters-loading">Loading options...</p>}
                                            </>
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.religion || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Caste</label>
                                        {isEditing ? (
                                            <select
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                                value={editData?.basicDetail?.caste || ''}
                                                onChange={(e) => handleInputChange('caste', e.target.value, true)}
                                                disabled={mastersLoading}
                                            >
                                                <option value="">Select Caste</option>
                                                {casteOptions.map((option) => (
                                                    <option key={option.id} value={option.name}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.caste || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subcaste</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                                value={editData?.basicDetail?.subcaste || ''}
                                                onChange={(e) => handleInputChange('subcaste', e.target.value, true)}
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.subcaste || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Willing to Marry from Any Caste</label>
                                        {isEditing ? (
                                            <select
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                                value={editData?.basicDetail?.willingToMarryFromAnyCaste === true ? 'true' : editData?.basicDetail?.willingToMarryFromAnyCaste === false ? 'false' : ''}
                                                onChange={(e) => handleInputChange('willingToMarryFromAnyCaste', e.target.value === 'true', true)}
                                            >
                                                <option value="">Select</option>
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>
                                        ) : (
                                            <p className="detail-value">
                                                {profile.basicDetail.willingToMarryFromAnyCaste !== undefined
                                                    ? (profile.basicDetail.willingToMarryFromAnyCaste ? 'Yes' : 'No')
                                                    : 'Not provided'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Dosham</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                                value={editData?.basicDetail?.dosham || ''}
                                                onChange={(e) => handleInputChange('dosham', e.target.value, true)}
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.dosham || 'Not provided'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Professional Details</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Education</label>
                                        {isEditing ? (
                                            <select
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                                value={editData?.basicDetail?.education || ''}
                                                onChange={(e) => handleInputChange('education', e.target.value, true)}
                                                disabled={mastersLoading}
                                            >
                                                <option value="">Select Education</option>
                                                {educationOptions.map((option) => (
                                                    <option key={option.id} value={option.name}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.education || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Employment Type</label>
                                        {isEditing ? (
                                            <select
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                                value={editData?.basicDetail?.employmentType || ''}
                                                onChange={(e) => handleInputChange('employmentType', e.target.value, true)}
                                                disabled={mastersLoading}
                                            >
                                                <option value="">Select Employment Type</option>
                                                {employmentTypeOptions.map((option) => (
                                                    <option key={option.id} value={option.name}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.employmentType || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                                        {isEditing ? (
                                            <select
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                                value={editData?.basicDetail?.occupation || ''}
                                                onChange={(e) => handleInputChange('occupation', e.target.value, true)}
                                                disabled={mastersLoading}
                                            >
                                                <option value="">Select Occupation</option>
                                                {occupationOptions.map((option) => (
                                                    <option key={option.id} value={option.name}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.occupation || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                                        {isEditing ? (
                                            <select
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                                value={editData?.basicDetail?.currency || ''}
                                                onChange={(e) => handleInputChange('currency', e.target.value, true)}
                                                disabled={mastersLoading}
                                            >
                                                <option value="">Select Currency</option>
                                                {currencyOptions.map((option) => (
                                                    <option key={option.id} value={option.name}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.currency || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Income</label>
                                        {isEditing ? (
                                            <select
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                                value={editData?.basicDetail?.annualIncome || ''}
                                                onChange={(e) => handleInputChange('annualIncome', e.target.value, true)}
                                                disabled={mastersLoading}
                                            >
                                                <option value="">Select Income Range</option>
                                                {incomeRangeOptions.map((option) => (
                                                    <option key={option.id} value={option.name}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.annualIncome || 'Not provided'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Location Details */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Location Details</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    className="detail-input"
                                                    value={editData?.basicDetail?.pincode || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                        handleInputChange('pincode', value, true);
                                                    }}
                                                    placeholder="Enter 6-digit pincode"
                                                    maxLength={6}
                                                />
                                                {loadingPincode && <p className="text-sm text-blue-600 mt-2">Fetching pincode details...</p>}
                                                {pincodeError && <p className="text-sm text-red-600 mt-2">{pincodeError}</p>}
                                            </>
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.pincode || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-500 bg-gray-100 cursor-not-allowed"
                                                value={editData?.basicDetail?.district || ''}
                                                readOnly
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.district || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-500 bg-gray-100 cursor-not-allowed"
                                                value={editData?.basicDetail?.state || ''}
                                                readOnly
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.state || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-500 bg-gray-100 cursor-not-allowed"
                                                value={editData?.basicDetail?.country || ''}
                                                readOnly
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.country || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                        {isEditing ? (
                                            postOffices.length > 0 ? (
                                                <select
                                                    className="detail-input"
                                                    value={editData?.basicDetail?.city || ''}
                                                    onChange={(e) => handleInputChange('city', e.target.value, true)}
                                                >
                                                    <option value="">Select City</option>
                                                    {postOffices.map((office, index) => (
                                                        <option key={index} value={office.Name}>
                                                            {office.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="detail-input"
                                                    value={editData?.basicDetail?.city || ''}
                                                    onChange={(e) => handleInputChange('city', e.target.value, true)}
                                                    placeholder="Enter city"
                                                />
                                            )
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.city || 'Not provided'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Family Status (from Basic Details) */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Family Status</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Family Status</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                                                value={editData?.basicDetail?.familyStatus || ''}
                                                onChange={(e) => handleInputChange('familyStatus', e.target.value, true)}
                                            />
                                        ) : (
                                            <p className="text-gray-800 py-2.5">{profile.basicDetail.familyStatus || 'Not provided'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {!profile?.basicDetail && (
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                            <p className="text-gray-600">No additional details available. Complete your profile to see more information.</p>
                        </div>
                    )}
                        </div>
                    )}

                    {activeTab === 'horoscope' && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Horoscope Details</h2>
                                {horoscopeData && (horoscopeData.rasi || horoscopeData.natchathiram || horoscopeData.birthPlace || horoscopeData.birthTime) ? (
                                    <button
                                        onClick={handleEditHoroscope}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-200"
                                    >
                                        ✏️ Edit
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleEditHoroscope}
                                        className="px-4 py-2 bg-[#ff6b35] text-white rounded-md font-medium cursor-pointer transition-colors duration-200 hover:bg-[#e55a2b]"
                                    >
                                        ➕ Add
                                    </button>
                                )}
                            </div>
                            {horoscopeData && (horoscopeData.rasi || horoscopeData.natchathiram || horoscopeData.birthPlace || horoscopeData.birthTime) ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rasi</label>
                                        <p className="text-gray-800 py-2.5">{horoscopeData.rasi || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Natchathiram</label>
                                        <p className="text-gray-800 py-2.5">{horoscopeData.natchathiram || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Place</label>
                                        <p className="text-gray-800 py-2.5">{horoscopeData.birthPlace || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Time</label>
                                        <p className="text-gray-800 py-2.5">{horoscopeData.birthTime || 'Not provided'}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-6 text-center">
                                    <p className="text-gray-600 mb-4">No horoscope details found. Add your horoscope details.</p>
                                    <button
                                        onClick={handleEditHoroscope}
                                        className="px-6 py-2 bg-[#ff6b35] text-white rounded-lg font-medium hover:bg-[#e55a2b] transition-colors"
                                    >
                                        Add Horoscope Details
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'family' && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Family Details</h2>
                                {familyData ? (
                                    <button
                                        onClick={handleEditFamily}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-200"
                                    >
                                        ✏️ Edit
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleEditFamily}
                                        className="px-4 py-2 bg-[#ff6b35] text-white rounded-md font-medium cursor-pointer transition-colors duration-200 hover:bg-[#e55a2b]"
                                    >
                                        ➕ Add
                                    </button>
                                )}
                            </div>
                            {familyData ? (
                                <>
                                    {/* Father Details */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Father Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Father Name</label>
                                                <p className="text-gray-800 py-2.5">{familyData.fatherName || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Father Occupation</label>
                                                <p className="text-gray-800 py-2.5">{familyData.fatherOccupation || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Father Status</label>
                                                <p className="text-gray-800 py-2.5">
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
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mother Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mother Name</label>
                                                <p className="text-gray-800 py-2.5">{familyData.motherName || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mother Occupation</label>
                                                <p className="text-gray-800 py-2.5">{familyData.motherOccupation || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mother Status</label>
                                                <p className="text-gray-800 py-2.5">
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
                                    {familyData.siblings && familyData.siblings.length > 0 ? (
                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Siblings</h3>
                                            <div className="space-y-3">
                                                {familyData.siblings.map((sibling, index) => (
                                                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-semibold text-gray-800">{sibling.name}</p>
                                                                <div className="flex gap-4 mt-1 text-sm text-gray-600">
                                                                    {sibling.gender && <span>Gender: {sibling.gender}</span>}
                                                                    {sibling.occupation && <span>Occupation: {sibling.occupation}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}
                                </>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-6 text-center">
                                    <p className="text-gray-600 mb-4">No family details found. Add your family details.</p>
                                    <button
                                        onClick={handleEditFamily}
                                        className="px-6 py-2 bg-[#ff6b35] text-white rounded-lg font-medium hover:bg-[#e55a2b] transition-colors"
                                    >
                                        Add Family Details
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">My Images</h2>
                                {userPhotos && (userPhotos.photo1link || userPhotos.photo2link || userPhotos.photo3link || userPhotos.photo4link || userPhotos.photo5link) ? (
                                    <button
                                        onClick={handleAddPhotos}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-200"
                                    >
                                        ✏️ Edit
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleAddPhotos}
                                        className="px-4 py-2 bg-[#ff6b35] text-white rounded-md font-medium cursor-pointer transition-colors duration-200 hover:bg-[#e55a2b]"
                                    >
                                        ➕ Add
                                    </button>
                                )}
                            </div>
                            {userPhotos && (userPhotos.photo1link || userPhotos.photo2link || userPhotos.photo3link || userPhotos.photo4link || userPhotos.photo5link) ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {[1, 2, 3, 4, 5].map((num) => {
                                        const photoKey = `photo${num}link` as keyof typeof userPhotos;
                                        const photoUrl = userPhotos[photoKey];
                                        return photoUrl ? (
                                            <div key={num} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                                <img
                                                    src={photoUrl}
                                                    alt={`Photo ${num}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EPhoto ${num}%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                                <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                                    Photo {num}
                                                </span>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-6 text-center">
                                    <p className="text-gray-500 mb-4">No photos uploaded yet.</p>
                                    <button
                                        onClick={handleAddPhotos}
                                        className="px-6 py-2 bg-[#ff6b35] text-white rounded-lg font-medium hover:bg-[#e55a2b] transition-colors"
                                    >
                                        Add Photos
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'hobbies' && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Hobbies & Interests</h2>
                                {hobbiesData && (hobbiesData.hobbies?.length > 0 || hobbiesData.musicGenres?.length > 0 || hobbiesData.bookTypes?.length > 0 || hobbiesData.movieTypes?.length > 0 || hobbiesData.sports?.length > 0 || hobbiesData.cuisines?.length > 0 || hobbiesData.languages?.length > 0) ? (
                                    <button
                                        onClick={handleEditHobbies}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-200"
                                    >
                                        ✏️ Edit
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleEditHobbies}
                                        className="px-4 py-2 bg-[#ff6b35] text-white rounded-md font-medium cursor-pointer transition-colors duration-200 hover:bg-[#e55a2b]"
                                    >
                                        ➕ Add
                                    </button>
                                )}
                            </div>
                            
                            {hobbiesData && (hobbiesData.hobbies?.length > 0 || hobbiesData.musicGenres?.length > 0 || hobbiesData.bookTypes?.length > 0 || hobbiesData.movieTypes?.length > 0 || hobbiesData.sports?.length > 0 || hobbiesData.cuisines?.length > 0 || hobbiesData.languages?.length > 0) && (
                                <div className="space-y-8">
                                    {/* Hobbies & Interests */}
                                    {hobbiesData.hobbies && hobbiesData.hobbies.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hobbies & Interests</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {hobbiesData.hobbies.map((hobby, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
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
                                                        className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
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
                                                        className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
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
                                            <p className="text-gray-500 text-lg mb-4">No hobbies or interests added yet.</p>
                                            <button
                                                onClick={handleEditHobbies}
                                                className="px-6 py-2 bg-[#ff6b35] text-white rounded-lg font-medium hover:bg-[#e55a2b] transition-colors"
                                            >
                                                Add Hobbies & Interests
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {(!hobbiesData || (!hobbiesData.hobbies?.length && !hobbiesData.musicGenres?.length && !hobbiesData.bookTypes?.length && !hobbiesData.movieTypes?.length && !hobbiesData.sports?.length && !hobbiesData.cuisines?.length && !hobbiesData.languages?.length)) && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg mb-4">No hobbies data available.</p>
                                    <button
                                        onClick={handleEditHobbies}
                                        className="px-6 py-2 bg-[#ff6b35] text-white rounded-lg font-medium hover:bg-[#e55a2b] transition-colors"
                                    >
                                        Add Hobbies & Interests
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-4 justify-end pt-6 border-t border-gray-200 mt-6">
                        {isEditing ? (
                            <>
                                <button onClick={handleCancel} className="py-2.5 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-300 disabled:opacity-50" disabled={saving}>
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="py-2.5 px-6 bg-[#ff6b35] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#e55a2b] disabled:opacity-50" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => navigate('/home')} className="py-2.5 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-300">
                                    Back to Home
                                </button>
                                <button onClick={fetchProfile} className="py-2.5 px-6 bg-[#ff6b35] text-white rounded-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#e55a2b]">
                                    Refresh Profile
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Photo Edit Modal */}
            {showPhotoEditModal && (
                <div 
                    className="fixed inset-0 bg-transparent bg-opacity-30 flex items-center justify-center z-[2000] p-4 overflow-y-auto" 
                    onClick={() => {
                        setShowPhotoEditModal(false);
                    }}
                >
                    <div 
                        className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl my-8" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Photos</h2>
                            <button
                                onClick={() => setShowPhotoEditModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-3xl font-light w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Upload Profile Photos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Profile Photo (Max 5) - {editingPhotos.length}/5
                                </label>
                                <div className="flex gap-4 items-start">
                                    {/* Single Upload Field */}
                                    <div className="flex-shrink-0">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handlePhotoUpload(e)}
                                            className="hidden"
                                            id="profile-photo-upload-edit"
                                            disabled={editingPhotos.length >= 5}
                                        />
                                        <label
                                            htmlFor="profile-photo-upload-edit"
                                            className={`block w-32 h-32 border-2 border-dashed border-pink-300 rounded-xl cursor-pointer transition-all hover:border-pink-400 hover:bg-pink-50 flex items-center justify-center ${editingPhotos.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <span className="text-3xl text-pink-400">+</span>
                                        </label>
                                    </div>
                                    
                                    {/* Selected Images in Row */}
                                    {editingPhotos.length > 0 && (
                                        <div className="flex-1 min-w-0">
                                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-gray-100" style={{ maxWidth: '100%' }}>
                                                {editingPhotos.map((photo) => (
                                                    <div key={photo.photoplacement} className="relative flex-shrink-0">
                                                        <div className="w-32 h-32 relative">
                                                            <img
                                                                src={photo.preview}
                                                                alt={`Photo ${photo.photoplacement}`}
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemovePhotoEdit(photo.photoplacement)}
                                                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 z-10"
                                                            >
                                                                ×
                                                            </button>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handlePhotoUpload(e, photo.photoplacement)}
                                                                className="hidden"
                                                                id={`replace-photo-${photo.photoplacement}`}
                                                            />
                                                            <label
                                                                htmlFor={`replace-photo-${photo.photoplacement}`}
                                                                className="absolute top-1 left-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600 z-10 cursor-pointer"
                                                                title="Replace photo"
                                                            >
                                                                ✎
                                                            </label>
                                                            <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                                                Photo {photo.photoplacement}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPhotoEditModal(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePhotoSave}
                                    disabled={editingPhotos.length === 0 || uploadingPhotos}
                                    className="flex-1 px-6 py-2.5 bg-gradient-to-r from-[#FB34AA] to-[#C204E7] text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploadingPhotos ? 'Saving...' : 'Save Photos'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Horoscope Modal */}
            <HoroscopeModal
                isOpen={showHoroscopeModal}
                onClose={() => setShowHoroscopeModal(false)}
                data={editingHoroscopeData}
                onChange={handleHoroscopeChange}
                onSubmit={handleSaveHoroscope}
            />

            {/* Family Details Modal */}
            <FamilyDetailsModal
                isOpen={showFamilyModal}
                onClose={() => setShowFamilyModal(false)}
                data={editingFamilyData}
                newSibling={newSibling}
                onChange={handleFamilyChange}
                onSiblingChange={handleSiblingChange}
                onAddSibling={handleAddSibling}
                onRemoveSibling={handleRemoveSibling}
                onSubmit={handleSaveFamily}
            />

            {/* Photo Upload Modal */}
            <PhotoUploadModal
                isOpen={showPhotoModal}
                onClose={() => {
                    setShowPhotoModal(false);
                    setPersonPhotos([]);
                    setProofPhoto(null);
                }}
                personPhotos={personPhotos}
                proofPhoto={proofPhoto}
                uploading={uploadingPhotos}
                onProfilePhotoUpload={handleProfilePhotoUpload}
                onProofUpload={handleProofUpload}
                onRemovePhoto={handleRemovePhoto}
                onSubmit={handlePhotoSubmit}
            />

            {/* Hobbies Modal */}
            <HobbiesModal
                isOpen={showHobbiesModal}
                onClose={() => setShowHobbiesModal(false)}
                activeTab={activeHobbyTab}
                onTabChange={setActiveHobbyTab}
                selections={hobbySelections}
                showMoreStates={showMoreStates}
                onToggleSelection={handleToggleHobbySelection}
                onToggleShowMore={handleToggleShowMore}
                onSubmit={handleSaveHobbies}
            />
        </div>
    );
};

export default MyProfile;

