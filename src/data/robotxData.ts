// ─────────────────────────────────────────────────────────────




// AQUAHOLICS — ROBOTX 2026 CONTENT
// All RobotX website content lives in this file.
// Pages read their content from here.
//
// IMPORTANT:
// Replace remaining TODO fields with confirmed team information,
// photographs, test dates/results, sponsors, and links.
// Do not replace unknown technical values with estimates.
// ─────────────────────────────────────────────────────────────


// ═════════════════════════════════════════════════════════════
// TEAM
// ═════════════════════════════════════════════════════════════

export const TEAM = {
  name: "AQUAHOLICS",

  institution: "R.M.K Engineering College, Department of ECE",

  location: "Tamil Nadu, India",

  tagline: "Autonomous marine robotics for cleaner water bodies.",

  email: "TODO-team-email@example.com",

  phone: "",

  links: [
    // {
    //   label: "Website",
    //   url: "https://aquaholics.in",
    // },
    // {
    //   label: "GitHub",
    //   url: "https://github.com/...",
    // },
    // {
    //   label: "LinkedIn",
    //   url: "https://linkedin.com/...",
    // },
  ] as { label: string; url: string }[],
};


// ═════════════════════════════════════════════════════════════
// EVENT
// ═════════════════════════════════════════════════════════════

export const EVENT = {
  name: "Maritime RobotX Challenge 2026",

  theme: "Storm Response",

  dates: "Week of 8 November 2026",

  venue: "Promontory at Marina Bay, Singapore",
};


// ═════════════════════════════════════════════════════════════
// NAVIGATION
// ═════════════════════════════════════════════════════════════

export const NAV = [
  { label: "Overview", path: "/robotx", end: true },

  { label: "Team", path: "/robotx/team" },

  { label: "System & Vehicles", path: "/robotx/system-vehicles" },

  { label: "Design & Development", path: "/robotx/design" },

  { label: "Testing & Results", path: "/robotx/testing" },

  { label: "Media", path: "/robotx/media" },

  { label: "Sponsors", path: "/robotx/sponsors" },

  { label: "Contact", path: "/robotx/contact" },
];


// ═════════════════════════════════════════════════════════════
// TEAM MEMBERS
// ═════════════════════════════════════════════════════════════

export type Member = {
  name: string;
  role: string;
  bio?: string;
  photo?: string;
};


export const MEMBERS: Member[] = [
  {
    name: "TODO Member Name",
    role: "Team Lead",
    bio: "TODO one-line bio.",
    photo: "",
  },

  {
    name: "TODO Member Name",
    role: "Embedded & Electronics",
    bio: "TODO one-line bio.",
    photo: "",
  },

  {
    name: "TODO Member Name",
    role: "Software & Autonomy",
    bio: "TODO one-line bio.",
    photo: "",
  },

  {
    name: "TODO Member Name",
    role: "Mechanical & Hull Design",
    bio: "TODO one-line bio.",
    photo: "",
  },
];


export const ADVISOR: Member = {
  name: "TODO Faculty Advisor",

  role: "Faculty Advisor",

  bio: "Department of ECE, R.M.K Engineering College",

  photo: "",
};


// ═════════════════════════════════════════════════════════════
// VEHICLES
// ═════════════════════════════════════════════════════════════

export type Vehicle = {
  id: string;

  name: string;

  domain: "USV" | "UUV" | "UAV";

  tagline: string;

  summary: string;

  specs: {
    label: string;
    value: string;
  }[];

  systems: {
    title: string;
    items: string[];
  }[];

  safety: string[];

  status: string;

  photo?: string;
};


// ─────────────────────────────────────────────────────────────
// CURRENT CONFIRMED VEHICLES
// ─────────────────────────────────────────────────────────────

export const VEHICLES: Vehicle[] = [

  // ═══════════════════════════════════════════════════════════
  // DRAKEN MARK 1 — USV
  // ═══════════════════════════════════════════════════════════

  {
    id: "usv",

    name: "DRAKEN Mark 1",

    domain: "USV",

    tagline: "Autonomous Surface Vehicle",

    summary:
      "DRAKEN Mark 1 is a custom-built Uncrewed Surface Vessel designed for autonomous surface navigation, computer-vision-based perception, obstacle handling and coordinated maritime mission execution.",

    specs: [
      {
        label: "Dimensions",
        value: "650 × 500 × 500 mm",
      },

      {
        label: "Construction",
        value: "Fiberglass and resin over thin sheet-metal base",
      },

      {
        label: "Hull",
        value: "V-shaped hull",
      },

      {
        label: "Compute",
        value: "Raspberry Pi 5",
      },

      {
        label: "Low-Level Controller",
        value: "Pixhawk",
      },

      {
        label: "Navigation Sensors",
        value: "GPS + 9-axis IMU",
      },

      {
        label: "Perception",
        value: "Camera + YOLOv5n + OpenCV",
      },

      {
        label: "LiDAR",
        value: "Not used",
      },

      {
        label: "Propulsion",
        value: "Underwater thrusters, 12–24 V",
      },

      {
        label: "Battery",
        value: "6S 7500 mAh lithium-ion",
      },

      {
        label: "Stability",
        value: "Custom ballast tank",
      },

      {
        label: "Communication",
        value: "RF telemetry + MAVLink",
      },

      {
        label: "Manual Control",
        value: "RF remote control",
      },

      {
        label: "Expected Speed",
        value: "5–10 km/h",
      },
    ],

    systems: [
      {
        title: "COMPUTING",

        items: [
          "Raspberry Pi 5",
          "High-level autonomy",
          "Mission logic",
          "Computer vision",
        ],
      },

      {
        title: "CONTROL",

        items: [
          "Pixhawk",
          "Low-level vehicle control",
          "Propulsion control",
          "Manual override",
        ],
      },

      {
        title: "PERCEPTION",

        items: [
          "Onboard camera",
          "YOLOv5n",
          "OpenCV",
          "Obstacle detection",
        ],
      },

      {
        title: "NAVIGATION",

        items: [
          "GPS",
          "9-axis IMU",
          "Waypoint navigation",
          "Obstacle response",
        ],
      },

      {
        title: "COMMUNICATION",

        items: [
          "RF telemetry",
          "MAVLink",
          "USV–UAV communication",
          "OCS / RoboCommand integration",
        ],
      },

      {
        title: "STABILITY",

        items: [
          "Custom ballast tank",
          "Water-condition stability",
          "Compact V-shaped hull",
        ],
      },
    ],

    safety: [
      "Hardware kill switch",
      "Geofence",
      "Low-battery return-to-home",
      "GPS-loss recovery",
      "Manual override",
      "Autonomous failure fallback",
      "Communication-loss fallback",
    ],

    status: "Autonomous navigation under development",

    photo: "",
  },


  // ═══════════════════════════════════════════════════════════
  // REVELATION — UAV
  // ═══════════════════════════════════════════════════════════

  {
    id: "uav",

    name: "REVELATION",

    domain: "UAV",

    tagline: "Aerial Intelligence Platform",

    summary:
      "REVELATION is a custom-built S500 aerial platform designed to provide aerial perception, mission information and cross-domain support for coordinated RobotX operations.",

    specs: [
      {
        label: "Airframe",
        value: "S500",
      },

      {
        label: "Flight Controller",
        value: "Pixhawk 2.4.8",
      },

      {
        label: "Companion Computer",
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
        label: "Communication",
        value: "Telemetry + MAVLink",
      },

      {
        label: "Battery",
        value: "Bonka LiPo 11.1 V 2200 mAh",
      },

      {
        label: "Payload Capacity",
        value: ">500 g",
      },

      {
        label: "Current Autonomy",
        value: "Semi-autonomous",
      },
    ],

    systems: [
      {
        title: "AIRFRAME",

        items: [
          "S500 frame",
          "Compact aerial platform",
          "Payload support",
          "Flight stability",
        ],
      },

      {
        title: "FLIGHT CONTROL",

        items: [
          "Pixhawk 2.4.8",
          "GPS navigation",
          "Manual flight control",
          "Autonomous flight testing",
        ],
      },

      {
        title: "COMPUTING",

        items: [
          "Raspberry Pi 5",
          "High-level autonomy",
          "Vision processing",
          "Mission logic",
        ],
      },

      {
        title: "PERCEPTION",

        items: [
          "Arducam IMX296",
          "Computer vision",
          "Aerial observation",
          "Mission information",
        ],
      },

      {
        title: "COMMUNICATION",

        items: [
          "Telemetry",
          "MAVLink",
          "USV coordination",
          "Mission information exchange",
        ],
      },
    ],

    safety: [
      "Return-to-home fallback",
      "Manual flight control",
      "GPS-based navigation",
      "Communication-loss fallback",
      "Autonomous flight fallback",
    ],

    status: "Autonomous flight testing",

    photo: "",
  },

  // ─────────────────────────────────────────────────────────
  // UUV
  // ─────────────────────────────────────────────────────────
  //
  // No confirmed AQUAHOLICS UUV information has been provided.
  // Do NOT add a fictional UUV here.
];


// ═════════════════════════════════════════════════════════════
// SYSTEM OF SYSTEMS
// ═════════════════════════════════════════════════════════════

export const SYSTEM_OF_SYSTEMS = {
  summary:
    "AQUAHOLICS is developing an integrated multi-domain System of Systems in which DRAKEN Mark 1 provides the surface platform and REVELATION provides aerial sensing and mission support. The platforms are designed to exchange mission and telemetry information while retaining independent vehicle-level control and safety fallbacks.",

  dataFlow: [
    "REVELATION provides aerial perception and mission information when aerial support is required.",

    "REVELATION and DRAKEN Mark 1 exchange mission and telemetry information through the inter-vehicle communication system.",

    "DRAKEN Mark 1 processes onboard perception, navigation and mission information for surface operations.",

    "The OCS provides the team interface to RoboCommand for system-level commands and reporting.",

    "Each vehicle retains independent control and safety fallback behavior if coordination or communication is interrupted.",
  ],
};


// ═════════════════════════════════════════════════════════════
// COMMUNICATION ARCHITECTURE
// ═════════════════════════════════════════════════════════════

export const COMMUNICATION = {
  vehicleLink: "SiK RF telemetry",

  protocol: "MAVLink",

  mechanisms: [
    "Frequency-hopping spread spectrum (FHSS)",
    "Time-division multiplexing (TDM)",
    "Gaussian frequency-shift keying (GFSK)",
  ],

  targetBand: "900 MHz class RF",

  status: "Integration and validation ongoing",

  architecture: [
    "DRAKEN Mark 1 ↔ REVELATION",
    "MAVLink mission and telemetry exchange",
    "OCS ↔ RoboCommand",
  ],
};


// ═════════════════════════════════════════════════════════════
// AUTONOMY
// ═════════════════════════════════════════════════════════════

export const AUTONOMY = {
  architecture: [
    "Perception",
    "State Estimation",
    "Decision",
    "Navigation",
    "Control",
    "Vehicle Action",
  ],

  usv: {
    perception: [
      "Camera-based perception",
      "YOLOv5n",
      "OpenCV",
      "Obstacle detection",
    ],

    stateEstimation: [
      "GPS",
      "9-axis IMU",
    ],

    navigation: [
      "Waypoint navigation",
      "Obstacle assessment",
      "Path replanning",
    ],

    control: [
      "Raspberry Pi 5 high-level autonomy",
      "Pixhawk low-level control",
    ],
  },

  uav: {
    perception: [
      "Arducam IMX296",
      "Computer vision",
      "Aerial observation",
    ],

    stateEstimation: [
      "GPS",
      "Flight-controller state",
    ],

    navigation: [
      "Autonomous flight testing",
      "Mission navigation",
    ],

    control: [
      "Raspberry Pi 5 high-level computing",
      "Pixhawk 2.4.8 flight control",
    ],
  },
};


// ═════════════════════════════════════════════════════════════
// AI / COMPUTER VISION
// ═════════════════════════════════════════════════════════════

export const AI_SYSTEM = {
  model: "YOLOv5n",

  framework: "OpenCV",

  purpose: [
    "Visual object detection",
    "Buoy and light-state perception",
    "Obstacle detection",
    "Mission-relevant visual perception",
  ],

  dataset: {
    type: "Custom dataset",
    images: "~4000",
    classes: "6",
    training: "Google Colab",
  },

  deployment: {
    platform: "Raspberry Pi 5",
    status: "Implemented and under validation",
  },
};


// ═════════════════════════════════════════════════════════════
// SAFETY & FALLBACK
// ═════════════════════════════════════════════════════════════

export const SAFETY = {
  mechanisms: [
    "Hardware kill switch",
    "Geofencing",
    "Low-battery return-to-home",
    "Manual override",
    "Communication-loss fallback",
    "GPS-loss recovery",
    "Autonomous-system failure fallback",
  ],

  behaviors: [
    {
      failure: "Unexpected obstacle",

      response:
        "Stop or slow, reassess the environment and re-plan the local path.",
    },

    {
      failure: "Communication loss",

      response:
        "Continue individual autonomous operation where safe; initiate safe-return behavior if the affected vehicle cannot recover the link.",
    },

    {
      failure: "USV autonomous failure",

      response: "Fall back to manual control.",
    },

    {
      failure: "UAV autonomous or communication failure",

      response:
        "Use return-to-home or manual recovery where conditions permit.",
    },

    {
      failure: "GPS loss",

      response:
        "Reduce or stop autonomous movement, attempt recovery, then transition to a safe fallback if recovery is unsuccessful.",
    },

    {
      failure: "Low battery",

      response:
        "Initiate return-to-home behavior where applicable.",
    },

    {
      failure: "Higher-priority mission command",

      response:
        "Interrupt the current task, execute the higher-priority command, and resume the previous mission when appropriate.",
    },
  ],
};


// ═════════════════════════════════════════════════════════════
// DESIGN & DEVELOPMENT
// ═════════════════════════════════════════════════════════════

export type Decision = {
  title: string;
  problem: string;
  options: string;
  decision: string;
  rationale: string;
};


export const DECISIONS: Decision[] = [
  {
    title: "V-Shaped USV Hull",

    problem:
      "The surface platform requires a compact hull capable of efficient movement and stable operation in the water.",

    options:
      "Different hull profiles and construction approaches were considered during the vehicle development process.",

    decision:
      "A compact V-shaped hull constructed using fiberglass and resin over a lightweight base structure.",

    rationale:
      "The V-shaped profile was selected to provide a streamlined form for moving through the water while supporting the required propulsion, electronics and ballast integration.",
  },

  {
    title: "Raspberry Pi 5 + Pixhawk Architecture",

    problem:
      "High-level perception and autonomy processing should not directly interfere with real-time vehicle control.",

    options:
      "A single computing platform or a separated high-level and low-level control architecture.",

    decision:
      "Raspberry Pi 5 is used for high-level computing, while Pixhawk handles low-level vehicle control.",

    rationale:
      "Separating autonomy and perception from real-time control provides a modular architecture and allows the vehicle-control layer to remain independent of higher-level AI processing.",
  },

  {
    title: "Camera-Based Obstacle Perception",

    problem:
      "The USV requires perception of relevant objects and obstacles for autonomous operation.",

    options:
      "Camera-based computer vision and alternative ranging-based perception approaches.",

    decision:
      "A camera-based perception pipeline using YOLOv5n and OpenCV.",

    rationale:
      "The approach provides a compact vision-based perception system that can run on the onboard computing platform.",
  },

  {
    title: "Custom Ballast System",

    problem:
      "The USV needs to maintain stability under changing water conditions.",

    options:
      "Fixed ballast arrangement or an integrated custom ballast system.",

    decision:
      "A custom ballast tank is integrated into DRAKEN Mark 1.",

    rationale:
      "The ballast system is intended to support vehicle stability while maintaining the required operating configuration.",
  },

  {
    title: "S500 UAV Platform",

    problem:
      "The aerial platform requires sufficient structural space, flight stability and payload capability for its onboard systems.",

    options:
      "Different multirotor frame configurations.",

    decision:
      "An S500-based custom UAV platform.",

    rationale:
      "The S500 configuration provides practical space for the flight controller, companion computer, camera, GPS, telemetry and payload while supporting the current development configuration.",
  },
];


// ═════════════════════════════════════════════════════════════
// BUILD LOG
// ═════════════════════════════════════════════════════════════

export type LogPost = {
  date: string;
  title: string;
  body: string;
  photo?: string;
};


export const BUILD_LOG: LogPost[] = [
  {
    date: "TODO",

    title: "USV Development",

    body:
      "TODO: Add confirmed build milestone, date, engineering work and supporting media.",

    photo: "",
  },

  {
    date: "TODO",

    title: "UAV Development",

    body:
      "TODO: Add confirmed UAV development milestone, date and supporting media.",

    photo: "",
  },

  {
    date: "TODO",

    title: "Autonomy Development",

    body:
      "TODO: Add confirmed autonomy or computer-vision development milestone.",

    photo: "",
  },
];


// ═════════════════════════════════════════════════════════════
// TESTING
// ═════════════════════════════════════════════════════════════

export type TestEntry = {
  date: string;

  type: "Simulation" | "Water" | "Air" | "Integration";

  location: string;

  minutes: number;

  objective: string;

  result: string;
};


export const TESTS: TestEntry[] = [
  {
    date: "TODO",

    type: "Simulation",

    location: "TODO simulator / lab",

    minutes: 0,

    objective:
      "Validate autonomy, perception or mission algorithms before physical testing.",

    result:
      "TODO: Add the actual simulation result and measured outcome.",
  },

  {
    date: "TODO",

    type: "Water",

    location: "TODO water-test location",

    minutes: 0,

    objective:
      "Validate DRAKEN Mark 1 manual operation, propulsion, steering and basic water behavior.",

    result:
      "Manual water testing completed. Add exact date, duration and measured results.",
  },

  {
    date: "TODO",

    type: "Water",

    location: "TODO water-test location",

    minutes: 0,

    objective:
      "Validate DRAKEN Mark 1 autonomous waypoint navigation and obstacle response.",

    result:
      "Partially validated. Autonomous navigation remains under development.",
  },

  {
    date: "TODO",

    type: "Air",

    location: "TODO flight-test location",

    minutes: 0,

    objective:
      "Validate REVELATION airframe, propulsion, flight controller and GPS-based flight.",

    result:
      "UAV flight testing completed. Add exact date, duration and measured results.",
  },

  {
    date: "TODO",

    type: "Air",

    location: "TODO flight-test location",

    minutes: 0,

    objective:
      "Validate autonomous flight and mission behavior.",

    result:
      "Partially validated. Autonomous flight testing remains in progress.",
  },

  {
    date: "TODO",

    type: "Integration",

    location: "TODO integration-test location",

    minutes: 0,

    objective:
      "Validate USV–UAV communication, OCS/RoboCommand interaction and coordinated operation.",

    result:
      "Integration and validation ongoing.",
  },
];


// ═════════════════════════════════════════════════════════════
// TESTING SUMMARY
// ═════════════════════════════════════════════════════════════

export const TESTING_SUMMARY = {
  approach: [
    "Virtual / algorithm testing",
    "Component and laboratory testing",
    "Relevant-environment testing",
    "Full-system / pseudo-competition testing",
  ],

  cycle: [
    "Test",
    "Observe",
    "Identify failure",
    "Modify design or software",
    "Retest",
    "Validate",
  ],

  currentStatus: [
    {
      area: "AI Detection",
      status: "Completed",
    },

    {
      area: "USV Manual Water Operation",
      status: "Completed",
    },

    {
      area: "USV Autonomous Navigation",
      status: "Partially validated",
    },

    {
      area: "UAV Flight",
      status: "Completed",
    },

    {
      area: "UAV Autonomous Flight",
      status: "Partially validated",
    },

    {
      area: "USV Obstacle Detection",
      status: "Completed",
    },

    {
      area: "USV–UAV Communication",
      status: "Undergoing validation",
    },

    {
      area: "OCS / RoboCommand",
      status: "Partially implemented / under test",
    },

    {
      area: "USV–UAV Integrated Operation",
      status: "Undergoing validation",
    },
  ],
};


// ═════════════════════════════════════════════════════════════
// CROSS-CUTTING CAPABILITIES
// These are technical system capabilities, NOT a competition
// strategy page.
// ═════════════════════════════════════════════════════════════

export const CROSS_CUTTING = [
  {
    title: "RoboCommand",

    summary:
      "OCS provides the team interface to RoboCommand for system-level commands and reporting.",

    status: "Implemented and under test",
  },

  {
    title: "Obstacle Avoidance",

    summary:
      "Camera-based computer vision identifies relevant obstacles and supports stop, slow-down and local path-replanning behavior.",

    status: "Implemented in autonomy architecture",
  },

  {
    title: "Inter-Vehicle Communication",

    summary:
      "DRAKEN Mark 1 and REVELATION are being integrated using RF telemetry and MAVLink for mission and telemetry exchange.",

    status: "Integration and validation ongoing",
  },

  {
    title: "Dynamic Adaptability",

    summary:
      "The autonomy architecture supports obstacle response, communication-loss behavior, mission interruption and recovery behaviors.",

    status: "Implemented and under validation",
  },

  {
    title: "Safety",

    summary:
      "Hardware and software safety mechanisms include kill switch, geofence, low-battery return-to-home, manual override and failure fallback behavior.",

    status: "Implemented / under validation",
  },
];


// ═════════════════════════════════════════════════════════════
// MEDIA
// ═════════════════════════════════════════════════════════════

export const VIDEOS: {
  title: string;
  youtubeId: string;
}[] = [
  // {
  //   title: "Team Introduction",
  //   youtubeId: "XXXXXXXXXXX",
  // },

  // {
  //   title: "DRAKEN Mark 1 Water Test",
  //   youtubeId: "XXXXXXXXXXX",
  // },

  // {
  //   title: "REVELATION Flight Test",
  //   youtubeId: "XXXXXXXXXXX",
  // },
];


export const PHOTOS: {
  src: string;
  alt: string;
  caption?: string;
}[] = [
  // {
  //   src: "/robotx/draken.jpg",
  //   alt: "DRAKEN Mark 1 during water testing",
  //   caption: "DRAKEN Mark 1 water test",
  // },

  // {
  //   src: "/robotx/revelation.jpg",
  //   alt: "REVELATION UAV during flight testing",
  //   caption: "REVELATION flight test",
  // },
];


// ═════════════════════════════════════════════════════════════
// SPONSORS
// ═════════════════════════════════════════════════════════════

export const SPONSORS: {
  name: string;
  logo?: string;
  url?: string;
  tier?: string;
}[] = [
  // {
  //   name: "Sponsor Name",
  //   logo: "/robotx/sponsors/name.png",
  //   url: "https://...",
  //   tier: "Gold",
  // },
];


// ═════════════════════════════════════════════════════════════
// SEARCH INDEX
// ═════════════════════════════════════════════════════════════

export type SearchItem = {
  title: string;
  path: string;
  text: string;
};


export const SEARCH_INDEX: SearchItem[] = [

  // ─────────────────────────────────────────────────────────
  // OVERVIEW
  // ─────────────────────────────────────────────────────────

  {
    title: "Overview",

    path: "/robotx",

    text: `
      ${EVENT.name}
      ${EVENT.theme}
      ${EVENT.dates}
      ${EVENT.venue}
      ${TEAM.name}
      ${TEAM.tagline}
    `,
  },


  // ─────────────────────────────────────────────────────────
  // TEAM
  // ─────────────────────────────────────────────────────────

  ...MEMBERS.map((member) => ({
    title: `${member.name} — ${member.role}`,

    path: "/robotx/team",

    text: `
      ${member.role}
      ${member.bio ?? ""}
    `,
  })),

  {
    title: ADVISOR.name,

    path: "/robotx/team",

    text: `
      ${ADVISOR.role}
      ${ADVISOR.bio ?? ""}
    `,
  },


  // ─────────────────────────────────────────────────────────
  // SYSTEM OF SYSTEMS
  // ─────────────────────────────────────────────────────────

  {
    title: "System of Systems",

    path: "/robotx/system-vehicles",

    text: `
      ${SYSTEM_OF_SYSTEMS.summary}
      ${SYSTEM_OF_SYSTEMS.dataFlow.join(" ")}
    `,
  },


  // ─────────────────────────────────────────────────────────
  // VEHICLES
  // ─────────────────────────────────────────────────────────

  ...VEHICLES.map((vehicle) => ({
    title: `${vehicle.name} — ${vehicle.domain}`,

    path: "/robotx/system-vehicles",

    text: `
      ${vehicle.name}
      ${vehicle.domain}
      ${vehicle.tagline}
      ${vehicle.summary}
      ${vehicle.status}

      ${vehicle.specs
        .map((spec) => `${spec.label}: ${spec.value}`)
        .join(" ")}

      ${vehicle.systems
        .map(
          (system) =>
            `${system.title}: ${system.items.join(", ")}`
        )
        .join(" ")}

      ${vehicle.safety.join(" ")}
    `,
  })),


  // ─────────────────────────────────────────────────────────
  // COMMUNICATION
  // ─────────────────────────────────────────────────────────

  {
    title: "Communication Architecture",

    path: "/robotx/system-vehicles",

    text: `
      ${COMMUNICATION.vehicleLink}
      ${COMMUNICATION.protocol}
      ${COMMUNICATION.mechanisms.join(" ")}
      ${COMMUNICATION.targetBand}
      ${COMMUNICATION.status}
    `,
  },


  // ─────────────────────────────────────────────────────────
  // AUTONOMY
  // ─────────────────────────────────────────────────────────

  {
    title: "Autonomy",

    path: "/robotx/design",

    text: `
      ${AUTONOMY.architecture.join(" ")}
      ${AUTONOMY.usv.perception.join(" ")}
      ${AUTONOMY.usv.stateEstimation.join(" ")}
      ${AUTONOMY.usv.navigation.join(" ")}
      ${AUTONOMY.usv.control.join(" ")}
      ${AUTONOMY.uav.perception.join(" ")}
      ${AUTONOMY.uav.stateEstimation.join(" ")}
      ${AUTONOMY.uav.navigation.join(" ")}
      ${AUTONOMY.uav.control.join(" ")}
    `,
  },


  // ─────────────────────────────────────────────────────────
  // AI
  // ─────────────────────────────────────────────────────────

  {
    title: "AI & Computer Vision",

    path: "/robotx/design",

    text: `
      ${AI_SYSTEM.model}
      ${AI_SYSTEM.framework}
      ${AI_SYSTEM.purpose.join(" ")}
      ${AI_SYSTEM.dataset.type}
      ${AI_SYSTEM.dataset.images}
      ${AI_SYSTEM.dataset.classes}
      ${AI_SYSTEM.dataset.training}
    `,
  },


  // ─────────────────────────────────────────────────────────
  // DESIGN DECISIONS
  // ─────────────────────────────────────────────────────────

  ...DECISIONS.map((decision) => ({
    title: decision.title,

    path: "/robotx/design",

    text: `
      ${decision.problem}
      ${decision.options}
      ${decision.decision}
      ${decision.rationale}
    `,
  })),


  // ─────────────────────────────────────────────────────────
  // BUILD LOG
  // ─────────────────────────────────────────────────────────

  ...BUILD_LOG.map((post) => ({
    title: post.title,

    path: "/robotx/design",

    text: `
      ${post.date}
      ${post.body}
    `,
  })),


  // ─────────────────────────────────────────────────────────
  // TESTING
  // ─────────────────────────────────────────────────────────

  ...TESTS.map((test) => ({
    title: `${test.type} test — ${test.date}`,

    path: "/robotx/testing",

    text: `
      ${test.location}
      ${test.objective}
      ${test.result}
    `,
  })),


  // ─────────────────────────────────────────────────────────
  // TESTING SUMMARY
  // ─────────────────────────────────────────────────────────

  {
    title: "Testing Strategy",

    path: "/robotx/testing",

    text: `
      ${TESTING_SUMMARY.approach.join(" ")}
      ${TESTING_SUMMARY.cycle.join(" ")}
      ${TESTING_SUMMARY.currentStatus
        .map((item) => `${item.area}: ${item.status}`)
        .join(" ")}
    `,
  },


  // ─────────────────────────────────────────────────────────
  // CROSS-CUTTING CAPABILITIES
  // ─────────────────────────────────────────────────────────

  ...CROSS_CUTTING.map((item) => ({
    title: item.title,

    path: "/robotx/system-vehicles",

    text: `
      ${item.summary}
      ${item.status}
    `,
  })),


  // ─────────────────────────────────────────────────────────
  // MEDIA
  // ─────────────────────────────────────────────────────────

  ...VIDEOS.map((video) => ({
    title: video.title,

    path: "/robotx/media",

    text: "video",
  })),

  ...PHOTOS.map((photo) => ({
    title: photo.alt,

    path: "/robotx/media",

    text: photo.caption ?? "",
  })),


  // ─────────────────────────────────────────────────────────
  // SPONSORS
  // ─────────────────────────────────────────────────────────

  ...SPONSORS.map((sponsor) => ({
    title: sponsor.name,

    path: "/robotx/sponsors",

    text: sponsor.tier ?? "sponsor",
  })),


  // ─────────────────────────────────────────────────────────
  // CONTACT
  // ─────────────────────────────────────────────────────────

  {
    title: "Contact",

    path: "/robotx/contact",

    text: `
      ${TEAM.email}
      ${TEAM.phone}
      ${TEAM.location}
      ${TEAM.institution}
    `,
  },
];