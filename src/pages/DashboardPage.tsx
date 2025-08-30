import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  Code, 
  Award, 
  TrendingUp, 
  Plus, 
  Edit, 
  Eye,
  Calendar,
  MapPin,
  ExternalLink,
  X,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  profileViews: number;
  connections: number;
}

interface RecentActivity {
  id: string;
  type: 'project' | 'skill' | 'profile';
  title: string;
  description: string;
  timestamp: string;
  action: string;
}

interface ProfileFormData {
  name: string;
  bio: string;
  location: string;
  education: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  technologies: string[];
  links: string[];
  imageUrl: string;
  imageFile?: File;
  isPublic: boolean;
}

interface SkillFormData {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

interface ExperienceFormData {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
}

interface LinksFormData {
  github: string;
  linkedin: string;
  portfolio: string;
  website: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalSkills: 0,
    profileViews: 0,
    connections: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddLinks, setShowAddLinks] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: user?.name || '',
    bio: '',
    location: '',
    education: ''
  });
  const [projectForm, setProjectForm] = useState<ProjectFormData>({
    title: '',
    description: '',
    technologies: [],
    links: [''],
    imageUrl: '',
    imageFile: undefined,
    isPublic: true
  });
  const [skillForm, setSkillForm] = useState<SkillFormData>({
    name: '',
    level: 'intermediate',
    category: ''
  });
  const [experienceForm, setExperienceForm] = useState<ExperienceFormData>({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    location: ''
  });
  const [linksForm, setLinksForm] = useState<LinksFormData>({
    github: '',
    linkedin: '',
    portfolio: '',
    website: ''
  });
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Notification states
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load user profile data
        const profileResponse = await api.get('/api/profile');
        const profileData = profileResponse.data.data;
        
        if (profileData) {
          setProfileForm({
            name: profileData.name || user?.name || '',
            bio: profileData.bio || '',
            location: profileData.location || '',
            education: profileData.education || ''
          });
          
          // Update stats with real data
      setStats({
            totalProjects: profileData.projects?.length || 0,
            totalSkills: profileData.skills?.length || 0,
            profileViews: profileData.profileViews || 0,
            connections: profileData.connections || 0,
          });
        }
        
        // Load recent activity (you can implement this API endpoint)
      setRecentActivity([
        {
          id: '1',
          type: 'project',
          title: 'E-commerce Platform',
          description: 'Updated project description and added new screenshots',
          timestamp: '2 hours ago',
          action: 'Updated',
        },
        {
          id: '2',
          type: 'skill',
          title: 'React Native',
          description: 'Added React Native to your skills list',
          timestamp: '1 day ago',
          action: 'Added',
        },
        {
          id: '3',
          type: 'profile',
          title: 'Profile Update',
          description: 'Updated your bio and location information',
          timestamp: '3 days ago',
          action: 'Updated',
        },
      ]);
      
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to default data
        setStats({
          totalProjects: 0,
          totalSkills: 0,
          profileViews: 0,
          connections: 0,
        });
      } finally {
      setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user]);

  // Handle current experience checkbox
  useEffect(() => {
    if (experienceForm.isCurrent) {
      setExperienceForm(prev => ({ ...prev, endDate: '' }));
    }
  }, [experienceForm.isCurrent]);

  // Show notification function
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 5000);
  };

  // Reset form functions
  const resetProfileForm = () => {
    setProfileForm({
      name: user?.name || '',
      bio: '',
      location: '',
      education: ''
    });
  };

  const loadProfileData = async () => {
    try {
      const response = await api.get('/api/profile');
      const profileData = response.data.data;
      if (profileData) {
        setProfileForm({
          name: profileData.name || user?.name || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          education: profileData.education || ''
        });
        
        // Load existing links
        if (profileData.links) {
          setLinksForm({
            github: profileData.links.github || '',
            linkedin: profileData.links.linkedin || '',
            portfolio: profileData.links.portfolio || '',
            website: profileData.links.website || ''
          });
        }
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      technologies: [],
      links: [''],
      imageUrl: '',
      imageFile: undefined,
      isPublic: true
    });
  };

  const resetSkillForm = () => {
    setSkillForm({
      name: '',
      level: 'intermediate',
      category: ''
    });
  };

  const resetExperienceForm = () => {
    setExperienceForm({
      company: '',
      position: '',
      description: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      location: ''
    });
  };

  const resetLinksForm = () => {
    setLinksForm({
      github: '',
      linkedin: '',
      portfolio: '',
      website: ''
    });
  };

  // Form submission functions
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // First check if profile exists, if not create it
      let response;
      try {
        response = await api.put('/api/profile', profileForm);
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Profile doesn't exist, create it
                      response = await api.post('/api/profile', profileForm);
        } else {
          throw error;
        }
      }
      
      if (response.data.success) {
        showNotification('success', 'Profile updated successfully!');
        setShowEditProfile(false);
        
        // Update the profile form with the response data
        if (response.data.data) {
          setProfileForm({
            name: response.data.data.name || profileForm.name,
            bio: response.data.data.bio || profileForm.bio,
            location: response.data.data.location || profileForm.location,
            education: response.data.data.education || profileForm.education
          });
        }
        
        // Refresh dashboard data
        const profileResponse = await api.get('/api/profile');
        const profileData = profileResponse.data.data;
        if (profileData) {
          setStats({
            totalProjects: profileData.projects?.length || 0,
            totalSkills: profileData.skills?.length || 0,
            profileViews: profileData.profileViews || 0,
            connections: profileData.connections || 0,
          });
        }
      } else {
        showNotification('error', 'Failed to update profile. Please try again.');
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let response;
      
      if (projectForm.imageFile) {
        // If image file exists, use the upload endpoint
        const formData = new FormData();
        formData.append('image', projectForm.imageFile);
        formData.append('title', projectForm.title);
        formData.append('description', projectForm.description);
        formData.append('isPublic', projectForm.isPublic.toString());
        
        // Add technologies
        if (projectForm.technologies && projectForm.technologies.length > 0) {
          projectForm.technologies.forEach(tech => {
            if (tech.trim()) {
              formData.append('technologies', tech);
            }
          });
        }
        
        // Add links
        if (projectForm.links && projectForm.links.length > 0) {
          projectForm.links.forEach(link => {
            if (link.trim()) {
              formData.append('links', link);
            }
          });
        }
        
        console.log('📤 Sending form data with image:', {
          title: projectForm.title,
          description: projectForm.description,
          technologies: projectForm.technologies,
          links: projectForm.links,
          isPublic: projectForm.isPublic,
          imageFile: projectForm.imageFile.name
        });
        
        response = await api.post('/api/profile/projects/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // No image file, use the regular endpoint
        response = await api.post('/api/profile/projects', projectForm);
      }
      
      if (response.data.success) {
        showNotification('success', 'Project added successfully!');
        setShowAddProject(false);
        setProjectForm({
          title: '',
          description: '',
          technologies: [],
          links: [''],
          imageUrl: '',
          imageFile: undefined,
          isPublic: true
        });
        // Refresh stats
        setStats(prev => ({ ...prev, totalProjects: prev.totalProjects + 1 }));
      } else {
        showNotification('error', 'Failed to add project. Please try again.');
      }
    } catch (error: any) {
      console.error('Failed to add project:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add project. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
              const response = await api.post('/api/profile/skills', { skill: skillForm.name });
      
      if (response.data.success) {
        showNotification('success', 'Skill added successfully!');
        setShowAddSkill(false);
        setSkillForm({
          name: '',
          level: 'intermediate',
          category: ''
        });
        // Refresh stats
        setStats(prev => ({ ...prev, totalSkills: prev.totalSkills + 1 }));
      } else {
        showNotification('error', 'Failed to add skill. Please try again.');
      }
    } catch (error: any) {
      console.error('Failed to add skill:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add skill. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('💼 Submitting experience:', experienceForm);
      
      // Prepare the data with proper formatting
      const experienceData = {
        ...experienceForm,
        // Ensure endDate is empty string if current job
        endDate: experienceForm.isCurrent ? '' : experienceForm.endDate
      };
      
      console.log('💼 Formatted experience data:', experienceData);
      
              const response = await api.post('/api/profile/work', experienceData);
      console.log('💼 Response:', response.data);
      
      if (response.data.success) {
        showNotification('success', 'Experience added successfully!');
        setShowAddExperience(false);
        setExperienceForm({
          company: '',
          position: '',
          description: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          location: ''
        });
      } else {
        showNotification('error', 'Failed to add experience. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ Failed to add experience:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add experience. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinksSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('🔗 Submitting links:', linksForm);
      
      // Filter out empty links and ensure URLs have protocol
      const ensureProtocol = (url: string) => {
        if (!url.trim()) return '';
        let trimmed = url.trim();
        
        // Fix common Vercel URL issues
        if (trimmed.includes('vercel') && !trimmed.includes('.app') && !trimmed.includes('.com')) {
          trimmed = trimmed + '.app';
        }
        
        // Add protocol if missing
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
          return 'https://' + trimmed;
        }
        return trimmed;
      };

      const filteredLinks = {
        github: ensureProtocol(linksForm.github),
        linkedin: ensureProtocol(linksForm.linkedin),
        portfolio: ensureProtocol(linksForm.portfolio),
        website: ensureProtocol(linksForm.website)
      };
      
      console.log('🔗 Filtered links:', filteredLinks);
      
              const response = await api.put('/api/profile/links', filteredLinks);
      console.log('🔗 Response:', response.data);
      
      if (response.data.success) {
        showNotification('success', 'Links updated successfully!');
        setShowAddLinks(false);
        // Don't reset form, keep the submitted values
      } else {
        showNotification('error', 'Failed to update links. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ Failed to update links:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update links. Please try again.';
      showNotification('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions for project form
  const addProjectLink = () => {
    setProjectForm(prev => ({
      ...prev,
      links: [...prev.links, '']
    }));
  };

  const removeProjectLink = (index: number) => {
    setProjectForm(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const updateProjectLink = (index: number, value: string) => {
    setProjectForm(prev => ({
      ...prev,
      links: prev.links.map((link, i) => i === index ? value : link)
    }));
  };

  const addProjectTechnology = (tech: string) => {
    if (tech.trim() && !projectForm.technologies.includes(tech.trim())) {
      setProjectForm(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech.trim()]
      }));
    }
  };

  const removeProjectTechnology = (tech: string) => {
    setProjectForm(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📁 File selected:', {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2)
      });
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'Image file size should be less than 5MB');
        return;
      }
      
      setProjectForm(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: URL.createObjectURL(file) // Create preview URL
      }));
      
      showNotification('success', 'Image selected successfully!');
    }
  };

  const removeImageFile = () => {
    setProjectForm(prev => ({
      ...prev,
      imageFile: undefined,
      imageUrl: ''
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your portfolio today
          </p>
        </div>

        {/* Notification */}
        {notification.type && (
          <div className={`mb-6 p-4 rounded-lg border ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{notification.message}</span>
              <button
                onClick={() => setNotification({ type: null, message: '' })}
                className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <Code className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-accent-100 dark:bg-accent-900 rounded-lg">
                <Award className="h-6 w-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Skills</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSkills}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 dark:bg-success-900 rounded-lg">
                <Eye className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.profileViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 dark:bg-warning-900 rounded-lg">
                <User className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Connections</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.connections}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    await loadProfileData();
                    setShowEditProfile(true);
                  }}
                  className="w-full flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Edit className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Edit Profile</span>
                </button>
                
                <button
                  onClick={() => setShowAddProject(true)}
                  className="w-full flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5 text-accent-600 dark:text-accent-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Add Project</span>
                </button>
                
                <button
                  onClick={() => setShowAddSkill(true)}
                  className="w-full flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Award className="h-5 w-5 text-success-600 dark:text-success-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Add Skill</span>
                </button>
                
                <button
                  onClick={() => setShowAddExperience(true)}
                  className="w-full flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Briefcase className="h-5 w-5 text-warning-600 dark:text-warning-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Add Experience</span>
                </button>
                
                <button
                  onClick={async () => {
                    await loadProfileData();
                    setShowAddLinks(true);
                  }}
                  className="w-full flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <ExternalLink className="h-5 w-5 text-accent-600 dark:text-accent-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Add Links</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
                <Link
                  to="/profile"
                  className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      activity.type === 'project' ? 'bg-primary-100 dark:bg-primary-900' :
                      activity.type === 'skill' ? 'bg-accent-100 dark:bg-accent-900' :
                      'bg-success-100 dark:bg-success-900'
                    }`}>
                      {activity.type === 'project' && <Code className="h-4 w-4 text-primary-600 dark:text-primary-400" />}
                      {activity.type === 'skill' && <Award className="h-4 w-4 text-accent-600 dark:text-accent-400" />}
                      {activity.type === 'profile' && <User className="h-4 w-4 text-success-600 dark:text-success-400" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      <span className="inline-block mt-2 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900 px-2 py-1 rounded">
                        {activity.action}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Growth Insights */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Growth Insights
              </h3>
              <TrendingUp className="h-5 w-5 text-success-600 dark:text-success-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600 dark:text-success-400 mb-1">
                  +24%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Profile views this month
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600 dark:text-accent-400 mb-1">
                  +3
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  New projects added
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  +8
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  New connections made
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
              <button
                onClick={() => {
                  setShowEditProfile(false);
                  resetProfileForm();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Education
                </label>
                <input
                  type="text"
                  value={profileForm.education}
                  onChange={(e) => setProfileForm({...profileForm, education: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProfile(false);
                    resetProfileForm();
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Project</h3>
              <button
                onClick={() => {
                  setShowAddProject(false);
                  resetProjectForm();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleProjectSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Technologies
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add technology"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const target = e.target as HTMLInputElement;
                          addProjectTechnology(target.value);
                          target.value = '';
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add technology"]') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          addProjectTechnology(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {projectForm.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {projectForm.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeProjectTechnology(tech)}
                            className="hover:text-blue-600 dark:hover:text-blue-300"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Links
                </label>
                <div className="space-y-2">
                  {projectForm.links.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => updateProjectLink(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                      {projectForm.links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProjectLink(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addProjectLink}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    + Add another link
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Image
                </label>
                
                {/* Image Preview */}
                {projectForm.imageUrl && (
                  <div className="mb-3 relative">
                    <img
                      src={projectForm.imageUrl}
                      alt="Project preview"
                      className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={removeImageFile}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {/* File Upload Input */}
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-300"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Max 5MB
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={projectForm.isPublic}
                  onChange={(e) => setProjectForm({...projectForm, isPublic: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Make project public
                </label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProject(false);
                    resetProjectForm();
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Skill</h3>
              <button
                onClick={() => {
                  setShowAddSkill(false);
                  resetSkillForm();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSkillSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skill Level
                </label>
                <select
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({...skillForm, level: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({...skillForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Frontend, Backend, DevOps"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSkill(false);
                    resetSkillForm();
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Experience Modal */}
      {showAddExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Work Experience</h3>
              <button
                onClick={() => {
                  setShowAddExperience(false);
                  resetExperienceForm();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleExperienceSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={experienceForm.company}
                    onChange={(e) => setExperienceForm({...experienceForm, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={experienceForm.position}
                    onChange={(e) => setExperienceForm({...experienceForm, position: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={experienceForm.description}
                  onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={experienceForm.startDate}
                    onChange={(e) => setExperienceForm({...experienceForm, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={experienceForm.endDate}
                    onChange={(e) => setExperienceForm({...experienceForm, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={experienceForm.isCurrent}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={experienceForm.location}
                    onChange={(e) => setExperienceForm({...experienceForm, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., New York, Remote"
                  />
                </div>
                
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="current"
                    checked={experienceForm.isCurrent}
                    onChange={(e) => setExperienceForm({...experienceForm, isCurrent: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="current" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    I currently work here
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddExperience(false);
                    resetExperienceForm();
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Links Modal */}
      {showAddLinks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <ExternalLink className="h-5 w-5 mr-2 text-accent-600 dark:text-accent-400" />
                Add Social Links
              </h2>
              <button
                onClick={() => {
                  setShowAddLinks(false);
                  resetLinksForm();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleLinksSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  value={linksForm.github}
                  onChange={(e) => setLinksForm({...linksForm, github: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://github.com/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={linksForm.linkedin}
                  onChange={(e) => setLinksForm({...linksForm, linkedin: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  value={linksForm.portfolio}
                  onChange={(e) => setLinksForm({...linksForm, portfolio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://your-portfolio.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Personal Website
                </label>
                <input
                  type="url"
                  value={linksForm.website}
                  onChange={(e) => setLinksForm({...linksForm, website: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://your-website.com"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddLinks(false);
                    resetLinksForm();
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Links
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
