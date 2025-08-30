import axios from 'axios';
import { SearchResult } from '../types';

export interface SearchFilters {
  type: 'all' | 'profiles' | 'projects' | 'skills';
  skills: string[];
  location: string;
  education: string;
  projectTech: string[];
}

export interface SearchSuggestion {
  type: string;
  text: string;
  value: string;
}

export interface SearchParams {
  q: string;
  type: string;
  page: number;
  limit: number;
  skills?: string;
  location?: string;
  education?: string;
  projectTech?: string;
}

class SearchService {
  private baseURL: string;

  constructor() {
    this.baseURL = '/api/search';
  }

  /**
   * Perform a search across profiles, projects, and skills
   */
  async search(query: string, filters: SearchFilters, page: number = 1, limit: number = 12): Promise<SearchResult> {
    try {
      const params: SearchParams = {
        q: query,
        type: filters.type,
        page,
        limit
      };

      if (filters.skills.length > 0) {
        params.skills = filters.skills.join(',');
      }
      if (filters.location) {
        params.location = filters.location;
      }
      if (filters.education) {
        params.education = filters.education;
      }
      if (filters.projectTech.length > 0) {
        params.projectTech = filters.projectTech.join(',');
      }

      const response = await axios.get(this.baseURL, { params });
      return response.data.data;
    } catch (error) {
      console.error('Search failed:', error);
      throw new Error('Failed to perform search');
    }
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSuggestions(query: string, limit: number = 8): Promise<SearchSuggestion[]> {
    try {
      const response = await axios.get(`${this.baseURL}/suggestions`, {
        params: { q: query, limit }
      });
      return response.data.data.suggestions;
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }

  /**
   * Perform advanced search with multiple filters
   */
  async advancedSearch(filters: {
    query?: string;
    skills?: string[];
    location?: string;
    education?: string;
    projectTech?: string[];
    limit?: number;
    page?: number;
  }): Promise<any> {
    try {
      const params: any = {
        limit: filters.limit || 20,
        page: filters.page || 1
      };

      if (filters.query) params.q = filters.query;
      if (filters.skills && filters.skills.length > 0) params.skills = filters.skills.join(',');
      if (filters.location) params.location = filters.location;
      if (filters.education) params.education = filters.education;
      if (filters.projectTech && filters.projectTech.length > 0) params.projectTech = filters.projectTech.join(',');

      const response = await axios.get(`${this.baseURL}/advanced`, { params });
      return response.data.data;
    } catch (error) {
      console.error('Advanced search failed:', error);
      throw new Error('Failed to perform advanced search');
    }
  }

  /**
   * Search profiles only
   */
  async searchProfiles(query: string, filters: Partial<SearchFilters> = {}, page: number = 1): Promise<any> {
    const searchFilters: SearchFilters = {
      type: 'profiles',
      skills: filters.skills || [],
      location: filters.location || '',
      education: filters.education || '',
      projectTech: filters.projectTech || []
    };
    return this.search(query, searchFilters, page);
  }

  /**
   * Search projects only
   */
  async searchProjects(query: string, filters: Partial<SearchFilters> = {}, page: number = 1): Promise<any> {
    const searchFilters: SearchFilters = {
      type: 'projects',
      skills: filters.skills || [],
      location: filters.location || '',
      education: filters.education || '',
      projectTech: filters.projectTech || []
    };
    return this.search(query, searchFilters, page);
  }

  /**
   * Search skills only
   */
  async searchSkills(query: string, page: number = 1): Promise<any> {
    const searchFilters: SearchFilters = {
      type: 'skills',
      skills: [],
      location: '',
      education: '',
      projectTech: []
    };
    return this.search(query, searchFilters, page);
  }

  /**
   * Get trending skills
   */
  async getTrendingSkills(limit: number = 10): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseURL}/trending-skills`, {
        params: { limit }
      });
      return response.data.data.skills;
    } catch (error) {
      console.error('Failed to get trending skills:', error);
      return [];
    }
  }

  /**
   * Get recent searches (if implemented)
   */
  getRecentSearches(): string[] {
    try {
      const recentSearches = localStorage.getItem('recentSearches');
      return recentSearches ? JSON.parse(recentSearches) : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Save search to recent searches
   */
  saveRecentSearch(query: string): void {
    try {
      const recentSearches = localStorage.getItem('recentSearches');
      const parsedSearches = recentSearches ? JSON.parse(recentSearches) : [];
      const updatedSearches = [query, ...parsedSearches.filter((s: string) => s !== query)].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  }

  /**
   * Clear recent searches
   */
  clearRecentSearches(): void {
    try {
      localStorage.removeItem('recentSearches');
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  }
}

export const searchService = new SearchService();
export default searchService;
