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
  // Domain 2.4 - Indicators of Malicious Activity
  {
    resource_id: 'R-D2.O4-01',
    objective_id: 'D2.O4',
    type: 'video',
    title: 'Professor Messer - Indicators of Malicious Activity (SY0-701 - 2.4)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/indicators-of-malicious-activity-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D2.O4-02',
    objective_id: 'D2.O4',
    type: 'video',
    title: 'IBM Technology - Indicators of Compromise (IoC) Explained',
    url: 'https://www.youtube.com/watch?v=8V4V9vH9oM8',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 2.5 - Mitigation Techniques
  {
    resource_id: 'R-D2.O5-01',
    objective_id: 'D2.O5',
    type: 'video',
    title: 'Professor Messer - Mitigation Techniques (SY0-701 - 2.5)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/mitigation-techniques-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D2.O5-02',
    objective_id: 'D2.O5',
    type: 'video',
    title: 'IBM Technology - Cybersecurity Mitigations Explained',
    url: 'https://www.youtube.com/watch?v=F03r21t1p9g',
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
  // Domain 3.4 - Resilience and Recovery
  {
    resource_id: 'R-D3.O4-01',
    objective_id: 'D3.O4',
    type: 'video',
    title: 'Professor Messer - Resilience and Recovery (SY0-701 - 3.4)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/resilience-and-recovery-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D3.O4-02',
    objective_id: 'D3.O4',
    type: 'video',
    title: 'IBM Technology - Disaster Recovery vs Backup vs High Availability',
    url: 'https://www.youtube.com/watch?v=lT24zQ8nQ5Y',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 4.1 - Computing hardening
  {
    resource_id: 'R-D4.O1-01',
    objective_id: 'D4.O1',
    type: 'video',
    title: 'Professor Messer - Securing Systems (SY0-701 - 4.1)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/securing-systems-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D4.O1-02',
    objective_id: 'D4.O1',
    type: 'video',
    title: 'IBM Technology - System Hardening Security Best Practices Explained',
    url: 'https://www.youtube.com/watch?v=F03r21t1p9g',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 4.2 - Asset Management
  {
    resource_id: 'R-D4.O2-01',
    objective_id: 'D4.O2',
    type: 'video',
    title: 'Professor Messer - Hardware and Software Asset Management (SY0-701 - 4.2)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/hardware-and-software-asset-management-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D4.O2-02',
    objective_id: 'D4.O2',
    type: 'video',
    title: 'IBM Technology - What is IT Asset Management (ITAM)?',
    url: 'https://www.youtube.com/watch?v=W-L6P6sR27I',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 4.3 - Vulnerability Management
  {
    resource_id: 'R-D4.O3-01',
    objective_id: 'D4.O3',
    type: 'video',
    title: 'Professor Messer - Vulnerability Management (SY0-701 - 4.3)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/vulnerability-management-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D4.O3-02',
    objective_id: 'D4.O3',
    type: 'video',
    title: 'IBM Technology - Vulnerability Scanning vs. Penetration Testing',
    url: 'https://www.youtube.com/watch?v=m7H0D_T3zEE',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 4.4 - Alerting and Monitoring
  {
    resource_id: 'R-D4.O4-01',
    objective_id: 'D4.O4',
    type: 'video',
    title: 'Professor Messer - Alerting and Monitoring (SY0-701 - 4.4)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/alerting-and-monitoring-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D4.O4-02',
    objective_id: 'D4.O4',
    type: 'video',
    title: 'IBM Technology - Security Alerting & Monitoring Concepts Explained',
    url: 'https://www.youtube.com/watch?v=hBwz4p23a0I',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 4.5 - Firewalls & Capabilities
  {
    resource_id: 'R-D4.O5-01',
    objective_id: 'D4.O5',
    type: 'video',
    title: 'Professor Messer - Network Security Capabilities (SY0-701 - 4.5)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/network-security-capabilities-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D4.O5-02',
    objective_id: 'D4.O5',
    type: 'video',
    title: 'IBM Technology - Intrusion Detection vs. Intrusion Prevention Systems (IDS/IPS)',
    url: 'https://www.youtube.com/watch?v=L-3f_D1l9G0',
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
  // Domain 4.7 - Security Automation
  {
    resource_id: 'R-D4.O7-01',
    objective_id: 'D4.O7',
    type: 'video',
    title: 'Professor Messer - Security Automation (SY0-701 - 4.7)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/security-automation-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D4.O7-02',
    objective_id: 'D4.O7',
    type: 'video',
    title: 'IBM Technology - SOAR Explained (Security Orchestration, Automation, and Response)',
    url: 'https://www.youtube.com/watch?v=1F2b_PqFz28',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 4.8 - Incident Response
  {
    resource_id: 'R-D4.O8-01',
    objective_id: 'D4.O8',
    type: 'video',
    title: 'Professor Messer - Incident Response Activities (SY0-701 - 4.8)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/incident-response-activities-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D4.O8-02',
    objective_id: 'D4.O8',
    type: 'video',
    title: 'IBM Technology - What is Incident Response?',
    url: 'https://www.youtube.com/watch?v=n7bXy7Z0I8M',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 4.9 - Investigations
  {
    resource_id: 'R-D4.O9-01',
    objective_id: 'D4.O9',
    type: 'video',
    title: 'Professor Messer - Data Sources and Investigations (SY0-701 - 4.9)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/data-sources-and-investigations-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D4.O9-02',
    objective_id: 'D4.O9',
    type: 'video',
    title: 'IBM Technology - Computer Forensics and Log Analysis Explained',
    url: 'https://www.youtube.com/watch?v=8V4V9vH9oM8',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 5.1 - Governance / Policies
  {
    resource_id: 'R-D5.O1-01',
    objective_id: 'D5.O1',
    type: 'video',
    title: 'Professor Messer - Security Governance (SY0-701 - 5.1)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/security-governance-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D5.O1-02',
    objective_id: 'D5.O1',
    type: 'video',
    title: 'IBM Technology - IT Governance Explained',
    url: 'https://www.youtube.com/watch?v=7uV8hG-d_4A',
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
  // Domain 5.3 - Third-Party Risk Management
  {
    resource_id: 'R-D5.O3-01',
    objective_id: 'D5.O3',
    type: 'video',
    title: 'Professor Messer - Third-Party Risk Management (SY0-701 - 5.3)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/third-party-risk-management-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D5.O3-02',
    objective_id: 'D5.O3',
    type: 'video',
    title: 'IBM Technology - Third-Party Risk Management (TPRM) Explained',
    url: 'https://www.youtube.com/watch?v=o6Z-H60rV9U',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 5.4 - Security Compliance
  {
    resource_id: 'R-D5.O4-01',
    objective_id: 'D5.O4',
    type: 'video',
    title: 'Professor Messer - Security Compliance (SY0-701 - 5.4)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/security-compliance-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D5.O4-02',
    objective_id: 'D5.O4',
    type: 'video',
    title: 'IBM Technology - Compliance Controls Explained',
    url: 'https://www.youtube.com/watch?v=9g0Q_eU7Q0M',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 5.5 - Audits and Assessments
  {
    resource_id: 'R-D5.O5-01',
    objective_id: 'D5.O5',
    type: 'video',
    title: 'Professor Messer - Audits and Assessments (SY0-701 - 5.5)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/audits-and-assessments-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D5.O5-02',
    objective_id: 'D5.O5',
    type: 'video',
    title: 'IBM Technology - Security Auditing vs. Compliance Assessment',
    url: 'https://www.youtube.com/watch?v=o6Z-H60rV9U',
    license_note: 'Free IBM YouTube resource',
    user_id: null,
  },
  // Domain 5.6 - Awareness Practices
  {
    resource_id: 'R-D5.O6-01',
    objective_id: 'D5.O6',
    type: 'video',
    title: 'Professor Messer - Security Awareness Practices (SY0-701 - 5.6)',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/security-awareness-practices-sy0-701/',
    license_note: 'Free educational link',
    user_id: null,
  },
  {
    resource_id: 'R-D5.O6-02',
    objective_id: 'D5.O6',
    type: 'video',
    title: 'IBM Technology - Phishing and Security Awareness Training',
    url: 'https://www.youtube.com/watch?v=g6Wn5w2XQ6k',
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
,
  {
    question_id: 'Q-D2.O1-02',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O1',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An analyst detects highly sophisticated, stealthy network intrusion traffic that has persisted for over six months. The attack utilizes zero-day exploits and custom malware to exfiltrate proprietary aerospace designs. Which threat actor is MOST likely responsible for this activity?',
    choices: [
      { id: 'A', text: 'Script Kiddies' },
      { id: 'B', text: 'Hacktivists' },
      { id: 'C', text: 'Nation-state / APT (Advanced Persistent Threat)' },
      { id: 'D', text: 'Key Employees' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'Nation-state actors or Advanced Persistent Threats (APTs) are highly funded, sophisticated groups targeting strategic assets (e.g., aerospace designs) over long periods using advanced tools like zero-day exploits.',
      why_not_others: {
        'A': 'Script kiddies lack the sophistication, funding, and persistence to utilize zero-day exploits or maintain access for six months.',
        'B': 'Hacktivists are typically motivated by ideology and public disruption, rather than long-term espionage and IP theft.',
        'D': 'While an insider has access, the description of advanced external command/control and zero-day exploits points to external nation-state groups.'
      }
    },
    tags: ['threat-actors', 'apt', 'nation-state'],
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
    question_id: 'Q-D2.O1-03',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O1',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A major petrochemical firm\'s public web page is defaced with messaging protesting oil pipeline construction. The attack did not steal customer data but caused significant reputational damage. What is the primary motivation and classification of this threat actor?',
    choices: [
      { id: 'A', text: 'Financial gain by Organized Crime' },
      { id: 'B', text: 'Ideological protest by Hacktivists' },
      { id: 'C', text: 'Market competition by Competitor intelligence' },
      { id: 'D', text: 'Revenge by a disgruntled Insider' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Hacktivists are motivated by political, social, or environmental ideologies. Defacing a website to protest pipeline construction fits this profile perfectly.',
      why_not_others: {
        'A': 'Organized crime focuses on financial profit (ransomware, credit card theft), not public political statements.',
        'C': 'Competitors seek proprietary trade secrets, not noisy public website defacements.',
        'D': 'Insiders typically retaliate by breaking internal systems or leaking data, rather than activist website defacement.'
      }
    },
    tags: ['threat-actors', 'hacktivism', 'motivation'],
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
    question_id: 'Q-D2.O1-04',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O1',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An administrator discovers that system log backups were manually purged from an admin terminal outside of business hours. Forensic analysis reveals the commands were executed using the valid credentials of a database administrator who was recently passed over for a promotion. How should this threat actor be classified?',
    choices: [
      { id: 'A', text: 'External competitor' },
      { id: 'B', text: 'Insider threat' },
      { id: 'C', text: 'Shadow IT agent' },
      { id: 'D', text: 'State-sponsored actor' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'An insider threat is an employee or contractor with authorized credentials who uses their access to cause harm (intentional or unintentional). A disgruntled administrator fits this definition.',
      why_not_others: {
        'A': 'An external competitor does not have legitimate corporate credentials unless they stole them, but the DBA\'s internal status makes them an insider.',
        'C': 'Shadow IT refers to using unauthorized hardware/software, not malicious DBA actions.',
        'D': 'State-sponsored groups act on behalf of foreign governments, not personal career grievances.'
      }
    },
    tags: ['threat-actors', 'insider-threat', 'motivation'],
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
    question_id: 'Q-D2.O2-02',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O2',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An executive receives a phone call from an individual claiming to be a network operations manager from corporate headquarters. The caller claims there is a high-priority database sync issue and requests the executive verify their login password over the phone. Which vector is being utilized?',
    choices: [
      { id: 'A', text: 'Phishing' },
      { id: 'B', text: 'Smishing' },
      { id: 'C', text: 'Vishing' },
      { id: 'D', text: 'Spear phishing' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'Vishing (voice phishing) uses telephone calls to execute social engineering attacks, impersonating authority figures to extract credentials.',
      why_not_others: {
        'A': 'Phishing is a general term, but usually implies email-based attacks.',
        'B': 'Smishing uses SMS text messages, not direct phone calls.',
        'D': 'Spear phishing targets specific individuals via email, whereas this is a voice-based attack.'
      }
    },
    tags: ['vectors', 'social-engineering', 'vishing'],
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
    question_id: 'Q-D2.O2-03',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O2',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A security engineer conducts a footprinting exercise and finds an exposed public cloud object storage bucket containing raw client databases. The bucket\'s access policies were configured to allow \'AllUsers\' read access. Which of the following best describes this component of the organization\'s attack surface?',
    choices: [
      { id: 'A', text: 'Supply chain threat vector' },
      { id: 'B', text: 'Cloud-based asset misconfiguration' },
      { id: 'C', text: 'Hardware vulnerability' },
      { id: 'D', text: 'Watering hole attack vector' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Cloud object storage buckets exposed to the public via excessive permissions represent a critical cloud-based asset misconfiguration, widening the organization\'s attack surface.',
      why_not_others: {
        'A': 'Supply chain attacks compromise vendors or upstream components, not direct cloud configurations.',
        'C': 'This is a software/governance configuration issue, not a physical hardware vulnerability.',
        'D': 'Watering hole attacks compromise websites frequented by targets to infect client browsers, which is not what occurred here.'
      }
    },
    tags: ['vectors', 'attack-surface', 'cloud-security'],
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
    question_id: 'Q-D2.O2-04',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O2',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'An attacker targets a defense contractor by identifying a local restaurant website where employees frequently order lunch. The attacker compromises the restaurant\'s web server and embeds exploit scripts that execute on client browsers when employees load the menu. What is the name of this attack vector?',
    choices: [
      { id: 'A', text: 'Man-in-the-Middle (MitM)' },
      { id: 'B', text: 'Watering hole attack' },
      { id: 'C', text: 'Direct access vector' },
      { id: 'D', text: 'Domain hijacking' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A watering hole attack compromises a third-party website frequently visited by a specific target group to infect their devices via drive-by downloads or browser exploits.',
      why_not_others: {
        'A': 'MitM intercepts traffic between two hosts, whereas a watering hole compromises the server of a site they browse.',
        'C': 'Direct access involves physical or direct logical connection to targeted endpoints.',
        'D': 'Domain hijacking changes DNS registrar information, which is not described here.'
      }
    },
    tags: ['vectors', 'social-engineering', 'watering-hole'],
    estimated_seconds: 65,
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
    question_id: 'Q-D2.O3-02',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A developer writes a C++ program that accepts user input into a static character array buffer without checking if the input length exceeds the buffer boundaries. When a tester enters a string that is twice the buffer size, the application crashes and overwrites adjacent memory addresses. What type of vulnerability exists?',
    choices: [
      { id: 'A', text: 'SQL Injection (SQLi)' },
      { id: 'B', text: 'Cross-Site Scripting (XSS)' },
      { id: 'C', text: 'Buffer Overflow' },
      { id: 'D', text: 'Directory Traversal' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'A buffer overflow occurs when an application writes more data to a buffer than it can hold, causing it to overwrite adjacent memory space, which can lead to system crashes or remote code execution.',
      why_not_others: {
        'A': 'SQLi injects database query commands, not memory buffers.',
        'B': 'XSS runs scripts on web browsers, not memory exploits on standalone binary assets.',
        'D': 'Directory traversal accesses unauthorized files by manipulating file paths.'
      }
    },
    tags: ['vulnerabilities', 'buffer-overflow', 'software-security'],
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
    question_id: 'Q-D2.O3-03',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O3',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'hard',
    prompt: 'A software bug occurs when a multi-threaded application processes a check-for-balance and a withdraw-funds task simultaneously on the same account, allowing a user to withdraw more money than they have because the state check finished before the withdraw task completed. What type of software vulnerability is this?',
    choices: [
      { id: 'A', text: 'Integer Overflow' },
      { id: 'B', text: 'Race Condition (TOCTTOU)' },
      { id: 'C', text: 'DLL Injection' },
      { id: 'D', text: 'Memory Leak' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A race condition (or Time-of-Check to Time-of-Use - TOCTTOU) occurs when the security behavior of a system depends on the execution sequence or timing of concurrent threads or processes.',
      why_not_others: {
        'A': 'Integer overflow occurs when an arithmetic operation exceeds the maximum size of the integer type.',
        'C': 'DLL Injection is an exploit injection technique to run custom code inside another process space.',
        'D': 'A memory leak fails to release allocated memory blocks, leading to resource depletion.'
      }
    },
    tags: ['vulnerabilities', 'race-condition', 'software-security'],
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
    question_id: 'Q-D2.O3-04',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'easy',
    prompt: 'A company deploys new internet-facing network routers. During an audit, the security team connects to the routers\' web administration portal and successfully logs in using the username \'admin\' and password \'admin\'. What category of vulnerability does this represent?',
    choices: [
      { id: 'A', text: 'Zero-day vulnerability' },
      { id: 'B', text: 'Default credentials / Misconfiguration' },
      { id: 'C', text: 'Injection flaw' },
      { id: 'D', text: 'Hardware Trojan' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Leaving default factory credentials active is a critical security misconfiguration vulnerability, allowing easy unauthorized access to network appliances.',
      why_not_others: {
        'A': 'Zero-day vulnerabilities are unknown to vendors; default credentials are known but simply left unchanged.',
        'C': 'Injection flaws relate to parsing unsanitized input commands (SQL, OS commands).',
        'D': 'Hardware Trojans are malicious modifications of physical circuits.'
      }
    },
    tags: ['vulnerabilities', 'misconfiguration', 'default-credentials'],
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
    question_id: 'Q-D2.O4-02',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A network monitor logs an unusual baseline shift: during off-hours, a database server initiates outbound encrypted SSL connections to a public IP address, transferring 50 GB of data. How should the analyst classify this indicator of compromise?',
    choices: [
      { id: 'A', text: 'Buffer overflow attack' },
      { id: 'B', text: 'Data exfiltration / beaconing' },
      { id: 'C', text: 'SQL Injection attempt' },
      { id: 'D', text: 'Rogue DHCP activity' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Unusual outbound data transfer (50 GB) during off-hours from a database server is a high-signal indicator of data exfiltration and potential command-and-control beaconing.',
      why_not_others: {
        'A': 'A buffer overflow causes crashes or shell spawns, not standard bulk data uploads.',
        'C': 'SQL Injection occurs on inbound traffic to query the DB, not outbound bulk data connections.',
        'D': 'Rogue DHCP servers dynamically assign IPs locally, they do not push data out over SSL.'
      }
    },
    tags: ['indicators', 'data-exfiltration', 'beaconing'],
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
    question_id: 'Q-D2.O4-03',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An administrator reviews event logs showing thousands of failed login attempts for different user accounts coming from a single IP address in a short time frame, followed by one successful login. What type of activity is indicated?',
    choices: [
      { id: 'A', text: 'DDoS attack' },
      { id: 'B', text: 'Credential stuffing / Brute-force attack' },
      { id: 'C', text: 'ARP poisoning' },
      { id: 'D', text: 'Privilege escalation' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Rapid failed logins for multiple accounts followed by a success indicate brute-force or credential stuffing (trying lists of stolen credentials), which succeeded in compromising an account.',
      why_not_others: {
        'A': 'DDoS aims to exhaust service availability, not log in successfully.',
        'C': 'ARP poisoning modifies local MAC address routing tables.',
        'D': 'Privilege escalation occurs *after* login, when a low-privilege user tries to gain admin rights.'
      }
    },
    tags: ['indicators', 'brute-force', 'credential-stuffing'],
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
    question_id: 'Q-D2.O4-04',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'A system administrator receives an alert from a File Integrity Monitoring (FIM) agent on a critical domain controller. The log indicates that the \'ntoskrnl.exe\' binary signature was modified. How should the administrator interpret this indicator?',
    choices: [
      { id: 'A', text: 'Normal automated patch update' },
      { id: 'B', text: 'Potential rootkit installation or system file modification' },
      { id: 'C', text: 'DNS cache poisoning indicator' },
      { id: 'D', text: 'SQL injection exploit on the server' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Modifying critical operating system kernel files like ntoskrnl.exe is a classic indicator of a rootkit installation, attempting to subvert OS calls at a low level.',
      why_not_others: {
        'A': 'While patches modify binaries, a FIM alert for key boot files should always be treated as anomalous/malicious until verified by patch schedules.',
        'C': 'DNS cache poisoning targets name resolution caches, not local system kernel binaries.',
        'D': 'SQL injection targets SQL databases, not core operating system kernel executable files.'
      }
    },
    tags: ['indicators', 'fim', 'rootkits'],
    estimated_seconds: 65,
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
    question_id: 'Q-D2.O5-02',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O5',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An organization wants to prevent users from executing unauthorized utility software (such as torrent clients or third-party web browsers) downloaded from the internet. Which hardening technique is MOST effective?',
    choices: [
      { id: 'A', text: 'Host-based firewalls' },
      { id: 'B', text: 'Application Allowlisting (Control)' },
      { id: 'C', text: 'Anti-virus software definitions' },
      { id: 'D', text: 'File system permissions (NTFS)' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Application Allowlisting (or control) ensures that only explicitly approved executable files are permitted to run on the endpoint, blocking all others by default.',
      why_not_others: {
        'A': 'Host firewalls block network ports, not local execution of programs.',
        'C': 'Anti-virus detects signature-matched malware, not benign but unauthorized tools (like uTorrent or Chrome).',
        'D': 'NTFS permissions regulate file read/write access, but allowlisting is the proper policy enforcement tool for execution controls.'
      }
    },
    tags: ['mitigations', 'allowlisting', 'hardening'],
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
    question_id: 'Q-D2.O5-03',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O5',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'To mitigate vulnerabilities, a security administrator disables default guest accounts, closes unused TCP ports, and enforces cryptographic session parameters on all servers. What is the name of this overall security practice?',
    choices: [
      { id: 'A', text: 'Patching' },
      { id: 'B', text: 'System Hardening' },
      { id: 'C', text: 'Intrusion Detection' },
      { id: 'D', text: 'Input Validation' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'System Hardening is the process of reducing an asset\'s attack surface by eliminating unnecessary accounts, interfaces, protocols, and services, and configuring security settings correctly.',
      why_not_others: {
        'A': 'Patching is applying software code fixes, which is just one part of the broader hardening process.',
        'C': 'Intrusion detection finds attacks; it does not harden the configurations to prevent them.',
        'D': 'Input validation is a secure coding practice, not system configuration changes.'
      }
    },
    tags: ['mitigations', 'hardening', 'attack-surface'],
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
    question_id: 'Q-D2.O5-04',
    exam_version: 'SY0-701',
    domain_id: 'D2',
    objective_id: 'D2.O5',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'An enterprise wants to isolate its payment processing database so that if a corporate office workstation is compromised by ransomware, the infection cannot easily traverse and compromise the financial database. Which architectural mitigation is best?',
    choices: [
      { id: 'A', text: 'Vulnerability scanning' },
      { id: 'B', text: 'Network Segmentation' },
      { id: 'C', text: 'Deploying EPP agents' },
      { id: 'D', text: 'Implementing Single Sign-On' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Network Segmentation divides a network into smaller sub-networks (using VLANs and firewalls). This limits lateral movement of malware (like ransomware) from less-secure zones to high-security zones.',
      why_not_others: {
        'A': 'Scanning identifies holes, but does not actively isolate systems from lateral traffic.',
        'C': 'EPP (Endpoint Protection Platforms) helps secure endpoints, but network routing filters are the correct barrier to prevent traversal.',
        'D': 'Single Sign-On centralizes credentials, which does not prevent network-level lateral traffic traversal.'
      }
    },
    tags: ['mitigations', 'segmentation', 'architecture'],
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
    question_id: 'Q-D3.O1-02',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O1',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'Under the cloud security shared responsibility model, a customer deploys an application onto a cloud provider\'s Software-as-a-Service (SaaS) platform. Who is responsible for securing the physical servers and the customer data stored in the SaaS, respectively?',
    choices: [
      { id: 'A', text: 'Customer is responsible for both physical servers and customer data.' },
      { id: 'B', text: 'Cloud provider is responsible for both physical servers and customer data.' },
      { id: 'C', text: 'Cloud provider is responsible for physical servers; Customer is responsible for customer data.' },
      { id: 'D', text: 'Customer is responsible for physical servers; Cloud provider is responsible for customer data.' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'Under all cloud models (IaaS, PaaS, SaaS), the cloud provider is always responsible for the physical security of the hosting infrastructure, while the customer is always responsible for the security of their own data.',
      why_not_others: {
        'A': 'The customer never owns the physical datacenters in public SaaS cloud architectures.',
        'B': 'The provider handles server security, but the customer retains ultimate responsibility for data classification/contents.',
        'D': 'This swaps the actual responsibilities.'
      }
    },
    tags: ['architecture', 'cloud', 'shared-responsibility'],
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
    question_id: 'Q-D3.O1-03',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O1',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'An IoT deployment processes sensor telemetry data directly on local gateway processors installed in manufacturing bays, rather than routing all raw traffic to a centralized cloud. What is the security implication of this edge computing model?',
    choices: [
      { id: 'A', text: 'It completely eliminates the need for cryptographic transport security.' },
      { id: 'B', text: 'It decreases security complexity by centralizing trust boundaries.' },
      { id: 'C', text: 'It distributes the physical and logical attack surface across many edge locations.' },
      { id: 'D', text: 'It forces all devices to use high-overhead IPSec tunnels.' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'Edge computing processes data near the source. The primary security implication is a highly decentralized and distributed physical and logical attack surface, requiring securing many separate edge assets.',
      why_not_others: {
        'A': 'Decentralization makes encryption more critical to protect paths between edge nodes and central databases.',
        'B': 'Edge architectures increase complexity by spreading trust boundaries across multiple sites.',
        'D': 'It does not force any specific protocol; other lightweight mechanisms (like TLS/CoAP) are often used.'
      }
    },
    tags: ['architecture', 'edge-computing', 'iot'],
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
    question_id: 'Q-D3.O1-04',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O1',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'An organization hosts its proprietary, legacy accounting system on in-house private virtualization servers, but leverages public cloud resources to scale outward during end-of-quarter workloads. What type of cloud deployment model is this?',
    choices: [
      { id: 'A', text: 'Private Cloud' },
      { id: 'B', text: 'Community Cloud' },
      { id: 'C', text: 'Hybrid Cloud' },
      { id: 'D', text: 'SaaS Cloud' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'A hybrid cloud integrates elements of private cloud systems (in-house) with public cloud infrastructure, often allowing cloud bursting to handle workload spikes.',
      why_not_others: {
        'A': 'Private clouds reside entirely within the organization\'s dedicated infrastructure control.',
        'B': 'Community clouds are shared by organizations with common interests (e.g. government, regulatory bodies).',
        'D': 'SaaS is software delivery, not a cloud integration model.'
      }
    },
    tags: ['architecture', 'cloud', 'hybrid-cloud'],
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
    question_id: 'Q-D3.O2-02',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O2',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A system administrator needs to connect remotely to internal production servers for maintenance. To ensure security, they must first SSH into a dedicated, hardened server located in the DMZ segment, and from there establish a connection to internal hosts. What is this security architecture host called?',
    choices: [
      { id: 'A', text: 'Active Directory Controller' },
      { id: 'B', text: 'Jump server / Bastion host' },
      { id: 'C', text: 'Load balancer' },
      { id: 'D', text: 'Web application firewall' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A jump server (or bastion host) is a hardened, monitored server used to bridge access between an external network and an internal high-security zone.',
      why_not_others: {
        'A': 'AD controllers manage directory identity metadata, they do not bridge remote system admin SSH sessions.',
        'C': 'Load balancers distribute user traffic across server pools.',
        'D': 'Web Application Firewalls filter HTTP/HTTPS application-layer payloads.'
      }
    },
    tags: ['infrastructure', 'bastion-host', 'network-security'],
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
    question_id: 'Q-D3.O2-03',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O2',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'An enterprise wants to enforce security on physical ethernet ports in corporate conference rooms, ensuring only domain-joined corporate laptops can acquire an IP address. Unapproved personal computers should be blocked automatically. Which technology is best suited?',
    choices: [
      { id: 'A', text: 'DNSSEC' },
      { id: 'B', text: '802.1X Port-based Authentication' },
      { id: 'C', text: 'DMZ zone routing' },
      { id: 'D', text: 'Dynamic DNS (DDNS)' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: '802.1X is an IEEE standard for port-based Network Access Control (PNAC). It forces devices connecting to physical switch ports or wireless networks to authenticate via a RADIUS/TACACS+ server before gaining access.',
      why_not_others: {
        'A': 'DNSSEC signs DNS records to prevent cache spoofing; it does not authenticate network port endpoints.',
        'C': 'DMZ hosts public-facing services, it is not an endpoint port security mechanism.',
        'D': 'DDNS updates DNS records dynamically when IPs change.'
      }
    },
    tags: ['infrastructure', '802.1x', 'network-access-control'],
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
    question_id: 'Q-D3.O2-04',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O2',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An online retail site experiences high traffic volume during seasonal sales events, threatening to overload its web servers. The security team wants to deploy a device that intercepts incoming web traffic, performs SSL decryption, and distributes sessions evenly across a cluster of servers. What device is needed?',
    choices: [
      { id: 'A', text: 'Forward Proxy' },
      { id: 'B', text: 'Network Address Translator (NAT)' },
      { id: 'C', text: 'Load Balancer' },
      { id: 'D', text: 'Honeypot' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'A load balancer distributes user traffic across multiple backend servers. Many load balancers also perform SSL/TLS offloading (decryption) to relieve server processors.',
      why_not_others: {
        'A': 'A forward proxy filters outbound client requests, whereas load balancers manage inbound server traffic.',
        'B': 'NAT translates IP addresses across boundary routers, it does not distribute requests across servers.',
        'D': 'Honeypots are dummy decoy assets designed to collect attacker metrics.'
      }
    },
    tags: ['infrastructure', 'load-balancer', 'high-availability'],
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
    question_id: 'Q-D3.O3-02',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A merchant database processes payment cards. To reduce their PCI DSS compliance audit scope, they replace actual 16-digit credit card numbers on database tables with random, mathematically unrelated reference strings that are linked back to card values only inside a high-security vault. What is this technique?',
    choices: [
      { id: 'A', text: 'Hashing' },
      { id: 'B', text: 'Data Masking' },
      { id: 'C', text: 'Tokenization' },
      { id: 'D', text: 'Data Erasure' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'Tokenization replaces sensitive values with a non-sensitive surrogate value (token) that carries no mathematical relation to the original value, reducing audit scopes.',
      why_not_others: {
        'A': 'Hashing is a one-way mathematical function; you cannot retrieve the credit card value later for processing transactions.',
        'B': 'Data masking hides values (e.g. XXXX-XXXX-XXXX-1234) for display purposes, but does not securely replace database entries.',
        'D': 'Data erasure deletes data completely.'
      }
    },
    tags: ['data-security', 'tokenization', 'pci-dss'],
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
    question_id: 'Q-D3.O3-03',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A company wants to ensure that if a corporate laptop is left in a taxi, a thief cannot boot up the device or connect the hard drive to another computer to access sensitive local customer databases. Which security control is MOST effective?',
    choices: [
      { id: 'A', text: 'File-level hashing' },
      { id: 'B', text: 'Full-Disk Encryption (FDE)' },
      { id: 'C', text: 'BIOS password protection' },
      { id: 'D', text: 'Data Loss Prevention (DLP) filters' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Full-Disk Encryption (FDE), such as BitLocker or FileVault, encrypts the entire drive sector-by-sector, protecting data at rest if physical hardware is lost or stolen.',
      why_not_others: {
        'A': 'Hashing validates file integrity, it does not encrypt or protect file content from reading.',
        'C': 'BIOS passwords prevent booting from the host, but the drive can easily be removed and read on a different host.',
        'D': 'DLP blocks data leaks over active transport channels, it cannot encrypt drives after loss.'
      }
    },
    tags: ['data-security', 'fde', 'data-at-rest'],
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
    question_id: 'Q-D3.O3-04',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An executive attempts to copy a corporate spreadsheet containing customer Social Security Numbers to an external USB flash drive. An agent running on their laptop blocks the transfer and displays a policy warning. What type of security system is executing this control?',
    choices: [
      { id: 'A', text: 'Hardware Security Module (HSM)' },
      { id: 'B', text: 'Endpoint Data Loss Prevention (DLP)' },
      { id: 'C', text: 'Host Intrusion Detection System (HIDS)' },
      { id: 'D', text: 'Secure Enclave' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'An endpoint-based Data Loss Prevention (DLP) system monitors actions (like copying files to USBs or emailing sensitive data) and blocks unauthorized transfers.',
      why_not_others: {
        'A': 'An HSM is a physical hardware processor dedicated to key generation/management.',
        'C': 'A HIDS inspects log events and system calls to detect security violations, not policy data leaks.',
        'D': 'A secure enclave is a hardware-isolated region of memory used to run sensitive tasks.'
      }
    },
    tags: ['data-security', 'dlp', 'endpoint-security'],
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
    question_id: 'Q-D3.O4-02',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A storage array utilizes five hard disk drives to store data. By writing striping blocks along with distributed parity sectors across all five drives, the system can tolerate the complete failure of any single drive without data loss. What configuration is being used?',
    choices: [
      { id: 'A', text: 'RAID 0' },
      { id: 'B', text: 'RAID 1' },
      { id: 'C', text: 'RAID 5' },
      { id: 'D', text: 'RAID 10' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'RAID 5 strips data and distributes parity information across three or more disks, providing fault tolerance for a single disk failure.',
      why_not_others: {
        'A': 'RAID 0 has striping but no parity or redundancy; if one drive fails, all data is lost.',
        'B': 'RAID 1 is simple disk mirroring, requiring pairs of disks.',
        'D': 'RAID 10 combines mirroring and striping, requiring a minimum of four disks.'
      }
    },
    tags: ['resilience', 'raid', 'fault-tolerance'],
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
    question_id: 'Q-D3.O4-03',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A business impact analysis (BIA) determines that the database backend for an online e-commerce shop cannot remain offline for more than 4 hours without causing severe financial losses. What recovery metric does this 4-hour window represent?',
    choices: [
      { id: 'A', text: 'Recovery Point Objective (RPO)' },
      { id: 'B', text: 'Recovery Time Objective (RTO)' },
      { id: 'C', text: 'Mean Time to Repair (MTTR)' },
      { id: 'D', text: 'Mean Time Between Failures (MTBF)' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'The Recovery Time Objective (RTO) is the maximum target time allowed to restore systems and resume operations following an incident or outage.',
      why_not_others: {
        'A': 'RPO defines the maximum tolerable age of data that must be recovered (e.g. database backup frequency).',
        'C': 'MTTR is the average time to fix a component physically.',
        'D': 'MTBF is the average time a device operates reliably between faults.'
      }
    },
    tags: ['resilience', 'rto', 'business-continuity'],
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
    question_id: 'Q-D3.O4-04',
    exam_version: 'SY0-701',
    domain_id: 'D3',
    objective_id: 'D3.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An enterprise routes transaction web requests through two redundant web server arrays running concurrently. A hardware health monitor routes user requests to both arrays. If one array crashes, users are seamlessly routed to the surviving array without experiencing service degradation. What is this design called?',
    choices: [
      { id: 'A', text: 'Active-Passive clustering' },
      { id: 'B', text: 'Active-Active clustering' },
      { id: 'C', text: 'Incremental backup replication' },
      { id: 'D', text: 'Site-to-Site replication' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'In an Active-Active cluster, all servers/arrays actively process requests simultaneously. If one fails, the load balancer routes all sessions to the survivors, achieving zero-downtime high availability.',
      why_not_others: {
        'A': 'In Active-Passive clustering, one node is dormant and must boot up or take over when the primary fails, introducing a small delay.',
        'C': 'Backup replication copies data blocks, it does not route live connection traffic.',
        'D': 'Site-to-site replication replicates data across locations, rather than load balancing server nodes.'
      }
    },
    tags: ['resilience', 'clustering', 'high-availability'],
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
    question_id: 'Q-D4.O1-02',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O1',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An organization wants to replace their signature-based antivirus agents with endpoint software capable of monitoring system calls, processes, and memory behaviors to detect and block zero-day exploits and malicious post-exploitation behavior. Which technology should they deploy?',
    choices: [
      { id: 'A', text: 'Host-based Firewalls' },
      { id: 'B', text: 'Unified Threat Management (UTM)' },
      { id: 'C', text: 'Endpoint Detection and Response (EDR)' },
      { id: 'D', text: 'File Integrity Monitoring (FIM)' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'EDR agents monitor endpoint behaviors in real-time, using threat intelligence and behavioral analytics to detect, isolate, and respond to threats that bypass static signatures.',
      why_not_others: {
        'A': 'Host firewalls filter network packets, they do not trace memory or system call behaviors.',
        'B': 'UTM is a gateway security appliance, not endpoint agent software.',
        'D': 'FIM tracks changes to files on disk, it does not analyze active process memory for exploits.'
      }
    },
    tags: ['endpoint-security', 'edr', 'mitigations'],
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
    question_id: 'Q-D4.O1-03',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O1',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An enterprise issues company smartphones to remote sales representatives. The security policy dictates that if a smartphone is lost or stolen, it must enforce local PIN locks, require full disk encryption, and support deletion of all corporate data via remote commands. Which system should the IT department implement?',
    choices: [
      { id: 'A', text: 'Network Access Control (NAC)' },
      { id: 'B', text: 'Mobile Device Management (MDM)' },
      { id: 'C', text: 'Virtual Desktop Infrastructure (VDI)' },
      { id: 'D', text: 'Secure Access Service Edge (SASE)' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'MDM systems allow central administrators to provision, manage, and secure mobile devices, including enforcing encryption, password policies, and executing remote wipes.',
      why_not_others: {
        'A': 'NAC checks client compliance before letting them join a network segment.',
        'C': 'VDI hosts virtual desktop sessions on central servers, it does not manage remote phone physical systems.',
        'D': 'SASE is a cloud-based network security architecture, not mobile asset fleet management.'
      }
    },
    tags: ['endpoint-security', 'mdm', 'mobile-security'],
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
    question_id: 'Q-D4.O1-04',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O1',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'Which security feature utilizes cryptographic keys embedded in system firmware to verify the digital signature of the operating system bootloader before allowing it to launch, ensuring that rootkits cannot infect the system boot path?',
    choices: [
      { id: 'A', text: 'TPM chip' },
      { id: 'B', text: 'Secure Boot' },
      { id: 'C', text: 'Asymmetric encryption' },
      { id: 'D', text: 'Measured Boot' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Secure Boot is a UEFI feature that prevents signed/trusted operating system loaders from being replaced by malicious code (like rootkits) by validating signatures prior to launch.',
      why_not_others: {
        'A': 'The TPM (Trusted Platform Module) stores hash metrics, but Secure Boot is the specific mechanism enforcing validation on the boot path.',
        'C': 'Asymmetric encryption is a mathematical tool, not a system boot process feature.',
        'D': 'Measured Boot logs boot metrics in the TPM registers for remote verification, but does not block boot execution directly.'
      }
    },
    tags: ['endpoint-security', 'secure-boot', 'uefi'],
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
    question_id: 'Q-D4.O2-02',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O2',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An asset manager runs a network discovery scan and discovers five unauthorized, unmanaged wireless access points connected to switches in the corporate research lab. How is this security challenge classified?',
    choices: [
      { id: 'A', text: 'Supply chain compromise' },
      { id: 'B', text: 'Shadow IT / Rogue assets' },
      { id: 'C', text: 'Software licensing violation' },
      { id: 'D', text: 'Zero-day exploitation' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Shadow IT and rogue assets are hardware or software installed inside an enterprise network without IT department approval or inclusion in the official asset register.',
      why_not_others: {
        'A': 'Supply chain exploits involve compromises from suppliers, not local unmanaged switches.',
        'C': 'Software license audits check for unpaid application seats, not physical switch connections.',
        'D': 'This is a governance/hardware management issue, not a software zero-day exploit.'
      }
    },
    tags: ['asset-management', 'rogue-devices', 'shadow-it'],
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
    question_id: 'Q-D4.O2-03',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O2',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'easy',
    prompt: 'Which of the following is the primary risk associated with failing to maintain an accurate, up-to-date software asset inventory?',
    choices: [
      { id: 'A', text: 'Inability to run quantitative risk assessments' },
      { id: 'B', text: 'Presence of unpatched, obsolete applications that are forgotten by security teams' },
      { id: 'C', text: 'Increased hardware replacement costs' },
      { id: 'D', text: 'Inability to implement MFA protocols' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Without an accurate inventory, security teams cannot patch what they do not know exists, leaving obsolete or vulnerable software unpatched in the enterprise.',
      why_not_others: {
        'A': 'BIA processes might be harder, but the immediate security risk is unpatched software exploits.',
        'C': 'Inventory databases track configurations, they do not increase server wear.',
        'D': 'MFA is independent of software asset inventories.'
      }
    },
    tags: ['asset-management', 'risk', 'inventories'],
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
    question_id: 'Q-D4.O2-04',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O2',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An enterprise runs an asset lifecycle audit and discovers that their core file transfer application has reached End-of-Life (EOL) status. The vendor has officially ceased all development and security support. What should the security team prioritize?',
    choices: [
      { id: 'A', text: 'Submit a ticket to patch the current version.' },
      { id: 'B', text: 'Plan a migration to a supported, secure replacement application.' },
      { id: 'C', text: 'Ignore the finding as long as the system works.' },
      { id: 'D', text: 'Degauss the server hosting the system.' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Once software reaches EOL, no security patches will be issued, creating high risks. The team must plan a migration to a supported product.',
      why_not_others: {
        'A': 'Vendors do not write patches for EOL systems; submitting a ticket is pointless.',
        'C': 'Leaving EOL database assets online exposes the business to unpatched exploit risk.',
        'D': 'Degaussing erases drives completely, which is premature and destructive for an active service before migrating databases.'
      }
    },
    tags: ['asset-management', 'eol', 'lifecycle'],
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
    question_id: 'Q-D4.O3-02',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A cybersecurity analyst wants to run a vulnerability scan that accurately checks local registry settings, installed configurations, and database file parameters without triggering security blocks. Which type of scan is best suited?',
    choices: [
      { id: 'A', text: 'Non-credentialed scan' },
      { id: 'B', text: 'Credentialed scan' },
      { id: 'C', text: 'Passive network sniff' },
      { id: 'D', text: 'Social engineering assessment' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Credentialed scans log in to targets with valid admin credentials. This lets the scanner inspect internal registry values, patches, and configurations, yielding fewer false positives and deeper results.',
      why_not_others: {
        'A': 'Non-credentialed scans inspect systems externally from the network, guessing configurations from open ports.',
        'C': 'Passive sniffing logs network packets; it cannot read server configurations or registry files.',
        'D': 'Social engineering tests staff behavior, not network software vulnerabilities.'
      }
    },
    tags: ['vulnerability-management', 'scanning', 'credentials'],
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
    question_id: 'Q-D4.O3-03',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O3',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'hard',
    prompt: 'A CVSS v3.1 score is evaluated for a new vulnerability. The analyst notices the vulnerability has a base score of 9.8, but because there is currently no active exploit script available in public forums, they adjust the priority. Which metric group allows for these time-dependent modifications?',
    choices: [
      { id: 'A', text: 'Environmental Metric Group' },
      { id: 'B', text: 'Temporal Metric Group' },
      { id: 'C', text: 'Base Metric Group' },
      { id: 'D', text: 'Threat Vector Group' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Temporal metrics in CVSS represent characteristics of a vulnerability that change over time, such as exploit code availability (exploitability), remediation level, and report confidence.',
      why_not_others: {
        'A': 'Environmental metrics adjust scores based on host importance/controls specific to the user\'s datacenter.',
        'C': 'Base metrics represent the permanent, intrinsic qualities of the vulnerability.',
        'D': 'Threat vectors are not a CVSS metric class group.'
      }
    },
    tags: ['vulnerability-management', 'cvss', 'scoring'],
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
    question_id: 'Q-D4.O3-04',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An organization discovers a zero-day vulnerability in their web portal. The software vendor indicates it will take two weeks to release a code patch. To protect the site immediately, the security team configures a Web Application Firewall (WAF) signature to block the attack payloads. How is this action classified?',
    choices: [
      { id: 'A', text: 'Risk acceptance' },
      { id: 'B', text: 'Vulnerability scanning' },
      { id: 'C', text: 'Virtual patching / Workaround' },
      { id: 'D', text: 'Declassification' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'A workaround or virtual patching uses adjacent upstream controls (like firewall rules or WAF filters) to block exploit traffic before a software patch is written and deployed.',
      why_not_others: {
        'A': 'Risk acceptance takes no mitigation action and accepts full breach consequences.',
        'B': 'Scanning discovers the issue, it does not mitigate it.',
        'D': 'Declassification is a document lifecycle process, not network threat mitigation.'
      }
    },
    tags: ['vulnerability-management', 'mitigations', 'virtual-patching'],
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
    question_id: 'Q-D4.O4-02',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A security analyst configures a host agent to monitor integrity on corporate directories. The agent generates an alert whenever an executable file inside `/usr/bin/` is modified or replaced. What type of monitoring tool is this?',
    choices: [
      { id: 'A', text: 'File Integrity Monitoring (FIM)' },
      { id: 'B', text: 'Network Tap (Test Access Point)' },
      { id: 'C', text: 'Simple Network Management Protocol (SNMP)' },
      { id: 'D', text: 'IP Flow Information Export (IPFIX)' }
    ],
    correct_answers: ['A'],
    explanation: {
      why_correct: 'File Integrity Monitoring (FIM) calculates cryptographic hashes of system files and monitors for changes, generating alerts when unexpected alterations occur.',
      why_not_others: {
        'B': 'A Network Tap copies physical cabling traffic, it does not trace server directory files.',
        'C': 'SNMP monitors system hardware metrics (CPU, disk space).',
        'D': 'IPFIX/NetFlow monitors traffic flows, not internal host file system states.'
      }
    },
    tags: ['monitoring', 'fim', 'integrity'],
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
    question_id: 'Q-D4.O4-03',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O4',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'A network engineer wants to implement secure remote monitoring for core switches. They need to ensure that the monitoring commands are encrypted in transit and the agent credentials are authenticated securely. Which protocol should they configure?',
    choices: [
      { id: 'A', text: 'SNMPv1' },
      { id: 'B', text: 'SNMPv2c' },
      { id: 'C', text: 'SNMPv3' },
      { id: 'D', text: 'TFTP' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'SNMPv3 provides advanced security features, including cryptographic encryption of traffic and secure authentication parameters, addressing cleartext community string vulnerabilities in v1 and v2c.',
      why_not_others: {
        'A': 'SNMPv1 transmits community strings in cleartext without encryption.',
        'B': 'SNMPv2c adds bulk transfer requests but still transmits community strings in cleartext.',
        'D': 'TFTP is a cleartext file transfer protocol, not a network monitoring system.'
      }
    },
    tags: ['monitoring', 'snmpv3', 'protocols'],
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
    question_id: 'Q-D4.O4-04',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An analyst reviews dashboard traffic trends and identifies an unusual spike in port 53 (DNS) queries. They want to check host connection data, specifically transaction bytes and timestamps, without reading the full packet payloads. What log resource is best?',
    choices: [
      { id: 'A', text: 'Full PCAP capture' },
      { id: 'B', text: 'NetFlow / IPFIX logs' },
      { id: 'C', text: 'FIM reports' },
      { id: 'D', text: 'Active Directory logs' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'NetFlow and IPFIX logs track IP traffic flows (timestamps, packet count, source/destination, byte size) without capturing actual packet payloads, facilitating quick traffic analysis.',
      why_not_others: {
        'A': 'PCAP (packet captures) logs complete payloads, which is high-overhead and too slow for high-level flow checks.',
        'C': 'FIM tracks changes to local disk files, not transit network packets.',
        'D': 'Active Directory logs identity authentications, not packet transit flows.'
      }
    },
    tags: ['monitoring', 'netflow', 'logs'],
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
    question_id: 'Q-D4.O5-02',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O5',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A security architect wants to prevent employees from visiting known malware delivery websites during business hours. They deploy a boundary proxy that intercepts all outbound HTTP/HTTPS requests, checks URLs against a reputation list, and filters matching connections. What type of proxy is this?',
    choices: [
      { id: 'A', text: 'Reverse Proxy' },
      { id: 'B', text: 'Forward Proxy' },
      { id: 'C', text: 'NAT Proxy' },
      { id: 'D', text: 'Direct Translation Gateway' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A forward proxy regulates outbound connections from an internal network (employees) to an external network (web), filtering URLs or cache payloads.',
      why_not_others: {
        'A': 'Reverse proxies protect inbound traffic to web servers, load balancing and caching requests.',
        'C': 'NAT changes IP fields in packet headers, it does not filter URL reputations.',
        'D': 'Translation gateways are not standard security architecture components.'
      }
    },
    tags: ['capabilities', 'proxy', 'filtering'],
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
    question_id: 'Q-D4.O5-03',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O5',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'hard',
    prompt: 'Which security modification to domain name resolution utilizes cryptographic signatures to guarantee that DNS query responses have not been altered or spoofed in transit by an attacker?',
    choices: [
      { id: 'A', text: 'DNSSEC' },
      { id: 'B', text: 'DNS Poisoning' },
      { id: 'C', text: 'SPF (Sender Policy Framework)' },
      { id: 'D', text: 'LDAPS' }
    ],
    correct_answers: ['A'],
    explanation: {
      why_correct: 'DNSSEC (Domain Name System Security Extensions) signs DNS records cryptographically, ensuring clients can verify the authenticity and integrity of name resolution data.',
      why_not_others: {
        'B': 'DNS poisoning is the exploit itself, which DNSSEC mitigates.',
        'C': 'SPF is an email authentication system targeting spoofed sender domains.',
        'D': 'LDAPS secures directory queries (LDAP over SSL), not DNS records.'
      }
    },
    tags: ['capabilities', 'dnssec', 'dns-security'],
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
    question_id: 'Q-D4.O5-04',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O5',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A security engineer deploys an attractive, vulnerability-mimicking decoy server inside the DMZ segment. The server contains simulated customer records but has no corporate business functions. Its only goal is to detect scanning activity and log threat actor exploit tools. What is this decoy server called?',
    choices: [
      { id: 'A', text: 'Jump server' },
      { id: 'B', text: 'Honeypot' },
      { id: 'C', text: 'Intrusion Prevention System (IPS)' },
      { id: 'D', text: 'Load balancer' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A honeypot is a decoy server or system designed to attract attackers. It captures their techniques and alerts security teams to scanning or exploit attempts.',
      why_not_others: {
        'A': 'Jump servers are secure entryways for admins, they are not intended to decoy attackers.',
        'C': 'An IPS blocks exploit traffic, it is not a dummy data decoy.',
        'D': 'Load balancers distribute user traffic to live web servers.'
      }
    },
    tags: ['capabilities', 'honeypot', 'detection'],
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
    question_id: 'Q-D4.O6-03',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O6',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An organization assigns folder access rights based on job roles. For example, any user assigned the \'Accounting Analyst\' role automatically acquires read-write permissions to financial files. Users lose access if they change departments. What access control model is this?',
    choices: [
      { id: 'A', text: 'Discretionary Access Control (DAC)' },
      { id: 'B', text: 'Mandatory Access Control (MAC)' },
      { id: 'C', text: 'Role-Based Access Control (RBAC)' },
      { id: 'D', text: 'Rule-Based Access Control' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'RBAC (Role-Based Access Control) assigns permissions to job roles rather than individual accounts. Users acquire permissions by being added to the corresponding group/role.',
      why_not_others: {
        'A': 'DAC lets the owner of a file delegate permissions at their discretion.',
        'B': 'MAC uses system-enforced labels (e.g. Secret, Top Secret) to determine access.',
        'D': 'Rule-based access uses system settings (like firewall rules) to check connections.'
      }
    },
    tags: ['iam', 'rbac', 'authorization'],
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
    question_id: 'Q-D4.O6-04',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O6',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'An enterprise restricts access to critical databases: a user can log in only if they are connecting from a corporate-owned computer, between 9:00 AM and 5:00 PM, and from a location IP address within the United States. Which authorization model does this represent?',
    choices: [
      { id: 'A', text: 'Discretionary Access Control (DAC)' },
      { id: 'B', text: 'Attribute-Based Access Control (ABAC)' },
      { id: 'C', text: 'Mandatory Access Control (MAC)' },
      { id: 'D', text: 'Role-Based Access Control (RBAC)' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'ABAC (Attribute-Based Access Control) evaluates attributes of the subject (user), the resource (database), and environmental variables (time, location, device status) to make access decisions.',
      why_not_others: {
        'A': 'DAC permits access based on user tables curated by the asset owner.',
        'C': 'MAC evaluates classification labels, not environmental parameters like IP geolocation.',
        'D': 'RBAC checks only user group memberships (roles), not location or time parameters.'
      }
    },
    tags: ['iam', 'abac', 'authorization'],
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
    question_id: 'Q-D4.O7-01',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O7',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An enterprise security system receives an alert showing a workstation communicating with a malicious server. The system automatically executes a script that isolates the endpoint network port and updates the firewall rules. What is the term for this automated response system?',
    choices: [
      { id: 'A', text: 'Security Information and Event Management (SIEM)' },
      { id: 'B', text: 'Security Orchestration, Automation, and Response (SOAR)' },
      { id: 'C', text: 'Intrusion Detection System (IDS)' },
      { id: 'D', text: 'Infrastructure as Code (IaC)' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'SOAR platforms automate threat incident ingestion and execute workflows (playbooks) to contain compromises without requiring manual analyst commands.',
      why_not_others: {
        'A': 'SIEM aggregates and correlates logs, generating alerts but not automatically orchestrating endpoint mitigations.',
        'C': 'IDS alerts security teams but does not automate response orchestrations.',
        'D': 'IaC defines network configuration scripts, it is not an incident response system.'
      }
    },
    tags: ['automation', 'soar', 'playbook'],
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
    question_id: 'Q-D4.O7-02',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O7',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A cloud engineer writes configuration templates to deploy identical, securely configured network firewalls across multiple test and production cloud segments. What automation concept is being utilized?',
    choices: [
      { id: 'A', text: 'Infrastructure as Code (IaC)' },
      { id: 'B', text: 'SOAR Playbooks' },
      { id: 'C', text: 'Containerization' },
      { id: 'D', text: 'Static Analysis (SAST)' }
    ],
    correct_answers: ['A'],
    explanation: {
      why_correct: 'Infrastructure as Code (IaC) defines infrastructure assets (networks, VMs, firewalls) using machine-readable configuration files, ensuring repeatable and secure deployments.',
      why_not_others: {
        'B': 'SOAR playbooks run incident response steps, not infrastructure deployments.',
        'C': 'Containerization isolates applications, not configuration templates.',
        'D': 'SAST is code security scanning, not resource deployment.'
      }
    },
    tags: ['automation', 'iac', 'cloud-security'],
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
    question_id: 'Q-D4.O7-03',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O7',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'To secure their application deployment pipeline, a devops team integrates automated scanning scripts that check code for vulnerability bugs before building, and execute automated penetration scripts on dynamic testing hosts. Where are these integrated?',
    choices: [
      { id: 'A', text: 'SIEM collector nodes' },
      { id: 'B', text: 'CI/CD (Continuous Integration / Continuous Deployment) pipeline' },
      { id: 'C', text: 'Active Directory domain controllers' },
      { id: 'D', text: 'Local backup registers' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'CI/CD pipelines automate building, testing, and deploying code. Integrating security scans (SAST/DAST) in the pipeline ensures vulnerabilities are caught early in the development lifecycle.',
      why_not_others: {
        'A': 'SIEM parses active runtime logs, not pre-compilation source code.',
        'C': 'AD controllers manage identity auth, not developer code pipelines.',
        'D': 'Backup registers log backups, they do not run active application security checks.'
      }
    },
    tags: ['automation', 'cicd', 'devsecops'],
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
    question_id: 'Q-D4.O7-04',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O7',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An organization exposes API endpoints to external partner applications. To prevent automated scripts from overwhelming their backend databases, they deploy a gateway that limits the number of requests a single client IP can make per minute. What security control is this?',
    choices: [
      { id: 'A', text: 'SOAR orchestration' },
      { id: 'B', text: 'API Rate Limiting' },
      { id: 'C', text: 'VLAN isolation' },
      { id: 'D', text: 'Full Disk Encryption' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'API gateways use Rate Limiting to enforce maximum request thresholds per time period, mitigating automated denial-of-service and brute force API calls.',
      why_not_others: {
        'A': 'SOAR coordinates multi-system actions, it does not regulate individual endpoint APIs directly.',
        'C': 'VLAN isolation partitions networks locally, it does not manage public web API request limits.',
        'D': 'FDE encrypts disk data at rest, it is not an API gateway feature.'
      }
    },
    tags: ['automation', 'api-security', 'rate-limiting'],
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
    question_id: 'Q-D4.O8-02',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O8',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A forensic analyst is collecting hard drive data from a server compromised by an attacker. The analyst documents the drive details, logs the cryptographic hash of the drive image, and records the signature of everyone who handles the storage media. What process is being maintained?',
    choices: [
      { id: 'A', text: 'Eradication' },
      { id: 'B', text: 'Chain of Custody' },
      { id: 'C', text: 'Lessons Learned session' },
      { id: 'D', text: 'Containment' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'The chain of custody documents the chronological control, collection, transfer, and analysis of physical or digital evidence, which is essential for admissibility in legal proceedings.',
      why_not_others: {
        'A': 'Eradication removes system threats (malware, accounts) after containment.',
        'C': 'Lessons learned is a post-incident review to improve future processes.',
        'D': 'Containment restricts the spread of a threat during an active incident.'
      }
    },
    tags: ['incident-response', 'forensics', 'chain-of-custody'],
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
    question_id: 'Q-D4.O8-03',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O8',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'easy',
    prompt: 'Two weeks after a ransomware incident is resolved, the security team and organizational stakeholders meet to discuss what went well, what went wrong, and how to improve incident response playbooks for future incidents. What phase of the Incident Response lifecycle is this?',
    choices: [
      { id: 'A', text: 'Preparation' },
      { id: 'B', text: 'Post-Incident Activity / Lessons Learned' },
      { id: 'C', text: 'Identification' },
      { id: 'D', text: 'Eradication' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'The Post-Incident Activity phase (specifically the lessons learned session) brings teams together to review performance and update policies, preventing future recurrences.',
      why_not_others: {
        'A': 'Preparation is done before incidents occur.',
        'C': 'Identification occurs when the incident is first detected.',
        'D': 'Eradication is removing malware/access keys, which happens prior to closing the incident.'
      }
    },
    tags: ['incident-response', 'lessons-learned', 'lifecycle'],
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
    question_id: 'Q-D4.O8-04',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O8',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A forensic investigator needs to analyze a drive from a workstation suspected of containing malware files. To perform the investigation securely without altering the evidence state, what should the investigator do first?',
    choices: [
      { id: 'A', text: 'Connect the drive directly to their work computer and browse files.' },
      { id: 'B', text: 'Create a bitstream copy (image) of the drive using a write-blocker, and analyze the copy.' },
      { id: 'C', text: 'Run a system restore to remove potential malware before copying.' },
      { id: 'D', text: 'Purge all free sectors on the disk using a degausser.' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Investigators must make a bitstream forensic clone of media using physical or software write-blockers to prevent any write alterations to original evidence.',
      why_not_others: {
        'A': 'Plugging drives directly into standard OS systems without write-blockers alters file timestamps, compromising evidence integrity.',
        'C': 'System restores modify files, violating forensic integrity protocols.',
        'D': 'Degaussing erases drives completely, destroying evidence.'
      }
    },
    tags: ['incident-response', 'forensics', 'data-acquisition'],
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
    question_id: 'Q-D4.O9-01',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O9',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A security analyst traces a multi-stage attack path. They find that a public web server was compromised, but need to correlate web server requests with network boundary firewall connections. What metadata field is MOST critical to correlate these logs?',
    choices: [
      { id: 'A', text: 'Operating system kernel version' },
      { id: 'B', text: 'Timestamp and source IP address' },
      { id: 'C', text: 'DNS TTL duration' },
      { id: 'D', text: 'Switch port number' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'To correlate log entries across disparate systems (like web servers and firewalls), analysts match the source IP address and precise timestamp across systems.',
      why_not_others: {
        'A': 'OS kernel versions identify hosts, they do not correlate dynamic transaction logs.',
        'C': 'DNS TTL defines record caching times, which is unrelated to correlation.',
        'D': 'Switch port numbers are local layer-2 details, not logged across internet boundary gateways.'
      }
    },
    tags: ['investigations', 'correlation', 'logs'],
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
    question_id: 'Q-D4.O9-02',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O9',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An analyst suspects that an internal corporate workstation was compromised by malware and is actively beaconing out to an external command-and-control (C2) server. Which log source is BEST suited to identify outbound queries to domain names known to host C2 servers?',
    choices: [
      { id: 'A', text: 'DHCP Server logs' },
      { id: 'B', text: 'DNS Query logs' },
      { id: 'C', text: 'FIM reports' },
      { id: 'D', text: 'Logon audit events' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'DNS query logs record name resolution requests. Checking them allows identifying hosts attempting to resolve known malicious C2 domain names.',
      why_not_others: {
        'A': 'DHCP logs record IP address leases, not active web domain connections.',
        'C': 'FIM tracks file system changes on disk, not outgoing query network traffic.',
        'D': 'Logon audits record session authentication attempts, not domain query resolutions.'
      }
    },
    tags: ['investigations', 'dns-logs', 'c2-beaconing'],
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
    question_id: 'Q-D4.O9-03',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O9',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'hard',
    prompt: 'A security team investigates an incident where a rogue laptop connected to the wireless network and launched an ARP attack. The team has a logged IP address from the attack, but the dynamic lease has expired. What log source should they query to map the IP back to the device\'s physical MAC address?',
    choices: [
      { id: 'A', text: 'DNS zone transfer files' },
      { id: 'B', text: 'DHCP lease logs' },
      { id: 'C', text: 'SMTP transaction logs' },
      { id: 'D', text: 'Active Directory logs' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'DHCP logs record dynamic allocation sessions, logging the hardware MAC address of the requesting device alongside the allocated IP address at that timestamp.',
      why_not_others: {
        'A': 'DNS maps names to IPs, it does not log client network card MAC addresses.',
        'C': 'SMTP manages mail server routes, not local network IP allocation data.',
        'D': 'AD controller logs log username logins, they do not map MAC hardware leases.'
      }
    },
    tags: ['investigations', 'dhcp-logs', 'mac-addresses'],
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
    question_id: 'Q-D4.O9-04',
    exam_version: 'SY0-701',
    domain_id: 'D4',
    objective_id: 'D4.O9',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A security analyst investigates a credential harvesting email that bypassed filtering controls. The analyst wants to verify the mail server hops, routing relays, and SPF/DKIM verification check output for the email. What log source must they examine?',
    choices: [
      { id: 'A', text: 'DNS query records' },
      { id: 'B', text: 'Email Headers / SMTP logs' },
      { id: 'C', text: 'NetFlow records' },
      { id: 'D', text: 'DHCP leases' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Email headers trace the path of an email through SMTP relays and log the results of SPF, DKIM, and DMARC validations executed by receiving gateways.',
      why_not_others: {
        'A': 'DNS logs show name lookup requests, not email path routing records.',
        'C': 'NetFlow logs packet flow counts, not application SMTP header details.',
        'D': 'DHCP lease logs record network card IP allocations.'
      }
    },
    tags: ['investigations', 'email-security', 'logs'],
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
    question_id: 'Q-D5.O1-02',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O1',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A security manager needs to present the organization\'s current vulnerability trends, patch compliance rates, and training scores to corporate leadership to validate security investments. What is this governing activity?',
    choices: [
      { id: 'A', text: 'Incident Response reporting' },
      { id: 'B', text: 'Security Metrics Reporting / Executive Governance' },
      { id: 'C', text: 'Configuration Management audits' },
      { id: 'D', text: 'Penetration Testing sessions' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Governance requires presenting security metrics (compliance, risk, vulnerabilities) to executive leadership to align security spending with business risk appetite.',
      why_not_others: {
        'A': 'IR reporting reviews specific active breaches, not steady-state program metrics.',
        'C': 'Configuration management checks system settings, it is not general business reporting.',
        'D': 'Penetration tests find security bugs, they do not manage program governance metrics.'
      }
    },
    tags: ['governance', 'metrics', 'reporting'],
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
    question_id: 'Q-D5.O1-03',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O1',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'easy',
    prompt: 'Which governance document outlines the precise, step-by-step instructions that technicians must follow to deploy and configure a new operating system image securely?',
    choices: [
      { id: 'A', text: 'Policy' },
      { id: 'B', text: 'Standard' },
      { id: 'C', text: 'Standard Operating Procedure (SOP)' },
      { id: 'D', text: 'Guideline' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'A Standard Operating Procedure (SOP) provides detailed, step-by-step instructions to ensure consistent execution of operational tasks.',
      why_not_others: {
        'A': 'Policies are high-level goal directives from management, not operational guides.',
        'B': 'Standards define mandatory baselines (such as required encryption algorithms), not step-by-step setup guides.',
        'D': 'Guidelines are optional recommendations, not mandatory procedures.'
      }
    },
    tags: ['governance', 'sop', 'procedures'],
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
    question_id: 'Q-D5.O1-04',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O1',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'Two organizations plan to collaborate on a joint technology initiative. Before drafting formal legally binding financial contracts, they draft a document outlining their mutual goals, shared intentions, and operational expectations. What is this document called?',
    choices: [
      { id: 'A', text: 'SLA' },
      { id: 'B', text: 'Memorandum of Understanding (MOU)' },
      { id: 'C', text: 'NDA' },
      { id: 'D', text: 'ISA' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'An MOU (Memorandum of Understanding) is a non-binding agreement between parties outlining a common line of action and intent prior to writing contracts.',
      why_not_others: {
        'A': 'An SLA is a binding contract defining performance and uptime parameters.',
        'C': 'An NDA regulates confidentiality and disclosure rules.',
        'D': 'An ISA is a technical agreement detailing the security parameters of a network interconnection.'
      }
    },
    tags: ['governance', 'agreements', 'mou'],
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
    question_id: 'Q-D5.O2-02',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O2',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An asset manager calculates that a web server replacement costs $10,000. If a fire damages the server, the loss percentage is estimated at 50% (Exposure Factor). The fire likelihood is once every 5 years (ARO = 0.20). What is the Annualized Loss Expectancy (ALE)?',
    choices: [
      { id: 'A', text: '$5,000' },
      { id: 'B', text: '$1,000' },
      { id: 'C', text: '$2,000' },
      { id: 'D', text: '$500' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'First, calculate Single Loss Expectancy (SLE) = Asset Value ($10,000) * Exposure Factor (0.50) = $5,000. Second, calculate ALE = SLE ($5,000) * ARO (0.20) = $1,000.',
      why_not_others: {
        'A': 'This is the SLE ($5,000), not the annualized value.',
        'C': 'This is incorrect arithmetic.',
        'D': 'This is incorrect arithmetic.'
      }
    },
    tags: ['risk-management', 'quantitative-analysis', 'ale'],
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
    question_id: 'Q-D5.O2-03',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O2',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'easy',
    prompt: 'A security analyst conducts a risk assessment by gathering stakeholders to rank potential threats on a scale of \'Low, Medium, High\' using a probability and impact matrix. What category of risk assessment is this?',
    choices: [
      { id: 'A', text: 'Quantitative risk analysis' },
      { id: 'B', text: 'Qualitative risk analysis' },
      { id: 'C', text: 'Supply chain assessment' },
      { id: 'D', text: 'Technical vulnerability audit' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Qualitative risk analysis uses descriptive, subjective scales (Low, Medium, High) to evaluate the probability and impact of risks rather than exact financial calculations.',
      why_not_others: {
        'A': 'Quantitative analysis uses exact numerical and financial values (dollars, probabilities).',
        'C': 'Supply chain assessments focus on vendor risk.',
        'D': 'Vulnerability audits scan configurations, they are not risk ranking sessions.'
      }
    },
    tags: ['risk-management', 'qualitative-analysis', 'risk-matrix'],
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
    question_id: 'Q-D5.O2-04',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O2',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'Which term describes the baseline amount of risk that an organization\'s senior leadership is willing to accept or tolerate in pursuit of its business objectives?',
    choices: [
      { id: 'A', text: 'Residual Risk' },
      { id: 'B', text: 'Risk Appetite' },
      { id: 'C', text: 'Exposure Factor' },
      { id: 'D', text: 'Risk Avoidance' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Risk appetite is the level of risk an organization is willing to accept before taking action to mitigate or transfer it.',
      why_not_others: {
        'A': 'Residual risk is the remaining risk left over after security controls have been implemented.',
        'C': 'Exposure factor is the percentage of loss an asset experiences during a threat event.',
        'D': 'Risk avoidance is a treatment strategy that eliminates the risk entirely.'
      }
    },
    tags: ['risk-management', 'risk-appetite'],
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
    question_id: 'Q-D5.O3-02',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An enterprise plans to integrate a third-party customer database application. Before signing, the compliance officer requires the vendor to submit an independent audit report that verifies their security controls have operated reliably over a six-month window. What document is needed?',
    choices: [
      { id: 'A', text: 'SOC 2 Type I report' },
      { id: 'B', text: 'SOC 2 Type II report' },
      { id: 'C', text: 'NDA agreement' },
      { id: 'D', text: 'BPA registry' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A SOC 2 Type II report evaluates the operational effectiveness of a vendor\'s controls over a period of time (typically 6 months or a year), ensuring they work consistently.',
      why_not_others: {
        'A': 'A SOC 2 Type I report evaluates the design of controls at a single point in time, not their operation over a window.',
        'C': 'An NDA protects confidentiality, it does not verify control operational audits.',
        'D': 'A BPA (Business Partners Agreement) governs partnership parameters, it is not a compliance audit report.'
      }
    },
    tags: ['vendors', 'soc2', 'risk-assessment'],
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
    question_id: 'Q-D5.O3-03',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'A contract with a third-party consulting firm expires. According to vendor lifecycle standards, which activity should the security team prioritize during vendor offboarding?',
    choices: [
      { id: 'A', text: 'Establish a new Interconnection Security Agreement (ISA).' },
      { id: 'B', text: 'Revoke credential access, return company assets, and verify data destruction.' },
      { id: 'C', text: 'Run an external penetration test on the consultant\'s server.' },
      { id: 'D', text: 'Perform a quantitative risk assessment.' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Offboarding vendors requires removing their logical credential access, reclaiming physical assets, and confirming they destroyed any stored corporate data to prevent data leakage.',
      why_not_others: {
        'A': 'ISAs connect active networks; offboarding requires terminating links, not establishing them.',
        'C': 'Testing external consultant systems is outside the scope of internal offboarding protocols.',
        'D': 'BIA/risk assessments are done before onboarding, offboarding is operational teardown.'
      }
    },
    tags: ['vendors', 'offboarding', 'lifecycle'],
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
    question_id: 'Q-D5.O3-04',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O3',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'Which legal agreement is typically established between co-owners of distinct businesses entering a partnership, outlining the financial investments, profit shares, and security responsibilities of each partner?',
    choices: [
      { id: 'A', text: 'Service Level Agreement (SLA)' },
      { id: 'B', text: 'Business Partners Agreement (BPA)' },
      { id: 'C', text: 'Non-Disclosure Agreement (NDA)' },
      { id: 'D', text: 'Interconnection Security Agreement (ISA)' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A Business Partners Agreement (BPA) is a contract between business partners that governs their relationship, detailing financial parameters and security rules.',
      why_not_others: {
        'A': 'An SLA specifies technical service metrics (e.g., uptime) between a vendor and a customer.',
        'C': 'An NDA protects proprietary information from public release.',
        'D': 'An ISA defines network connection rules between two networks.'
      }
    },
    tags: ['vendors', 'agreements', 'bpa'],
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
    question_id: 'Q-D5.O4-02',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O4',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An international airline routes customer profiles. The system must allow EU citizens to view their profile metadata and request the complete deletion of their data from all ticketing databases (Right to be Forgotten). Which regulation mandates this compliance?',
    choices: [
      { id: 'A', text: 'HIPAA' },
      { id: 'B', text: 'PCI DSS' },
      { id: 'C', text: 'GDPR' },
      { id: 'D', text: 'SOX' }
    ],
    correct_answers: ['C'],
    explanation: {
      why_correct: 'The General Data Protection Regulation (GDPR) is a comprehensive EU privacy regulation. It mandates user data rights, including the \'right to be forgotten\' (erasure).',
      why_not_others: {
        'A': 'HIPAA is a U.S. health data law.',
        'B': 'PCI DSS is an industry standard for credit card transactions, not a government privacy law.',
        'D': 'SOX regulates financial reporting controls for public U.S. companies.'
      }
    },
    tags: ['compliance', 'gdpr', 'privacy'],
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
    question_id: 'Q-D5.O4-03',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O4',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'A publicly traded corporation in the United States must verify that internal IT access controls and change management logs are audited to prevent fraudulent alterations of financial accounting records. Which regulation applies?',
    choices: [
      { id: 'A', text: 'GDPR' },
      { id: 'B', text: 'Sarbanes-Oxley Act (SOX)' },
      { id: 'C', text: 'HIPAA' },
      { id: 'D', text: 'COPPA' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'SOX (Sarbanes-Oxley Act) mandates strict auditing of financial reporting controls for public companies in the U.S., which directly impacts IT systems hosting financial data.',
      why_not_others: {
        'A': 'GDPR is an EU privacy law, not a U.S. public accounting regulation.',
        'C': 'HIPAA is a healthcare data privacy law.',
        'D': 'COPPA regulates online privacy for children under 13.'
      }
    },
    tags: ['compliance', 'sox', 'regulations'],
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
    question_id: 'Q-D5.O4-04',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O4',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'An organization appoints a senior executive to define privacy standards, manage compliance audits, and act as the point of contact for regulatory inquiries regarding user data leaks. What is this role called?',
    choices: [
      { id: 'A', text: 'Chief Financial Officer (CFO)' },
      { id: 'B', text: 'Data Protection Officer (DPO)' },
      { id: 'C', text: 'Systems Administrator' },
      { id: 'D', text: 'Data Custodian' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A Data Protection Officer (DPO) is responsible for overseeing data protection strategy and implementation to ensure compliance with privacy regulations (like GDPR).',
      why_not_others: {
        'A': 'CFOs manage corporate finance.',
        'C': 'Administrators configure hosts but do not manage organizational privacy compliance.',
        'D': 'Data custodians manage the technical storage and backup of data, rather than regulatory governance.'
      }
    },
    tags: ['compliance', 'dpo', 'roles'],
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
    question_id: 'Q-D5.O5-02',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O5',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'An organization hires an ethical hacking firm to simulate an attack on their network. The hackers are given no information about the internal network topology or server configurations beforehand, mimicking a real-world external threat. What type of assessment is this?',
    choices: [
      { id: 'A', text: 'Vulnerability Scan' },
      { id: 'B', text: 'Black-box Penetration Test' },
      { id: 'C', text: 'White-box Penetration Test' },
      { id: 'D', text: 'Compliance Audit' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A black-box penetration test is conducted without any prior knowledge of the target system\'s infrastructure, simulating an external attacker\'s perspective.',
      why_not_others: {
        'A': 'Vulnerability scans are automated scans for known signature holes, they do not attempt active exploitation.',
        'C': 'White-box tests give hackers complete documentation and network maps beforehand.',
        'D': 'Audits check compliance checksheets, they do not simulate active exploits.'
      }
    },
    tags: ['audits', 'penetration-test', 'black-box'],
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
    question_id: 'Q-D5.O5-03',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O5',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'easy',
    prompt: 'A security team gathers business unit leaders in a conference room. They present a hypothetical scenario where the company\'s website is knocked offline by a DDoS attack and lead a verbal discussion of roles, contact protocols, and recovery steps. What is this exercise called?',
    choices: [
      { id: 'A', text: 'Full-scale physical evacuation' },
      { id: 'B', text: 'Tabletop Exercise' },
      { id: 'C', text: 'Credentialed vulnerability scan' },
      { id: 'D', text: 'Parallel test' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A tabletop exercise is a discussion-based simulation where key personnel meet to verbally walk through their responses to a disaster scenario, identifying gaps in plans.',
      why_not_others: {
        'A': 'Physical evacuations move staff physically out of buildings.',
        'C': 'Scans are automated software checks.',
        'D': 'Parallel testing runs duplicate physical servers, rather than discussion sessions.'
      }
    },
    tags: ['audits', 'tabletop', 'disaster-recovery'],
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
    question_id: 'Q-D5.O5-04',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O5',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'medium',
    prompt: 'To ensure audit objectivity and prevent organizational bias, the team responsible for auditing internal server configurations reports directly to which of the following governing bodies?',
    choices: [
      { id: 'A', text: 'The IT operations supervisor' },
      { id: 'B', text: 'The corporate Board Audit Committee' },
      { id: 'C', text: 'The software development lead' },
      { id: 'D', text: 'The database administration manager' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Auditors must remain independent. Reporting directly to the Board\'s Audit Committee bypasses the operational chain of management, avoiding conflicts of interest and pressure to alter findings.',
      why_not_others: {
        'A': 'Reporting to IT supervisors creates conflicts because the supervisor is responsible for the systems being audited.',
        'C': 'Development leads manage software creation, not audit governance.',
        'D': 'DB managers run databases; having auditors report to them ruins audit independence.'
      }
    },
    tags: ['audits', 'governance', 'independence'],
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
    question_id: 'Q-D5.O6-01',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O6',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An organization sends benign, simulated phishing emails to employees and records who clicks links or submits login data. Employees who fail are automatically enrolled in remedial training. What is this security practice?',
    choices: [
      { id: 'A', text: 'Active penetration testing' },
      { id: 'B', text: 'Simulated Phishing Campaign' },
      { id: 'C', text: 'Social engineering risk transfer' },
      { id: 'D', text: 'Role-Based Access control' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Phishing simulations train employees to recognize malicious emails by sending controlled, simulated attacks and assigning educational materials to those who fall victim.',
      why_not_others: {
        'A': 'Penetration tests target software/network vulnerabilities, not employee email hygiene metrics.',
        'C': 'Risk transfer uses insurance or contracts, not internal employee training.',
        'D': 'RBAC controls folder permissions, not phishing metrics.'
      }
    },
    tags: ['awareness', 'phishing', 'training'],
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
    question_id: 'Q-D5.O6-02',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O6',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'To prevent vulnerabilities like SQL Injection and Cross-Site Scripting (XSS) in their products, an organization mandates that all software developers attend training sessions on secure coding principles (OWASP Top 10). What is this awareness practice?',
    choices: [
      { id: 'A', text: 'Vulnerability scanning' },
      { id: 'B', text: 'Targeted Developer Security Training' },
      { id: 'C', text: 'Code signing certificates' },
      { id: 'D', text: 'Quantitative risk analysis' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Targeted training ensures staff with specific roles (like developers) receive security training relevant to their tasks, such as secure coding practices.',
      why_not_others: {
        'A': 'Scanning detects issues in code, but training prevents developers from writing them in the first place.',
        'C': 'Signing certificates verify developer identity; they do not improve code quality.',
        'D': 'Risk analysis calculates financial impact metrics, it is not developer education.'
      }
    },
    tags: ['awareness', 'training', 'secure-coding'],
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
    question_id: 'Q-D5.O6-03',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O6',
    topic_ids: [],
    type: 'mcq',
    difficulty: 'easy',
    prompt: 'An organization enforces a policy requiring all physical documents containing sensitive customer data to be locked in drawers when employees leave their desks, and screens must be locked. What policy is this?',
    choices: [
      { id: 'A', text: 'Acceptable Use Policy (AUP)' },
      { id: 'B', text: 'Clean Desk Policy' },
      { id: 'C', text: 'Data retention standard' },
      { id: 'D', text: 'Change management policy' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'A clean desk policy mandates that sensitive documents and physical media are locked away when not in use, preventing shoulder surfing or theft.',
      why_not_others: {
        'A': 'An AUP defines rules for using corporate IT systems.',
        'C': 'Retention standards define how long data is stored before deletion.',
        'D': 'Change management governs code and system upgrades.'
      }
    },
    tags: ['awareness', 'clean-desk', 'physical-security'],
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
    question_id: 'Q-D5.O6-04',
    exam_version: 'SY0-701',
    domain_id: 'D5',
    objective_id: 'D5.O6',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'easy',
    prompt: 'An enterprise wants to improve employee participation in security training. They replace traditional slide decks with an interactive quiz platform featuring points, badges, and a department leaderboard. What awareness technique is this?',
    choices: [
      { id: 'A', text: 'Social engineering' },
      { id: 'B', text: 'Gamification' },
      { id: 'C', text: 'Phishing simulation' },
      { id: 'D', text: 'Access review' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Gamification uses game-like elements (points, badges, leaderboards) in non-game environments to increase user engagement and learning retention during training.',
      why_not_others: {
        'A': 'Social engineering is the threat vector attempting to deceive staff.',
        'C': 'Phishing simulations are training email tests, not general slide replacements.',
        'D': 'Access reviews audit system folder permissions.'
      }
    },
    tags: ['awareness', 'gamification', 'training'],
    estimated_seconds: 40,
    provenance: {
      author_type: 'original',
      source_origin: ['CompTIA objective map'],
      copyright_status: 'original',
      license_note: 'safe_to_export',
      import_policy: 'n/a'
    },
    status: 'active'
  }
,
  {
    question_id: 'Q-D1.O3-04',
    exam_version: 'SY0-701',
    domain_id: 'D1',
    objective_id: 'D1.O3',
    topic_ids: [],
    type: 'scenario_mcq',
    difficulty: 'medium',
    prompt: 'An organization is migrating their legacy on-premise document server to a public cloud storage service. During the migration, a team lead discovers that the cloud storage bucket permissions were accidentally configured to allow public access. According to change management standards, which phase of the change control process was bypassed?',
    choices: [
      { id: 'A', text: 'Request for Change (RFC) submission' },
      { id: 'B', text: 'Security impact analysis and validation testing' },
      { id: 'C', text: 'Standard rollback scheduling' },
      { id: 'D', text: 'Post-implementation review (PIR)' }
    ],
    correct_answers: ['B'],
    explanation: {
      why_correct: 'Security impact analysis and validation testing inside change management ensures that security configurations, settings, and permissions are verified in a staging environment before the change is applied to production.',
      why_not_others: {
        'A': 'RFC submission is the initial step to document the requested change, not the testing or validation phase.',
        'C': 'Rollback scheduling prepares steps to revert a change if it fails, rather than validating permissions prior to migration.',
        'D': 'A PIR happens after the migration is completed to evaluate outcomes, whereas this issue should have been caught during pre-deployment validation testing.'
      }
    },
    tags: ['change-management', 'validation', 'cloud-security'],
    estimated_seconds: 50,
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
