// User types
export interface User {
  id: string
  email: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

// Profile types
export interface Project {
  id: string
  title: string
  description: string
  links: string[]
  technologies: string[]
  imageUrl?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  description: string
  startDate?: string
  endDate?: string
  isCurrent: boolean
  location?: string
  createdAt: string
  updatedAt: string
}

export interface SocialLinks {
  github?: string
  linkedin?: string
  portfolio?: string
  website?: string
}

export interface Profile {
  id: string
  userId: string
  name: string
  email: string
  bio?: string
  education?: string
  location?: string
  skills: string[]
  projects: Project[]
  work: WorkExperience[]
  links: SocialLinks
  avatar?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    profile?: Partial<Profile>
    token: string
  }
}

export interface AuthState {
  user: User | null
  profile: Profile | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Search types
export interface SearchQuery {
  q: string
  type?: 'all' | 'profiles' | 'projects' | 'skills'
  limit?: number
  page?: number
}

export interface SearchResult {
  query: string
  type: string
  totalResults: number
  results: {
    profiles?: {
      data: Profile[]
      total: number
      totalPages: number
      currentPage: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
    projects?: {
      data: Project[]
      total: number
      totalPages: number
      currentPage: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
    skills?: {
      data: Array<{ name: string; count: number }>
      total: number
      totalPages: number
      currentPage: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
  pagination: {
    currentPage: number
    limit: number
  }
}

// Skills types
export interface Skill {
  name: string
  count: number
  profileCount?: number
  rank?: number
}

export interface SkillCategory {
  [category: string]: Skill[]
}

// Project types
export interface ProjectWithProfile extends Project {
  profile: {
    id: string
    name: string
    avatar?: string
    skills: string[]
  }
}

// Form types
export interface ProfileFormData {
  name: string
  email: string
  bio: string
  education: string
  location: string
  avatar: string
  isPublic: boolean
}

export interface ProjectFormData {
  title: string
  description: string
  links: string[]
  technologies: string[]
  imageUrl: string
  isPublic: boolean
}

export interface WorkFormData {
  company: string
  position: string
  duration: string
  description: string
  startDate: string
  endDate?: string
  isCurrent: boolean
}

// UI types
export interface ButtonVariant {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
}

export interface InputProps {
  label?: string
  error?: string
  required?: boolean
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'url' | 'textarea'
}

// Theme types
export interface Theme {
  name: 'light' | 'dark'
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    accent: string
  }
}

// Navigation types
export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

// Toast types
export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

// Error types
export interface ApiError {
  success: false
  message: string
  errors?: Array<{
    field: string
    message: string
  }>
}

// Filter types
export interface ProjectFilters {
  skill?: string
  search?: string
  limit?: number
  page?: number
}

export interface SkillFilters {
  limit?: number
  page?: number
}

// Component props types
export interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: Array<{
    label: string
    onClick: () => void
    icon?: React.ComponentType<{ className?: string }>
    disabled?: boolean
  }>
  align?: 'left' | 'right'
}
