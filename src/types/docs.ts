// ─── Raw API Response Types ───────────────────────────────────────────────────

export type WpDocTopic = {
    id: number
    name: string
    slug: string
    count: number
    description: string
    link: string
}

export type WpDocSection = {
    id: number
    name: string
    slug: string
    count: number
    description: string
    link: string
    acf: {
        related_topics: string[]
    }
}

export type WpDocIndustry = {
    id: number
    name: string
    slug: string
    count: number
    description: string
    link: string
    acf: {
        related_topics: string[]
    }
}

export type WpDoc = {
    id: number
    slug: string
    link: string
    title: {
        rendered: string
    }
    content: {
        rendered: string
    }
    modified: string
    excerpt: {
        rendered: string
    }
    doc_topic: number[]
    doc_section: number[]
    doc_industry: number[]
    acf: {
        doc_slug: string
        doc_type: 'doc' | 'topic' | 'section' | 'industry'
        description: string
    }
}

// ─── Transformed Types (untuk UI) ────────────────────────────────────────────

export type DocIndustryItem = {
    id: number
    label: string
    slug: string
    description: string
    docs: DocItem[]
}

export type DocItem = {
    id: number
    label: string
    slug: string
    href: string
    description: string
}

export type DocSectionItem =
    | {
          type: 'flat'
          id: number
          label: string
          slug: string
          description: string
          docs: DocItem[]
      }
    | {
          type: 'industry'
          id: number
          label: string
          slug: string
          description: string
          industries: DocIndustryItem[]
      }

export type DocNavTopic = {
    id: number
    label: string
    slug: string
    count: number
    description: string
    sections: DocSectionItem[]
}
