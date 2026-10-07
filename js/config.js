/**
 * PRANAY VYAS — DIGITAL CITY PORTFOLIO CONFIGURATION
 * All portfolio information is centralized here for easy editing.
 */

export const portfolioConfig = {
  personal: {
    name: "Pranay Vyas",
    role: "B.Tech CSE Student • Aspiring Software Engineer",
    university: "JECRC University",
    degree: "B.Tech in Computer Science & Engineering (Core)",
    period: "2026 – Present",
    location: "Jaipur, Rajasthan, India",
    tagline: "CODE. LEARN. BUILD. EVOLVE.",
    shortBio: "Exploring programming, problem solving, and the world of software engineering through structured learning and disciplined practice.",
    longBio: [
      "Hello, I am Pranay Vyas — a first-year B.Tech Computer Science student at JECRC University with a deep curiosity for computing systems and software craft.",
      "Rather than chasing surface-level trends, I am laying solid foundations in low-level programming with C and C++, understanding memory, pointers, and the computational complexity of Data Structures & Algorithms (DSA).",
      "I view engineering as an iterative process: breaking down difficult problems, writing clean modular code, versioning everything on Git, and continuously evolving my mindset toward production software engineering.",
      "I am at the beginning of my journey, actively building problem-solving discipline, participating in hackathons, and preparing for opportunities where I can contribute to impactful software."
    ],
    email: "vprany37@gmail.com",
    githubUsername: "Pranay-vyas-01",
    githubUrl: "https://github.com/Pranay-vyas-01",
    linkedinUrl: "https://www.linkedin.com/in/pranay-vyas-bb12ab430/",
    availability: "Available for Summer Internships, Hackathon Teams & Open-Source Collaboration"
  },

  buildings: [
    {
      id: "about",
      number: "01",
      label: "ABOUT",
      title: "HOME BASE",
      subtitle: "Identity, Philosophy & Signature",
      desc: "Pranay's central hub, personal engineering story, and signature 3D PV artifact.",
      pos: { x: -14, z: 9, y: 0 },
      size: { w: 4.8, h: 10, d: 4.8 },
      color: "#8b5cf6",
      accent: "#a78bfa"
    },
    {
      id: "education",
      number: "02",
      label: "EDUCATION",
      title: "JECRC UNIVERSITY",
      subtitle: "Academic Foundation & Roadmap",
      desc: "Stylized modern university complex tracing university coursework, milestones, and computer science core.",
      pos: { x: -18, z: -7, y: 0 },
      size: { w: 5.2, h: 8.5, d: 5.2 },
      color: "#a78bfa",
      accent: "#c4b5fd"
    },
    {
      id: "skills",
      number: "03",
      label: "SKILLS",
      title: "TECH TOWER",
      subtitle: "3D Skill Network & Practices",
      desc: "Interactive 3D network of core technologies currently being mastered with honest learning records.",
      pos: { x: -6, z: -15, y: 0 },
      size: { w: 4.5, h: 14, d: 4.5 },
      color: "#7c3aed",
      accent: "#a855f7"
    },
    {
      id: "projects",
      number: "04",
      label: "PROJECTS",
      title: "PROJECT LABS",
      subtitle: "Future Builds & Storylines",
      desc: "Modular prototyping spaces and the Problem-Idea-Build-Result engineering storytelling framework.",
      pos: { x: 9, z: -13, y: 0 },
      size: { w: 5.5, h: 11, d: 5.5 },
      color: "#38bdf8",
      accent: "#818cf8"
    },
    {
      id: "github",
      number: "05",
      label: "GITHUB",
      title: "COMMAND CENTER",
      subtitle: "Telemetry & Live Repositories",
      desc: "Developer control room connected directly to GitHub API with live repository streaming.",
      pos: { x: 17, z: -4, y: 0 },
      size: { w: 5.0, h: 12.5, d: 5.0 },
      color: "#818cf8",
      accent: "#6366f1"
    },
    {
      id: "goals",
      number: "06",
      label: "GOALS",
      title: "FUTURE TOWER",
      subtitle: "Trajectory to Software Engineer",
      desc: "Tower of aspirations connecting Student -> Developer -> Software Engineer -> Future.",
      pos: { x: 15, z: 11, y: 0 },
      size: { w: 4.6, h: 16, d: 4.6 },
      color: "#c084fc",
      accent: "#e879f9"
    },
    {
      id: "resume",
      number: "07",
      label: "RESUME",
      title: "CAREER CENTER",
      subtitle: "Recruiter Fast-Scan & Document",
      desc: "Recruiter-optimized view with in-site document viewer, skills breakdown, and direct download.",
      pos: { x: 2, z: 15, y: 0 },
      size: { w: 4.8, h: 9.5, d: 4.8 },
      color: "#38bdf8",
      accent: "#67e8f9"
    },
    {
      id: "contact",
      number: "08",
      label: "CONTACT",
      title: "COMMUNICATION TOWER",
      subtitle: "Terminal & Social Hub",
      desc: "Signal mast with active transmission form, direct email link, and professional profiles.",
      pos: { x: -6, z: 6, y: 0 },
      size: { w: 4.0, h: 13, d: 4.0 },
      color: "#a855f7",
      accent: "#d8b4fe"
    },
    {
      id: "innovation",
      number: "09",
      label: "INNOVATION",
      title: "INNOVATION LAB",
      subtitle: "Hackathons, EDP & Competitions",
      desc: "Experimental lab for hackathon explorations, EDP startup thinking, and innovative problem solving.",
      pos: { x: 0, z: -3, y: 0 },
      size: { w: 5.2, h: 7.5, d: 5.2 },
      color: "#ec4899",
      accent: "#f472b6"
    }
  ],

  // 3D Skill Network
  skills: [
    {
      id: "c-lang",
      name: "C",
      category: "Low-Level & Core Systems",
      status: "CURRENTLY LEARNING",
      icon: "⚙️",
      summary: "Foundation of computer architecture and manual memory management.",
      details: "Studying low-level program flow, memory pointers, dynamic allocation (malloc/free), stack vs heap, structs, and file I/O. Writing robust procedural algorithms and understanding compiler translation to assembly.",
      topics: ["Pointers & Pointer Arithmetic", "Dynamic Memory Management", "Structs & Unions", "Bitwise Operations", "Modular Header Design"]
    },
    {
      id: "cpp-lang",
      name: "C++",
      category: "Object-Oriented & Performance",
      status: "CURRENTLY LEARNING",
      icon: "⚡",
      summary: "Modern C++ idioms, OOP design, and Standard Template Library (STL).",
      details: "Practicing classes, encapsulation, inheritance, polymorphism, RAII, references, copy semantics, and leveraging standard library containers (vector, unordered_map, set, priority_queue) for high-performance execution.",
      topics: ["OOP Principles & Abstraction", "STL Containers & Iterators", "Templates & Generic Code", "References & Memory Safety", "Competitive Problem Solving"]
    },
    {
      id: "dsa",
      name: "DSA",
      category: "Algorithms & Problem Solving",
      status: "CURRENTLY LEARNING",
      icon: "🧠",
      summary: "Algorithmic thinking, time/space complexity, and core data structures.",
      details: "Solving algorithmic problems daily. Mastering arrays, strings, two pointers, sliding window, recursion, linked lists, stacks, queues, and tree traversals. Focusing on writing clean, optimal solutions within strict time limits.",
      topics: ["Asymptotic Analysis (Big-O)", "Recursion & Backtracking", "Arrays, Strings & Hash Tables", "Linked Lists, Stacks & Queues", "Trees & Graph Fundamentals"]
    },
    {
      id: "github",
      name: "GitHub",
      category: "Version Control & Collaboration",
      status: "CURRENTLY LEARNING",
      icon: "🐙",
      summary: "Collaborative Git workflows, commits, branching, and pull requests.",
      details: "Maintaining an active GitHub profile (@Pranay-vyas-01). Committing code with clear semantic messages, managing feature branches, resolving merge conflicts, and preparing repositories with comprehensive documentation and READMEs.",
      topics: ["Git Plumbing & Porcelain", "Branching & Merging", "Pull Requests & Code Reviews", "Repository Architecture", "GitHub Actions & Automation"]
    },
    {
      id: "vscode",
      name: "VS Code",
      category: "Development Environment",
      status: "CURRENTLY LEARNING",
      icon: "💻",
      summary: "Daily engineering workstation, debugging configurations, and tooling.",
      details: "Configuring g++ and clang compiler toolchains, tasks.json, launch.json for interactive GDB/LLDB debugging, Vim keybindings, Git integration, and language server protocols for maximum developer productivity.",
      topics: ["GDB / LLDB Debugger Tooling", "tasks.json & launch.json Setup", "Compiler Flags & Build Tasks", "Productivity Extensions", "Integrated Terminal Workflows"]
    }
  ],

  // Education Timeline
  education: {
    institution: "JECRC University",
    location: "Jaipur, Rajasthan",
    degree: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science and Engineering (Core)",
    duration: "2026 – Present",
    status: "Active Full-Time Undergraduate",
    overview: "Engaged in an intensive core computer science curriculum covering computer programming, discrete mathematics, engineering sciences, and problem solving.",
    timeline: [
      {
        year: "2026",
        title: "Joined JECRC University — B.Tech CSE (Core)",
        subtitle: "Beginning the Engineering Journey",
        desc: "Commenced undergraduate studies in Computer Science and Engineering. Built strong foundation in C programming, procedural logic, and discrete computational mathematics.",
        badge: "Milestone Reached"
      },
      {
        year: "Present",
        title: "Deepening C++, DSA & Algorithmic Foundations",
        subtitle: "Daily Problem Solving & Systems Craft",
        desc: "Actively practicing algorithms and data structures on platforms like LeetCode and HackerRank. Deepening comprehension of Object-Oriented Programming and memory models in C++.",
        badge: "In Progress"
      },
      {
        year: "Upcoming",
        title: "Software Engineering & Applied Project Labs",
        subtitle: "Full-Stack Development & Collaborative Builds",
        desc: "Expanding into modern web systems, database design, API engineering, and participating in university and national hackathons.",
        badge: "Planned"
      },
      {
        year: "Horizon",
        title: "Industry Internships & Software Engineering Role",
        subtitle: "Transitioning from Student to Professional",
        desc: "Targeting engineering internships, open-source code contributions, and securing a position as a Software Development Engineer.",
        badge: "Target"
      }
    ]
  },

  // Projects system (Honest placeholders with storytelling framework)
  projects: {
    storytellingFramework: [
      { step: "01", name: "PROBLEM", desc: "Clearly defined real-world or technical bottleneck that demands a solution." },
      { step: "02", name: "IDEA", desc: "Architectural blueprint, algorithms, and design choices selected to address it." },
      { step: "03", name: "BUILD", desc: "Hands-on implementation, toolchain, data flow, and code structure." },
      { step: "04", name: "RESULT", desc: "Measurable outcome, performance metrics, and key lessons learned." }
    ],
    slots: [
      {
        slotNumber: "01",
        status: "ACTIVE DEVELOPMENT",
        isPlaceholder: true,
        title: "Project Slot 01 — Core Systems Project",
        category: "C / C++ / DSA",
        summary: "Currently conceptualizing and implementing an algorithmic data structure visualizer and performance benchmark tool.",
        story: {
          problem: "Understanding complex algorithmic trade-offs (e.g. cache locality vs pointer chasing) requires clear visual and metric comparisons.",
          idea: "Build a lightweight CLI / graphical tool in C++ measuring execution clock cycles and memory footprint for various sorting and tree algorithms.",
          build: "Using C++20, chrono high-resolution timers, custom memory allocator wrappers, and structured output formatting.",
          result: "In development. Will be released open-source on GitHub with comprehensive benchmarks."
        },
        techStack: ["C++", "DSA", "CMake", "Git"],
        role: "Sole Developer",
        githubUrl: "https://github.com/Pranay-vyas-01",
        liveUrl: null
      },
      {
        slotNumber: "02",
        status: "COMING SOON",
        isPlaceholder: true,
        title: "Project Slot 02 — Web & API Exploration",
        category: "Full-Stack / Modern Web",
        summary: "Reserved for upcoming collaborative hackathon project focused on real-time developer productivity or student tooling.",
        story: {
          problem: "Students frequently struggle to track consistent problem-solving streaks and structured notes across multiple competitive programming portals.",
          idea: "A unified dashboard aggregating problem solving statistics, tag taxonomy, and targeted revision reminders.",
          build: "Clean frontend architecture with responsive UI, local caching, and REST API telemetry.",
          result: "Under architectural planning for upcoming collegiate hackathon."
        },
        techStack: ["JavaScript", "HTML5", "CSS3", "REST APIs", "GitHub"],
        role: "Frontend & Logic Engineer",
        githubUrl: "https://github.com/Pranay-vyas-01",
        liveUrl: null
      },
      {
        slotNumber: "03",
        status: "OPEN FOR COLLABORATION",
        isPlaceholder: true,
        title: "Build Something — Central Project Lab",
        category: "Hackathons & Innovation",
        summary: "An open workspace inviting developers, classmates, and mentors to team up on high-impact software ideas.",
        story: {
          problem: "The best software emerges from curiosity, diverse viewpoints, and relentless collaborative execution.",
          idea: "Partner with fellow engineers to brainstorm, design, and ship production-grade software during university hackathons.",
          build: "Fast prototyping, agile task breakdown, Git pull request workflows, and high code quality standards.",
          result: "Let's build together. Reach out via the Communication Tower!"
        },
        techStack: ["Open Collaboration", "C++", "Web Technologies", "Git"],
        role: "Collaborator / Core Developer",
        githubUrl: "https://github.com/Pranay-vyas-01",
        liveUrl: null
      }
    ]
  },

  // Future Goals & Progression
  goals: {
    progression: [
      {
        stage: "STUDENT",
        phase: "Phase 1: Foundation",
        desc: "Mastering fundamental Computer Science curriculum at JECRC University, internalizing core mathematical concepts and discrete algorithms.",
        status: "Active Phase"
      },
      {
        stage: "DEVELOPER",
        phase: "Phase 2: Building",
        desc: "Transforming theoretical understanding into functional software: developing personal utilities, writing unit tests, mastering Git and terminal tools.",
        status: "Transitioning"
      },
      {
        stage: "SOFTWARE ENGINEER",
        phase: "Phase 3: Production",
        desc: "Engineering scalable systems, participating in industrial internships, solving real-world customer problems with clean, maintainable architecture.",
        status: "Target Horizon"
      },
      {
        stage: "FUTURE",
        phase: "Phase 4: Impact",
        desc: "Leading technical initiatives, contributing to open-source infrastructure, and continuously pushing technical frontiers.",
        status: "Long-Term Vision"
      }
    ],
    concreteMilestones: [
      {
        title: "DSA Problem-Solving Mastery",
        target: "200+ Problems Solved",
        desc: "Consistent practice across Arrays, Binary Trees, Dynamic Programming, and Graph Traversals on LeetCode/CodeChef.",
        status: "In Progress"
      },
      {
        title: "Low-Level & Systems Depth",
        target: "C/C++ Project Suite",
        desc: "Constructing custom data containers, a memory pool allocator, and a CLI utility from scratch.",
        status: "In Progress"
      },
      {
        title: "Hackathon Competitions",
        target: "3+ Hackathon Submissions",
        desc: "Collaborating with peers to ship functional solutions within 24–48 hour sprints.",
        status: "Active Search"
      },
      {
        title: "Software Engineering Internship",
        target: "Summer Internship Opportunity",
        desc: "Securing an engineering internship where I can learn from senior developers and contribute production code.",
        status: "Preparing"
      }
    ]
  },

  // Career Center / Resume data
  resume: {
    statusNote: "RESUME DRAFT • READY FOR RECRUITER PREVIEW",
    summary: "Aspiring Software Engineer and B.Tech CSE undergraduate with strong programming fundamentals in C, C++, and Data Structures & Algorithms. Fast learner, disciplined problem solver, and passionate about writing clean, maintainable code.",
    quickFacts: [
      { label: "Degree", value: "B.Tech Computer Science & Engineering (Core)" },
      { label: "Institution", value: "JECRC University, Jaipur" },
      { label: "Graduation Window", value: "2026 – Present" },
      { label: "Primary Languages", value: "C, C++" },
      { label: "Core Competencies", value: "Data Structures, Algorithms, Problem Solving, Git" },
      { label: "Workstation", value: "VS Code, Git, GitHub, Linux/Windows Terminal" },
      { label: "Work Authorization", value: "India (Open to Remote / On-Site Internships)" }
    ],
    sections: [
      {
        heading: "Education",
        items: [
          {
            title: "B.Tech in Computer Science & Engineering (Core)",
            subtitle: "JECRC University • Jaipur, Rajasthan",
            date: "2026 – Present",
            bullets: [
              "Core coursework: Computer Programming (C/C++), Discrete Mathematics, Engineering Sciences.",
              "Actively solving programming assignments and building algorithmic problem-solving discipline.",
              "Participating in university tech workshops, coding meetups, and academic symposiums."
            ]
          }
        ]
      },
      {
        heading: "Technical Skills",
        items: [
          {
            title: "Languages & Core",
            subtitle: "Foundation",
            date: "Current Focus",
            bullets: [
              "C: Pointers, manual memory allocation, data structures, modular program architecture.",
              "C++: Object-Oriented Programming, Standard Template Library (vector, map, set), RAII.",
              "Algorithms: Time & Space complexity analysis, recursion, sorting, searching, linked lists, trees."
            ]
          },
          {
            title: "Tools & Environment",
            subtitle: "Daily Workflow",
            date: "Current Focus",
            bullets: [
              "Version Control: Git, GitHub (@Pranay-vyas-01), branching, semantic commit conventions.",
              "Development: VS Code, GDB debugger, command-line toolchains, Markdown documentation."
            ]
          }
        ]
      },
      {
        heading: "Key Engineering Practices",
        items: [
          {
            title: "Continuous Learning & Problem Solving",
            subtitle: "Self-Directed Study",
            date: "Ongoing",
            bullets: [
              "Solving coding challenges daily to hone pattern recognition across algorithmic problem types.",
              "Documenting learnings and code implementations with clear comments and README files.",
              "Exploring software architecture principles to bridge the gap between student code and industry standards."
            ]
          }
        ]
      }
    ]
  },

  // Innovation Lab
  innovation: {
    heading: "INNOVATION & EXPLORATION",
    subtitle: "Hackathons, Entrepreneurship Development (EDP) & Creative Engineering",
    timeline: [
      {
        date: "2026",
        event: "University Innovation & EDP Induction",
        whatIDid: "Engaged with student entrepreneurship and technical incubation initiatives at JECRC University.",
        whatILearned: "Understood product-market fit, identifying genuine user pain points, and rapid proof-of-concept prototyping."
      },
      {
        date: "Upcoming",
        event: "Collegiate & National Hackathons",
        whatIDid: "Assembling interdisciplinary teams to build practical solutions under real-time constraints.",
        whatILearned: "Agile communication, rapid technical decision-making, and delivering an end-to-end working MVP."
      },
      {
        date: "Continuous",
        event: "Open-Source & Independent Experiments",
        whatIDid: "Prototyping developer utilities, algorithm visualizers, and learning low-level software mechanics.",
        whatILearned: "Self-driven debugging, reading documentation thoroughly, and writing clean, reproducible code."
      }
    ]
  }
};
