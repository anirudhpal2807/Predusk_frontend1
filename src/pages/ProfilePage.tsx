import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { MapPin, GraduationCap, Code, Briefcase, ExternalLink, Mail, Calendar } from 'lucide-react';

interface ProfileData {
  _id: string;
  userId?: string;
  name: string;
  email?: string;
  bio?: string;
  location?: string;
  education?: string;
  skills: string[];
  projects: Array<{
    _id: string;
    title: string;
    description: string;
    technologies: string[];
    links: string[];
    imageUrl?: string;
  }>;
  work: Array<{
    _id: string;
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    location?: string;
  }>;
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    website?: string;
  };
  avatar?: string;
  isPublic: boolean;
}

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const isOwnProfile = !userId || userId === 'undefined' || userId === currentUser?._id;

  // Redirect to search if userId is undefined and not own profile
  useEffect(() => {
    if (!isOwnProfile && (!userId || userId === 'undefined')) {
      console.log('🔍 Redirecting to search due to invalid userId:', userId);
      navigate('/search');
    }
  }, [userId, isOwnProfile, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        console.log('🔍 Fetching profile for userId:', userId);
        console.log('🔍 isOwnProfile:', isOwnProfile);
        console.log('🔍 Current user ID:', currentUser?._id);
        
        // Check if userId is valid
        if (!isOwnProfile && (!userId || userId === 'undefined')) {
          console.error('❌ Invalid userId:', userId);
          setError('Invalid user ID');
          setIsLoading(false);
          return;
        }
        
        let response;
        if (isOwnProfile) {
          // Fetch current user's profile
          response = await axios.get('/api/profile');
        } else {
          // Fetch other user's public profile
          response = await axios.get(`/api/profile/${userId}`);
        }
        
        const profileData = response.data.data;
        console.log('🔍 Raw profile data:', profileData);
        console.log('🔍 Profile data structure:', {
          hasSkills: !!profileData.skills,
          hasProjects: !!profileData.projects,
          hasWork: !!profileData.work,
          hasLinks: !!profileData.links,
          skillsType: typeof profileData.skills,
          projectsType: typeof profileData.projects,
          workType: typeof profileData.work,
          linksType: typeof profileData.links
        });
        
        // Add userId to the profile data for navigation and ensure default values
        const safeProfileData = {
          skills: profileData.skills || [],
          projects: profileData.projects || [],
          work: profileData.work || [],
          links: profileData.links || {},
          ...profileData,
          userId: userId || currentUser?._id
        };
        
        console.log('🔍 Safe profile data:', safeProfileData);
        setProfile(safeProfileData);
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
        console.error('Error details:', err.response?.data);
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isOwnProfile, currentUser?._id]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Profile Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/search')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Profile Not Found
        </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The profile you're looking for doesn't exist or is not public.
            </p>
            <button
              onClick={() => navigate('/search')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Additional safety check
  if (!profile || typeof profile !== 'object') {
    console.error('❌ Profile is invalid:', profile);
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Invalid Profile Data
        </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The profile data is corrupted or invalid.
            </p>
            <button
              onClick={() => navigate('/search')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-3xl">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {profile.name}
              </h1>
              {profile.bio && (
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                  {profile.bio}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </div>
                )}
                {profile.education && (
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {profile.education}
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Code className="h-5 w-5" />
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {profile.projects && profile.projects.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Code className="h-5 w-5" />
              Projects
            </h2>
            <div className="grid gap-6">
              {profile.projects.map((project) => {
                console.log('🔍 Project data:', project);
                console.log('🖼️ Project imageUrl:', project.imageUrl);
                return (
                  <div key={project._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                      {/* Project Image */}
                  {project.imageUrl && (
                    <div className="mb-3">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        onError={(e) => {
                          console.error('❌ Image failed to load:', project.imageUrl);
                          console.error('❌ Project data:', project);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          // Show fallback
                          const fallback = target.parentElement?.querySelector('.image-fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                        onLoad={() => {
                          console.log('✅ Image loaded successfully:', project.imageUrl);
                        }}
                      />
                      {/* Fallback when image fails */}
                      <div 
                        className="image-fallback hidden w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center"
                      >
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <div className="text-4xl mb-2">🖼️</div>
                          <div className="text-sm">Image not available</div>
                        </div>
                      </div>
                    </div>
                  )}
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {project.description}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.links && project.links.length > 0 && (
                      <div className="flex gap-2">
                        {project.links.map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Project
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Work Experience Section */}
        {profile.work && profile.work.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </h2>
            <div className="space-y-4">
              {profile.work.map((work) => (
                <div key={work._id} className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {work.position}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium">
                    {work.company}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(work.startDate).toLocaleDateString()} - 
                    {work.isCurrent ? ' Present' : work.endDate ? new Date(work.endDate).toLocaleDateString() : ''}
                  </div>
                  {work.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <MapPin className="h-4 w-4" />
                      {work.location}
                    </div>
                  )}
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {work.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {profile.links && (profile.links.github || profile.links.linkedin || profile.links.portfolio || profile.links.website) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Connect
            </h2>
            <div className="flex gap-4">
              {profile.links.github && (
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {profile.links.linkedin && (
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {profile.links.portfolio && (
                <a
                  href={profile.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Portfolio
                </a>
              )}
              {profile.links.website && (
                <a
                  href={profile.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Website
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
