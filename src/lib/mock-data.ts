import { type CandidateSummary, type JobSummary } from "@/lib/types";

export const dashboardMetrics = {
  totalHires: 124,
  avgMatchScore: 82,
  processingQueue: 48
};

export const jobs: JobSummary[] = [
  {
    id: "job-senior-ui-designer",
    title: "Senior UI Designer",
    city: "London (Remote)",
    createdAt: "Aug 21, 2025",
    resumeCount: 42,
    shortlistedCount: 12,
    pendingCount: 8,
    lastUpdated: "2h ago",
    matchScore: 88,
    status: "Active",
    description: "Owns the product visual system, works closely with product and engineering, and improves UX consistency across the ATS workspace.",
    originalJd: "Hiring Senior UI Designer",
    enhancedJd: "Senior UI Designer with design systems, Figma, accessibility, motion design, collaboration, and 5+ years of SaaS product experience.",
    skills: ["Figma", "Design Systems", "Accessibility", "Motion Design"],
    jobEmbedding: [0.62, 0.11, 0.84, 0.39, 0.25, 0.9]
  },
  {
    id: "job-technical-lead",
    title: "Technical Lead",
    city: "New York City",
    createdAt: "Aug 19, 2025",
    resumeCount: 18,
    shortlistedCount: 5,
    pendingCount: 3,
    lastUpdated: "4h ago",
    matchScore: 79,
    status: "Active",
    description: "Leads backend systems, reviews architecture, and partners with recruiters on role fit and shortlist decisions.",
    originalJd: "Need technical lead for platform team",
    enhancedJd: "Technical Lead with Node.js, system design, microservices, Kafka, AWS, REST APIs, and hands-on leadership.",
    skills: ["Node.js", "Kafka", "AWS", "System Design"],
    jobEmbedding: [0.73, 0.18, 0.52, 0.48, 0.8, 0.44]
  },
  {
    id: "job-marketing-manager",
    title: "Marketing Manager",
    city: "Berlin",
    createdAt: "Aug 18, 2025",
    resumeCount: 89,
    shortlistedCount: 24,
    pendingCount: 15,
    lastUpdated: "1d ago",
    matchScore: 71,
    status: "Active",
    description: "Runs go-to-market campaigns and recruiting brand messaging for internal hiring needs.",
    originalJd: "Marketing manager needed",
    enhancedJd: "Performance marketing, employer branding, analytics, campaign strategy, stakeholder communication, and experimentation.",
    skills: ["Analytics", "Branding", "Campaign Strategy"],
    jobEmbedding: [0.21, 0.37, 0.29, 0.88, 0.41, 0.59]
  }
];

export const candidates: CandidateSummary[] = [
  {
    id: "cand-alex-morgan",
    fullName: "Alex Morgan",
    email: "alex.m@design.co",
    phone: "+44 7700 900111",
    role: "Senior UI Designer",
    matchPercentage: 98,
    skills: ["Figma", "React", "Design Systems"],
    experienceYears: 12,
    status: "SHORTLISTED",
    uploadDate: "Today",
    resumeUrl: "/samples/alex-morgan.pdf",
    notes: "Strong portfolio and system thinking.",
    matchedSkills: ["Figma", "Design Systems"],
    missingSkills: ["Accessibility"],
    parsedText: "Senior product designer focused on design systems, accessibility, and motion-led product experiences."
  },
  {
    id: "cand-sarah-chen",
    fullName: "Sarah Chen",
    email: "s.chen@tech.net",
    phone: "+1 212 555 0144",
    role: "UI / UX Lead",
    matchPercentage: 94,
    skills: ["System Design", "UX Research"],
    experienceYears: 8,
    status: "READ",
    uploadDate: "Today",
    resumeUrl: "/samples/sarah-chen.pdf",
    notes: "Excellent research depth.",
    matchedSkills: ["UX Research"],
    missingSkills: ["Figma"],
    parsedText: "UI and UX lead with product strategy, research, and design system ownership."
  },
  {
    id: "cand-david-wright",
    fullName: "David Wright",
    email: "d.wright@agency.com",
    phone: "+49 160 555 2081",
    role: "Product Designer",
    matchPercentage: 72,
    skills: ["Motion", "Branding"],
    experienceYears: 4,
    status: "UNREAD",
    uploadDate: "Yesterday",
    resumeUrl: "/samples/david-wright.pdf",
    notes: "Needs stronger ATS fit.",
    matchedSkills: ["Motion"],
    missingSkills: ["Accessibility", "Design Systems"],
    parsedText: "Product designer with branding, motion, and feature launch experience."
  }
];
