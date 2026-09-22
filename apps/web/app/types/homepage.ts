export interface Tag {
  id?: number
  label: string
}

export interface Capability {
  id?: number
  text: string
}

export interface Service {
  id?: number
  title: string
  description: string
}

export interface ProcessStep {
  id?: number
  index: string
  title: string
  description: string
}

export interface Homepage {
  heroEyebrow: string
  heroTitle: string
  /** Substring of heroTitle to underline (case-insensitive). Empty = no underline. */
  heroEmphasis: string
  heroLead: string
  heroPrimaryCta: string
  heroSecondaryCta: string
  heroTags: Tag[]
  capabilitiesCommand: string
  capabilities: Capability[]
  aboutEyebrow: string
  aboutTitleOne: string
  aboutBodyOne: string
  aboutTitleTwo: string
  aboutBodyTwo: string
  servicesEyebrow: string
  services: Service[]
  processEyebrow: string
  processSteps: ProcessStep[]
  contactEyebrow: string
  contactTitle: string
  contactBody: string
  contactEmail: string
  contactLocation: string
  whyTitle: string
  whyBody: string
}
