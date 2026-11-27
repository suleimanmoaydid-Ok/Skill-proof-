import { CandidateAccount, SkillProofState } from "../types/skillproof";

export interface AssessmentQuestion {
  id: string;
  domain: string;
  prompt: string;
  options: string[];
  correctOption: string;
  competencyTag: string;
  explanation: string;
}

export const SAMPLE_ASSESSMENT_TRACKS: Record<
  string,
  { title: string; domain: string; description: string; questions: AssessmentQuestion[] }
> = {
  "software-systems": {
    title: "Sample Practical Assessment: Full-Stack Web & Data Reliability",
    domain: "Software & Civic Systems Engineering",
    description:
      "A 5-item scenario-based sample assessment evaluating API design, data integrity, offline resilience, and security fundamentals. Marked clearly as a demonstration sample assessment.",
    questions: [
      {
        id: "sw-q1",
        domain: "Software & Civic Systems Engineering",
        prompt:
          "A community clinic dashboard loses internet connectivity intermittently while logging freezer temperatures. Which architecture pattern best preserves readings without data loss?",
        options: [
          "Queue timestamped readings locally in IndexedDB/SQLite and synchronize idempotently on reconnect",
          "Discard readings taken offline and alert the user to re-enter temperatures manually",
          "Store readings only in React component memory until the browser tab closes",
          "Disable all sensor logging whenever latency exceeds 500ms",
        ],
        correctOption:
          "Queue timestamped readings locally in IndexedDB/SQLite and synchronize idempotently on reconnect",
        competencyTag: "Offline-First Data Integrity & Sync",
        explanation:
          "Durable local persistence paired with idempotent server synchronization ensures no sensor telemetry is lost or duplicated on reconnect.",
      },
      {
        id: "sw-q2",
        domain: "Software & Civic Systems Engineering",
        prompt:
          "When designing a REST endpoint that updates vaccine stock counts across concurrent clinic workers, how should you prevent lost updates?",
        options: [
          "Use database transactions with optimistic version checks or atomic increment/decrement operations",
          "Allow each browser client to overwrite the full inventory JSON object directly",
          "Run a client-side setTimeout delay of 2 seconds before every POST request",
          "Cache the inventory count only in localStorage without server validation",
        ],
        correctOption:
          "Use database transactions with optimistic version checks or atomic increment/decrement operations",
        competencyTag: "Backend Concurrency & Relational Data Modelling",
        explanation:
          "Transactional updates or atomic SQL operations prevent race conditions when two operators modify stock simultaneously.",
      },
      {
        id: "sw-q3",
        domain: "Software & Civic Systems Engineering",
        prompt:
          "In a TypeScript React application handling external user-submitted URLs (such as project links), what is the safest rendering practice?",
        options: [
          "Validate that the parsed URL protocol is strictly https: or http: before rendering an anchor link",
          "Render any submitted string directly into href and use dangerouslySetInnerHTML",
          "Accept javascript: URLs if the user confirms they own the link",
          "Rely solely on CSS styling to hide suspicious URLs",
        ],
        correctOption:
          "Validate that the parsed URL protocol is strictly https: or http: before rendering an anchor link",
        competencyTag: "Frontend Security & Input Validation",
        explanation:
          "Validating URL protocols prevents javascript: URI injection and cross-site scripting risks.",
      },
      {
        id: "sw-q4",
        domain: "Software & Civic Systems Engineering",
        prompt:
          "What is the most reliable way to verify that an alert threshold calculation (e.g., freezer temperature > 8°C for 15 minutes) works consistently after refactoring?",
        options: [
          "Write automated unit tests covering boundary values, time windows, and sensor fault edge cases",
          "Manually check the chart once in the browser after deploying to production",
          "Remove TypeScript strict checks so the code compiles faster",
          "Log values to the browser console during development only",
        ],
        correctOption:
          "Write automated unit tests covering boundary values, time windows, and sensor fault edge cases",
        competencyTag: "Automated Testing & Quality Assurance",
        explanation:
          "Boundary and time-window unit tests catch regressions deterministically before deployment.",
      },
      {
        id: "sw-q5",
        domain: "Software & Civic Systems Engineering",
        prompt:
          "Which HTTP status code and payload pattern is most appropriate when a client submits an invalid payload to an Express API endpoint?",
        options: [
          "HTTP 400 Bad Request with a structured JSON error message describing the invalid field",
          "HTTP 200 OK with an empty HTML page",
          "HTTP 500 Internal Server Error with the database password in the stack trace",
          "Silently ignore the request and close the socket",
        ],
        correctOption:
          "HTTP 400 Bad Request with a structured JSON error message describing the invalid field",
        competencyTag: "Node.js & REST API Engineering",
        explanation:
          "Explicit 4xx status codes with clean, non-sensitive error messages guide client error recovery.",
      },
    ],
  },
  "solar-microgrid": {
    title: "Sample Practical Assessment: Off-Grid Solar & Electrical Safety",
    domain: "Renewable Energy & Electrical Maintenance",
    description:
      "A 5-item scenario-based sample assessment for photovoltaic sizing, battery protection, and safe commissioning practices.",
    questions: [
      {
        id: "sol-q1",
        domain: "Renewable Energy & Electrical Maintenance",
        prompt:
          "Before disconnecting DC photovoltaic array strings at a combiner box for maintenance, what is the critical safety sequence?",
        options: [
          "Isolate the AC/DC load breakers first, verify zero current with a clamp meter, then open DC isolators wearing rated PPE",
          "Unplug MC4 connectors immediately under full solar load to save time",
          "Turn off only the battery inverter display panel",
          "Cover one panel with cardboard and pull the fuse bare-handed",
        ],
        correctOption:
          "Isolate the AC/DC load breakers first, verify zero current with a clamp meter, then open DC isolators wearing rated PPE",
        competencyTag: "DC Isolation & Field Safety",
        explanation:
          "Opening DC circuits under load causes sustained electrical arcs; load shedding and zero-current verification are mandatory.",
      },
      {
        id: "sol-q2",
        domain: "Renewable Energy & Electrical Maintenance",
        prompt:
          "When sizing an MPPT charge controller for a cold-climate site, which PV array specification must never be exceeded?",
        options: [
          "Maximum open-circuit voltage (Voc) adjusted for lowest expected ambient temperature",
          "Nominal panel wattage multiplied by cable length",
          "Short-circuit current divided by battery capacity",
          "Panel frame thickness in millimeters",
        ],
        correctOption:
          "Maximum open-circuit voltage (Voc) adjusted for lowest expected ambient temperature",
        competencyTag: "PV Array & Charge Controller Sizing",
        explanation:
          "Cold temperatures increase PV Voc; exceeding the controller's max Voc rating causes permanent input stage failure.",
      },
      {
        id: "sol-q3",
        domain: "Renewable Energy & Electrical Maintenance",
        prompt:
          "A 48V LiFePO4 battery bank shows one cell reaching over-voltage cutoff while overall pack voltage is normal. What is the likely cause?",
        options: [
          "Cell imbalance requiring BMS inspection and controlled top-balancing",
          "Solar panels producing AC instead of DC",
          "Normal behavior requiring no inspection",
          "Excessive grounding wire diameter",
        ],
        correctOption:
          "Cell imbalance requiring BMS inspection and controlled top-balancing",
        competencyTag: "Battery Management & Diagnostics",
        explanation:
          "Cell drift triggers premature BMS high-voltage disconnect and reduces usable pack capacity.",
      },
      {
        id: "sol-q4",
        domain: "Renewable Energy & Electrical Maintenance",
        prompt:
          "Why are DC surge protection devices (SPDs) installed near both the PV array entry and inverter DC bus on long outdoor runs?",
        options: [
          "To divert induced lightning and switching transients safely to earth before damaging power electronics",
          "To increase daytime solar irradiance",
          "To convert 48V DC into 230V AC",
          "To eliminate the need for overcurrent fuses",
        ],
        correctOption:
          "To divert induced lightning and switching transients safely to earth before damaging power electronics",
        competencyTag: "Surge Protection & Earthing Standards",
        explanation:
          "Long exterior DC runs act as antennas for surge events; coordinated SPDs protect inverter semiconductors.",
      },
      {
        id: "sol-q5",
        domain: "Renewable Energy & Electrical Maintenance",
        prompt:
          "Which commissioning document is most valuable as practical evidence for an international skills assessor?",
        options: [
          "Signed test sheet recording Voc, Isc, insulation resistance, torque checks, and site photographs",
          "A verbal statement that the lights turned on",
          "An unlabelled photo of a solar panel from the internet",
          "A receipt for hand tools",
        ],
        correctOption:
          "Signed test sheet recording Voc, Isc, insulation resistance, torque checks, and site photographs",
        competencyTag: "Commissioning Documentation & Compliance",
        explanation:
          "Quantified test measurements and traceable commissioning logs substantiate field competence.",
      },
    ],
  },
};

export const DEMO_CANDIDATES: CandidateAccount[] = [
  {
    id: "cand-demo-amina",
    isDemoAccount: true,
    demoLabel: "Fictional Demonstration Candidate",
    passportId: "SP-DEMO-2026-0418",
    createdAt: "2026-10-12",
    profile: {
      fullName: "Amina Al-Mansoor (Demo Profile)",
      headline: "Full-Stack Web & Civic Health Telemetry Developer",
      bio: "Fictional demonstration profile representing a displaced software engineer with 5 years of experience building resilient web tools for community clinics and humanitarian supply chains. Seeking host-country recognition of practical engineering competencies alongside partial academic documentation.",
      originCountry: "Syria",
      currentCountry: "Jordan",
      languages: ["Arabic (Native)", "English (Professional Working)"],
      targetSector: "Software Engineering & Digital Health Systems",
      avatarUrl: "/src/assets/images/demo_candidate_avatar_1795617036684.jpg",
      email: "amina.demo@skillproof.example",
      availabilityNote: "Demonstration profile — available for technical skills validation",
    },
    workExperience: [
      {
        id: "exp-demo-1",
        roleTitle: "Software Developer — Community Health Systems",
        organisation: "Al-Noor Regional Medical Logistics (Fictional Demo Org)",
        country: "Syria / Regional Remote",
        startYear: "2019",
        endYear: "2023",
        summary:
          "Built browser-based clinic stock and cold-chain temperature logging dashboards using React, TypeScript, and Node.js for 12 rural primary health centres.",
      },
    ],
    qualifications: [
      {
        id: "qual-demo-1",
        title: "Bachelor of Science in Software Engineering",
        institution: "Damascus University (Demonstration Record)",
        countryOfAward: "Syria",
        yearOfCompletion: "2018",
        qualificationLevel: "EQF Level 6 Equivalent (Unconfirmed)",
        supportingDocuments:
          "Digital copy of graduation certificate summary (Arabic); full official transcript pending certified translation.",
        missingDocumentsNote:
          "Certified official transcript and course syllabus archive are currently inaccessible due to displacement.",
        verificationStatus: "documentation-incomplete",
        isDemoData: true,
      },
    ],
    skills: [
      {
        id: "skill-demo-1",
        name: "React & TypeScript Frontend Architecture",
        category: "Frontend Engineering",
        proficiencyContext: "5 years building accessible operational dashboards and state-managed forms.",
        status: "human-assessed",
        linkedProjectIds: ["proj-demo-1"],
        linkedQualificationIds: ["qual-demo-1"],
        evidenceSummary:
          "Demonstrated in ClinicColdChain Monitor project architecture and sample assessment walkthrough.",
        lastUpdated: "2026-11-18",
        isDemoData: true,
      },
      {
        id: "skill-demo-2",
        name: "Node.js & REST API Engineering",
        category: "Backend & Systems",
        proficiencyContext: "Designing transactional endpoints, input validation, and alert ingestion services.",
        status: "evidence-submitted",
        linkedProjectIds: ["proj-demo-1"],
        linkedQualificationIds: ["qual-demo-1"],
        evidenceSummary:
          "Linked to ClinicColdChain backend telemetry API description and sample repository URL.",
        lastUpdated: "2026-11-20",
        isDemoData: true,
      },
      {
        id: "skill-demo-3",
        name: "Relational Data Modelling & Offline Sync",
        category: "Data & Persistence",
        proficiencyContext: "Schema design for clinic freezer inventory and intermittent-connectivity queueing.",
        status: "ai-suggested",
        linkedProjectIds: ["proj-demo-1"],
        linkedQualificationIds: [],
        evidenceSummary:
          "AI-suggested from project narrative; requires automated test evidence and human technical review before verification.",
        lastUpdated: "2026-11-21",
        isDemoData: true,
      },
    ],
    projects: [
      {
        id: "proj-demo-1",
        title: "ClinicColdChain — Vaccine & Solar Freezer Telemetry Monitor",
        description:
          "A lightweight web application designed for rural clinics to monitor vaccine refrigerator temperatures, track batch expiry dates, and preserve alert logs during power or internet outages.",
        problemAddressed:
          "Local clinics experienced silent vaccine spoilage when grid power dropped overnight and paper logs failed to capture cumulative temperature excursions.",
        solutionDeveloped:
          "Developed a React + TypeScript dashboard backed by a Node.js REST API and SQLite telemetry store with offline local queueing, threshold excursion alerts, and printable clinic compliance summaries.",
        technologies: ["React", "TypeScript", "Node.js", "SQLite", "Tailwind CSS"],
        roleAndContributions:
          "Lead application developer: designed the relational schema, built the frontend alert timeline and inventory views, and implemented REST sync endpoints.",
        githubUrl: "https://github.com/skillproof-demo/clinic-coldchain-monitor",
        liveDemoUrl: "https://demo-coldchain.skillproof.example",
        coverImageUrl: "/src/assets/images/demo_project_cover_1795617035329.jpg",
        skillsDemonstrated: [
          "React & TypeScript Frontend Architecture",
          "Node.js & REST API Engineering",
          "Relational Data Modelling & Offline Sync",
        ],
        completionDate: "2025-09",
        supportingEvidence:
          "Demonstration data: Architecture notes, dashboard UI screenshots, and sample repository reference (not live-fetched by SkillProof).",
        analysisStatus: "simulated-demo-analysis",
        humanAssessmentStatus: "human-assessed",
        isDemoData: true,
      },
    ],
    evidenceAnalyses: [
      {
        id: "ev-demo-1",
        skillId: "skill-demo-1",
        projectId: "proj-demo-1",
        skillName: "React & TypeScript Frontend Architecture",
        category: "Frontend Engineering",
        supportingEvidence:
          "Project: ClinicColdChain Monitor · Role: Lead application developer building alert timelines and inventory state views.",
        explanation:
          "Submitted project documentation describes structured state management, tabular telemetry views, and type-safe form workflows consistent with production React + TypeScript delivery.",
        evidenceLimitations:
          "Sample GitHub URL is demonstration data and has not been live-fetched; component test suite coverage was not independently executed.",
        recommendedAssessment: "30-minute UI architecture & accessibility walkthrough.",
        recommendedNextStep:
          "Already reviewed by demonstration human assessor; eligible for partner organisation verification.",
        analysisSource: "simulated-demo",
        assessmentStatus: "human-assessed",
        humanDecision: {
          status: "human-assessed-confirmed",
          assessorName: "Dr. Tariq Haddad (Demo Assessor)",
          assessorOrganisation: "Regional Skills Recognition Panel (Demo)",
          reviewNotes:
            "Sample review: Candidate clearly explained component separation and offline queue UI states during structured demonstration review. Not an official national licence.",
          decidedAt: "2026-11-18",
        },
      },
      {
        id: "ev-demo-2",
        skillId: "skill-demo-2",
        projectId: "proj-demo-1",
        skillName: "Node.js & REST API Engineering",
        category: "Backend & Systems",
        supportingEvidence:
          "Project: ClinicColdChain Monitor · Submitted REST sync endpoint description and sample repository link.",
        explanation:
          "Project narrative indicates practical handling of telemetry ingestion endpoints, status validation, and inventory persistence.",
        evidenceLimitations:
          "Demonstration repository contents were not automatically retrieved. No automated API integration test report or load benchmark is attached yet.",
        recommendedAssessment:
          "Complete Sample Assessment Q5 & submit API endpoint test output for human review.",
        recommendedNextStep:
          "Move to Pending Human Assessment once unit test logs or API schema documentation are added.",
        analysisSource: "simulated-demo",
        assessmentStatus: "evidence-submitted",
        humanDecision: {
          status: "pending-review",
          assessorName: "",
          assessorOrganisation: "",
          reviewNotes: "",
          decidedAt: "",
        },
      },
      {
        id: "ev-demo-3",
        skillId: "skill-demo-3",
        projectId: "proj-demo-1",
        skillName: "Relational Data Modelling & Offline Sync",
        category: "Data & Persistence",
        supportingEvidence:
          "Project: ClinicColdChain Monitor · Solution notes mentioning SQLite schema and offline queueing.",
        explanation:
          "AI-assisted interpretation suggests competency in relational schema design and intermittent-connectivity sync patterns based on submitted problem/solution statements.",
        evidenceLimitations:
          "AI-suggested only. No ER diagram, SQL migration file, or conflict-resolution test evidence is currently attached. Must NOT be treated as verified.",
        recommendedAssessment:
          "Practical schema design & conflict-resolution review with a technical assessor.",
        recommendedNextStep:
          "Attach SQL schema snippet or architecture diagram and request human assessment.",
        analysisSource: "simulated-demo",
        assessmentStatus: "ai-suggested",
        humanDecision: {
          status: "pending-review",
          assessorName: "",
          assessorOrganisation: "",
          reviewNotes: "",
          decidedAt: "",
        },
      },
    ],
    assessments: [
      {
        id: "assess-demo-1",
        title: "Sample Practical Assessment: Full-Stack Web & Data Reliability",
        domain: "Software & Civic Systems Engineering",
        completedAt: "2026-11-17",
        isSampleDemo: true,
        score: 4,
        maxScore: 5,
        status: "sample-completed",
        competencyObservations: [
          "Strong grasp of offline-first telemetry queueing, safe URL validation, and REST error status codes.",
          "Demonstrated awareness of transactional inventory concurrency patterns.",
        ],
        identifiedGaps: [
          "Automated boundary & time-window regression testing evidence is not yet documented in the project showcase.",
        ],
        answers: [
          {
            questionId: "sw-q1",
            questionPrompt: "Offline clinic telemetry persistence pattern",
            selectedOption:
              "Queue timestamped readings locally in IndexedDB/SQLite and synchronize idempotently on reconnect",
            isCorrect: true,
            competencyTag: "Offline-First Data Integrity & Sync",
          },
          {
            questionId: "sw-q2",
            questionPrompt: "Preventing lost updates in concurrent stock endpoints",
            selectedOption:
              "Use database transactions with optimistic version checks or atomic increment/decrement operations",
            isCorrect: true,
            competencyTag: "Backend Concurrency & Relational Data Modelling",
          },
          {
            questionId: "sw-q3",
            questionPrompt: "Safe rendering of external user-submitted URLs",
            selectedOption:
              "Validate that the parsed URL protocol is strictly https: or http: before rendering an anchor link",
            isCorrect: true,
            competencyTag: "Frontend Security & Input Validation",
          },
          {
            questionId: "sw-q4",
            questionPrompt: "Verifying temperature alert threshold calculations after refactoring",
            selectedOption: "Manually check the chart once in the browser after deploying to production",
            isCorrect: false,
            competencyTag: "Automated Testing & Quality Assurance",
          },
          {
            questionId: "sw-q5",
            questionPrompt: "HTTP status pattern for invalid client payloads",
            selectedOption:
              "HTTP 400 Bad Request with a structured JSON error message describing the invalid field",
            isCorrect: true,
            competencyTag: "Node.js & REST API Engineering",
          },
        ],
      },
    ],
    bridgingPathways: [
      {
        id: "bridge-demo-1",
        competencyGap: "Automated Testing & Regression Evidence (Identified in Sample Assessment & Evidence Review)",
        recommendedLearningArea: "Automated Unit & API Integration Testing (Vitest / Supertest)",
        suggestedCourse: "Practical Test-Driven Verification for Web Systems (Self-Paced Bridging Module)",
        assessmentOpportunity: "Submit documented test suite coverage alongside ClinicColdChain project for assessor sign-off",
        certificationPathway: "Recognition of Prior Learning (RPL) Technical Portfolio Endorsement (pending partner assessor review)",
        progress: "in-progress",
        referralStatus: "referral-drafted",
        notes: "Demonstration recommendation. Does not guarantee external certification or scholarship funding.",
        isDemoData: true,
      },
      {
        id: "bridge-demo-2",
        competencyGap: "Incomplete Academic Transcripts for B.Sc. Software Engineering",
        recommendedLearningArea: "Alternative Credential Reconstruction & Documentation Portfolio",
        suggestedCourse: "Host-Country Qualification Recognition Readiness Clinic",
        assessmentOpportunity: "UNESCO Qualifications Passport / Regional ENIC-NARIC Advisory Intake",
        certificationPathway: "Advisory Comparability Statement (subject to authorised national recognition body)",
        progress: "not-started",
        referralStatus: "not-requested",
        notes: "Prepared to guide credential mapping when full academic transcripts are inaccessible.",
        isDemoData: true,
      },
    ],
  },
  {
    id: "cand-demo-samuel",
    isDemoAccount: true,
    demoLabel: "Fictional Demonstration Candidate",
    passportId: "SP-DEMO-2026-0792",
    createdAt: "2026-10-28",
    profile: {
      fullName: "Samuel Ochieng (Demo Profile)",
      headline: "Off-Grid Solar Microgrid & Industrial Electrical Technician",
      bio: "Fictional demonstration profile of a displaced electrical technician with 6 years of field commissioning experience in community solar microgrids and battery inverter systems.",
      originCountry: "South Sudan",
      currentCountry: "Kenya",
      languages: ["English (Fluent)", "Swahili (Conversational)"],
      targetSector: "Renewable Energy & Electrical Trades",
      avatarUrl: "",
      email: "samuel.demo@skillproof.example",
      availabilityNote: "Pending human assessment for DC safety commissioning logs",
    },
    workExperience: [
      {
        id: "exp-sam-1",
        roleTitle: "Field Solar Technician",
        organisation: "Upper Nile Community Power Cooperative (Fictional Demo Org)",
        country: "South Sudan",
        startYear: "2020",
        endYear: "2024",
        summary: "Installed and maintained 15kW–40kW hybrid solar battery stations for community boreholes and clinics.",
      },
    ],
    qualifications: [
      {
        id: "qual-sam-1",
        title: "Diploma in Electrical Installation & Power Systems",
        institution: "Juba Technical Institute (Demonstration Record)",
        countryOfAward: "South Sudan",
        yearOfCompletion: "2019",
        qualificationLevel: "TVET Level 5 (Pending Comparability Review)",
        supportingDocuments: "Photocopy of practical trade certificate; employer reference letter attached.",
        missingDocumentsNote: "Original embossed certificate lost during relocation.",
        verificationStatus: "submitted-for-review",
        isDemoData: true,
      },
    ],
    skills: [
      {
        id: "skill-sam-1",
        name: "PV Array & Charge Controller Sizing",
        category: "Renewable Energy Systems",
        proficiencyContext: "Sized 48V MPPT systems for clinic cold-chain loads.",
        status: "pending-human-assessment",
        linkedProjectIds: ["proj-sam-1"],
        linkedQualificationIds: ["qual-sam-1"],
        evidenceSummary: "Load calculation sheets and commissioning summary submitted.",
        lastUpdated: "2026-11-19",
        isDemoData: true,
      },
      {
        id: "skill-sam-2",
        name: "DC Isolation & Field Safety",
        category: "Electrical Safety",
        proficiencyContext: "Lockout/tagout and surge protection installation.",
        status: "verified-organisation",
        linkedProjectIds: ["proj-sam-1"],
        linkedQualificationIds: ["qual-sam-1"],
        evidenceSummary: "Verified via partner TVET practical trade bench test (Demo).",
        lastUpdated: "2026-11-15",
        isDemoData: true,
      },
    ],
    projects: [
      {
        id: "proj-sam-1",
        title: "24kW Solar Borehole & Clinic Backup Microgrid Commissioning",
        description:
          "Designed and commissioned a dual-inverter 48V LiFePO4 solar microgrid powering a community water pump and health post.",
        problemAddressed: "Diesel generator fuel shortages caused frequent water pumping interruptions.",
        solutionDeveloped: "Installed 48 solar modules with coordinated DC/AC surge protection and load-priority relays.",
        technologies: ["MPPT Solar Sizing", "48V LiFePO4 BMS", "DC Surge Protection", "Single-Line Schematics"],
        roleAndContributions: "Lead installation technician responsible for string sizing, earthing tests, and commissioning logbook.",
        githubUrl: "",
        liveDemoUrl: "",
        coverImageUrl: "",
        skillsDemonstrated: ["PV Array & Charge Controller Sizing", "DC Isolation & Field Safety"],
        completionDate: "2024-11",
        supportingEvidence: "Demonstration commissioning logbook measurements (Voc, Isc, earth resistance).",
        analysisStatus: "simulated-demo-analysis",
        humanAssessmentStatus: "pending-human-assessment",
        isDemoData: true,
      },
    ],
    evidenceAnalyses: [
      {
        id: "ev-sam-1",
        skillId: "skill-sam-1",
        projectId: "proj-sam-1",
        skillName: "PV Array & Charge Controller Sizing",
        category: "Renewable Energy Systems",
        supportingEvidence: "Microgrid commissioning logbook and load calculation summary.",
        explanation: "Load calculations account for inductive pump surge current and cold-weather Voc limits.",
        evidenceLimitations: "Requires host-country licensed electrical assessor sign-off on earthing resistance values.",
        recommendedAssessment: "Practical trade calculation check & host-country wiring code review.",
        recommendedNextStep: "Awaiting assessor review in Pending Assessments queue.",
        analysisSource: "simulated-demo",
        assessmentStatus: "pending-human-assessment",
        humanDecision: {
          status: "pending-review",
          assessorName: "",
          assessorOrganisation: "",
          reviewNotes: "",
          decidedAt: "",
        },
      },
    ],
    assessments: [],
    bridgingPathways: [
      {
        id: "bridge-sam-1",
        competencyGap: "Host-Country Electrical Wiring & Licensing Code Alignment",
        recommendedLearningArea: "National Electrical Code & Grid-Tie Safety Standards",
        suggestedCourse: "TVET Bridging Orientation for Displaced Electrical Technicians",
        assessmentOpportunity: "Authorised National Trade Test Centre Practical Exam",
        certificationPathway: "Host-Country Wireman Licence Equivalency Pathway (requires authorised board exam)",
        progress: "in-progress",
        referralStatus: "pending-partner-review",
        notes: "Demonstration pathway.",
        isDemoData: true,
      },
    ],
  },
];

export function createBlankPersonalCandidate(fullName = "New Candidate"): CandidateAccount {
  const id = `cand-personal-${Date.now()}`;
  return {
    id,
    isDemoAccount: false,
    passportId: `SP-USR-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString().slice(0, 10),
    profile: {
      fullName,
      headline: "",
      bio: "",
      originCountry: "",
      currentCountry: "",
      languages: [],
      targetSector: "",
      avatarUrl: "",
      email: "",
      availabilityNote: "",
    },
    workExperience: [],
    qualifications: [],
    skills: [],
    projects: [],
    evidenceAnalyses: [],
    assessments: [],
    bridgingPathways: [],
  };
}

export const INITIAL_STATE: SkillProofState = {
  activeCandidateId: DEMO_CANDIDATES[0].id,
  candidates: DEMO_CANDIDATES,
  activeRole: "candidate",
  activeSection: "overview",
  preferSimulatedAnalysis: false,
};
