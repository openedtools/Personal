import type { Objective, Topic, Question, Resource } from '../types/schemas';

export const DOMAINS = [
  { id: 'D1', name: 'General Security Concepts', weight: 0.12 },
  { id: 'D2', name: 'Threats, Vulnerabilities, and Mitigations', weight: 0.22 },
  { id: 'D3', name: 'Security Architecture', weight: 0.18 },
  { id: 'D4', name: 'Security Operations', weight: 0.28 },
  { id: 'D5', name: 'Security Program Management and Oversight', weight: 0.20 },
];

export const OBJECTIVES: Objective[] = [
  // Domain 1
  { objective_id: 'D1.O1', domain_id: 'D1', title: 'Compare and contrast various types of security controls', weight: 0.03, tags: ['controls', 'governance'] },
  { objective_id: 'D1.O2', domain_id: 'D1', title: 'Summarize fundamental security concepts', weight: 0.03, tags: ['concepts', 'zero-trust'] },
  { objective_id: 'D1.O3', domain_id: 'D1', title: 'Explain the importance of change management processes and the impact to security', weight: 0.03, tags: ['operations', 'change-management'] },
  { objective_id: 'D1.O4', domain_id: 'D1', title: 'Explain the importance of using appropriate cryptographic solutions', weight: 0.03, tags: ['cryptography', 'pki'] },
  // Domain 2
  { objective_id: 'D2.O1', domain_id: 'D2', title: 'Compare and contrast common threat actors and motivations', weight: 0.04, tags: ['threats', 'actors'] },
  { objective_id: 'D2.O2', domain_id: 'D2', title: 'Explain common threat vectors and attack surfaces', weight: 0.04, tags: ['vectors', 'social-engineering'] },
  { objective_id: 'D2.O3', domain_id: 'D2', title: 'Explain various types of vulnerabilities', weight: 0.05, tags: ['vulnerabilities', 'cvss'] },
  { objective_id: 'D2.O4', domain_id: 'D2', title: 'Given a scenario, analyze indicators of malicious activity', weight: 0.05, tags: ['analysis', 'attacks'] },
  { objective_id: 'D2.O5', domain_id: 'D2', title: 'Explain the purpose of mitigation techniques used to secure the enterprise', weight: 0.04, tags: ['mitigations', 'hardening'] },
  // Domain 3
  { objective_id: 'D3.O1', domain_id: 'D3', title: 'Compare and contrast security implications of different architecture models', weight: 0.04, tags: ['architecture', 'cloud'] },
  { objective_id: 'D3.O2', domain_id: 'D3', title: 'Given a scenario, apply security principles to secure enterprise infrastructure', weight: 0.05, tags: ['architecture', 'network-security'] },
  { objective_id: 'D3.O3', domain_id: 'D3', title: 'Compare and contrast concepts and strategies to protect data', weight: 0.05, tags: ['data-security', 'privacy'] },
  { objective_id: 'D3.O4', domain_id: 'D3', title: 'Explain the importance of resilience and recovery in security architecture', weight: 0.04, tags: ['resilience', 'disaster-recovery'] },
  // Domain 4
  { objective_id: 'D4.O1', domain_id: 'D4', title: 'Given a scenario, apply common security techniques to computing resources', weight: 0.03, tags: ['operations', 'hardening'] },
  { objective_id: 'D4.O2', domain_id: 'D4', title: 'Explain the security implications of proper hardware, software, and data asset management', weight: 0.03, tags: ['operations', 'assets'] },
  { objective_id: 'D4.O3', domain_id: 'D4', title: 'Explain various activities associated with vulnerability management', weight: 0.03, tags: ['operations', 'patches'] },
  { objective_id: 'D4.O4', domain_id: 'D4', title: 'Explain security alerting and monitoring concepts and tools', weight: 0.03, tags: ['monitoring', 'logs'] },
  { objective_id: 'D4.O5', domain_id: 'D4', title: 'Given a scenario, modify enterprise capabilities to enhance security', weight: 0.03, tags: ['operations', 'firewalls'] },
  { objective_id: 'D4.O6', domain_id: 'D4', title: 'Given a scenario, implement and maintain identity and access management', weight: 0.04, tags: ['iam', 'mfa'] },
  { objective_id: 'D4.O7', domain_id: 'D4', title: 'Explain the importance of automation and orchestration related to secure operations', weight: 0.03, tags: ['operations', 'automation'] },
  { objective_id: 'D4.O8', domain_id: 'D4', title: 'Explain appropriate incident response activities', weight: 0.03, tags: ['incident-response', 'forensics'] },
  { objective_id: 'D4.O9', domain_id: 'D4', title: 'Given a scenario, use data sources to support an investigation', weight: 0.03, tags: ['investigation', 'logs'] },
  // Domain 5
  { objective_id: 'D5.O1', domain_id: 'D5', title: 'Summarize elements of effective security governance', weight: 0.03, tags: ['governance', 'policies'] },
  { objective_id: 'D5.O2', domain_id: 'D5', title: 'Explain elements of the risk management process', weight: 0.04, tags: ['risk', 'analysis'] },
  { objective_id: 'D5.O3', domain_id: 'D5', title: 'Explain the processes associated with third-party risk assessment and management', weight: 0.03, tags: ['risk', 'vendors'] },
  { objective_id: 'D5.O4', domain_id: 'D5', title: 'Summarize elements of effective security compliance', weight: 0.03, tags: ['compliance', 'privacy'] },
  { objective_id: 'D5.O5', domain_id: 'D5', title: 'Explain types and purposes of audits and assessments', weight: 0.03, tags: ['audits', 'penetration-testing'] },
  { objective_id: 'D5.O6', domain_id: 'D5', title: 'Given a scenario, implement security awareness practices', weight: 0.04, tags: ['awareness', 'phishing'] },
];

export const TOPICS: Topic[] = [
  { topic_id: 'D1.O1.T1', objective_id: 'D1.O1', parent_topic_id: null, official_path: '1.1 > Security Controls > Categories', title: 'Control Categories (Technical, Managerial, Operational, Physical)', tags: ['categories'] },
  { topic_id: 'D1.O1.T2', objective_id: 'D1.O1', parent_topic_id: null, official_path: '1.1 > Security Controls > Functional Types', title: 'Control Functional Types (Preventive, Detective, Corrective, Deterrent, Compensating, Directive)', tags: ['types'] },
  { topic_id: 'D1.O2.T1', objective_id: 'D1.O2', parent_topic_id: null, official_path: '1.2 > Security Concepts > CIA Triad', title: 'Confidentiality, Integrity, and Availability', tags: ['cia'] },
  { topic_id: 'D1.O2.T2', objective_id: 'D1.O2', parent_topic_id: null, official_path: '1.2 > Security Concepts > Zero Trust', title: 'Zero Trust Control Plane & Data Plane', tags: ['zero-trust'] },
  { topic_id: 'D4.O6.T1', objective_id: 'D4.O6', parent_topic_id: null, official_path: '4.6 > Identity & Access > MFA', title: 'Multifactor Authentication (Factors & Attributes)', tags: ['mfa'] },
  { topic_id: 'D4.O6.T2', objective_id: 'D4.O6', parent_topic_id: null, official_path: '4.6 > Identity & Access > SSO', title: 'Single Sign-On and Federation (SAML, OIDC)', tags: ['sso', 'saml'] },
];

export const RESOURCES: Resource[] = [
  // Domain 1.1 - Security Controls
  {
    resource_id: 'R-D1.O1-01',
    objective_id: 'D1.O1',
    type: 'video',
    title: 'Professor Messer - Security Controls (SY0-701 - 1.1)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/security-controls-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D1.O1-02',
    objective_id: 'D1.O1',
    type: 'video',
    title: 'IBM Technology - Security Controls Explained',
    url: 'https://www.youtube.com/watch?v=rl97sYwXg08',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 1.2 - Security Concepts
  {
    resource_id: 'R-D1.O2-01',
    objective_id: 'D1.O2',
    type: 'doc',
    title: 'NIST Zero Trust Architecture (SP 800-207)',
    url: 'https://csrc.nist.gov/publications/detail/sp/800-207/final',
    license_note: 'Public domain NIST publication',
    user_id: null,
  },
  {
    resource_id: 'R-D1.O2-02',
    objective_id: 'D1.O2',
    type: 'video',
    title: 'Professor Messer - Security Concepts (SY0-701 - 1.2)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/security-concepts-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D1.O2-03',
    objective_id: 'D1.O2',
    type: 'video',
    title: 'IBM Technology - What is Zero Trust Security?',
    url: 'https://www.youtube.com/watch?v=i479Y25W9p8',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  {
    resource_id: 'R-D1.O2-04',
    objective_id: 'D1.O2',
    type: 'video',
    title: 'IBM Technology - What is the CIA Triad?',
    url: 'https://www.youtube.com/watch?v=tS_yM1mO4fU',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 1.3 - Change Management
  {
    resource_id: 'R-D1.O3-01',
    objective_id: 'D1.O3',
    type: 'video',
    title: 'Professor Messer - Change Management (SY0-701 - 1.3)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/change-management-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D1.O3-02',
    objective_id: 'D1.O3',
    type: 'video',
    title: 'IBM Technology - Change Management Process Explained',
    url: 'https://www.youtube.com/watch?v=1F2b_PqFz28',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 1.4 - Cryptographic Solutions
  {
    resource_id: 'R-D1.O4-01',
    objective_id: 'D1.O4',
    type: 'video',
    title: 'Professor Messer - Cryptographic Solutions (SY0-701 - 1.4)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/cryptographic-solutions-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D1.O4-02',
    objective_id: 'D1.O4',
    type: 'video',
    title: 'IBM Technology - Symmetric vs. Asymmetric Encryption',
    url: 'https://www.youtube.com/watch?v=AQDCe585Lnc',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  {
    resource_id: 'R-D1.O4-03',
    objective_id: 'D1.O4',
    type: 'video',
    title: 'IBM Technology - What is PKI? (Public Key Infrastructure)',
    url: 'https://www.youtube.com/watch?v=A2w3P7Wv_zE',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  {
    resource_id: 'R-D1.O4-04',
    objective_id: 'D1.O4',
    type: 'video',
    title: 'IBM Technology - What is Hashing and How Does it Work?',
    url: 'https://www.youtube.com/watch?v=2BldESGZKB8',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 2.1 - Threat Actors
  {
    resource_id: 'R-D2.O1-01',
    objective_id: 'D2.O1',
    type: 'video',
    title: 'Professor Messer - Threat Actors and Motivations (SY0-701 - 2.1)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/threat-actors-and-motivations-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D2.O1-02',
    objective_id: 'D2.O1',
    type: 'video',
    title: 'IBM Technology - Cyber Threat Intelligence Explained',
    url: 'https://www.youtube.com/watch?v=28BEXlM5W9A',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 2.2 - Threat Vectors & Social Engineering
  {
    resource_id: 'R-D2.O2-01',
    objective_id: 'D2.O2',
    type: 'video',
    title: 'Professor Messer - Threat Vectors and Attack Surfaces (SY0-701 - 2.2)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/threat-vectors-and-attack-surfaces-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D2.O2-02',
    objective_id: 'D2.O2',
    type: 'video',
    title: 'IBM Technology - Social Engineering Attacks Explained',
    url: 'https://www.youtube.com/watch?v=g6Wn5w2XQ6k',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 2.3 - Vulnerabilities
  {
    resource_id: 'R-D2.O3-01',
    objective_id: 'D2.O3',
    type: 'video',
    title: 'Professor Messer - Vulnerability Types (SY0-701 - 2.3)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/vulnerability-types-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D2.O3-02',
    objective_id: 'D2.O3',
    type: 'video',
    title: 'IBM Technology - What is a Zero-Day Vulnerability?',
    url: 'https://www.youtube.com/watch?v=5r4Q4gSgH6A',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 3.1 - Architecture Models
  {
    resource_id: 'R-D3.O1-01',
    objective_id: 'D3.O1',
    type: 'video',
    title: 'Professor Messer - Cloud Models (SY0-701 - 3.1)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/cloud-models-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D3.O1-02',
    objective_id: 'D3.O1',
    type: 'video',
    title: 'IBM Technology - Cloud Shared Responsibility Model Explained',
    url: 'https://www.youtube.com/watch?v=kYOp1ZgH2mU',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 3.2 - Infrastructure Security
  {
    resource_id: 'R-D3.O2-01',
    objective_id: 'D3.O2',
    type: 'video',
    title: 'Professor Messer - Secure Infrastructure Design (SY0-701 - 3.2)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/secure-infrastructure-design-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D3.O2-02',
    objective_id: 'D3.O2',
    type: 'video',
    title: 'IBM Technology - What is a Firewall?',
    url: 'https://www.youtube.com/watch?v=3KzJ6aXv0mE',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  {
    resource_id: 'R-D3.O2-03',
    objective_id: 'D3.O2',
    type: 'video',
    title: 'IBM Technology - What is a Web Application Firewall (WAF)?',
    url: 'https://www.youtube.com/watch?v=Jm2qC4hWlDk',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 3.3 - Data Protection
  {
    resource_id: 'R-D3.O3-01',
    objective_id: 'D3.O3',
    type: 'video',
    title: 'Professor Messer - Data Protection (SY0-701 - 3.3)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/data-protection-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D3.O3-02',
    objective_id: 'D3.O3',
    type: 'video',
    title: 'IBM Technology - Data Masking vs Tokenization Explained',
    url: 'https://www.youtube.com/watch?v=yR4c2R9G1eA',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 4.6 - Identity and Access Management
  {
    resource_id: 'R-D4.O6-01',
    objective_id: 'D4.O6',
    type: 'video',
    title: 'Professor Messer - Identity and Access Management (SY0-701 - 4.6)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/identity-and-access-management-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D4.O6-02',
    objective_id: 'D4.O6',
    type: 'video',
    title: 'IBM Technology - What is Multi-Factor Authentication (MFA)?',
    url: 'https://www.youtube.com/watch?v=5rAEEH-0t4M',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  {
    resource_id: 'R-D4.O6-03',
    objective_id: 'D4.O6',
    type: 'video',
    title: 'IBM Technology - What is Single Sign-On (SSO)?',
    url: 'https://www.youtube.com/watch?v=iBhlT2wE0oU',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 5.2 - Risk Management
  {
    resource_id: 'R-D5.O2-01',
    objective_id: 'D5.O2',
    type: 'doc',
    title: 'NIST Cybersecurity Framework (CSF) 2.0',
    url: 'https://www.nist.gov/cyberframework',
    license_note: 'Public NIST cybersecurity documentation',
    user_id: null,
  },
  {
    resource_id: 'R-D5.O2-02',
    objective_id: 'D5.O2',
    type: 'video',
    title: 'Professor Messer - Risk Management (SY0-701 - 5.2)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/risk-management-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D5.O2-03',
    objective_id: 'D5.O2',
    type: 'video',
    title: 'IBM Technology - What is Risk Management?',
    url: 'https://www.youtube.com/watch?v=7uV8hG-d_4A',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
];

export const QUESTIONS: Question[] = [
  {
    question_id: 'Q-D1.O1-01',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O1',
    topic_ids: ['D1.O1.T1', 'D1.O1.T2'],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An organization places security guards at its data center entrances and requires all employees to display visual ID badges. Additionally, security locks are installed on server racks. How would you classify the security guards relative to control category and functional type?',
    choices: [
      { id: 'A', text: 'Operational category and Preventive type' },
      { id: 'B', text: 'Physical category and Preventive type' },
      { id: 'C', text: 'Managerial category and Detective type' },
      { id: 'D', text: 'Technical category and Deterrent type' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Security guards physically restrict unauthorized access to the facility, classifying them as Physical controls. Because their presence is designed to stop unauthorized access from occurring in the first place, they act functionally as a Preventive control.',
      why_not_others: {
        'A': 'While operational controls relate to human processes, physical guards are categorized under Physical security. Preventive is correct, but the category is incorrect.',
        'C': 'Managerial controls involve risk assessments, policies, and procedures, which guards are not. Detective controls detect violations after they happen, whereas guards prevent access.',
        'D': 'Technical controls utilize hardware/software systems (such as firewalls or smart cards). Security guards are human-physical assets, not technical systems.'
      }
    },
    tags: ['controls', 'physical-security', 'preventive-controls'],
    estimated_seconds: 60,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map', 'NIST Glossary'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O2-01',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O2',
    topic_ids: ['D1.O2.T2'],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'Under a Zero Trust architecture, an adaptive policy decision engine evaluates device hygiene, user role, and location telemetry before granting access to a payroll system. In which plane of the Zero Trust model does the adaptive access decision logic execute, and where is the policy enforced?',
    choices: [
      { id: 'A', text: 'Decision executes in the control plane; policy is enforced in the data plane.' },
      { id: 'B', text: 'Decision executes in the data plane; policy is enforced in the control plane.' },
      { id: 'C', text: 'Both the decision and enforcement execute entirely in the control plane.' },
      { id: 'D', text: 'Both the decision and enforcement execute entirely in the data plane.' }
    ],
    correct_answers: ['A'],
    explanation: {
      why_correct: 'In Zero Trust Architecture, the Control Plane is responsible for making policy decisions (e.g., authentication, device validation, authorization engines). The Data Plane is responsible for transferring session data and enforcing those decisions at communication boundaries (such as a gateway or agent blocking traffic).',
      why_not_others: {
        'B': 'This swaps the definitions. The control plane makes the decision; the data plane acts as the enforcement point.',
        'C': 'Enforcement must happen in the data plane where the actual packet transmission and user communication occur.',
        'D': 'The decision engine runs out-of-band in the control plane to verify identity before traffic is permitted in the data plane.'
      }
    },
    tags: ['zero-trust', 'control-plane', 'data-plane'],
    estimated_seconds: 80,
    provenance: {
      author_type: 'original',
      source_origin: ['NIST SP 800-207', 'CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O2-02',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O2',
    topic_ids: ['D1.O2.T1'],
    type: 'mcq',
    difficulty: 'easy',
    prompt: 'Which security goal of the CIA Triad is compromised when a SQL injection exploit allows an attacker to alter transactional logs inside a banking database?',
    choices: [
      { id: 'A', text: 'Confidentiality' },
      { id: 'B', text: 'Integrity' },
      { id: 'C', text: 'Availability' },
      { id: 'D', text: 'Non-repudiation' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Integrity is the preservation of data against unauthorized alteration or destruction. Modifying databases or transactional logs directly violates this security objective.',
      why_not_others: {
        'A': 'Confidentiality is violated when data is disclosed to unauthorized users, not when it is altered.',
        'C': 'Availability is compromised when resources are made inaccessible (such as a DoS attack). The logs are still accessible, just altered.',
        'D': 'Non-repudiation prevents a party from denying an action, which is related to integrity but is not one of the three legs of the CIA Triad.'
      }
    },
    tags: ['cia-triad', 'integrity'],
    estimated_seconds: 40,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O3-01',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A security engineer plans to apply a minor security patch to a critical production database server. According to change management best practices, which of the following is the MOST critical document to prepare in case the database fails to mount after patching?',
    choices: [
      { id: 'A', text: 'Vendor SLA agreement' },
      { id: 'B', text: 'Backout plan' },
      { id: 'C', text: 'Auditor approval request' },
      { id: 'D', text: 'Version control register' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A backout plan (or rollback plan) provides step-by-step instructions on how to undo a change and restore the system to its last known stable state in the event of an implementation failure.',
      why_not_others: {
        'A': 'An SLA (Service Level Agreement) dictates service times with external parties, but does not help technically restore a broken database.',
        'C': 'Approval is obtained before starting, but does not act as a technical contingency for system recovery.',
        'D': 'Version control lists the differences in files, but is not the operational rollback procedure.'
      }
    },
    tags: ['change-management', 'operations', 'backout-plan'],
    estimated_seconds: 60,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O4-01',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O4',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'An organization needs to encrypt bulk backup data before archiving it to offline tapes. The solution must provide high processing speed and minimal computational overhead for terabytes of data. Which cryptographic method should they select?',
    choices: [
      { id: 'A', text: 'Asymmetric encryption with RSA-4096' },
      { id: 'B', text: 'Symmetric encryption with AES-GCM' },
      { id: 'C', text: 'Hashing with SHA-256' },
      { id: 'D', text: 'Digital signatures using ECDSA' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Symmetric encryption algorithms (such as AES-GCM) are mathematically less intensive and significantly faster than asymmetric algorithms. This makes them ideal for bulk data encryption.',
      why_not_others: {
        'A': 'Asymmetric encryption is computationally expensive and slow, making it unviable for bulk storage encryption.',
        'C': 'SHA-256 is a hashing algorithm. Hashing is a one-way mathematical function that provides integrity verification, but does not allow data to be decrypted (confidentiality).',
        'D': 'Digital signatures are used for authenticity and non-repudiation, not for bulk data confidentiality.'
      }
    },
    tags: ['cryptography', 'symmetric-encryption', 'aes'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O4-02',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'When a user establishes an HTTPS connection to a web server, which key pair is utilized to authenticate the web server, and how is the subsequent bulk data session key established?',
    choices: [
      { id: 'A', text: 'The server authenticated via its public key; the session key is negotiated symmetrically using Diffie-Hellman or RSA key exchange.' },
      { id: 'B', text: 'The server authenticated via the client’s private key; the session key is negotiated asymmetric-only.' },
      { id: 'C', text: 'The server authenticated via a shared pre-keyed secret; the session key is generated by a third-party PKI CA.' },
      { id: 'D', text: 'The server authenticated via its private key; the session key is hardcoded in the client browser.' }
    ],
    correct_answers: ['A'],
    explanation: {
      why_correct: 'The server proves its identity using its asymmetric key pair (authenticating via certificate verification of its public key). For bulk data transfer, they negotiate a temporary symmetric session key (using Diffie-Hellman or RSA key exchange) to achieve rapid, secure transport.',
      why_not_others: {
        'B': 'The client private key is not used to authenticate the server; that would require mutual TLS (mTLS), which is not the standard browser HTTPS flow. Also, bulk data is symmetric.',
        'C': 'Session keys are negotiated dynamically between client and server, not generated or distributed by a Certificate Authority (CA).',
        'D': 'Session keys are ephemeral and unique per session; they are never static or hardcoded.'
      }
    },
    tags: ['cryptography', 'https', 'pki', 'ssl-tls'],
    estimated_seconds: 80,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D2.O1-01',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O1',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A large defense contractor detects a persistent intrusion in their network. Security researchers discover custom malware designed to exfiltrate proprietary designs of an aerospace guidance system. No ransom request is received, and the attackers demonstrate high coordination over several months. Which threat actor type fits this profile?',
    choices: [
      { id: 'A', text: 'Hacktivist' },
      { id: 'B', text: 'Script Kiddie' },
      { id: 'C', text: 'Nation-State / APT' },
      { id: 'D', text: 'Shadow IT' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'Nation-state actors (Advanced Persistent Threats) typically possess high technical sophistication, long-term persistence, and are motivated by geopolitical advantages or intellectual property theft rather than financial extortion.',
      why_not_others: {
        'A': 'Hacktivists are motivated by political or social causes, often defacing websites or leaking credentials publicly, rather than stealthy military exfiltration.',
        'B': 'Script kiddies lack high sophistication and rely on pre-compiled scripts, unable to maintain months-long stealth campaigns.',
        'D': 'Shadow IT refers to unauthorized internal hardware or software deployments, not an external threat actor exfiltrating intellectual property.'
      }
    },
    tags: ['threat-actors', 'nation-state', 'apt'],
    estimated_seconds: 60,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D2.O2-01',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O2',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'The Chief Financial Officer receives an email appearing to come from the CEO, requesting an immediate wire transfer to a new vendor for a confidential acquisition. The email domain has a slight typo (e.g., ceeo-company.com instead of ceo-company.com). Which threat vector and attack surface is this target utilizing?',
    choices: [
      { id: 'A', text: 'Supply chain vulnerability' },
      { id: 'B', text: 'Human vector via Business Email Compromise (BEC)' },
      { id: 'C', text: 'Message-based vector via Short Message Service (SMS)' },
      { id: 'D', text: 'Open service port surface' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'This is a classic Business Email Compromise (BEC) scenario, targeting executive personnel (human vector) via social engineering. The spoofed email domain is a message-based attack vector targeting human trust.',
      why_not_others: {
        'A': 'Supply chain vulnerabilities involve third-party vendor code or hardware compromises (like compromised libraries or firmware), not typosquatting emails.',
        'C': 'SMS refers to text message phishing (Smishing). This was sent via email, not phone messaging.',
        'D': 'Open service ports are technical network entry points (e.g., SSH, RDP), not domain spoofing scams targeting executives.'
      }
    },
    tags: ['social-engineering', 'phishing', 'bec'],
    estimated_seconds: 60,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D2.O3-01',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O3',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'Which metric category in the Common Vulnerability Scoring System (CVSS) represents characteristics of a vulnerability that remain constant over time and across different user environments?',
    choices: [
      { id: 'A', text: 'Temporal Metrics' },
      { id: 'B', text: 'Environmental Metrics' },
      { id: 'C', text: 'Base Metrics' },
      { id: 'D', text: 'Threat Metrics' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'Base metrics represent the intrinsic properties of a vulnerability that are constant over time and across different user environments (e.g. Exploitability metrics like attack vector/complexity, and Impact metrics like confidentiality/integrity/availability impact).',
      why_not_others: {
        'A': 'Temporal metrics (or Threat metrics in newer versions) measure properties that change over time (e.g. exploit code maturity or remediation level).',
        'B': 'Environmental metrics reflect characteristics that are specific to a particular user’s network environment (e.g. presence of mitigating controls).',
        'D': 'Threat metrics is another name for temporal characteristics in CVSS v4, which fluctuate.'
      }
    },
    tags: ['vulnerabilities', 'cvss'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['CVSS specification', 'CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D2.O4-01',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A security operations center (SOC) analyst observes multiple alerts showing high quantities of files changing extensions to ".locked" on a file share server. The server CPU utilization is spiked, and database records are no longer readable. Which indicator of malicious activity is most likely present?',
    choices: [
      { id: 'A', text: 'Distributed Denial of Service (DDoS)' },
      { id: 'B', text: 'Ransomware deployment' },
      { id: 'C', text: 'Man-in-the-Middle (MitM) sniffing' },
      { id: 'D', text: 'SQL Injection' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Spiked CPU utilization, widespread file extension alteration (e.g., to ".locked"), and unreadable database data are primary indicators of cryptographic ransomware actively encrypting files.',
      why_not_others: {
        'A': 'DDoS causes server denial of service due to traffic saturation, not file modification or encryption on disk.',
        'C': 'MitM attacks intercept traffic in transit silently and do not write to or modify local server files or CPU load.',
        'D': 'SQL injection is database command execution; while it can alter records, it does not encrypt broad filesystems or append locked file extensions.'
      }
    },
    tags: ['malware', 'indicators', 'ransomware'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D2.O5-01',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O5',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A nuclear power plant controls critical turbine systems using legacy workstation machines. These machines have no software support and are highly vulnerable to network-based buffer overflows. Which mitigation technique should be applied to prevent remote exploitation while keeping them operational?',
    choices: [
      { id: 'A', text: 'Apply continuous patching directly to the workstations' },
      { id: 'B', text: 'Deploy an endpoint-based antivirus client' },
      { id: 'C', text: 'Network air-gapping / absolute isolation' },
      { id: 'D', text: 'Enforce weak credential configuration' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'Air-gapping or absolute network isolation is a mitigation strategy that physically isolates secure networks from unsecured networks (such as the Internet or corporate LANs). Since the legacy systems cannot be patched, isolating them from network access prevents remote network exploitation.',
      why_not_others: {
        'A': 'The prompt states the systems are "legacy" and have "no software support", making patching impossible.',
        'B': 'Antivirus clients can detect local malware execution but do not block network-level exploits targeting unpatched vulnerabilities.',
        'D': 'Hardening requires strong credential configuration; weak credential configuration would worsen security.'
      }
    },
    tags: ['mitigation', 'segmentation', 'air-gap'],
    estimated_seconds: 60,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D3.O1-01',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O1',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'Under the cloud shared responsibility model, a customer deploys virtual machines running Windows Server inside an Infrastructure as a Service (IaaS) environment. Which of the following is the client\'s responsibility to secure?',
    choices: [
      { id: 'A', text: 'Physical hypervisor hosting' },
      { id: 'B', text: 'Guest operating system patches' },
      { id: 'C', text: 'Physical storage drive destruction' },
      { id: 'D', text: 'Network cabling and power delivery' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'In IaaS, the cloud provider maintains physical hardware, virtualization layers, and storage facilities. The customer is responsible for configuring and patching the guest operating systems, installing applications, and maintaining data access policies.',
      why_not_others: {
        'A': 'The hypervisor configuration is managed by the cloud provider in standard IaaS.',
        'C': 'Physical data center hardware destruction is the cloud provider\'s responsibility.',
        'D': 'Physical power and networking are managed by the hosting cloud provider.'
      }
    },
    tags: ['cloud-security', 'iaas', 'shared-responsibility'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['AWS Shared Responsibility Map', 'CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D3.O2-01',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O2',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'A security architect wants to prevent SQL injection and cross-site scripting (XSS) attacks from reaching an internal database server that hosts a public-facing e-commerce application. Where should they place a Web Application Firewall (WAF)?',
    choices: [
      { id: 'A', text: 'Directly in the screened subnet (DMZ) inline with web traffic' },
      { id: 'B', text: 'Inside the internal database segment, behind the web server' },
      { id: 'C', text: 'On the router interface connecting the company to the ISP' },
      { id: 'D', text: 'On the local host of every database administrator workstation' }
    ],
    correct_answers: ['A'],
    explanation: {
      why_correct: 'A Web Application Firewall (WAF) inspects application-layer traffic (Layer 7). Placing it inline in the screened subnet (DMZ) in front of the web servers allows it to intercept and filter HTTP/HTTPS payloads before they hit application servers and databases.',
      why_not_others: {
        'B': 'Placing it behind the web server is too late in the traffic flow; the web server itself is already exposed. WAFs are placed closer to the ingress of the web service.',
        'C': 'ISP routers handle network routing and simple IP filters, not HTTP payload inspection.',
        'D': 'Workstation firewalls protect administrators, not web application servers.'
      }
    },
    tags: ['network-security', 'waf', 'architecture'],
    estimated_seconds: 70,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D3.O3-01',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A database administrator needs to test an application using real production customer data. To protect customer privacy, they replace credit card numbers with generic characters (e.g., XXXX-XXXX-XXXX-1234). Which data protection method is this?',
    choices: [
      { id: 'A', text: 'Data Masking' },
      { id: 'B', text: 'Hashing' },
      { id: 'C', text: 'Symmetric Encryption' },
      { id: 'D', text: 'Data Minimization' }
    ],
    correct_answers: ['A'],
    explanation: {
      why_correct: 'Data masking hides sensitive data elements by replacing them with dummy characters or formatting, preserving the schema pattern for software testing without exposing actual data.',
      why_not_others: {
        'B': 'Hashing maps data to a fixed-length cryptographic hash. It does not output readable suffix numbers like "...1234".',
        'C': 'Symmetric encryption alters data into ciphertext, which can be decrypted back to plaintext. Masked data is irreversibly scrubbed.',
        'D': 'Data minimization is the governance policy of only collecting necessary data. Modifying a test environment database is data masking.'
      }
    },
    tags: ['data-protection', 'masking', 'privacy'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D3.O4-01',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A company establishes a disaster recovery target stating that systems must be restored within 4 hours of a critical outage, and they can afford to lose no more than 2 hours of transaction data. How should these metrics be labeled?',
    choices: [
      { id: 'A', text: 'RTO is 2 hours; RPO is 4 hours' },
      { id: 'B', text: 'RTO is 4 hours; RPO is 2 hours' },
      { id: 'C', text: 'MTTR is 4 hours; MTBF is 2 hours' },
      { id: 'D', text: 'RTO is 4 hours; SLA is 2 hours' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Recovery Time Objective (RTO) is the maximum acceptable duration of time to restore systems after a disaster (4 hours). Recovery Point Objective (RPO) is the maximum targeted period in which data might be lost from an outage (2 hours).',
      why_not_others: {
        'A': 'This swaps the definitions of RTO and RPO.',
        'C': 'MTTR (Mean Time to Repair) is average repair time, and MTBF (Mean Time Between Failures) is average operational time between failures. These are reliability engineering metrics, not disaster goals.',
        'D': 'An SLA is a service level contract, not the data loss tolerance (RPO).'
      }
    },
    tags: ['resilience', 'rto', 'rpo'],
    estimated_seconds: 60,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D4.O1-01',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O1',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An administrator wants to secure the enterprise wireless networks by preventing unauthorized devices from connecting via password guessing. They decide to deploy WPA3. Which cryptographic mechanism does WPA3 use to protect against offline dictionary attacks?',
    choices: [
      { id: 'A', text: 'Pre-Shared Key (PSK) 4-Way Handshake' },
      { id: 'B', text: 'Simultaneous Authentication of Equals (SAE)' },
      { id: 'C', text: 'Wired Equivalent Privacy (WEP)' },
      { id: 'D', text: 'Temporal Key Integrity Protocol (TKIP)' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'WPA3 replaces the PSK handshake with Simultaneous Authentication of Equals (SAE), which implements a secure key exchange (Dragonfly) that prevents offline dictionary attacks.',
      why_not_others: {
        'A': 'The legacy PSK 4-way handshake utilized in WPA2 is vulnerable to offline dictionary cracking if attackers capture the handshake.',
        'C': 'WEP is an obsolete, insecure wireless standard utilizing RC4 encryption.',
        'D': 'TKIP is a legacy wrapper cipher used to patch WEP, replaced by CCMP/AES.'
      }
    },
    tags: ['wireless-security', 'wpa3', 'hardening'],
    estimated_seconds: 60,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D4.O2-01',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O2',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'Which hardware disposal method uses a strong electromagnetic field to completely erase magnetic data sectors on a tape or hard disk drive before physical destruction?',
    choices: [
      { id: 'A', text: 'Pulping' },
      { id: 'B', text: 'Degaussing' },
      { id: 'C', text: 'Shedding' },
      { id: 'D', text: 'Wiping' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Degaussing exposes magnetic media (tapes and HDDs) to a powerful magnetic field, altering the magnetic alignment of data sectors and completely destroying data domains.',
      why_not_others: {
        'A': 'Pulping is a chemical process that breaks paper records down to fiber, not magnetic media.',
        'C': 'Shredding is physical cutting of drives, which is separate from electromagnetic erasure.',
        'D': 'Wiping is a software process that overwrites logical address blocks with zeroes, not electromagnetic erasure.'
      }
    },
    tags: ['disposal', 'degaussing', 'hardware-lifecycle'],
    estimated_seconds: 45,
    provenance: {
      author_type: 'original',
      source_origin: ['NIST SP 800-88', 'CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D4.O3-01',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A security team reviews vulnerability scan findings showing a high-severity vulnerability on their custom internal client portal. Further manual investigation reveals that the system is not running the flagged service, and the scanner misidentified the OS version. How should this finding be classified?',
    choices: [
      { id: 'A', text: 'True Positive' },
      { id: 'B', text: 'False Positive' },
      { id: 'C', text: 'True Negative' },
      { id: 'D', text: 'False Negative' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A false positive is an alert that indicates a vulnerability or compromise exists when, in fact, it does not. In this case, the scan flagged a vulnerability that the server did not actually possess.',
      why_not_others: {
        'A': 'A true positive is a real vulnerability that is correctly flagged by the scanner.',
        'C': 'A true negative occurs when a secure system does not have a vulnerability and is not flagged by the scanner.',
        'D': 'A false negative is a critical failure where an actual vulnerability exists but the scanner fails to detect it.'
      }
    },
    tags: ['vulnerability-management', 'analysis', 'false-positive'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D4.O4-01',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A network administrator wants to aggregate logs from network firewalls, endpoint clients, and Active Directory servers to correlate events and detect multi-stage attack paths. Which tool is best suited for this task?',
    choices: [
      { id: 'A', text: 'Network-based Intrusion Prevention System (NIPS)' },
      { id: 'B', text: 'Security Information and Event Management (SIEM)' },
      { id: 'C', text: 'File Integrity Monitoring (FIM)' },
      { id: 'D', text: 'Network Access Control (NAC)' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A SIEM (Security Information and Event Management) platform aggregates log data from diverse infrastructure assets, performs correlation, and generates security alerts.',
      why_not_others: {
        'A': 'A NIPS blocks malicious traffic in transit but does not ingest and correlate server or client directory logs.',
        'C': 'FIM is focused on auditing changes to files on disk, not correlating network logs.',
        'D': 'NAC verifies device posture before granting network access but does not act as a central event log repository.'
      }
    },
    tags: ['monitoring', 'siem', 'log-aggregation'],
    estimated_seconds: 55,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D4.O5-01',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O5',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A system administrator needs to configure an external firewall to allow incoming email traffic to the company\'s mail transfer agent (MTA). Which port and protocol must be opened?',
    choices: [
      { id: 'A', text: 'Port 22 (SSH)' },
      { id: 'B', text: 'Port 25 (SMTP)' },
      { id: 'C', text: 'Port 110 (POP3)' },
      { id: 'D', text: 'Port 443 (HTTPS)' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Port 25 is the standard network port for Simple Mail Transfer Protocol (SMTP), which is used by MTAs to route and deliver incoming mail traffic.',
      why_not_others: {
        'A': 'Port 22 is for secure shell remote access, not email transmission.',
        'C': 'Port 110 is POP3, used by clients to retrieve email from their mail server, not for incoming MTA-to-MTA transfer.',
        'D': 'Port 443 is for secure web traffic, not standard MTA routing.'
      }
    },
    tags: ['firewall-rules', 'protocols', 'smtp'],
    estimated_seconds: 40,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D4.O6-01',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O6',
    topic_ids: ['D4.O6.T2'],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'An organization is setting up Single Sign-On (SSO) to a cloud CRM application. They want authentication assertions to be signed XML payloads sent from their corporate Active Directory Identity Provider (IdP) directly to the SaaS provider (Service Provider) through the client browser. Which protocol should they select?',
    choices: [
      { id: 'A', text: 'OIDC (OpenID Connect)' },
      { id: 'B', text: 'SAML (Security Assertion Markup Language)' },
      { id: 'C', text: 'OAuth 2.0' },
      { id: 'D', text: 'RADIUS' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'SAML (Security Assertion Markup Language) is an XML-based open standard for exchanging authentication and authorization data between an Identity Provider and a Service Provider. SAML assertions are formatted as XML documents.',
      why_not_others: {
        'A': 'OIDC is a identity layer built on OAuth 2.0, utilizing JSON Web Tokens (JWT) rather than XML assertions.',
        'C': 'OAuth 2.0 is an authorization framework (utilizing API access tokens), not a federated XML identity assertion protocol.',
        'D': 'RADIUS is a legacy centralized AAA protocol, not a browser-redirect federation standard for SaaS.'
      }
    },
    tags: ['iam', 'sso', 'saml'],
    estimated_seconds: 70,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D4.O6-02',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O6',
    topic_ids: ['D4.O6.T1'],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An administrator wants to secure corporate accounts by implementing Multifactor Authentication (MFA). They require employees to use a username and password, a software authenticator token (TOTP) on their mobile device, and a fingerprint scan. Which MFA factors are represented?',
    choices: [
      { id: 'A', text: 'Something you know, something you have, and something you are.' },
      { id: 'B', text: 'Something you know, something you do, and somewhere you are.' },
      { id: 'C', text: 'Something you have, something you are, and something you do.' },
      { id: 'D', text: 'Something you know, something you are, and somewhere you are.' }
    ],
    correct_answers: ['A'],
    explanation: {
      why_correct: 'A password is "something you know" (knowledge factor). A TOTP token from an authenticator app on a physical device is "something you have" (possession factor). A fingerprint scan is "something you are" (inherence factor).',
      why_not_others: {
        'B': 'This omits the possession factor (the phone token) and incorrect factors like "something you do" (behavioral) or "somewhere you are" (geographic).',
        'C': 'This omits the password (knowledge factor).',
        'D': 'This omits the token (possession factor) and adds location.'
      }
    },
    tags: ['iam', 'mfa', 'factors'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D4.O8-01',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O8',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'During a cyber incident, a security analyst confirms that an attacker has gained access to a company workstation and is pivoting to scanning local file shares. The analyst disconnects the workstation\'s network interface card (NIC) from the network switch. Which stage of the Incident Response lifecycle is being performed?',
    choices: [
      { id: 'A', text: 'Preparation' },
      { id: 'B', text: 'Identification' },
      { id: 'C', text: 'Containment' },
      { id: 'D', text: 'Eradication' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'Containment involves isolating the compromise to prevent it from spreading or causing further damage. Disconnecting the infected workstation stops the attacker from communicating with network file shares.',
      why_not_others: {
        'A': 'Preparation focuses on setting up plans, tools, and training before an incident occurs.',
        'B': 'Identification involves detecting and diagnosing the incident (which already occurred in this scenario).',
        'D': 'Eradication involves removing the threat agent (e.g., wiping the host or deleting malware accounts) after containment.'
      }
    },
    tags: ['incident-response', 'containment', 'lifecycle'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['NIST SP 800-61', 'CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D5.O1-01',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O1',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'Which governance document is a high-level statement expressing senior leadership\'s security direction and expectations, mandating compliance across the entire organization?',
    choices: [
      { id: 'A', text: 'Procedure' },
      { id: 'B', text: 'Standard' },
      { id: 'C', text: 'Policy' },
      { id: 'D', text: 'Guideline' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'A policy is a mandatory, high-level document authorized by senior management that sets the overall security posture and rules of the enterprise.',
      why_not_others: {
        'A': 'Procedures are step-by-step instructions for executing specific actions, not high-level statements.',
        'B': 'Standards establish specific technical baselines or configurations, not general management directions.',
        'D': 'Guidelines are optional, recommended best practices rather than mandatory requirements.'
      }
    },
    tags: ['governance', 'policies'],
    estimated_seconds: 40,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D5.O2-01',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O2',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A company calculates that a flood could damage their server room, costing $100,000 in hardware replacement and lost productivity. They decide to purchase a business insurance policy that pays out $90,000 in the event of flood damage. Which risk treatment strategy is this?',
    choices: [
      { id: 'A', text: 'Risk Mitigation' },
      { id: 'B', text: 'Risk Avoidance' },
      { id: 'C', text: 'Risk Transference' },
      { id: 'D', text: 'Risk Acceptance' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'Risk transference shifts the financial impact of a risk to a third party (such as an insurance provider or vendor contract). Purchasing flood insurance is a classic transference strategy.',
      why_not_others: {
        'A': 'Risk mitigation applies security controls (such as building flood walls or installing redundant servers) to reduce the likelihood or impact.',
        'B': 'Risk avoidance eliminates the risk entirely (e.g. moving the server room to a dry region).',
        'D': 'Risk acceptance means acknowledging the risk and taking no action, bearing the entire $100,000 cost.'
      }
    },
    tags: ['risk-management', 'risk-treatment', 'insurance'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D5.O3-01',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A software company plans to host customer databases with a public cloud service provider. To guarantee the database remains accessible, the company wants to legally enforce a 99.9% uptime requirement, complete with financial credits if the provider fails to meet it. Which document must they establish?',
    choices: [
      { id: 'A', text: 'Rules of Engagement (RoE)' },
      { id: 'B', text: 'Service Level Agreement (SLA)' },
      { id: 'C', text: 'Non-Disclosure Agreement (NDA)' },
      { id: 'D', text: 'Interconnection Security Agreement (ISA)' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A Service Level Agreement (SLA) is a contract that defines performance expectations, availability metrics, and financial penalties or credits for service delivery between a client and vendor.',
      why_not_others: {
        'A': 'Rules of Engagement outline limits and scopes for security testing (like pen tests), not uptime goals.',
        'C': 'An NDA protects intellectual property and confidential information against disclosure, not availability.',
        'D': 'An ISA specifies technical security parameters for connecting two distinct networks, not general availability terms.'
      }
    },
    tags: ['vendor-management', 'sla', 'contracts'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D5.O4-01',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O4',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'Which regulatory standard specifically mandates strict security controls to protect cardholder transaction data, applying to any business that stores, processes, or transmits credit card information?',
    choices: [
      { id: 'A', text: 'GDPR' },
      { id: 'B', text: 'HIPAA' },
      { id: 'C', text: 'PCI DSS' },
      { id: 'D', text: 'FERPA' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'PCI DSS (Payment Card Industry Data Security Standard) is a set of security requirements established by card brands to ensure merchants protect credit card transaction details.',
      why_not_others: {
        'A': 'GDPR is a European regulation focused on general data privacy, not credit card transactions.',
        'B': 'HIPAA is a U.S. federal law regulating healthcare privacy and security, not payment systems.',
        'D': 'FERPA regulates student educational record privacy in the U.S.'
      }
    },
    tags: ['compliance', 'pci-dss', 'regulations'],
    estimated_seconds: 40,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D5.O5-01',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O5',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'An organization hires an independent, certified auditing firm to assess their compliance with a specific industry security standard. The audit output will be shared with investors. Which type of assessment is this?',
    choices: [
      { id: 'A', text: 'Internal Audit' },
      { id: 'B', text: 'External Audit' },
      { id: 'C', text: 'Vulnerability Scan' },
      { id: 'D', text: 'Self-Attestation' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'An external audit is conducted by an independent third-party auditor. Their report carries high credibility for external stakeholders (investors, partners, regulators) because the auditing firm has no conflict of interest.',
      why_not_others: {
        'A': 'Internal audits are conducted by employees of the firm, primarily for internal improvement, and are less credible to external investors.',
        'C': 'Vulnerability scans are technical scans, not compliance audits of controls.',
        'D': 'Self-attestation is completing a questionnaire yourself, not having an independent firm verify it.'
      }
    },
    tags: ['audits', 'compliance'],
    estimated_seconds: 45,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O1-02',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O1',
    topic_ids: ['D1.O1.T1', 'D1.O1.T2'],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An administrator configures a network firewall to block incoming traffic on port 23 (Telnet) and configures audit logging to record all blocked connection attempts. How should the firewall rule and the audit logging be classified, respectively, in terms of functional type?',
    choices: [
      { id: 'A', text: 'Firewall is Preventive; Audit logging is Detective' },
      { id: 'B', text: 'Firewall is Detective; Audit logging is Corrective' },
      { id: 'C', text: 'Firewall is Preventive; Audit logging is Compensating' },
      { id: 'D', text: 'Firewall is Deterrent; Audit logging is Preventive' }
    ],
    correct_answers: ['A'],
    explanation: {
      why_correct: 'The firewall rule actively blocks incoming traffic, preventing unauthorized connections (Preventive). Audit logs record events after they occur, enabling detection of unauthorized scan activities (Detective).',
      why_not_others: {
        'B': 'A firewall is not detective; it prevents connection. Audit logging is detective, not corrective (which resolves or restores after a breach).',
        'C': 'Audit logging detects and audits events; it is not a compensating control (which is used when a primary control is not feasible).',
        'D': 'Firewalls are technical preventive measures, not deterrents (which discourage actions using warnings or presence). Audit logs do not prevent connections directly.'
      }
    },
    tags: ['controls', 'preventive-controls', 'detective-controls', 'firewall'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O1-03',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O1',
    topic_ids: ['D1.O1.T1', 'D1.O1.T2'],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: "To comply with corporate governance policies, all newly hired developers must read and sign the company's Acceptable Use Policy (AUP) within their first week. Under which control category and functional type is this training requirement classified?",
    choices: [
      { id: 'A', text: 'Technical category and Preventive type' },
      { id: 'B', text: 'Managerial category and Directive type' },
      { id: 'C', text: 'Operational category and Compensating type' },
      { id: 'D', text: 'Physical category and Detective type' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Security policies, administrative rules, and training mandates are authored by management, placing them in the Managerial (administrative) category. Because the AUP formally instructs employees on acceptable behaviors and rules, it functions as a Directive control.',
      why_not_others: {
        'A': 'Policies are human/administrative processes, not technical controls involving software/hardware systems.',
        'C': 'While training execution can be operational, a policy mandate is primarily a Managerial control. Directive is correct, not compensating.',
        'D': 'It does not involve physical facilities or assets, nor does it detect violations (detective).'
      }
    },
    tags: ['controls', 'managerial-controls', 'directive-controls', 'policy'],
    estimated_seconds: 55,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O1-04',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O1',
    topic_ids: ['D1.O1.T2'],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'An organization operates a legacy mainframe server that hosts critical inventory databases but cannot support modern cryptographic transport protocols. To secure data in transit without altering the mainframe, the security team deploys external IPSec VPN gateways on adjacent network routers. What functional type of control does this VPN deployment represent?',
    choices: [
      { id: 'A', text: 'Detective control' },
      { id: 'B', text: 'Deterrent control' },
      { id: 'C', text: 'Compensating control' },
      { id: 'D', text: 'Directive control' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'A compensating control is a security measure deployed to mitigate a vulnerability when standard security controls are not technically feasible or viable (in this case, encrypting traffic directly on the legacy server). The external IPSec gateway provides the required encryption capability, compensating for the host\'s lack of support.',
      why_not_others: {
        'A': 'Detective controls identify breaches or logs after they happen, whereas VPN gateways encrypt/secure connections to prevent exposure.',
        'B': 'Deterrent controls discourage attackers (e.g. warning signs), they do not mitigate key hardware constraints.',
        'D': 'Directive controls instruct human behavior (policies), rather than implementing technical network setups.'
      }
    },
    tags: ['controls', 'compensating-controls', 'vpn'],
    estimated_seconds: 60,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O2-03',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O2',
    topic_ids: ['D1.O2.T1'],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'A company implements a digital signature system for outbound purchase orders. By encrypting a cryptographic hash of the order document with the sender\'s private key, the system ensures that the sender cannot later deny having authorized the transaction. Which core security concept does this design satisfy?',
    choices: [
      { id: 'A', text: 'Confidentiality' },
      { id: 'B', text: 'Availability' },
      { id: 'C', text: 'Non-repudiation' },
      { id: 'D', text: 'Least Privilege' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'Non-repudiation ensures that a party to a transaction or communication cannot deny the authenticity of their signature or sending the message. Digital signatures achieve this by binding the sender\'s private key to the signature, which can be verified by anyone using their public key.',
      why_not_others: {
        'A': 'Confidentiality prevents unauthorized disclosure of data, which signatures do not achieve on their own (the hash signature is public/verifiable).',
        'B': 'Availability ensures systems remain functional and accessible, not that users cannot deny their actions.',
        'D': 'Least privilege restricts account permissions, which is unrelated to verifying transacting identity.'
      }
    },
    tags: ['concepts', 'non-repudiation', 'cryptography'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O2-04',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O2',
    topic_ids: ['D1.O2.T2'],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'Under a Zero Trust Architecture (ZTA), which statement best describes the fundamental guiding principle of microsegmentation?',
    choices: [
      { id: 'A', text: 'Creating a single large demilitarized zone (DMZ) for all public web services.' },
      { id: 'B', text: 'Dividing the network into small, isolated security zones to restrict lateral movement.' },
      { id: 'C', text: 'Enforcing complex password rules at the domain controller layer.' },
      { id: 'D', text: 'Deploying host-based intrusion prevention systems on remote laptops.' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Microsegmentation divides network zones into distinct, granular compartments (workloads, servers, or subnets) with unique security policies. This restricts an attacker\'s ability to move laterally across the network if they compromise a single device, reinforcing Zero Trust principles.',
      why_not_others: {
        'A': 'A single large DMZ is a perimeter-focused strategy, which goes against ZTA\'s goal of breaking down trust boundaries inside the perimeter.',
        'C': 'Password rules are IAM password strength policies, not network architectural segmentation.',
        'D': 'HIPS protects endpoints, which is a host security control, not microsegmentation of networks.'
      }
    },
    tags: ['concepts', 'zero-trust', 'microsegmentation'],
    estimated_seconds: 55,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O3-02',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A systems administrator wants to apply a major firmware update to the company\'s core network switches. Before implementing the change, they present the plan to a group of stakeholders responsible for evaluating risk, scheduling alignment, and operational impact. What is the name of this governing group?',
    choices: [
      { id: 'A', text: 'Incident Response Team (IRT)' },
      { id: 'B', text: 'Disaster Recovery Board (DRB)' },
      { id: 'C', text: 'Change Advisory Board (CAB)' },
      { id: 'D', text: 'Software Quality Assurance (SQA) team' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'The Change Advisory Board (CAB) is a cross-functional group of stakeholders that reviews, evaluates, and approves major changes. Their role is to assess risks, coordinate timelines, and ensure a stable backout plan is in place to minimize operational disruption.',
      why_not_others: {
        'A': 'The IRT handles post-incident mitigation, not pre-planned system upgrades.',
        'B': 'The Disaster Recovery Board activates systems in the event of an outage; they do not handle business-as-usual changes.',
        'D': 'SQA validates software code metrics, they do not manage core organizational network switches change control.'
      }
    },
    tags: ['change-management', 'operations', 'cab'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O3-03',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'To ensure that a newly developed security patch does not break existing database applications or degrade transaction processing speeds, where should the patch first be deployed and tested according to change management standards?',
    choices: [
      { id: 'A', text: 'Production database server during standard business hours' },
      { id: 'B', text: 'A designated sandbox or staging environment mirroring production' },
      { id: 'C', text: 'Directly to the client workstations via automated scripting' },
      { id: 'D', text: 'The primary domain controller to test authentication impact' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Changes should always be tested in a sandbox, staging, or user acceptance testing (UAT) environment that closely mirrors production. This allows verification of application compatibility, security behavior, and performance without risking downtime on live systems.',
      why_not_others: {
        'A': 'Deploying straight to production databases without sandbox testing violates change control policies and risks critical database crashes.',
        'C': 'Client workstations are endpoints, not database application servers. Patching them does not validate server databases.',
        'D': 'The domain controller handles user authentications (Active Directory), not database transactional speeds.'
      }
    },
    tags: ['change-management', 'operations', 'testing'],
    estimated_seconds: 50,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O4-03',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O4',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'An application developer needs to securely store user credentials in a local authentication database. To defend against offline dictionary and rainbow table cracking attacks, which of the following techniques should they implement alongside a cryptographic hashing algorithm?',
    choices: [
      { id: 'A', text: 'Diffie-Hellman Key Exchange' },
      { id: 'B', text: 'Adding a unique, random salt to each password before hashing' },
      { id: 'C', text: 'Digital signatures using the developer\'s private key' },
      { id: 'D', text: 'Encrypting the database file with asymmetric RSA' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Salting is the process of appending a unique, random value (a salt) to a plaintext password before hashing it. This ensures that identical passwords yield different hashes, preventing attackers from using precomputed hashes (rainbow tables) to crack passwords offline.',
      why_not_others: {
        'A': 'Diffie-Hellman is a session key agreement protocol for data in transit; it is not used to store credentials at rest.',
        'C': 'Digital signatures verify authenticity, not hash storage security against brute forcing.',
        'D': 'Asymmetric RSA is slow and unsuited for database storage encryption. Hashing is the correct password verification standard.'
      }
    },
    tags: ['cryptography', 'passwords', 'salting', 'hashing'],
    estimated_seconds: 55,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  },
  {
    question_id: 'Q-D1.O4-04',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'A client web browser connects to a banking portal and needs to instantly verify if the server\'s SSL/TLS certificate was revoked this morning. Which protocol or check provides the most real-time verification of certificate revocation status without downloading a large document?',
    choices: [
      { id: 'A', text: 'Certificate Revocation List (CRL)' },
      { id: 'B', text: 'Online Certificate Status Protocol (OCSP)' },
      { id: 'C', text: 'Certificate Signing Request (CSR)' },
      { id: 'D', text: 'Diffie-Hellman Key Exchange' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'OCSP (Online Certificate Status Protocol) allows a client to query a Certificate Authority\'s database in real time for the revocation status of a single certificate. This is much faster and uses less bandwidth than downloading an entire Certificate Revocation List (CRL).',
      why_not_others: {
        'A': 'A CRL requires downloading the entire list of revoked certificates, which is not real-time and consumes substantial bandwidth.',
        'C': 'A CSR is created by a server to request a certificate from a CA; it is not a verification check.',
        'D': 'Diffie-Hellman negotiates key pairs; it does not contain certificate authentication or revocation checks.'
      }
    },
    tags: ['cryptography', 'pki', 'ocsp', 'certificates'],
    estimated_seconds: 60,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  }
];
