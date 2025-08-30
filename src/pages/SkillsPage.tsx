import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Users, Code, Star, BookOpen, ExternalLink } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  popularity: number;
  developersCount: number;
  projectsCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  trending: boolean;
  resources: {
    name: string;
    url: string;
    type: 'documentation' | 'tutorial' | 'course';
  }[];
}

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['all', 'frontend', 'backend', 'mobile', 'database', 'devops', 'ai', 'design', 'other'];

  useEffect(() => {
    // Simulate loading skills data
    setTimeout(() => {
      const mockSkills: Skill[] = [
        {
          id: '1',
          name: 'React',
          category: 'frontend',
          description: 'A JavaScript library for building user interfaces, particularly single-page applications. It\'s used for handling the view layer and can be used for developing both web and mobile applications.',
          icon: '⚛️',
          popularity: 95,
          developersCount: 12450,
          projectsCount: 8920,
          difficulty: 'Intermediate',
          trending: true,
          resources: [
            { name: 'Official Docs', url: 'https://reactjs.org', type: 'documentation' },
            { name: 'React Tutorial', url: 'https://example.com', type: 'tutorial' },
            { name: 'React Course', url: 'https://example.com', type: 'course' }
          ]
        },
        {
          id: '2',
          name: 'Node.js',
          category: 'backend',
          description: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.',
          icon: '🟢',
          popularity: 92,
          developersCount: 11890,
          projectsCount: 7650,
          difficulty: 'Intermediate',
          trending: true,
          resources: [
            { name: 'Official Docs', url: 'https://nodejs.org', type: 'documentation' },
            { name: 'Node.js Guide', url: 'https://example.com', type: 'tutorial' }
          ]
        },
        {
          id: '3',
          name: 'Python',
          category: 'backend',
          description: 'A high-level, interpreted programming language known for its simplicity and readability. Widely used in web development, data science, AI, and automation.',
          icon: '🐍',
          popularity: 98,
          developersCount: 15670,
          projectsCount: 12340,
          difficulty: 'Beginner',
          trending: false,
          resources: [
            { name: 'Python Docs', url: 'https://python.org', type: 'documentation' },
            { name: 'Python Tutorial', url: 'https://example.com', type: 'tutorial' }
          ]
        },
        {
          id: '4',
          name: 'TypeScript',
          category: 'frontend',
          description: 'A superset of JavaScript that adds static typing, classes, and modules. It helps catch errors early and provides better tooling support.',
          icon: '📘',
          popularity: 88,
          developersCount: 9870,
          projectsCount: 6540,
          difficulty: 'Intermediate',
          trending: true,
          resources: [
            { name: 'TypeScript Docs', url: 'https://typescriptlang.org', type: 'documentation' },
            { name: 'TS Course', url: 'https://example.com', type: 'course' }
          ]
        },
        {
          id: '5',
          name: 'MongoDB',
          category: 'database',
          description: 'A NoSQL document database that stores data in flexible, JSON-like documents. Perfect for applications that need to handle large amounts of unstructured data.',
          icon: '🍃',
          popularity: 85,
          developersCount: 8760,
          projectsCount: 5430,
          difficulty: 'Intermediate',
          trending: false,
          resources: [
            { name: 'MongoDB Docs', url: 'https://docs.mongodb.com', type: 'documentation' },
            { name: 'MongoDB Tutorial', url: 'https://example.com', type: 'tutorial' }
          ]
        },
        {
          id: '6',
          name: 'Docker',
          category: 'devops',
          description: 'A platform for developing, shipping, and running applications in containers. It enables consistent deployment across different environments.',
          icon: '🐳',
          popularity: 87,
          developersCount: 7650,
          projectsCount: 4320,
          difficulty: 'Intermediate',
          trending: true,
          resources: [
            { name: 'Docker Docs', url: 'https://docs.docker.com', type: 'documentation' },
            { name: 'Docker Course', url: 'https://example.com', type: 'course' }
          ]
        },
        {
          id: '7',
          name: 'TensorFlow',
          category: 'ai',
          description: 'An open-source machine learning framework developed by Google. It\'s used for building and training neural networks and other ML models.',
          icon: '🧠',
          popularity: 78,
          developersCount: 5430,
          projectsCount: 3210,
          difficulty: 'Advanced',
          trending: true,
          resources: [
            { name: 'TensorFlow Docs', url: 'https://tensorflow.org', type: 'documentation' },
            { name: 'ML Course', url: 'https://example.com', type: 'course' }
          ]
        },
        {
          id: '8',
          name: 'Figma',
          category: 'design',
          description: 'A collaborative interface design tool that runs in the browser. It\'s widely used for UI/UX design, prototyping, and design systems.',
          icon: '🎨',
          popularity: 82,
          developersCount: 6540,
          projectsCount: 4560,
          difficulty: 'Beginner',
          trending: false,
          resources: [
            { name: 'Figma Help', url: 'https://help.figma.com', type: 'documentation' },
            { name: 'Design Course', url: 'https://example.com', type: 'course' }
          ]
        }
      ];
      
      setSkills(mockSkills);
      setFilteredSkills(mockSkills);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = skills;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(skill => skill.difficulty === selectedDifficulty);
    }

    setFilteredSkills(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty, skills]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      frontend: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      backend: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      mobile: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      database: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      devops: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      ai: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      design: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return colors[category] || colors.other;
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'text-green-600 dark:text-green-400';
    if (popularity >= 80) return 'text-yellow-600 dark:text-yellow-400';
    if (popularity >= 70) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
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
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Skills & Technologies
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the most in-demand skills in the tech industry. 
            Learn about technologies, their popularity, and find resources to master them.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search skills, categories, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredSkills.length} of {skills.length} skills
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              {/* Skill Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{skill.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {skill.name}
                        {skill.trending && (
                          <TrendingUp className="inline h-5 w-5 text-orange-500 ml-2" />
                        )}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                        {skill.category}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(skill.difficulty)}`}>
                    {skill.difficulty}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {skill.description}
                </p>

                {/* Popularity Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Popularity</span>
                    <span className={`font-medium ${getPopularityColor(skill.popularity)}`}>
                      {skill.popularity}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        skill.popularity >= 90 ? 'bg-green-500' :
                        skill.popularity >= 80 ? 'bg-yellow-500' :
                        skill.popularity >= 70 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${skill.popularity}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {skill.developersCount.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-1" />
                    {skill.projectsCount.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {skill.trending ? 'Trending' : 'Stable'}
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div className="p-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Learning Resources
                </h4>
                <div className="space-y-2">
                  {skill.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {resource.name}
                      </span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No skills found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsPage;
