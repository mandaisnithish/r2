// src/data/robotxData.ts

// ============================================================
// ROBOTX 2026 — AQUAHOLICS
// Central data source for the RobotX website
// ============================================================


// ============================================================
// TEAM
// ============================================================

export type TeamLink = {
  label: string;
  url: string;
};

export const TEAM = {
  name: "AQUAHOLICS",
  institution: "R.M.K Engineering College, Department of ECE",
  location: "Tamil Nadu, India",

  tagline: "Autonomous marine robotics for cleaner water bodies.",

  // Replace this with the official team email when available.
  email: "prempradeep038@gmail.com",

  phone: "",

  links: [] as TeamLink[],
};


// ============================================================
// EVENT
// ============================================================

export const EVENT = {
  name: "Maritime RobotX Challenge 2026",
  shortName: "RobotX 2026",
  organizer: "RoboNation",

  theme: "Storm Response",

  dates: "Week of 8 November 2026",
  venue: "Promontory at Marina Bay, Singapore",
  location: "Singapore",

  year: 2026,
};


// ============================================================
// NAVIGATION
// ============================================================

export const NAV = [
  {
    label: "Overview",
    path: "/robotx",
    end: true,
  },
  {
    label: "Team",
    path: "/robotx/team",
  },
  {
    label: "System & Vehicles",
    path: "/robotx/system-vehicles",
  },
  {
    label: "Design & Development",
    path: "/robotx/design",
  },
  {
    label: "Testing & Results",
    path: "/robotx/testing",
  },
  {
    label: "Media",
    path: "/robotx/media",
  },
  {
    label: "Sponsors",
    path: "/robotx/sponsors",
  },
  {
    label: "Contact",
    path: "/robotx/contact",
  },
] as const;


// ============================================================
// VEHICLES
// ============================================================

export type VehicleDomain = "USV" | "UAV" | "UUV";

export type VehicleSpec = {
  label: string;
  value: string;
};

export type VehicleSystem = {
  name: string;
  description: string;
};

export type Vehicle = {
  id: string;
  name: string;
  domain: VehicleDomain;
  type: string;
  description: string;

  image?: string;

  status?: string;

  dimensions?: string;
  material?: string;
  hull?: string;

  specs: VehicleSpec[];
  systems: VehicleSystem[];

  autonomy?: string;
  communication?: string;
  power?: string;
  payload?: string;
};

export const VEHICLES: Vehicle[] = [
  {
    id: "draken-mark-1",
    name: "DRAKEN Mark 1",
    domain: "USV",
    type: "Uncrewed Surface Vessel",

    description:
      "A custom-built uncrewed surface vessel designed as the primary surface platform for the AQUAHOLICS RobotX 2026 System of Systems.",

    status: "Development & testing",

    dimensions: "650 × 500 × 500 mm",
    material: "Fiberglass/resin over a thin sheet-metal base",
    hull: "V-shaped hull",

    specs: [
      {
        label: "Length",
        value: "650 mm",
      },
      {
        label: "Breadth",
        value: "500 mm",
      },
      {
        label: "Height",
        value: "500 mm",
      },
      {
        label: "Expected speed",
        value: "5–10 km/h",
      },
      {
        label: "Power system",
        value: "6S 7500 mAh lithium-ion",
      },
      {
        label: "Propulsion",
        value: "12–24 V underwater thrusters",
      },
      {
        label: "Flight / vehicle controller",
        value: "Pixhawk",
      },
      {
        label: "High-level computer",
        value: "Raspberry Pi 5",
      },
      {
        label: "Navigation",
        value: "GPS + 9-axis IMU",
      },
    ],

    systems: [
      {
        name: "High-level computing",
        description:
          "Raspberry Pi 5 handles high-level perception and autonomous software functions.",
      },
      {
        name: "Low-level control",
        description:
          "Pixhawk provides vehicle-level control and interfaces with the propulsion system.",
      },
      {
        name: "Perception",
        description:
          "Camera-based perception using YOLOv5n and OpenCV.",
      },
      {
        name: "Navigation",
        description:
          "GPS and 9-axis IMU provide vehicle state and navigation information.",
      },
      {
        name: "Communication",
        description:
          "RF telemetry and MAVLink are used for telemetry and command communication.",
      },
      {
        name: "Buoyancy",
        description:
          "A custom ballast tank is incorporated into the vehicle design.",
      },
      {
        name: "Manual control",
        description:
          "The vehicle supports manual operation through an RF remote.",
      },
    ],

    autonomy:
      "Autonomous navigation and perception are under continued development and validation.",

    communication:
      "RF telemetry with MAVLink.",

    power:
      "6S 7500 mAh lithium-ion battery system.",

    payload:
      "RobotX mission equipment and onboard sensing systems.",
  },

  {
    id: "revelation",
    name: "REVELATION",
    domain: "UAV",
    type: "Uncrewed Aerial Vehicle",

    description:
      "An S500-based aerial platform providing aerial sensing and mission support within the AQUAHOLICS System of Systems.",

    status: "Development & testing",

    specs: [
      {
        label: "Airframe",
        value: "S500",
      },
      {
        label: "Flight controller",
        value: "Pixhawk 2.4.8",
      },
      {
        label: "High-level computer",
        value: "Raspberry Pi 5",
      },
      {
        label: "Camera",
        value: "Arducam IMX296",
      },
      {
        label: "GPS",
        value: "RadioLink SE100",
      },
      {
        label: "Battery",
        value: "Bonka LiPo 11.1 V 2200 mAh",
      },
      {
        label: "Payload capacity",
        value: ">500 g",
      },
      {
        label: "Autonomy",
        value: "Semi-autonomous",
      },
    ],

    systems: [
      {
        name: "Airframe",
        description:
          "S500 multirotor airframe used as the aerial platform.",
      },
      {
        name: "Flight control",
        description:
          "Pixhawk 2.4.8 provides flight-control functionality.",
      },
      {
        name: "High-level computing",
        description:
          "Raspberry Pi 5 supports onboard high-level processing.",
      },
      {
        name: "Vision",
        description:
          "Arducam IMX296 camera supports aerial visual perception.",
      },
      {
        name: "Navigation",
        description:
          "GPS and flight-controller state support autonomous flight functions.",
      },
      {
        name: "Communication",
        description:
          "Telemetry and MAVLink provide command and vehicle-status communication.",
      },
    ],

    autonomy:
      "Semi-autonomous operation with autonomous flight testing in progress.",

    communication:
      "Telemetry and MAVLink.",

    power:
      "Bonka LiPo 11.1 V 2200 mAh.",

    payload:
      "More than 500 g.",
  },
];


// ============================================================
// SYSTEM OF SYSTEMS
// ============================================================

export const SYSTEM_OF_SYSTEMS = {
  title: "Integrated System of Systems",

  summary:
    "AQUAHOLICS is developing an integrated multi-domain System of Systems in which DRAKEN Mark 1 provides the surface platform and REVELATION provides aerial sensing and mission support. The platforms are designed to exchange mission and telemetry information while retaining independent vehicle-level control and safety fallbacks.",

  domains: [
    {
      id: "surface",
      name: "Surface",
      vehicle: "DRAKEN Mark 1",
      domain: "USV",
      description:
        "Primary surface vehicle for navigation, perception and mission operations.",
    },
    {
      id: "air",
      name: "Air",
      vehicle: "REVELATION",
      domain: "UAV",
      description:
        "Aerial platform for elevated sensing and mission support.",
    },
    {
      id: "command",
      name: "Command",
      vehicle: "OCS / RoboCommand",
      domain: "Operations",
      description:
        "Operational command and telemetry interface supporting the overall system.",
    },
  ],

  communication: {
    protocol: "MAVLink",
    telemetry: "SiK RF telemetry",
    frequency: "900 MHz class RF",
    modulation: "FHSS / TDM / GFSK",
    status: "Integration and validation ongoing",
  },

  links: [
    {
      from: "OCS / RoboCommand",
      to: "DRAKEN Mark 1",
      label: "Command & telemetry",
      direction: "bidirectional",
    },
    {
      from: "OCS / RoboCommand",
      to: "REVELATION",
      label: "Command & telemetry",
      direction: "bidirectional",
    },
    {
      from: "DRAKEN Mark 1",
      to: "REVELATION",
      label: "Inter-vehicle information",
      direction: "bidirectional",
    },
  ],

  principle:
    "Each vehicle retains independent control and safety functions while the system architecture enables information sharing and coordinated mission behavior.",
};


// ============================================================
// AUTONOMY
// ============================================================

export const AUTONOMY = {
  stages: [
    {
      id: "perception",
      title: "Perception",
      description:
        "Camera-based sensing and computer vision are used to interpret the operating environment.",
    },
    {
      id: "state-estimation",
      title: "State Estimation",
      description:
        "GPS, IMU and flight/vehicle-controller state provide information about platform state.",
    },
    {
      id: "decision",
      title: "Decision",
      description:
        "Mission software uses available perception and state information to determine the next action.",
    },
    {
      id: "navigation",
      title: "Navigation",
      description:
        "Waypoint navigation and autonomous movement functions are being developed and validated.",
    },
    {
      id: "control",
      title: "Control",
      description:
        "Pixhawk provides low-level vehicle and flight-control functions.",
    },
    {
      id: "action",
      title: "Vehicle Action",
      description:
        "The resulting commands are executed by the vehicle propulsion or flight system.",
    },
  ],

  usv: {
    perception: "Camera + YOLOv5n + OpenCV",
    navigation: "GPS + 9-axis IMU + waypoint navigation",
    computing: "Raspberry Pi 5",
    control: "Pixhawk",
    status: "Under continued validation",
  },

  uav: {
    perception: "Arducam IMX296 + computer vision",
    navigation: "GPS + flight-controller state",
    computing: "Raspberry Pi 5",
    control: "Pixhawk 2.4.8",
    status: "Autonomous flight testing in progress",
  },
};


// ============================================================
// AI / PERCEPTION
// ============================================================

export const AI = {
  model: "YOLOv5n",

  framework: "OpenCV",

  dataset: {
    approximateImages: 4000,
    classes: 6,
    trainingPlatform: "Google Colab",
  },

  deployment:
    "The trained perception model is being deployed and validated on Raspberry Pi 5.",

  status: "Implemented / under validation",
};


// ============================================================
// SAFETY
// ============================================================

export const SAFETY = [
  {
    id: "kill-switch",
    title: "Kill Switch",
    description:
      "Manual emergency intervention is available to stop vehicle operation.",
  },
  {
    id: "geofence",
    title: "Geofence",
    description:
      "Geofencing is used as a boundary mechanism for autonomous operation.",
  },
  {
    id: "low-battery",
    title: "Low-Battery Return",
    description:
      "Low-battery handling includes return-to-home behavior where applicable.",
  },
  {
    id: "manual-override",
    title: "Manual Override",
    description:
      "Manual control remains available as a safety fallback.",
  },
  {
    id: "communication-loss",
    title: "Communication-Loss Fallback",
    description:
      "Fallback behaviors are incorporated for loss of communication.",
  },
  {
    id: "gps-loss",
    title: "GPS-Loss Recovery",
    description:
      "GPS-loss handling is considered as part of vehicle recovery behavior.",
  },
  {
    id: "autonomy-failure",
    title: "Autonomy Failure Fallback",
    description:
      "The architecture retains vehicle-level fallback and manual intervention capability.",
  },
];


// ============================================================
// DESIGN DECISIONS
// ============================================================

export type DesignDecision = {
  title: string;
  problem: string;
  options: string;
  decision: string;
  rationale: string;
};

export const DECISIONS: DesignDecision[] = [
  {
    title: "V-Shaped USV Hull",

    problem:
      "The surface vehicle requires a stable and practical hull geometry for operation on water while remaining suitable for a compact custom-built platform.",

    options:
      "Alternative hull geometries and construction approaches were considered during the vehicle design process.",

    decision:
      "A V-shaped hull was selected for DRAKEN Mark 1.",

    rationale:
      "The selected geometry provides the basis for the custom surface platform while remaining compatible with the team's fabrication approach and onboard systems.",
  },

  {
    title: "Raspberry Pi 5 + Pixhawk Architecture",

    problem:
      "The vehicle requires both high-level computing for perception and autonomy and reliable low-level vehicle control.",

    options:
      "A single computer architecture and a separated high-level/low-level control architecture were considered.",

    decision:
      "Raspberry Pi 5 is used for high-level computing while Pixhawk handles low-level vehicle control.",

    rationale:
      "Separating high-level processing from low-level control allows computationally intensive perception and autonomy functions to operate independently from the core vehicle-control layer.",
  },

  {
    title: "Camera-Based Perception",

    problem:
      "The vehicle needs environmental perception for autonomous operation while maintaining a practical onboard sensing configuration.",

    options:
      "Vision-based perception and additional ranging-based sensing approaches were considered.",

    decision:
      "Camera-based perception using YOLOv5n and OpenCV is being used.",

    rationale:
      "The approach provides a compact perception pipeline suitable for onboard deployment and enables the team to develop custom computer-vision capabilities.",
  },

  {
    title: "Custom Ballast System",

    problem:
      "The USV requires an approach for managing the vehicle's buoyancy and waterline behavior.",

    options:
      "Different buoyancy-management approaches were considered during vehicle development.",

    decision:
      "A custom ballast tank is incorporated into DRAKEN Mark 1.",

    rationale:
      "The custom approach allows the ballast system to be integrated with the team's vehicle geometry and mechanical architecture.",
  },

  {
    title: "S500 UAV Platform",

    problem:
      "The aerial component requires a platform capable of carrying onboard computing, sensing and communication equipment.",

    options:
      "An existing multirotor platform was considered as an alternative to designing an airframe from scratch.",

    decision:
      "The S500 airframe is used for REVELATION.",

    rationale:
      "The platform provides a practical base for integrating the Pixhawk flight controller, Raspberry Pi 5, camera, GPS and telemetry systems.",
  },
];


// ============================================================
// DEVELOPMENT / BUILD LOG
// ============================================================

export type BuildPost = {
  date: string;
  title: string;
  body: string;
  photo?: string;
};

export const BUILD_LOG: BuildPost[] = [
  {
    date: "2026-01-15",
    title: "RobotX System Development Begins",
    body:
      "The AQUAHOLICS RobotX development effort began with the definition of the surface and aerial vehicle architecture and the initial System of Systems approach.",
  },

  {
    date: "2026-02-10",
    title: "DRAKEN Mark 1 Vehicle Development",
    body:
      "The custom DRAKEN Mark 1 surface vehicle platform was developed around a V-shaped hull and an architecture combining Raspberry Pi 5 high-level computing with Pixhawk vehicle control.",
  },

  {
    date: "2026-03-05",
    title: "REVELATION UAV Platform",
    body:
      "The REVELATION aerial platform was developed around an S500 airframe, Pixhawk 2.4.8 flight controller, Raspberry Pi 5 onboard computer, camera and GPS systems.",
  },

  {
    date: "2026-04-12",
    title: "Perception Pipeline Development",
    body:
      "The team developed a vision-based perception pipeline using YOLOv5n and OpenCV and prepared a custom dataset for model training and deployment.",
  },

  {
    date: "2026-05-18",
    title: "Vehicle-Level Integration",
    body:
      "Vehicle computing, sensing, communication and control components were progressively integrated into the USV and UAV platforms.",
  },

  {
    date: "2026-06-22",
    title: "Autonomy Development",
    body:
      "Autonomous navigation, perception and vehicle behaviors were brought into the development and validation cycle.",
  },

  {
    date: "2026-08-15",
    title: "System Integration",
    body:
      "The team continued integration of the USV, UAV and communication architecture toward coordinated multi-domain operation.",
  },
];


// ============================================================
// TESTING
// ============================================================

export type TestRecord = {
  date: string;
  type: "Water" | "Air" | "Simulation";
  location: string;
  minutes: number;
  objective: string;
  result: string;
};

/*
 * Keep this list empty until the team has confirmed the actual
 * dates, durations, locations and results of the tests.
 *
 * The Testing & Results page already has an EmptyState for this.
 *
 * Do NOT publish fabricated testing numbers as competition evidence.
 */

export const TESTS: TestRecord[] = [];


// ============================================================
// VALIDATION SUMMARY
// ============================================================

export const VALIDATION = {
  aiDetection: {
    status: "validated",
    title: "AI Detection",
    text: "Vision-based detection has been tested.",
  },

  usvManualControl: {
    status: "validated",
    title: "USV Manual Control",
    text: "Manual water operation has been tested.",
  },

  autonomousNavigation: {
    status: "partial",
    title: "Autonomous Navigation",
    text: "Autonomous navigation remains under continued validation.",
  },

  usvUavIntegration: {
    status: "ongoing",
    title: "USV–UAV Integration",
    text: "Inter-vehicle communication and coordinated operation are being tested.",
  },
};


// ============================================================
// MEDIA
// ============================================================

export type MediaItemType =
  | "image"
  | "video"
  | "document"
  | "simulation";

export type MediaItem = {
  id: string;
  title: string;
  description: string;
  type: MediaItemType;
  url?: string;
  thumbnail?: string;
  date?: string;
};

export const MEDIA: MediaItem[] = [
  /*
   * Add real media here as it becomes available.
   *
   * Example:
   *
   * {
   *   id: "draken-water-test",
   *   title: "DRAKEN Mark 1 Water Test",
   *   description: "Water testing of the DRAKEN Mark 1 USV.",
   *   type: "image",
   *   url: "/robotx/media/draken-water-test.jpg",
   *   date: "2026-08-20",
   * },
   */
];


// ============================================================
// SPONSORS
// ============================================================

export type Sponsor = {
  name: string;
  tier?: string;
  logo?: string;
  url?: string;
  description?: string;
};

export const SPONSORS: Sponsor[] = [
  /*
   * Add only confirmed sponsors here.
   *
   * Example:
   *
   * {
   *   name: "Organisation Name",
   *   tier: "Technical Partner",
   *   logo: "/robotx/sponsors/example.png",
   *   url: "https://example.com",
   *   description: "Confirmed support for the AQUAHOLICS RobotX team.",
   * },
   */
];


// ============================================================
// CONTACT
// ============================================================

export const CONTACT = {
  teamName: TEAM.name,

  institution: TEAM.institution,

  location: TEAM.location,

  email: TEAM.email,

  phone: TEAM.phone,

  website: "https://aquaholics.in",

  event: EVENT.name,
};


// ============================================================
// OVERVIEW PAGE CONTENT
// ============================================================

export const OVERVIEW = {
  eyebrow: "AQUAHOLICS · ROBOTX 2026",

  title: "Autonomous Systems for the Maritime Environment",

  intro:
    "AQUAHOLICS is developing a multi-domain autonomous System of Systems for the Maritime RobotX Challenge 2026, combining an uncrewed surface vessel with an aerial platform.",

  description:
    "Our RobotX platform brings together DRAKEN Mark 1, a custom-built uncrewed surface vessel, and REVELATION, an S500-based aerial vehicle. The platforms combine onboard computing, perception, navigation, communication and vehicle-level control to support coordinated autonomous operations.",

  focusAreas: [
    {
      id: "surface",
      title: "Surface Autonomy",
      description:
        "DRAKEN Mark 1 provides the primary surface platform for navigation, perception and mission operations.",
    },
    {
      id: "aerial",
      title: "Aerial Sensing",
      description:
        "REVELATION provides an aerial perspective and mission-support capability.",
    },
    {
      id: "perception",
      title: "AI Perception",
      description:
        "YOLOv5n and OpenCV form the current vision-based perception pipeline.",
    },
    {
      id: "integration",
      title: "System Integration",
      description:
        "MAVLink and RF telemetry support communication between vehicle and command layers.",
    },
  ],

  systemStatement:
    "The architecture is designed so that each vehicle retains independent control and safety fallbacks while sharing information required for coordinated system behavior.",

  competitionApproach:
    "The team is developing progressively from vehicle-level capabilities toward integrated multi-domain operation, using testing and iteration to identify limitations and improve system reliability.",
};


// ============================================================
// COMPETITION APPROACH
// ============================================================

export const COMPETITION = {
  title: "Competition Approach",

  strategy:
    "AQUAHOLICS is developing the RobotX system progressively, starting with reliable vehicle-level operation and moving toward perception, autonomous behaviors, communication and coordinated multi-domain operation.",

  priorities: [
    "Establish reliable vehicle-level operation.",
    "Validate perception and navigation capabilities.",
    "Develop autonomous behaviors incrementally.",
    "Validate communication between system components.",
    "Integrate USV and UAV capabilities.",
    "Use testing results to refine the system before increasingly complex scenarios.",
  ],

  systemOfSystems:
    "The RobotX architecture combines a USV, UAV and operational command layer while maintaining independent vehicle-level control and safety mechanisms.",

  currentFocus:
    "Vehicle integration, autonomous behavior development, perception validation and USV–UAV communication.",
};


// ============================================================
// DESIGN PRINCIPLES
// ============================================================

export const DESIGN_PRINCIPLES = [
  {
    id: "modularity",
    title: "Modular Architecture",
    description:
      "High-level computing, low-level control, perception and communication are separated into functional layers.",
  },
  {
    id: "progressive-validation",
    title: "Progressive Validation",
    description:
      "Capabilities are developed and tested individually before being combined into increasingly complex system behavior.",
  },
  {
    id: "fallbacks",
    title: "Independent Safety",
    description:
      "Vehicle-level control and safety fallbacks remain available even when higher-level autonomy is active.",
  },
  {
    id: "integration",
    title: "System Integration",
    description:
      "The USV and UAV are being developed as independent platforms that can exchange information as part of a larger System of Systems.",
  },
];


// ============================================================
// ROBOTX WEBSITE STATISTICS
// ============================================================

export const WEBSITE_STATS = [
  {
    value: "2",
    label: "Vehicle Domains",
    description: "USV + UAV",
  },
  {
    value: "1",
    label: "Integrated System",
    description: "System of Systems",
  },
  {
    value: "2026",
    label: "Competition",
    description: "Maritime RobotX Challenge",
  },
];


// ============================================================
// TEAM MEMBERS
// ============================================================

export type Member = {
  name: string;
  role: string;
  bio?: string;
  photo?: string;
};

export const MEMBERS: Member[] = [
  {
    name: "Prem Pradeep S",
    role: "Team Lead · CAD · USV",
    bio: "Team lead responsible for CAD and USV development.",
    photo: "",
  },

  {
    name: "Manova Cibi D",
    role: "Hardware",
    bio: "Hardware team member contributing to vehicle systems.",
    photo: "",
  },

  {
    name: "Syed Ashfaq K",
    role: "Hardware · UAV",
    bio: "Hardware team member focused on UAV systems.",
    photo: "",
  },

  {
    name: "Niveditha E",
    role: "Hardware · Communication",
    bio: "Hardware team member focused on communication systems.",
    photo: "",
  },

  {
    name: "Madhava Perumal Y",
    role: "Hardware · UAV",
    bio: "Hardware team member focused on UAV systems.",
    photo: "",
  },

  {
    name: "Saktthi Murugan S B",
    role: "Hardware · USV",
    bio: "Hardware team member focused on USV systems.",
    photo: "",
  },

  {
    name: "Aditya Jayaraj",
    role: "Hardware",
    bio: "Hardware team member contributing to vehicle development.",
    photo: "",
  },

  {
    name: "Gokulrajan R M",
    role: "Hardware · USV",
    bio: "Hardware team member focused on USV systems.",
    photo: "",
  },

  {
    name: "Nivedhan RK",
    role: "Management",
    bio: "Team member contributing to team management and coordination.",
    photo: "",
  },

  {
    name: "Dhaneshwara M",
    role: "Software",
    bio: "Software team member contributing to autonomous system and software development.",
    photo: "",
  },
];

export const ADVISOR: Member = {
  name: "Sharma G",
  role: "Faculty Mentor",
  bio: "Faculty mentor supporting the AQUAHOLICS RobotX 2026 team.",
  photo: "",
};


// ============================================================
// TEAM SUMMARY
// ============================================================

export const TEAM_SUMMARY = {
  studentCount: MEMBERS.length,
  facultyCount: 1,

  disciplines: [
    "Hardware",
    "Software",
    "USV",
    "UAV",
    "Communication",
    "CAD",
    "Management",
  ],

  story:
    "AQUAHOLICS brings together students working across hardware, software, CAD, communication, USV, UAV and management to develop an integrated autonomous maritime robotics system.",
};


// ============================================================
// SYSTEM LAYERS
// ============================================================

export const SYSTEM_LAYERS = [
  {
    id: "mission",
    title: "Mission Layer",
    description:
      "Defines mission objectives and high-level coordinated behavior.",
  },

  {
    id: "perception",
    title: "Perception Layer",
    description:
      "Uses onboard cameras and computer vision to interpret the environment.",
  },

  {
    id: "navigation",
    title: "Navigation Layer",
    description:
      "Combines positioning and vehicle state information for navigation.",
  },

  {
    id: "communication",
    title: "Communication Layer",
    description:
      "Provides telemetry and information exchange using RF communication and MAVLink.",
  },

  {
    id: "control",
    title: "Vehicle Control Layer",
    description:
      "Pixhawk-based control provides low-level vehicle or flight control.",
  },

  {
    id: "physical",
    title: "Physical Layer",
    description:
      "Includes the USV, UAV, propulsion, power, sensing and mechanical systems.",
  },
];


// ============================================================
// FOOTER
// ============================================================

export const FOOTER = {
  teamName: TEAM.name,
  event: EVENT.name,

  tagline:
    "Autonomous marine robotics for cleaner water bodies.",

  links: NAV,

  website: "https://aquaholics.in",
};


// ============================================================
// END OF FILE
// ============================================================
// ============================================================
// SEARCH INDEX
// ============================================================

export type SearchIndexItem = {
  id: string;
  title: string;
  text: string;
  path: string;
  category: string;
};

export const SEARCH_INDEX: SearchIndexItem[] = [
  {
    id: "overview",
    title: "RobotX 2026 Overview",
    text:
      "AQUAHOLICS RobotX 2026 autonomous maritime robotics System of Systems.",
    path: "/robotx",
    category: "Overview",
  },

  {
    id: "team",
    title: "AQUAHOLICS Team",
    text:
      "Meet the AQUAHOLICS team developing the RobotX 2026 system.",
    path: "/robotx/team",
    category: "Team",
  },

  {
    id: "draken",
    title: "DRAKEN Mark 1",
    text:
      "Custom-built uncrewed surface vessel used as the primary surface platform.",
    path: "/robotx/system-vehicles",
    category: "USV",
  },

  {
    id: "revelation",
    title: "REVELATION",
    text:
      "S500-based uncrewed aerial vehicle providing aerial sensing and mission support.",
    path: "/robotx/system-vehicles",
    category: "UAV",
  },

  {
    id: "system-of-systems",
    title: "System of Systems",
    text:
      "Integrated architecture combining the DRAKEN Mark 1 USV, REVELATION UAV and command layer.",
    path: "/robotx/system-vehicles",
    category: "System",
  },

  {
    id: "design",
    title: "Design & Development",
    text:
      "Vehicle design decisions, architecture and development approach.",
    path: "/robotx/design",
    category: "Design",
  },

  {
    id: "testing",
    title: "Testing & Results",
    text:
      "Testing activities, validation status and RobotX development results.",
    path: "/robotx/testing",
    category: "Testing",
  },

  {
    id: "media",
    title: "Media",
    text:
      "RobotX photos, videos and development media.",
    path: "/robotx/media",
    category: "Media",
  },

  {
    id: "sponsors",
    title: "Sponsors",
    text:
      "Organizations supporting the AQUAHOLICS RobotX 2026 team.",
    path: "/robotx/sponsors",
    category: "Sponsors",
  },

  {
    id: "contact",
    title: "Contact AQUAHOLICS",
    text:
      "Contact and team information for AQUAHOLICS RobotX 2026.",
    path: "/robotx/contact",
    category: "Contact",
  },

  {
    id: "ai",
    title: "AI & Perception",
    text:
      "YOLOv5n, OpenCV and the onboard computer-vision perception pipeline.",
    path: "/robotx/system-vehicles",
    category: "AI",
  },

  {
    id: "autonomy",
    title: "Autonomy",
    text:
      "Perception, state estimation, decision, navigation, control and vehicle action.",
    path: "/robotx/system-vehicles",
    category: "Autonomy",
  },

  {
    id: "safety",
    title: "Safety & Fallback",
    text:
      "Kill switch, geofence, manual override, communication-loss and other safety mechanisms.",
    path: "/robotx/system-vehicles",
    category: "Safety",
  },
];