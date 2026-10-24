/* Author: Nithish Kaliannan Ananth */
// src/constants/cmsSnapshot.ts
// Snapshot of the live CMS (aquaholics-backend, 24 Oct 2026). Used as
// placeholder data while the API wakes up and as the fallback when it is
// unreachable, so offline visitors see real content instead of dummy copy.
//
// One deliberate difference from the CMS: the Great Pacific Garbage Patch
// stat. The CMS says "18M+ km²"; the accepted figure is about 1.6M km².
// Fix it in Admin → Home → Stats too.

import type { HomeContent, Stat, AboutContent, Value, Member, Partner } from "../types";
import type { Product } from "../types/product";
import type { TimelineEvent, TimelineDashboardStats } from "../api/timelineapi";
import type { ContactInfo } from "../types/contact";

export const HOME_CONTENT: HomeContent = {
  "id": 1,
  "heroTitle": "Splash In & Say Welcome to Aquaholics",
  "heroSubtitle": "Every river needs a hero. Ours just happens to float.",
  "heroButtonText": "See how it work",
  "problemTitle": "Our Rivers and Lakes Are Drowning in Waste",
  "problemText": "Every day, our waters absorb what we throw away—plastic, sewage, chemicals, and agricultural waste. At the same time, invasive vegetation spreads unchecked and when it comes to cleaning up, humans are still doing what machines should: entering polluted waters, working for hours, and struggling to keep up.",
  "problemImageUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1784653873/aquaholics/home-content/gxgrpkny3lyj1ewwcsuq.jpg",
  "solutionTitle": "One Robot. Full Autonomy. No Limits. Just Cleaner Waters.",
  "solutionText": "Powered by AI, LiDAR, and intelligent navigation, our autonomous robot takes on the toughest parts of waterway cleaning—from detecting floating waste to collecting debris and vegetation—all while monitoring the health of the water in real time.",
  "solutionImageUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1784651876/aquaholics/home-content/orayleezwyjldh3jmipw.jpg",
  "ctaTitle": "Ready to See Cleaner Water in Action?",
  "ctaButtonText": "Partner with AQUAHOLICS",
  "active": true
};

export const HOME_STATS: Stat[] = [
  {
    "id": 1,
    "label": "Tons of plastic enter oceans from rivers every year",
    "numericValue": 2.4,
    "suffix": "M+",
    "prefix": "",
    "displayOrder": 1
  },
  {
    "id": 2,
    "label": "Of lakes and waterways are impacted by invasive aquatic weeds",
    "numericValue": 1000.0,
    "suffix": "s",
    "prefix": "",
    "displayOrder": 2
  },
  {
    "id": 3,
    "label": "Area of the Great Pacific Garbage Patch, about three times the size of France",
    "numericValue": 1.6,
    "suffix": "M km²",
    "prefix": "",
    "displayOrder": 3
  }
];

export const ABOUT_CONTENT: AboutContent = {
  "id": 1,
  "heroTitle": "Ever Met an AQUAHOLIC?",
  "heroSubtitle": "We exist to redefine water restoration. Every innovation we build is driven by one purpose—to protect the world’s most valuable resource.",
  "storyTitle": "Every Era Has Its Heroes.👑",
  "storyText": "From an Idea to a Revolution.\n\nWhat began as a student project quickly became something much bigger. The more we studied water pollution, the more we realised the gap between the scale of the problem and the effectiveness of existing solutions. Developing AQUAHOLICS demanded setbacks, sleepless nights, failed experiments, and countless redesigns that often seemed impossible. Those experiences didn’t slow us down—they defined who we are and why we continue building.",
  "storyImageUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1784654823/aquaholics/about-content/yuvmpoff5ulnul1lmshk.png",
  "missionTitle": "Our Mission",
  "missionText": "To become the force that redefine the future of water restoration by using autonomous intelligence, fearless innovation, and unwavering purpose.",
  "visionTitle": "Our Vision",
  "visionText": "A future where every river, lake, and ocean tells the story of humanity’s greatest comeback.",
  "whyTitle": "Defining an AQUAHOLIC...",
  "whyText": "For decades, water restoration relied on manpower. We believe the future belongs to intelligent machines that protect nature with greater precision, consistency, and reach.",
  "ctaTitle": "Want to Join the Blue Revolution?",
  "ctaButtonText": "Join the Mission",
  "isActive": true
};

export const VALUES: Value[] = [
  {
    "id": 2,
    "title": "Precision Engineering",
    "description": "Every component is designed for reliability, efficiency, and scale.",
    "icon": "lucide-zap",
    "displayOrder": 1
  },
  {
    "id": 3,
    "title": "Autonomous Intelligence",
    "description": "We build machines that think, navigate, and act independently.",
    "icon": "lucide-lightbulb",
    "displayOrder": 2
  },
  {
    "id": 1,
    "title": "Legacy",
    "description": "Building technology that will outlive us and redefine conservation.",
    "icon": "lucide-globe",
    "displayOrder": 3
  }
];

export const MEMBERS: Member[] = [
  {
    "id": 1,
    "name": "Prem Pradeep S",
    "role": "Founder & Managing Director",
    "photoUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1784658421/aquaholics/members/bijq0szpkgxu0kixrhu6.png",
    "bio": "From building prototypes to winning grants and taking the technology from the lab to real-world waters, Prem is on a mission to prove that the future of environmental action isn't just about awareness—it’s about building the technology to act.",
    "expertise": "CAD, Electronics, Robotics, Bussiness",
    "linkedin": "https://www.linkedin.com/in/prem-pradeep-s",
    "github": "https://www.linkedin.com/in/prem-pradeep-s",
    "instagram": "https://www.instagram.com/_premeee_?igsh=Mmlub3NoeXUwdnA0",
    "displayOrder": 1
  },
  {
    "id": 2,
    "name": "Dhaneshwara M",
    "role": "Chief Technology Officer",
    "photoUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1784659487/aquaholics/members/kncz3k6zgthrett9regv.png",
    "bio": "Autonomous water cleanup isn't just a robotics problem — it's a systems problem. He builds the vision models that let the robots recognize waste and the secure backend architecture that holds the whole platform together, end to end.",
    "expertise": "Java, Spring Boot, React, Computer Vision, AI",
    "linkedin": "https://www.linkedin.com/in/dhaneshwara-m-921585263",
    "github": "https://github.com/dHANESHWaRa-m",
    "instagram": "https://www.instagram.com/dhaneshwara_1?igsh=MXJidHg0NXRrdTR0ag==",
    "displayOrder": 2
  },
  {
    "id": 3,
    "name": "Gokulrajan R M",
    "role": "Chief Financial Officer",
    "photoUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1784660169/aquaholics/members/tegaf0n04ivkhjr3akm9.png",
    "bio": "Autonomous water surface cleaning begins with reliable embedded systems. Gokul developed the Arduino Mega-based control software, integrated sensors, propellers, and LoRa communication, enabling the robot to detect, navigate, and collect floating and semi-floating waste with dependable real-time performance.",
    "expertise": "Python, Embedded C, JAVA, AWS, AI",
    "linkedin": "https://www.linkedin.com/in/gokulrajan-r-m",
    "github": "https://github.com/Gokulrajan2004",
    "instagram": "https://www.instagram.com/gokulrajan.r.m?igsh=MWRyZjJmbmg0bDg1Nw==",
    "displayOrder": 3
  },
  {
    "id": 4,
    "name": "Aishwarya K",
    "role": "Chief Information Officer",
    "photoUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1784660335/aquaholics/members/g1zawdodtflxkxju8atb.png",
    "bio": "Aishwarya drives the digital strategy behind the autonomous water surface cleaning project by focusing on software development and system integration. She contributes to building scalable solution, and backend services that enable efficient data management, and seamless coordination between hardware and software components.",
    "expertise": "Java, Networking, Python, Full Stack Development.",
    "linkedin": "https://www.linkedin.com/in/aishwarya-k-a0920a263",
    "github": "https://github.com/aishwaryak727",
    "instagram": "https://www.instagram.com/aishwarya_k7?igsh=N3dzdHp0bWxhYWpp",
    "displayOrder": 4
  },
  {
    "id": 5,
    "name": "Poojashree T",
    "role": "Chief Operational Officer",
    "photoUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1784660513/aquaholics/members/pfilalm2pn6bnb7txgvz.png",
    "bio": "",
    "expertise": "",
    "linkedin": "",
    "github": "",
    "instagram": "",
    "displayOrder": 5
  },
  {
    "id": 6,
    "name": "Harini M",
    "role": "Chief Commercial Officer",
    "photoUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1784736499/aquaholics/members/ybhscciuyohoqxmeov5v.png",
    "bio": "Harini focuses on understanding customer needs and ensuring a positive user experience for the Autonomous Water Surface Cleaning Project. She works closely with customers, gathers feedback, and helps the team improve the solution based on user requirements. She also builds strong customer relationships and supports the successful adoption of the project.",
    "expertise": "Full Stack Development, Java, Computer Vision, Networking",
    "linkedin": "https://www.linkedin.com/in/harini-m-618920262/",
    "github": "https://github.com/harini083",
    "instagram": "https://www.instagram.com/harini.m_8?igsh=MXdla3ZnY3hkbnZlMA==",
    "displayOrder": 6
  },
  {
    "id": 7,
    "name": "Nivedhan R K",
    "role": "Chief Marketing Officer",
    "photoUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1784660649/aquaholics/members/jkppqxdqvamarrfdh5as.jpg",
    "bio": "From crafting the brand story to shaping investor pitches and building AQUAHOLICS’ public presence, Nivedhan is focused on turning innovative technology into a movement that inspires trust, attracts opportunities, and drives real environmental impact.",
    "expertise": "Brand Strategy, Marketing, Pitch Deck Design, Creative Direction, Public Speaking, Content Strategy",
    "linkedin": "https://www.linkedin.com/in/nivedhanrk",
    "github": "https://github.com/nivedhanrk",
    "instagram": "https://www.instagram.com/itssnivi",
    "displayOrder": 7
  },
  {
    "id": 8,
    "name": "Sharma G",
    "role": "Industrial Expert",
    "photoUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1784660714/aquaholics/members/fyoucwsqdsxeyhs582ar.png",
    "bio": "",
    "expertise": "",
    "linkedin": "",
    "github": "",
    "instagram": "",
    "displayOrder": 8
  }
];

export const PARTNERS: Partner[] = [];

export const PRODUCT: Product = {
  "id": 1,
  "name": "Walrus",
  "tagline": "India's First Indigenous, Fully Autonomous Water Surface Cleaning Robot",
  "description": "Walrus is an intelligent, fully autonomous water surface cleaning robot built to keep lakes, rivers, canals, and harbors clean—around the clock. Powered by AI-driven perception and advanced robotics, it navigates water bodies, identifies and collects floating waste, and tackles pollution without constant human intervention. Designed for sustainable, scalable operation, Walrus brings together autonomy, intelligence, and clean technology to transform the way we protect and restore our water bodies.",
  "heroTitle": "Meet Walrus",
  "heroSubtitle": "Reimagining Water Cleanup Through Autonomous Robotics.",
  "coverImageUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1785133560/aquaholics/products/wqkdrdi4aiuhbn27x0iw.jpg",
  "videoUrl": "https://youtu.be/LPK7dAEQOzk",
  "ctaTitle": "Ready to Transform Water Bodies?",
  "ctaButtonText": "Calling all autobots....",
  "active": true,
  "images": [
    {
      "id": 1,
      "imageUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1785133628/aquaholics/products/gallery/jmgtfabxgec5s48loipd.jpg",
      "caption": "CAD Model of Walrus",
      "displayOrder": 1
    },
    {
      "id": 2,
      "imageUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1785133662/aquaholics/products/gallery/zhzbcmszj2xakuplbw78.jpg",
      "caption": "Skeleton of Walrus",
      "displayOrder": 2
    },
    {
      "id": 3,
      "imageUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1785133697/aquaholics/products/gallery/dzkbfqrkl8wicf4twau7.jpg",
      "caption": "Chassis of Walrus",
      "displayOrder": 3
    },
    {
      "id": 4,
      "imageUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1785133735/aquaholics/products/gallery/bnpd4qphhe3ni6cxrr3k.jpg",
      "caption": "50% Completed Model",
      "displayOrder": 4
    },
    {
      "id": 5,
      "imageUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1785133799/aquaholics/products/gallery/zvb7q486ivhlgh2ocrls.jpg",
      "caption": "Real Time Testing",
      "displayOrder": 5
    }
  ],
  "features": [
    {
      "id": 1,
      "icon": "Route",
      "title": "Autonomous NAVIGATION..",
      "description": "Powered by LiDAR, GPS, geofencing, and ROS-based navigation, our robot intelligently maps and navigates water bodies with minimal human intervention. Real-time sensing enables it to detect obstacles, plan safe routes, and operate within predefined boundaries.",
      "displayOrder": 1
    },
    {
      "id": 2,
      "icon": "SlidersHorizontal",
      "title": "Ballast Tank",
      "description": "Twin ballast tanks positioned on either side of the robot actively pump water in and out to adjust its draft and buoyancy.",
      "displayOrder": 2
    },
    {
      "id": 3,
      "icon": "Cog",
      "title": "Collection Mechanism",
      "description": "A rotating screw conveyor mechanism continuously collects floating waste from the water surface and transports it directly into the onboard collection chamber.",
      "displayOrder": 3
    },
    {
      "id": 4,
      "icon": "Gauge",
      "title": "Water Quality Monitoring",
      "description": "Equipped with advanced water quality sensors, the robot continuously monitors key parameters such as pH, dissolved oxygen, turbidity, and temperature in real time.",
      "displayOrder": 4
    }
  ],
  "specs": [
    {
      "id": 2,
      "category": "Flotation Body",
      "label": "Floating Depth",
      "value": "Up to 20 cm",
      "description": "Controlled floating depth maintained via ballast tank adjustment",
      "displayOrder": 1
    },
    {
      "id": 4,
      "category": "Flotation Body",
      "label": "Hull Material",
      "value": "Fiberglass reinforced with ISO polymer resin",
      "description": "Lightweight, corrosion-resistant, durable for long-term floating use",
      "displayOrder": 2
    },
    {
      "id": 5,
      "category": "Flotation Body",
      "label": "Debris Handling Capacity",
      "value": "Up to 4 kg",
      "description": "Maximum weight of debris the propellers can push/drag",
      "displayOrder": 3
    },
    {
      "id": 6,
      "category": "Collection System",
      "label": "Mechanism",
      "value": "Screw conveyor",
      "description": "Collects and transports floating waste into a net",
      "displayOrder": 1
    },
    {
      "id": 7,
      "category": "Collection System",
      "label": "Operating Speed",
      "value": "30 RPM",
      "description": "Screw conveyor rotation speed",
      "displayOrder": 2
    },
    {
      "id": 8,
      "category": "Collection System",
      "label": "Collection Rate",
      "value": "12–25 L/hour",
      "description": "Depends on debris density and fill rate",
      "displayOrder": 3
    },
    {
      "id": 9,
      "category": "Navigation System",
      "label": "Autonomous Mode",
      "value": "YOLOv5n + LiDAR + IMU + GPS",
      "description": "Camera-based object detection with 3D mapping via ROS",
      "displayOrder": 1
    },
    {
      "id": 10,
      "category": "Navigation System",
      "label": "Manual Mode",
      "value": "LoRa-based remote control",
      "description": "Backup/testing mode when autonomous navigation is disabled",
      "displayOrder": 2
    }
  ],
  "steps": [
    {
      "id": 1,
      "stepNumber": 1,
      "icon": "Navigation",
      "title": "Autonomous Navigation",
      "description": "The robot uses LiDAR, GPS, IMU, and camera-based object detection to map its surroundings and navigate independently toward floating waste."
    },
    {
      "id": 2,
      "stepNumber": 2,
      "icon": "Recycle",
      "title": "Waste Collection",
      "description": "A screw conveyor mechanism draws floating debris into a collection net, while ballast tanks adjust depth for efficient collection."
    },
    {
      "id": 3,
      "stepNumber": 3,
      "icon": "Microscope",
      "title": "Water Quality Monitoring",
      "description": "Onboard sensors measure pH, DO, TDS, ORP, and other parameters, using machine learning to classify pollution sources in real time."
    },
    {
      "id": 4,
      "stepNumber": 4,
      "icon": "Cloud",
      "title": "Live Data & Alerts",
      "description": "Sensor data, robot status, and pollution alerts are synced to the cloud dashboard, notifying authorities when action is needed."
    }
  ],
  "useCases": [
    {
      "id": 1,
      "icon": "Waves",
      "title": "Rivers & Lakes",
      "description": "Clears floating plastic waste and debris from rivers and lakes, supporting conservation and riverfront development projects.",
      "imageUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1785423319/aquaholics/products/usecases/h2v2icneixrbvuitfupq.webp",
      "displayOrder": 1
    },
    {
      "id": 2,
      "icon": "Building2",
      "title": "Municipal Water Bodies",
      "description": "Deployed by city councils and urban local bodies to maintain clean public water bodies while cutting manual cleaning costs.",
      "imageUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1785423319/aquaholics/products/usecases/lij3nwjeme8ip86tt6m1.jpg",
      "displayOrder": 2
    },
    {
      "id": 3,
      "icon": "Fish",
      "title": "Aquaculture Farms",
      "description": "Cleans and monitors fish farming ponds, improving water quality for healthier aquaculture yields.",
      "imageUrl": "https://res.cloudinary.com/ykw1tsku/image/upload/v1785423322/aquaholics/products/usecases/a2djsipkha2yubuzxrut.jpg",
      "displayOrder": 3
    }
  ]
};

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    "id": 12,
    "title": "Boeing BUILD 5.0",
    "description": "Boeing BUILD 5.0 attracted the highest number of entries to date, with over 2,000 ideas submitted by more than 2,700 students and start-up participants applying from tier 1, 2, and 3 cities across India.  Following a stringent evaluation process, 75 shortlisted teams entered the regional boot camp, of which Team AQUAHOLICS was a regional finalists.",
    "category": "MILESTONE",
    "date": "2026-06-10",
    "result": "Regional Finalist",
    "organization": "Boeing, IITM RP",
    "position": "Top 75",
    "link": "",
    "extraInfo": "",
    "imageUrl": "",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": 8,
    "title": "Niralthiruvizha",
    "description": "AQUAHOLICS was selected among the Top 500 teams under the Naan Mudhalvan Niral Thiruvizha initiative after successfully presenting its innovative solution. The selection recognized the project's potential and enabled access to further startup support and funding opportunities.",
    "category": "FUNDING",
    "date": "2026-04-10",
    "result": "Won",
    "organization": "Tamil Nadu [Naan Mudhalvan]",
    "position": "Top 500 Teams",
    "prizeAmount": 15000.0,
    "link": "",
    "extraInfo": "",
    "imageUrl": "",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": 11,
    "title": "Patent Publication",
    "description": "A patent has been successfully filed for the developed innovation and has now been published, marking another significant milestone in the journey of research and innovation.",
    "category": "PATENT",
    "date": "2026-02-17",
    "result": "Published",
    "organization": "IpIndia",
    "position": "",
    "link": "",
    "extraInfo": "",
    "imageUrl": "",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": 7,
    "title": "Ulagam Ungal Kaiyil",
    "description": "AQUAHOLICS was selected to be showcased at the Ulagam Ungal Kaiyil Innovation Expo, providing an opportunity to present our solution to industry leaders, startups, academic institutions, and government representatives. The exhibition recognized our project's innovation and its potential to address real-world environmental challenges.",
    "category": "RECOGNITION",
    "date": "2026-01-06",
    "result": "",
    "organization": "Tamil Nadu Government",
    "position": "",
    "prizeAmount": 1.0,
    "link": "",
    "extraInfo": "",
    "imageUrl": "",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": 10,
    "title": "Paper Publication",
    "description": "Successfully presented our Springer-formatted research paper at ICAARS 2025, held at PSG College of Technology, Coimbatore, on December 12–13, 2025",
    "category": "PUBLICATION",
    "date": "2025-12-13",
    "result": "Published",
    "organization": "PSG x IEEE [ICAARS]",
    "position": "",
    "prizeAmount": 0.0,
    "link": "",
    "extraInfo": "",
    "imageUrl": "",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": 6,
    "title": "Startup Cafe",
    "description": "Selected by EDII Startup Cafe for the innovative potential of AQUAHOLICS. The project successfully progressed through mentoring sessions, startup evaluations, and validation programs, earning funding support to accelerate prototype development and commercialization.",
    "category": "FUNDING",
    "date": "2025-12-08",
    "result": "Won",
    "organization": "Anna University [EDII]",
    "position": "",
    "prizeAmount": 300000.0,
    "link": "",
    "extraInfo": "",
    "imageUrl": "",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": 1,
    "title": "Idea To Impact 2.0",
    "description": "Starting with over 2,000 teams from across India, the I2I 2.0 Innovation Challenge followed a highly competitive selection process, narrowing the competition to 200, then 80, and finally 40 teams. The shortlisted teams received ₹50,000 in seed funding to develop functional prototypes. After successfully building and demonstrating our autonomous water surface cleaning robot, AQUAHOLICS secured a place among the Top 10 finalists and was ultimately awarded the First Prize, receiving ₹1,00,000 for our innovation and its potential environmental impact.",
    "category": "COMPETITION",
    "date": "2025-10-25",
    "result": "Winner",
    "organization": "IIT Madras and Wipro",
    "position": "1st Place",
    "prizeAmount": 100000.0,
    "link": "",
    "extraInfo": "",
    "imageUrl": "",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": 5,
    "title": "IETE Paper Presentation",
    "description": "Demonstrated the vision and technical foundation of AQUAHOLICS through a detailed paper presentation, explaining its potential to address water pollution using autonomous technology. The project's originality and engineering approach impressed the judges and secured a winning position.",
    "category": "COMPETITION",
    "date": "2025-03-09",
    "result": "Won",
    "organization": "IETE",
    "position": "3rd Place",
    "prizeAmount": 3500.0,
    "link": "",
    "extraInfo": "",
    "imageUrl": "",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": 4,
    "title": "Project Expo",
    "description": "Showcased the AQUAHOLICS prototype before a panel of judges, demonstrating its autonomous waste collection capabilities and real-world environmental applications. The project's innovation, working prototype, and presentation quality earned it top recognition among competing teams.",
    "category": "COMPETITION",
    "date": "2025-02-22",
    "result": "Won",
    "organization": "Panimalar Engineering college",
    "position": "1st Prize",
    "prizeAmount": 5500.0,
    "link": "",
    "extraInfo": "",
    "imageUrl": "",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": 3,
    "title": "National Technical Paper Presentation",
    "description": "Presented the AQUAHOLICS autonomous water surface cleaning project through a technical paper, showcasing its innovative design, embedded systems, and environmental impact. After successfully progressing through multiple evaluation rounds, the project received the highest overall score and secured the First Prize.",
    "category": "COMPETITION",
    "date": "2024-09-28",
    "result": "Won",
    "organization": "SSN",
    "position": "1st Prize",
    "prizeAmount": 7000.0,
    "link": "",
    "extraInfo": "",
    "imageUrl": "",
    "createdAt": "",
    "updatedAt": ""
  },
  {
    "id": 2,
    "title": "Project Expo",
    "description": "Successfully presented the AQUAHOLICS autonomous water surface cleaning robot at the VIT Project Expo. The project demonstrated an innovative approach to removing floating waste and improving water quality, earning appreciation from the judges for its practical impact and technical implementation.",
    "category": "COMPETITION",
    "date": "2024-09-20",
    "result": "Won",
    "organization": "VIT",
    "position": "2nd place",
    "prizeAmount": 5000.0,
    "link": "",
    "extraInfo": "",
    "imageUrl": "",
    "createdAt": "",
    "updatedAt": ""
  }
];

export const TIMELINE_STATS: TimelineDashboardStats = {
  "totalCompetitionPrize": 121000.0,
  "totalCompetitionsCount": 5,
  "totalFunding": 315000.0
};

export const CONTACT_INFO: ContactInfo = {
  "id": 2,
  "heroTitle": "Let's Talk",
  "heroSubtitle": "We'd love to hear from you — reach out anytime",
  "email": "aquaholics.tech@gmail.com",
  "phone": "7708365986",
  "address": "No.10, Pon Vedha Apartments, Tamarai Nagar 2nd Street, Cholambedu Road, Ambattur, Chennai - 600054",
  "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3885.6455585263657!2d80.137838!3d13.121626000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDA3JzE3LjkiTiA4MMKwMDgnMTYuMiJF!5e0!3m2!1sen!2sin!4v1784740150801!5m2!1sen!2sin",
  "linkedin": "https://www.linkedin.com/company/aquaholics-pvt-ltd/",
  "instagram": "https://www.instagram.com/aquaholicshq?igsh=MXVzZGt2b3ZiZDd2Zg==",
  "twitter": "https://x.com/AquaholicsHQ?s=20",
  "youtube": "https://youtube.com/@aquaholics_24?si=81Ia7jNvXnRPcCsm",
  "active": true
};
