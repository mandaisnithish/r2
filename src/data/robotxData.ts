// src/data/robotxData.ts

export type LinkItem = {
  label: string;
  url: string;
};

export type Member = {
  name: string;
  role: string;
  bio?: string;
  photo?: string;
};

/* =========================================================
   TEAM
   ========================================================= */

export const TEAM = {
  name: "AQUAHOLICS",
  institution: "R.M.K Engineering College, Department of ECE",
  location: "Tamil Nadu, India",
  tagline: "Autonomous marine robotics for cleaner water bodies.",
  email: "TODO-team-email@example.com",
  phone: "",
  links: [] as LinkItem[],
};

/* =========================================================
   EVENT
   ========================================================= */

export const EVENT = {
  name: "Maritime RobotX Challenge 2026",
  theme: "Storm Response",
  dates: "Week of 8 November 2026",
  venue: "Promontory at Marina Bay, Singapore",
};

/* =========================================================
   NAVIGATION
   ========================================================= */

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
];

/* =========================================================
   USV — DRAKEN MARK 1
   ========================================================= */

export const USV = {
  name: "DRAKEN Mark 1",
  type: "USV",
  fullName: "Custom-built Uncrewed Surface Vessel",

  description:
    "DRAKEN Mark 1 is AQUAHOLICS' custom-built surface vehicle for autonomous maritime operations and RobotX 2026 missions.",

  dimensions: {
    length: "650 mm",
    breadth: "500 mm",
    height: "500 mm",
  },

  hull: {
    shape: "V-shaped hull",
    material: "Fiberglass/resin over thin sheet-metal base",
  },

  computing: {
    highLevel: "Raspberry Pi 5",
    lowLevel: "Pixhawk",
  },

  navigation: [
    "GPS",
    "9-axis IMU",
    "Waypoint navigation",
  ],

  perception: [
    "Camera",
    "YOLOv5n",
    "OpenCV",
  ],

  propulsion: {
    type: "Underwater thrusters",
    voltage: "12–24 V",
  },

  power: {
    battery: "6S 7500mAh lithium-ion",
  },

  systems: [
    "Custom ballast tank",
    "RF telemetry",
    "MAVLink",
    "Manual RF remote",
  ],

  autonomy:
    "Autonomous navigation with camera-based perception, obstacle assessment and path replanning.",

  expectedSpeed: "5–10 km/h",

  lidar: "Not used",
};

/* =========================================================
   UAV — REVELATION
   ========================================================= */

export const UAV = {
  name: "REVELATION",
  type: "UAV",
  fullName: "S500 UAV platform",

  description:
    "REVELATION is AQUAHOLICS' aerial platform for aerial sensing, mission support and multi-domain coordination.",

  airframe: "S500",

  flightController: "Pixhawk 2.4.8",

  computing: {
    highLevel: "Raspberry Pi 5",
  },

  camera: "Arducam IMX296",

  navigation: [
    "RadioLink SE100 GPS",
    "Flight-controller state estimation",
  ],

  communication: [
    "Telemetry",
    "MAVLink",
  ],

  power: {
    battery: "Bonka LiPo 11.1V 2200mAh",
  },

  payload: ">500 g",

  autonomy:
    "Semi-autonomous operation with autonomous flight testing.",

  perception: [
    "Arducam IMX296",
    "Computer vision",
  ],
};

/* =========================================================
   SYSTEM OF SYSTEMS
   ========================================================= */

export const SYSTEM_OF_SYSTEMS = {
  title: "Integrated System of Systems",

  summary:
    "AQUAHOLICS is developing an integrated multi-domain System of Systems in which DRAKEN Mark 1 provides the surface platform and REVELATION provides aerial sensing and mission support. The platforms are designed to exchange mission and telemetry information while retaining independent vehicle-level control and safety fallbacks.",

  domains: [
    {
      name: "Surface",
      platform: "DRAKEN Mark 1",
      type: "USV",
      role: "Surface navigation, perception and mission execution",
    },
    {
      name: "Air",
      platform: "REVELATION",
      type: "UAV",
      role: "Aerial sensing and mission support",
    },
  ],

  communication: {
    technology: "SiK RF telemetry",
    protocol: "MAVLink",
    modulation: [
      "FHSS",
      "TDM",
      "GFSK",
    ],
    targetBand: "900 MHz class RF",
    status: "Integration and validation ongoing",
  },

  links: [
    "DRAKEN Mark 1 ↔ REVELATION",
    "OCS ↔ RoboCommand",
  ],

  architecture: [
    "Vehicle-level autonomy",
    "Inter-vehicle communication",
    "Mission-level coordination",
    "Independent safety fallbacks",
  ],
};

/* =========================================================
   AUTONOMY
   ========================================================= */

export const AUTONOMY = {
  layers: [
    "Perception",
    "State Estimation",
    "Decision",
    "Navigation",
    "Control",
    "Vehicle Action",
  ],

  usv: {
    platform: "DRAKEN Mark 1",
    perception: [
      "Camera",
      "YOLOv5n",
      "OpenCV",
    ],
    navigation: [
      "GPS",
      "9-axis IMU",
      "Waypoint navigation",
      "Obstacle assessment",
      "Path replanning",
    ],
    compute: {
      highLevel: "Raspberry Pi 5",
      lowLevel: "Pixhawk",
    },
  },

  uav: {
    platform: "REVELATION",
    perception: [
      "Arducam IMX296",
      "Computer vision",
    ],
    navigation: [
      "GPS",
      "Flight-controller state",
      "Autonomous flight testing",
    ],
    compute: {
      highLevel: "Raspberry Pi 5",
      lowLevel: "Pixhawk 2.4.8",
    },
  },
};

/* =========================================================
   AI / COMPUTER VISION
   ========================================================= */

export const AI = {
  model: "YOLOv5n",
  computerVision: "OpenCV",

  dataset: {
    approximateImages: "4000 images",
    classes: 6,
    trainingPlatform: "Google Colab",
  },

  deployment: "Raspberry Pi 5",

  status: "Implemented and under validation",

  purpose:
    "Camera-based perception supporting autonomous vehicle operation.",
};

/* =========================================================
   SAFETY
   ========================================================= */

export const SAFETY = [
  {
    name: "Kill Switch",
    description:
      "Provides a direct mechanism for stopping vehicle operation when required.",
  },
  {
    name: "Geofence",
    description:
      "Constrains autonomous operation to the defined operating area.",
  },
  {
    name: "Low-Battery Return-to-Home",
    description:
      "Provides a fallback response when battery levels become critical.",
  },
  {
    name: "Manual Override",
    description:
      "Allows the operator to regain direct vehicle control.",
  },
  {
    name: "Communication-Loss Fallback",
    description:
      "Provides predefined behavior when communication is interrupted.",
  },
  {
    name: "GPS-Loss Recovery",
    description:
      "Provides a recovery behavior when reliable GPS information is unavailable.",
  },
  {
    name: "Autonomy Failure Fallback",
    description:
      "Provides a fallback path when autonomous operation cannot continue safely.",
  },
];

/* =========================================================
   DESIGN DECISIONS
   ========================================================= */

export const DESIGN_DECISIONS = [
  {
    title: "V-Shaped USV Hull",
    area: "Vehicle Design",
    decision:
      "A V-shaped hull was selected for DRAKEN Mark 1.",
    rationale:
      "The design forms the basis of the custom-built surface platform used by the team.",
  },

  {
    title: "Raspberry Pi 5 + Pixhawk Architecture",
    area: "Computing & Control",
    decision:
      "A Raspberry Pi 5 is used for high-level computing while Pixhawk handles vehicle-level control.",
    rationale:
      "This separates high-level autonomy and perception from low-level vehicle control.",
  },

  {
    title: "Camera-Based Perception",
    area: "Autonomy",
    decision:
      "Camera-based perception using YOLOv5n and OpenCV is used for visual understanding.",
    rationale:
      "The approach provides the perception pipeline used by the autonomous system without relying on LiDAR.",
  },

  {
    title: "Custom Ballast System",
    area: "Marine Systems",
    decision:
      "A custom ballast tank is incorporated into DRAKEN Mark 1.",
    rationale:
      "The ballast system is part of the custom surface-vehicle architecture.",
  },

  {
    title: "S500 UAV Platform",
    area: "Aerial Platform",
    decision:
      "The S500 platform is used as the basis of REVELATION.",
    rationale:
      "It provides the aerial platform for sensing and mission support.",
  },
];

/* =========================================================
   TEAM MEMBERS
   ========================================================= */

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

/* =========================================================
   FACULTY MENTOR
   ========================================================= */

export const ADVISOR: Member = {
  name: "Sharma G",
  role: "Faculty Mentor",
  bio: "Faculty mentor supporting the AQUAHOLICS RobotX 2026 team.",
  photo: "",
};

/* =========================================================
   BUILD PROGRESS
   ========================================================= */

export const BUILD_PROGRESS = [
  {
    title: "USV Development",
    status: "In Development",
    description:
      "Development of the DRAKEN Mark 1 custom-built surface vehicle.",
  },

  {
    title: "UAV Development",
    status: "In Development",
    description:
      "Development and autonomy testing of the REVELATION aerial platform.",
  },

  {
    title: "System Integration",
    status: "In Progress",
    description:
      "Integration of vehicle systems and inter-vehicle communication.",
  },

  {
    title: "Autonomy Validation",
    status: "Under Validation",
    description:
      "Validation of perception, navigation and autonomous behaviors.",
  },
];

/* =========================================================
   TESTING
   ========================================================= */

export const TESTING = {
  status: "Testing and validation ongoing",

  areas: [
    {
      title: "USV Testing",
      description:
        "Testing of DRAKEN Mark 1 vehicle systems, navigation and autonomous behaviors.",
    },

    {
      title: "UAV Testing",
      description:
        "Testing of REVELATION flight systems and autonomous flight behaviors.",
    },

    {
      title: "Perception Testing",
      description:
        "Validation of camera-based perception using YOLOv5n and OpenCV.",
    },

    {
      title: "Communication Testing",
      description:
        "Validation of RF telemetry and MAVLink communication between system components.",
    },

    {
      title: "System-of-Systems Testing",
      description:
        "Validation of multi-domain coordination between the surface and aerial platforms.",
    },
  ],
};

/* =========================================================
   MEDIA
   ========================================================= */

export const MEDIA = {
  videos: [],
  photos: [],
  documents: [],
};

/* =========================================================
   SPONSORS
   ========================================================= */

export const SPONSORS = [];

/* =========================================================
   COMPETITION APPROACH
   ========================================================= */

export const COMPETITION_APPROACH = {
  summary:
    "AQUAHOLICS is developing a multi-domain autonomous System of Systems around a custom-built USV and UAV platform, with emphasis on autonomous capability, vehicle-level safety and inter-vehicle coordination.",

  priorities: [
    "Demonstrate autonomous capability",
    "Integrate multiple vehicle domains",
    "Maintain independent vehicle-level control",
    "Validate communication and telemetry",
    "Use perception for autonomous operation",
    "Maintain manual and safety fallbacks",
  ],

  domains: [
    "USV",
    "UAV",
  ],
};