export interface EmailPayload {
  title: string
  body: string
}

export interface PushPayload {
  title: string
  body: string
  sound?: string
  data?: Record<string, any>
}

export interface ApiResponse {
  message: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  category: "welcome" | "announcement" | "meeting" | "reminder" | "custom"
  variables: string[]
  createdAt: string
  updatedAt: string
  isDefault?: boolean
}

export interface TemplateVariable {
  key: string
  label: string
  defaultValue: string
  required: boolean
}
