// Exact control references and titles extracted from the read-only production audit.
export const policyControlFrameworks = [
  {
    "framework": "HIPAA",
    "controls": [
      {
        "id": "AC-01",
        "title": "Multi-factor authentication for the cloud console (e.g., AWS)"
      },
      {
        "id": "AC-02",
        "title": "VPN access management with MFA"
      },
      {
        "id": "AC-03",
        "title": "Platform access management with MFA"
      },
      {
        "id": "AC-04",
        "title": "Role definition in cloud and platform (RBAC, least privilege)"
      },
      {
        "id": "AC-05",
        "title": "Cloud IAM groups to enforce access restrictions"
      },
      {
        "id": "AC-06",
        "title": "Managed identity service or SSO for user authentication (e.g., AWS Cognito, Okta)"
      },
      {
        "id": "AC-07",
        "title": "Just-in-time access for privileged operations"
      },
      {
        "id": "AC-08",
        "title": "Strong password enforcement"
      },
      {
        "id": "AC-09",
        "title": "Session timeout and auto-logout, cloud console"
      },
      {
        "id": "AC-10",
        "title": "Session timeout and auto-logout, platform"
      },
      {
        "id": "AC-11",
        "title": "Break-glass emergency access accounts with alerting"
      },
      {
        "id": "AS-01",
        "title": "Restrict HTTP methods"
      },
      {
        "id": "AS-02",
        "title": "Code scanning (e.g., Snyk, Dependabot, AWS CodeGuru)"
      },
      {
        "id": "AS-03",
        "title": "API gateway security (e.g., AWS API Gateway)"
      },
      {
        "id": "AS-04",
        "title": "Automated vulnerability scanning"
      },
      {
        "id": "AS-05",
        "title": "Secure SDLC"
      },
      {
        "id": "AS-06",
        "title": "API authentication (OAuth 2.0, OpenID Connect)"
      },
      {
        "id": "AS-07",
        "title": "Static and dynamic application security testing"
      },
      {
        "id": "AS-08",
        "title": "Strict Content Security Policy rules"
      },
      {
        "id": "AS-09",
        "title": "Runtime application self-protection"
      },
      {
        "id": "BR-01",
        "title": "Multi-region disaster recovery failover"
      },
      {
        "id": "BR-02",
        "title": "Automated backups"
      },
      {
        "id": "BR-03",
        "title": "Backup validation"
      },
      {
        "id": "BR-04",
        "title": "Automated snapshots of compute instances"
      },
      {
        "id": "BR-05",
        "title": "Offsite backup"
      },
      {
        "id": "BR-06",
        "title": "DR test schedule and result monitoring"
      },
      {
        "id": "BR-07",
        "title": "Alerts for backup failures"
      },
      {
        "id": "BR-08",
        "title": "Load balancing"
      },
      {
        "id": "BR-09",
        "title": "Backup retention and deletion"
      },
      {
        "id": "BR-10",
        "title": "Emergency mode operations runbook"
      },
      {
        "id": "BR-11",
        "title": "Applications and data criticality analysis with RTO and RPO targets"
      },
      {
        "id": "DC-01",
        "title": "Hosting region selection based on customer data residency"
      },
      {
        "id": "DC-02",
        "title": "Review of cloud provider data center security (e.g., SOC 2, ISO 27001 reports)"
      },
      {
        "id": "DE-01",
        "title": "Monitoring of company devices"
      },
      {
        "id": "DE-02",
        "title": "Device provisioning for staff accessing sensitive information"
      },
      {
        "id": "DE-03",
        "title": "Automatic deactivation of lost or stolen devices"
      },
      {
        "id": "DE-04",
        "title": "Enforcement of security patches and software updates"
      },
      {
        "id": "DE-05",
        "title": "Full disk encryption on company devices"
      },
      {
        "id": "DE-06",
        "title": "Mobile device management"
      },
      {
        "id": "DE-07",
        "title": "Antivirus and anti-malware enforcement"
      },
      {
        "id": "DE-08",
        "title": "Asset management and inventory"
      },
      {
        "id": "DE-09",
        "title": "Secure disposal of retired devices"
      },
      {
        "id": "DE-10",
        "title": "Remote data wipe"
      },
      {
        "id": "DE-11",
        "title": "Sanitisation of devices and media before reissue"
      },
      {
        "id": "DS-01",
        "title": "Encryption of PHI in transit (TLS 1.2/1.3)"
      },
      {
        "id": "DS-02",
        "title": "AES-256 encryption of PHI at rest"
      },
      {
        "id": "DS-03",
        "title": "Encrypted backups with cross-region redundancy (e.g., AWS Backup)"
      },
      {
        "id": "DS-04",
        "title": "Secure email via encryption (TLS, PGP)"
      },
      {
        "id": "DS-05",
        "title": "Tokenization of PHI"
      },
      {
        "id": "DS-06",
        "title": "Encryption key management"
      },
      {
        "id": "DS-07",
        "title": "Inventory of all data repositories"
      },
      {
        "id": "DS-08",
        "title": "Automated patch management tool"
      },
      {
        "id": "DS-09",
        "title": "Information classification"
      },
      {
        "id": "DS-10",
        "title": "Digital signatures for sensitive files"
      },
      {
        "id": "GC-01",
        "title": "Compliance certifications and audit"
      },
      {
        "id": "GC-02",
        "title": "Penetration testing"
      },
      {
        "id": "GC-03",
        "title": "Cloud framework security reviews (e.g., AWS Well-Architected)"
      },
      {
        "id": "GC-04",
        "title": "Annual documented risk assessment and risk register"
      },
      {
        "id": "GC-05",
        "title": "Designated security official and privacy officer"
      },
      {
        "id": "GC-06",
        "title": "Policy version control and 6-year documentation retention"
      },
      {
        "id": "HR-01",
        "title": "Employee handbook"
      },
      {
        "id": "HR-02",
        "title": "Access control termination"
      },
      {
        "id": "HR-03",
        "title": "Employee onboarding"
      },
      {
        "id": "HR-04",
        "title": "Employee offboarding"
      },
      {
        "id": "HR-05",
        "title": "Job description management"
      },
      {
        "id": "HR-06",
        "title": "NDA and confidentiality agreements"
      },
      {
        "id": "HR-07",
        "title": "Background check verification"
      },
      {
        "id": "HR-08",
        "title": "Workstation security and acceptable use"
      },
      {
        "id": "HR-09",
        "title": "Annual access review"
      },
      {
        "id": "HR-10",
        "title": "Documented sanctions for workforce violations"
      },
      {
        "id": "IR-01",
        "title": "On-call triage plan"
      },
      {
        "id": "IR-02",
        "title": "Tabletop exercise for disaster recovery"
      },
      {
        "id": "IR-03",
        "title": "Incident alert monitoring and escalation (e.g., PagerDuty, ticketing system)"
      },
      {
        "id": "IR-04",
        "title": "Breach notification plan"
      },
      {
        "id": "IR-05",
        "title": "Incident response plan"
      },
      {
        "id": "LM-01",
        "title": "Keystroke logging alerts for admin accounts"
      },
      {
        "id": "LM-02",
        "title": "Cloud audit logging and configuration tracking (e.g., AWS CloudTrail, AWS Config)"
      },
      {
        "id": "LM-03",
        "title": "Intrusion detection system"
      },
      {
        "id": "LM-04",
        "title": "Root access and SSH session monitoring"
      },
      {
        "id": "LM-05",
        "title": "User activity monitoring"
      },
      {
        "id": "LM-06",
        "title": "SIEM integration"
      },
      {
        "id": "LM-07",
        "title": "Automated threat detection"
      },
      {
        "id": "LM-08",
        "title": "File integrity monitoring"
      },
      {
        "id": "LM-09",
        "title": "Bot detection"
      },
      {
        "id": "LM-10",
        "title": "API threat intelligence"
      },
      {
        "id": "NI-01",
        "title": "Client-side security agents (e.g., CrowdStrike, SentinelOne)"
      },
      {
        "id": "NI-02",
        "title": "Firewall on employee home networks"
      },
      {
        "id": "NI-03",
        "title": "Network segmentation in the cloud environment"
      },
      {
        "id": "NI-04",
        "title": "Certificate management (e.g., AWS Certificate Manager)"
      },
      {
        "id": "NI-05",
        "title": "DDoS protection"
      },
      {
        "id": "NI-06",
        "title": "Infrastructure as code"
      },
      {
        "id": "NI-07",
        "title": "Web application firewall"
      },
      {
        "id": "NI-08",
        "title": "IP allow-listing"
      },
      {
        "id": "NI-09",
        "title": "Secure DNS"
      },
      {
        "id": "NI-10",
        "title": "Endpoint detection and response"
      },
      {
        "id": "OW-01",
        "title": "Clear desk enforcement"
      },
      {
        "id": "PR-01",
        "title": "Minimum necessary standard for uses, disclosures and requests of PHI"
      },
      {
        "id": "PR-02",
        "title": "Notice of privacy practices"
      },
      {
        "id": "PR-03",
        "title": "Individual right of access to PHI"
      },
      {
        "id": "PR-04",
        "title": "Individual right to amend PHI"
      },
      {
        "id": "PR-05",
        "title": "Accounting of disclosures"
      },
      {
        "id": "PR-06",
        "title": "Privacy complaints process"
      },
      {
        "id": "TR-01",
        "title": "Incident response training"
      },
      {
        "id": "TR-02",
        "title": "HIPAA compliance training"
      },
      {
        "id": "TR-03",
        "title": "Sensitive information management training for staff with access to sensitive data"
      },
      {
        "id": "TR-04",
        "title": "Remote work training"
      },
      {
        "id": "TR-05",
        "title": "Security awareness training"
      },
      {
        "id": "VR-01",
        "title": "Vendor selection assessment"
      },
      {
        "id": "VR-02",
        "title": "Continuous vendor security assessment"
      },
      {
        "id": "VR-03",
        "title": "Executed business associate agreement before a vendor handles PHI"
      },
      {
        "id": "WH-01",
        "title": "VPN required for access to sensitive information"
      },
      {
        "id": "WH-02",
        "title": "Prohibition on personal devices for sensitive information"
      },
      {
        "id": "WH-03",
        "title": "Strong Wi-Fi passwords"
      },
      {
        "id": "WH-04",
        "title": "VPN on public Wi-Fi"
      },
      {
        "id": "WH-05",
        "title": "Wi-Fi network encryption"
      }
    ]
  },
  {
    "framework": "ISO/IEC 27001:2022",
    "controls": [
      {
        "id": "A.5.1",
        "title": "Policies for information security"
      },
      {
        "id": "A.5.10",
        "title": "Acceptable use of information and other associated assets"
      },
      {
        "id": "A.5.11",
        "title": "Return of assets"
      },
      {
        "id": "A.5.12",
        "title": "Classification of information"
      },
      {
        "id": "A.5.13",
        "title": "Labelling of information"
      },
      {
        "id": "A.5.14",
        "title": "Information transfer"
      },
      {
        "id": "A.5.15",
        "title": "Access control"
      },
      {
        "id": "A.5.16",
        "title": "Identity management"
      },
      {
        "id": "A.5.17",
        "title": "Authentication information"
      },
      {
        "id": "A.5.18",
        "title": "Access rights"
      },
      {
        "id": "A.5.19",
        "title": "Information security in supplier relationships"
      },
      {
        "id": "A.5.2",
        "title": "Information security roles and responsibilities"
      },
      {
        "id": "A.5.20",
        "title": "Addressing information security within supplier agreements"
      },
      {
        "id": "A.5.21",
        "title": "Managing information security in the ICT supply chain"
      },
      {
        "id": "A.5.22",
        "title": "Monitoring, review and change management of supplier services"
      },
      {
        "id": "A.5.23",
        "title": "Information security for use of cloud services ★ NEW"
      },
      {
        "id": "A.5.24",
        "title": "Information security incident management planning and preparation"
      },
      {
        "id": "A.5.25",
        "title": "Assessment and decision on information security events"
      },
      {
        "id": "A.5.26",
        "title": "Response to information security incidents"
      },
      {
        "id": "A.5.27",
        "title": "Learning from information security incidents"
      },
      {
        "id": "A.5.28",
        "title": "Collection of evidence"
      },
      {
        "id": "A.5.29",
        "title": "Information security during disruption"
      },
      {
        "id": "A.5.3",
        "title": "Segregation of duties"
      },
      {
        "id": "A.5.30",
        "title": "ICT readiness for business continuity ★ NEW"
      },
      {
        "id": "A.5.31",
        "title": "Legal, statutory, regulatory and contractual requirements"
      },
      {
        "id": "A.5.32",
        "title": "Intellectual property rights"
      },
      {
        "id": "A.5.33",
        "title": "Protection of records"
      },
      {
        "id": "A.5.34",
        "title": "Privacy and protection of PII"
      },
      {
        "id": "A.5.35",
        "title": "Independent review of information security"
      },
      {
        "id": "A.5.36",
        "title": "Compliance with policies, rules and standards for information security"
      },
      {
        "id": "A.5.37",
        "title": "Documented operating procedures"
      },
      {
        "id": "A.5.4",
        "title": "Management responsibilities"
      },
      {
        "id": "A.5.5",
        "title": "Contact with authorities"
      },
      {
        "id": "A.5.6",
        "title": "Contact with special interest groups"
      },
      {
        "id": "A.5.7",
        "title": "Threat intelligence ★ NEW"
      },
      {
        "id": "A.5.8",
        "title": "Information security in project management"
      },
      {
        "id": "A.5.9",
        "title": "Inventory of information and other associated assets"
      },
      {
        "id": "A.6.1",
        "title": "Screening"
      },
      {
        "id": "A.6.2",
        "title": "Terms and conditions of employment"
      },
      {
        "id": "A.6.3",
        "title": "Information security awareness, education and training"
      },
      {
        "id": "A.6.4",
        "title": "Disciplinary process"
      },
      {
        "id": "A.6.5",
        "title": "Responsibilities after termination or change of employment"
      },
      {
        "id": "A.6.6",
        "title": "Confidentiality or non-disclosure agreements"
      },
      {
        "id": "A.6.7",
        "title": "Remote working"
      },
      {
        "id": "A.6.8",
        "title": "Information security event reporting"
      },
      {
        "id": "A.7.1",
        "title": "Physical security perimeters"
      },
      {
        "id": "A.7.10",
        "title": "Storage media"
      },
      {
        "id": "A.7.11",
        "title": "Supporting utilities"
      },
      {
        "id": "A.7.12",
        "title": "Cabling security"
      },
      {
        "id": "A.7.13",
        "title": "Equipment maintenance"
      },
      {
        "id": "A.7.14",
        "title": "Secure disposal or re-use of equipment"
      },
      {
        "id": "A.7.2",
        "title": "Physical entry"
      },
      {
        "id": "A.7.3",
        "title": "Securing offices, rooms and facilities"
      },
      {
        "id": "A.7.4",
        "title": "Physical security monitoring ★ NEW"
      },
      {
        "id": "A.7.5",
        "title": "Protecting against physical and environmental threats"
      },
      {
        "id": "A.7.6",
        "title": "Working in secure areas"
      },
      {
        "id": "A.7.7",
        "title": "Clear desk and clear screen"
      },
      {
        "id": "A.7.8",
        "title": "Equipment siting and protection"
      },
      {
        "id": "A.7.9",
        "title": "Security of assets off-premises"
      },
      {
        "id": "A.8.1",
        "title": "User endpoint devices"
      },
      {
        "id": "A.8.10",
        "title": "Information deletion ★ NEW"
      },
      {
        "id": "A.8.11",
        "title": "Data masking ★ NEW"
      },
      {
        "id": "A.8.12",
        "title": "Data leakage prevention ★ NEW"
      },
      {
        "id": "A.8.13",
        "title": "Information backup"
      },
      {
        "id": "A.8.14",
        "title": "Redundancy of information processing facilities"
      },
      {
        "id": "A.8.15",
        "title": "Logging"
      },
      {
        "id": "A.8.16",
        "title": "Monitoring activities ★ NEW"
      },
      {
        "id": "A.8.17",
        "title": "Clock synchronisation"
      },
      {
        "id": "A.8.18",
        "title": "Use of privileged utility programs"
      },
      {
        "id": "A.8.19",
        "title": "Installation of software on operational systems"
      },
      {
        "id": "A.8.2",
        "title": "Privileged access rights"
      },
      {
        "id": "A.8.20",
        "title": "Networks security"
      },
      {
        "id": "A.8.21",
        "title": "Security of network services"
      },
      {
        "id": "A.8.22",
        "title": "Segregation of networks"
      },
      {
        "id": "A.8.23",
        "title": "Web filtering ★ NEW"
      },
      {
        "id": "A.8.24",
        "title": "Use of cryptography"
      },
      {
        "id": "A.8.25",
        "title": "Secure development life cycle"
      },
      {
        "id": "A.8.26",
        "title": "Application security requirements"
      },
      {
        "id": "A.8.27",
        "title": "Secure system architecture and engineering principles"
      },
      {
        "id": "A.8.28",
        "title": "Secure coding ★ NEW"
      },
      {
        "id": "A.8.29",
        "title": "Security testing in development and acceptance"
      },
      {
        "id": "A.8.3",
        "title": "Information access restriction"
      },
      {
        "id": "A.8.30",
        "title": "Outsourced development"
      },
      {
        "id": "A.8.31",
        "title": "Separation of development, test and production environments"
      },
      {
        "id": "A.8.32",
        "title": "Change management"
      },
      {
        "id": "A.8.33",
        "title": "Test information"
      },
      {
        "id": "A.8.34",
        "title": "Protection of information systems during audit testing"
      },
      {
        "id": "A.8.4",
        "title": "Access to source code"
      },
      {
        "id": "A.8.5",
        "title": "Secure authentication"
      },
      {
        "id": "A.8.6",
        "title": "Capacity management"
      },
      {
        "id": "A.8.7",
        "title": "Protection against malware"
      },
      {
        "id": "A.8.8",
        "title": "Management of technical vulnerabilities"
      },
      {
        "id": "A.8.9",
        "title": "Configuration management ★ NEW"
      }
    ]
  },
  {
    "framework": "NIST CSF 2.0",
    "controls": [
      {
        "id": "DE.AE-02",
        "title": "Potentially Adverse Events Analyzed"
      },
      {
        "id": "DE.AE-03",
        "title": "Information Correlated"
      },
      {
        "id": "DE.AE-04",
        "title": "Estimated Impact Established"
      },
      {
        "id": "DE.AE-06",
        "title": "Information Provided to Authorized Staff"
      },
      {
        "id": "DE.AE-07",
        "title": "Cyber Threat Intelligence Integrated"
      },
      {
        "id": "DE.AE-08",
        "title": "Incidents Declared"
      },
      {
        "id": "DE.CM-01",
        "title": "Networks Monitored"
      },
      {
        "id": "DE.CM-02",
        "title": "Physical Environment Monitored"
      },
      {
        "id": "DE.CM-03",
        "title": "Personnel Activity Monitored"
      },
      {
        "id": "DE.CM-06",
        "title": "External Service Provider Activities Monitored"
      },
      {
        "id": "DE.CM-09",
        "title": "Computing Hardware and Software Monitored"
      },
      {
        "id": "GV.OC-01",
        "title": "Organizational Mission Understood"
      },
      {
        "id": "GV.OC-02",
        "title": "Internal and External Stakeholders Identified"
      },
      {
        "id": "GV.OC-03",
        "title": "Legal and Regulatory Requirements Understood"
      },
      {
        "id": "GV.OC-04",
        "title": "Critical Objectives and Dependencies Understood"
      },
      {
        "id": "GV.OC-05",
        "title": "Outcomes and Resilience Requirements Understood"
      },
      {
        "id": "GV.OV-01",
        "title": "Cybersecurity Risk Management Reviewed"
      },
      {
        "id": "GV.OV-02",
        "title": "Cybersecurity Strategy Reviewed"
      },
      {
        "id": "GV.OV-03",
        "title": "Organizational Cybersecurity Performance Reviewed"
      },
      {
        "id": "GV.PO-01",
        "title": "Cybersecurity Policy Established"
      },
      {
        "id": "GV.PO-02",
        "title": "Policy Reviewed and Updated"
      },
      {
        "id": "GV.RM-01",
        "title": "Risk Management Objectives Established"
      },
      {
        "id": "GV.RM-02",
        "title": "Risk Appetite and Tolerance Established"
      },
      {
        "id": "GV.RM-03",
        "title": "Cybersecurity Risk Management Integrated"
      },
      {
        "id": "GV.RM-04",
        "title": "Strategic Direction Communicated"
      },
      {
        "id": "GV.RM-05",
        "title": "Lines of Communication Established"
      },
      {
        "id": "GV.RM-06",
        "title": "Standardized Response Methods Established"
      },
      {
        "id": "GV.RM-07",
        "title": "Strategic Opportunities Considered"
      },
      {
        "id": "GV.RR-01",
        "title": "Leadership Accountable for Cybersecurity Risk"
      },
      {
        "id": "GV.RR-02",
        "title": "Roles and Responsibilities Assigned"
      },
      {
        "id": "GV.RR-03",
        "title": "Adequate Resources Provided"
      },
      {
        "id": "GV.RR-04",
        "title": "Cybersecurity Integrated in Human Resources"
      },
      {
        "id": "GV.SC-01",
        "title": "Supply Chain Risk Management Policy Established"
      },
      {
        "id": "GV.SC-02",
        "title": "Cybersecurity Roles in Supply Chain Established"
      },
      {
        "id": "GV.SC-03",
        "title": "Supply Chain Risk Management Integrated"
      },
      {
        "id": "GV.SC-04",
        "title": "Suppliers Inventoried"
      },
      {
        "id": "GV.SC-05",
        "title": "Requirements Established for Suppliers"
      },
      {
        "id": "GV.SC-06",
        "title": "Planning and Due Diligence Performed"
      },
      {
        "id": "GV.SC-07",
        "title": "Supplier Security Practices Assessed"
      },
      {
        "id": "GV.SC-08",
        "title": "Relevant Suppliers Treated as Critical Infrastructure"
      },
      {
        "id": "GV.SC-09",
        "title": "Supply Chain Security Practices Assessed Before Acquisition"
      },
      {
        "id": "GV.SC-10",
        "title": "Cybersecurity Supply Chain Risk Managed Throughout Product Lifecycle"
      },
      {
        "id": "ID.AM-01",
        "title": "Inventories of Hardware Maintained"
      },
      {
        "id": "ID.AM-02",
        "title": "Inventories of Software Maintained"
      },
      {
        "id": "ID.AM-03",
        "title": "Network Representations Maintained"
      },
      {
        "id": "ID.AM-04",
        "title": "Inventories of Services Maintained"
      },
      {
        "id": "ID.AM-05",
        "title": "Assets Prioritized"
      },
      {
        "id": "ID.AM-07",
        "title": "Inventories of Data Maintained"
      },
      {
        "id": "ID.AM-08",
        "title": "Assets Managed Throughout Lifecycle"
      },
      {
        "id": "ID.IM-01",
        "title": "Improvements Identified from Evaluations"
      },
      {
        "id": "ID.IM-02",
        "title": "Improvements Identified from Security Tests and Exercises"
      },
      {
        "id": "ID.IM-03",
        "title": "Improvements Identified from Execution of Operational Processes"
      },
      {
        "id": "ID.IM-04",
        "title": "Incident Response Plans Updated"
      },
      {
        "id": "ID.RA-01",
        "title": "Vulnerabilities in Assets Identified"
      },
      {
        "id": "ID.RA-02",
        "title": "Cyber Threat Intelligence Received"
      },
      {
        "id": "ID.RA-03",
        "title": "Internal and External Threats Identified"
      },
      {
        "id": "ID.RA-04",
        "title": "Potential Impacts and Likelihoods Identified"
      },
      {
        "id": "ID.RA-05",
        "title": "Threats, Vulnerabilities, and Impacts Used to Understand Risk"
      },
      {
        "id": "ID.RA-06",
        "title": "Risk Responses Chosen and Prioritized"
      },
      {
        "id": "ID.RA-07",
        "title": "Changes Identified and Assessed"
      },
      {
        "id": "ID.RA-08",
        "title": "Processes Established for Receiving Vulnerability Reports"
      },
      {
        "id": "ID.RA-09",
        "title": "Authenticity of Hardware and Software Verified"
      },
      {
        "id": "ID.RA-10",
        "title": "Critical Suppliers Assessed"
      },
      {
        "id": "PR.AA-01",
        "title": "Identities and Credentials Managed"
      },
      {
        "id": "PR.AA-02",
        "title": "Identity Proofing and Binding Performed"
      },
      {
        "id": "PR.AA-03",
        "title": "Users, Services, and Hardware Authenticated"
      },
      {
        "id": "PR.AA-04",
        "title": "Identity Assertions Protected"
      },
      {
        "id": "PR.AA-05",
        "title": "Access Permissions Managed"
      },
      {
        "id": "PR.AA-06",
        "title": "Physical Access Managed"
      },
      {
        "id": "PR.AT-01",
        "title": "Awareness Training Provided"
      },
      {
        "id": "PR.AT-02",
        "title": "Role-Based Training Provided"
      },
      {
        "id": "PR.DS-01",
        "title": "Data-at-Rest Protected"
      },
      {
        "id": "PR.DS-02",
        "title": "Data-in-Transit Protected"
      },
      {
        "id": "PR.DS-10",
        "title": "Data-in-Use Protected"
      },
      {
        "id": "PR.DS-11",
        "title": "Backups of Data Maintained"
      },
      {
        "id": "PR.IR-01",
        "title": "Networks and Environments Protected"
      },
      {
        "id": "PR.IR-02",
        "title": "Internet-Facing Attack Surface Managed"
      },
      {
        "id": "PR.IR-03",
        "title": "Mechanisms Implemented to Achieve Resilience Requirements"
      },
      {
        "id": "PR.IR-04",
        "title": "Adequate Resource Capacity Ensured"
      },
      {
        "id": "PR.PS-01",
        "title": "Configuration Management Performed"
      },
      {
        "id": "PR.PS-02",
        "title": "Software Maintained"
      },
      {
        "id": "PR.PS-03",
        "title": "Hardware Maintained"
      },
      {
        "id": "PR.PS-04",
        "title": "Log Records Created and Protected"
      },
      {
        "id": "PR.PS-05",
        "title": "Installation and Execution of Unauthorized Software Prevented"
      },
      {
        "id": "PR.PS-06",
        "title": "Secure Software Development Practices Used"
      },
      {
        "id": "RC.CO-03",
        "title": "Recovery Activities Communicated"
      },
      {
        "id": "RC.CO-04",
        "title": "Public Updates Issued"
      },
      {
        "id": "RC.RP-01",
        "title": "Recovery Plan Executed"
      },
      {
        "id": "RC.RP-02",
        "title": "Recovery Actions Selected"
      },
      {
        "id": "RC.RP-03",
        "title": "Integrity of Backups and Other Restoration Assets Verified"
      },
      {
        "id": "RC.RP-04",
        "title": "Critical Services Restored"
      },
      {
        "id": "RC.RP-05",
        "title": "Restoration Activities Verified"
      },
      {
        "id": "RC.RP-06",
        "title": "End of Incident Declared"
      },
      {
        "id": "RS.AN-03",
        "title": "Analysis Performed to Determine What Occurred"
      },
      {
        "id": "RS.AN-06",
        "title": "Actions Performed During Investigation Cataloged"
      },
      {
        "id": "RS.AN-07",
        "title": "Incident Data and Metadata Collected"
      },
      {
        "id": "RS.AN-08",
        "title": "Magnitude of Incidents Estimated"
      },
      {
        "id": "RS.CO-02",
        "title": "Internal Stakeholders Notified"
      },
      {
        "id": "RS.CO-03",
        "title": "Information Shared with Designated Parties"
      },
      {
        "id": "RS.MA-01",
        "title": "Incident Response Plan Executed"
      },
      {
        "id": "RS.MA-02",
        "title": "Incident Reports Investigated"
      },
      {
        "id": "RS.MA-03",
        "title": "Incidents Categorized and Prioritized"
      },
      {
        "id": "RS.MA-04",
        "title": "Incidents Escalated or Elevated as Needed"
      },
      {
        "id": "RS.MA-05",
        "title": "Criteria for Initiating Incident Recovery Established"
      },
      {
        "id": "RS.MI-01",
        "title": "Incidents Contained"
      },
      {
        "id": "RS.MI-02",
        "title": "Incidents Eradicated"
      }
    ]
  }
];

export const policyControlCount = 314;

export const policyControls = policyControlFrameworks.flatMap(({ framework, controls }) =>
  controls.map((control) => ({ ...control, framework })),
);

export const getPolicyControlKey = (framework, controlId) => `${framework}::${controlId}`;
