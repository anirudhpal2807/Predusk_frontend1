import React, { useState, useEffect } from 'react';
import { Search, Code, ExternalLink, Github, Calendar, User } from 'lucide-react';
import api from '../services/api';
import { API_CONFIG } from '../config/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  technologies: string[];
  links: string[];
  createdAt: string;
  updatedAt: string;
  profile: {
    _id: string;
    name: string;
    avatar?: string;
    skills: string[];
  };
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to construct full image URL
  const getImageUrl = (imageUrl?: string): string | undefined => {
    if (!imageUrl) return undefined;
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative path, construct full URL
    if (imageUrl.startsWith('/')) {
      return `${window.location.origin}${imageUrl}`;
    }
    
    // If it's just a filename, construct full URL
    return `${window.location.origin}/uploads/projects/${imageUrl}`;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use environment-aware API URL
        const apiUrl = import.meta.env.DEV 
          ? '/api/projects' 
          : 'https://predusk-backend1.vercel.app/api/projects';
        
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        if (result.success) {
          console.log('📁 Fetched projects:', result.data.projects);
          // Debug image URLs
          result.data.projects.forEach((project: Project, index: number) => {
            console.log(`🔍 Project ${index + 1}:`, {
              title: project.title,
              imageUrl: project.imageUrl,
              fullImageUrl: getImageUrl(project.imageUrl)
            });
          });
          setProjects(result.data.projects);
          setFilteredProjects(result.data.projects);
        } else {
          console.error('❌ Failed to fetch projects:', result.message);
          setError(result.message || 'Failed to fetch projects');
        }
      } catch (error) {
        console.error('❌ Error fetching projects:', error);
        setError('Network error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => 
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      project.profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-500 text-xl mb-4">❌ Error Loading Projects</div>
          <div className="text-gray-600 dark:text-gray-400 mb-6">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Amazing Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore innovative projects from talented developers around the world. 
            Get inspired, learn new technologies, and connect with creators.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, technologies, or creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* Projects Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              {searchTerm ? 'No projects found matching your search.' : 'No projects available at the moment.'}
            </div>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
              <div key={project._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                   {project.imageUrl ? (
                <img
                       src={getImageUrl(project.imageUrl)}
                  alt={project.title}
                  className="w-full h-full object-cover"
                       onError={(e) => {
                         console.error('❌ Image failed to load:', project.imageUrl);
                         console.error('❌ Full URL:', getImageUrl(project.imageUrl));
                         const target = e.target as HTMLImageElement;
                         target.style.display = 'none';
                         // Show fallback
                         const fallback = target.parentElement?.querySelector('.image-fallback') as HTMLElement;
                         if (fallback) fallback.style.display = 'flex';
                       }}
                       onLoad={() => {
                         console.log('✅ Image loaded successfully:', project.imageUrl);
                         console.log('✅ Full URL:', getImageUrl(project.imageUrl));
                       }}
                     />
                   ) : null}
                   
                   {/* Fallback when no image or image fails to load */}
                   <div className={`image-fallback w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 flex items-center justify-center ${getImageUrl(project.imageUrl) ? 'hidden' : 'flex'}`}>
                     <div className="text-center text-primary-600 dark:text-primary-400">
                       <Code className="h-12 w-12 mx-auto mb-2" />
                       <p className="text-sm">No Image</p>
                     </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                  {/* Project Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Project Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies && project.technologies.length > 0 ? (
                        project.technologies.slice(0, 4).map((tech, index) => (
                    <span
                            key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                    >
                      {tech}
                    </span>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">No technologies specified</span>
                      )}
                      {project.technologies && project.technologies.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                    </div>
                </div>

                  {/* Project Meta */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(project.createdAt)}
                  </div>
                </div>

                  {/* Author Info */}
                  <div className="flex items-center mb-4">
                    {project.profile.avatar ? (
                      <img
                        src={project.profile.avatar}
                        alt={project.profile.name}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full mr-3 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.profile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {project.profile.skills && project.profile.skills.length > 0 
                          ? project.profile.skills.slice(0, 3).join(', ')
                          : 'No skills listed'
                        }
                      </p>
                  </div>
                </div>

                  {/* Project Links */}
                  <div className="flex gap-2">
                    {project.links && project.links.length > 0 ? (
                      <>
                        {project.links.find(link => link.includes('github.com')) && (
                          <a
                            href={project.links.find(link => link.includes('github.com'))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                          >
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                          </a>
                        )}
                        {project.links.find(link => !link.includes('github.com')) && (
                          <a
                            href={project.links.find(link => !link.includes('github.com'))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  )}
                      </>
                    ) : (
                      <div className="w-full text-center text-gray-500 dark:text-gray-400 text-sm py-2">
                        No links available
                      </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
