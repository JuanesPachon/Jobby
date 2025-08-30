export interface UserData {
  id?: number
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  created_at?: string
  updated_at?: string
  profile?: Profile
  experiences?: Experience[]
  skills?: Skill[]
  documents?: Document[]
}

export interface Profile {
  photo_url: string
  description: string
  created_at: string
  updated_at: string,
  education: string,
  current_location: string
}

export interface Experience {
  id: number
  title: string
  location: string
  start_date: string
  end_date?: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: number
  skill_name: string
}

export interface Document {
  id: number
  file_url: string
  uploaded_at: string
}
