import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, GraduationCap, Code, Users, Briefcase, ExternalLink, TrendingUp, Clock, X } from 'lucide-react';
import { Profile, SearchResult } from '../types';
import { searchService, SearchFilters } from '../services/searchService';

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    skills: [],
    location: '',
    education: '',
    projectTech: []
  });
  const [results, setResults] = useState<SearchResult | null>(null);
  const [suggestions, setSuggestions] = useState<Array<{ type: string; text: string; value: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSkills, setTrendingSkills] = useState<Array<{ name: string; count: number }>>([]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string, searchFilters: SearchFilters, page: number) => {
      if (!searchQuery.trim()) {
        setResults(null);
        return;
      }

      setIsLoading(true);
             try {
         const results = await searchService.search(searchQuery, searchFilters, page, 12);
         console.log('🔍 Search results:', results);
         console.log('🔍 Profiles data:', results.results.profiles?.data);
         setResults(results);
         searchService.saveRecentSearch(searchQuery);
       } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  // Get search suggestions
  const getSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const suggestions = await searchService.getSuggestions(searchQuery, 8);
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
    
    if (value.trim()) {
      getSuggestions(value);
      debouncedSearch(value, filters, 1);
    } else {
      setSuggestions([]);
      setResults(null);
    }
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    
    if (query.trim()) {
      debouncedSearch(query, newFilters, 1);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: { type: string; text: string; value: string }) => {
    setQuery(suggestion.value);
    setSuggestions([]);
    
    if (suggestion.type === 'skill') {
      handleFilterChange('skills', [...filters.skills, suggestion.value]);
    } else if (suggestion.type === 'project') {
      handleFilterChange('projectTech', [...filters.projectTech, suggestion.value]);
    }
    
    debouncedSearch(suggestion.value, filters, 1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (query.trim()) {
      debouncedSearch(query, filters, page);
    }
  };

  // Remove filter
  const removeFilter = (filterType: keyof SearchFilters, value: string) => {
    if (filterType === 'skills') {
      handleFilterChange('skills', filters.skills.filter(s => s !== value));
    } else if (filterType === 'projectTech') {
      handleFilterChange('projectTech', filters.projectTech.filter(t => t !== value));
    }
  };

  // Load recent searches and trending skills on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const recent = searchService.getRecentSearches();
        const trending = await searchService.getTrendingSkills(6);
        setRecentSearches(recent);
        setTrendingSkills(trending);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    
    loadInitialData();
  }, []);

  // Update URL params when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.type !== 'all') params.set('type', filters.type);
    if (filters.skills.length > 0) params.set('skills', filters.skills.join(','));
    if (filters.location) params.set('location', filters.location);
    if (filters.education) params.set('education', filters.education);
    if (filters.projectTech.length > 0) params.set('projectTech', filters.projectTech.join(','));
    
    setSearchParams(params);
  }, [query, filters, setSearchParams]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Search & Discover
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find talented developers, explore amazing projects, and discover in-demand skills
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-3xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for profiles, projects, or skills..."
              className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          
          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                >
                  <div className={`p-2 rounded-full ${
                    suggestion.type === 'profile' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' :
                    suggestion.type === 'project' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' :
                    'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
                  }`}>
                    {suggestion.type === 'profile' ? <Users className="h-4 w-4" /> :
                     suggestion.type === 'project' ? <Briefcase className="h-4 w-4" /> :
                     <Code className="h-4 w-4" />}
                  </div>
                  <span className="text-gray-900 dark:text-white">{suggestion.text}</span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {suggestion.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Filter className="h-5 w-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All</option>
                  <option value="profiles">Profiles Only</option>
                  <option value="projects">Projects Only</option>
                  <option value="skills">Skills Only</option>
                </select>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g., React, Node.js"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      handleFilterChange('skills', [...filters.skills, e.currentTarget.value.trim()]);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="e.g., New York, Remote"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Education
                </label>
                <input
                  type="text"
                  value={filters.education}
                  onChange={(e) => handleFilterChange('education', e.target.value)}
                  placeholder="e.g., Computer Science"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Active Filters */}
            {(filters.skills.length > 0 || filters.projectTech.length > 0) && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active Filters:</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.skills.map((skill, index) => (
                    <span
                      key={`skill-${index}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {skill}
                      <button
                        onClick={() => removeFilter('skills', skill)}
                        className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {filters.projectTech.map((tech, index) => (
                    <span
                      key={`tech-${index}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      {tech}
                      <button
                        onClick={() => removeFilter('projectTech', tech)}
                        className="ml-1 hover:text-green-600 dark:hover:text-green-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 dark:text-gray-400">Searching...</span>
            </div>
          </div>
        )}

        {/* Search Results */}
        {results && !isLoading && (
          <div className="space-y-8">
            {/* Results Summary */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Found <span className="font-semibold text-gray-900 dark:text-white">{results.totalResults}</span> results for "{results.query}"
              </p>
            </div>

            {/* Profiles Results */}
            {results.results.profiles && results.results.profiles.data.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  Profiles ({results.results.profiles.total})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.results.profiles.data.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
                {results.results.profiles.totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={results.results.profiles.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}

            {/* Projects Results */}
            {results.results.projects && results.results.projects.data.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-green-600" />
                  Projects ({results.results.projects.total})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.results.projects.data.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
                {results.results.projects.totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={results.results.projects.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}

            {/* Skills Results */}
            {results.results.skills && results.results.skills.data.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Code className="h-6 w-6 text-purple-600" />
                  Skills ({results.results.skills.total})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.results.skills.data.map((skill, index) => (
                    <SkillCard key={index} skill={skill} />
                  ))}
                </div>
                {results.results.skills.totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={results.results.skills.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}

            {/* No Results */}
            {results.totalResults === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!results && !isLoading && (
          <div className="space-y-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchChange(search)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {search}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = recentSearches.filter((_, i) => i !== index);
                          setRecentSearches(updated);
                          localStorage.setItem('recentSearches', JSON.stringify(updated));
                        }}
                        className="ml-1 hover:text-gray-500 dark:hover:text-gray-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      searchService.clearRecentSearches();
                      setRecentSearches([]);
                    }}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Trending Skills */}
            {trendingSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Trending Skills
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {trendingSkills.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(skill.name);
                        debouncedSearch(skill.name, filters, 1);
                      }}
                      className="p-3 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {skill.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {skill.count} devs
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Default Message */}
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Start searching</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enter a search term above to discover profiles, projects, and skills.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Profile Card Component
const ProfileCard: React.FC<{ profile: Profile }> = ({ profile }) => {
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    console.log('🔍 Clicking profile with userId:', profile.userId);
    console.log('🔍 Full profile object:', profile);
    
    if (!profile.userId) {
      console.error('❌ No userId found in profile:', profile);
      alert('Profile ID not found. Please try again.');
      return;
    }
    
    navigate(`/profile/${profile.userId}`);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleProfileClick}
    >
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {profile.name}
        </h3>
        {profile.bio && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
            {profile.bio}
          </p>
        )}
        {profile.location && (
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-2">
            <MapPin className="h-4 w-4" />
            {profile.location}
          </div>
        )}
        {profile.education && (
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-3">
            <GraduationCap className="h-4 w-4" />
            {profile.education}
          </div>
        )}
        {profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {profile.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
              >
                {skill}
              </span>
            ))}
            {profile.skills.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                +{profile.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

// Project Card Component
const ProjectCard: React.FC<{ project: any }> = ({ project }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
    <div className="mb-4">
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {project.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
        {project.description}
      </p>
    </div>
    
    {project.technologies && project.technologies.length > 0 && (
      <div className="flex flex-wrap gap-1 mb-4">
        {project.technologies.slice(0, 4).map((tech: string, index: number) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 4 && (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-full">
            +{project.technologies.length - 4} more
          </span>
        )}
      </div>
    )}

    {project.profile && (
      <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
        {project.profile.avatar ? (
          <img
            src={project.profile.avatar}
            alt={project.profile.name}
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
            {project.profile.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm text-gray-600 dark:text-gray-400">
          by {project.profile.name}
        </span>
      </div>
    )}

    {project.links && project.links.length > 0 && (
      <div className="flex gap-2 mt-3">
        {project.links.map((link: string, index: number) => (
          <a
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            View
          </a>
        ))}
      </div>
    )}
  </div>
);

// Skill Card Component
const SkillCard: React.FC<{ skill: { name: string; count: number } }> = ({ skill }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
        <Code className="h-8 w-8 text-purple-600 dark:text-purple-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {skill.name}
      </h3>
      <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
        <Users className="h-4 w-4" />
        <span className="text-sm">{skill.count} developers</span>
      </div>
    </div>
  </div>
);

// Pagination Component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default SearchPage;
