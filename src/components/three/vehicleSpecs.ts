/* Author: Nithish Kaliannan Ananth */
// src/components/three/vehicleSpecs.ts
// Subsystems of each procedural model: telemetry-pin copy, 3D anchors and
// exploded-view offsets. Pure data (no three import) so HTML controls can
// use it without pulling WebGL into the main bundle.
//
// Every value comes from the CMS (Walrus) or src/data/robotxData.ts
// (DRAKEN Mark 1, REVELATION). Do not add figures that aren't there.

export type VehicleKind = "walrus" | "draken" | "revelation";

export type Subsystem = {
  id: string;
  code: string;
  label: string;
  value: string;
  anchor: [number, number, number];
  explode: [number, number, number];
};

export const SUBSYSTEMS: Record<VehicleKind, Subsystem[]> = {
  walrus: [
    { id: "vision", code: "SYS-01", label: "LiDAR + vision", value: "YOLOv5n · LiDAR · IMU · GPS", anchor: [0, 1.8, 0.05], explode: [0, 0.75, 0] },
    { id: "collection", code: "SYS-02", label: "Screw conveyor", value: "30 RPM · 12–25 L/h into a net", anchor: [0, 0.15, -1.55], explode: [0, 0.05, -0.9] },
    { id: "ballast", code: "SYS-03", label: "Twin ballast tanks", value: "Sets draft · floats up to 20 cm deep", anchor: [0.86, 0.05, 0.2], explode: [0.55, 0, 0] },
    { id: "propulsion", code: "SYS-04", label: "Stern thrusters", value: "Pushes up to 4 kg of debris", anchor: [0.86, -0.28, 1.6], explode: [0, -0.35, 0.6] },
    { id: "avionics", code: "SYS-05", label: "Control stack", value: "ROS autonomy · LoRa manual override", anchor: [0, 0.62, -0.2], explode: [0, 1.15, -0.25] },
    { id: "power", code: "SYS-06", label: "Power core", value: "Onboard battery pack", anchor: [0, 0.6, 0.32], explode: [0, 0.85, 0.45] },
    { id: "sensing", code: "SYS-07", label: "Water-quality probe", value: "pH · DO · turbidity · temperature", anchor: [-0.62, -0.35, 0.45], explode: [-0.45, -0.25, 0] },
  ],
  draken: [
    { id: "vision", code: "USV-01", label: "Camera perception", value: "YOLOv5n + OpenCV", anchor: [0, 1.05, -0.72], explode: [0, 0.45, -0.35] },
    { id: "avionics", code: "USV-02", label: "Compute", value: "Raspberry Pi 5 + Pixhawk", anchor: [0, 0.62, -0.2], explode: [0, 1.15, -0.25] },
    { id: "power", code: "USV-03", label: "Power", value: "6S 7500 mAh lithium-ion", anchor: [0, 0.6, 0.32], explode: [0, 0.85, 0.45] },
    { id: "propulsion", code: "USV-04", label: "Propulsion", value: "12–24 V underwater thrusters", anchor: [0.86, -0.28, 1.6], explode: [0, -0.35, 0.6] },
    { id: "ballast", code: "USV-05", label: "Ballast", value: "Custom ballast tank", anchor: [0.86, 0.05, 0.2], explode: [0.55, 0, 0] },
    { id: "comms", code: "USV-06", label: "Telemetry", value: "SiK RF · MAVLink", anchor: [0.42, 1.55, 0.55], explode: [0.3, 0.6, 0.2] },
    { id: "nav", code: "USV-07", label: "Navigation", value: "GPS + 9-axis IMU", anchor: [0, 1.62, 0.05], explode: [0, 0.6, 0] },
  ],
  revelation: [
    { id: "propulsion", code: "UAV-01", label: "S500 airframe", value: "Quad · 4 motors", anchor: [0.95, 0.12, 0.95], explode: [0.45, 0.2, 0.45] },
    { id: "avionics", code: "UAV-02", label: "Flight stack", value: "Pixhawk 2.4.8 + Raspberry Pi 5", anchor: [0, 0.2, 0], explode: [0, 0.55, 0] },
    { id: "vision", code: "UAV-03", label: "Camera", value: "Arducam IMX296", anchor: [0, -0.32, -0.28], explode: [0, -0.45, -0.25] },
    { id: "nav", code: "UAV-04", label: "GPS", value: "RadioLink SE100", anchor: [0, 0.62, 0.15], explode: [0, 0.6, 0] },
    { id: "power", code: "UAV-05", label: "Battery", value: "LiPo 11.1 V 2200 mAh", anchor: [0, -0.12, 0.18], explode: [0, -0.5, 0.3] },
  ],
};

export const VEHICLE_META: Record<VehicleKind, { name: string; serial: string; kind: string }> = {
  walrus: { name: "Walrus", serial: "AQH-WLR-01", kind: "Autonomous surface cleaner" },
  draken: { name: "DRAKEN Mark 1", serial: "AQH-USV-01", kind: "Uncrewed surface vessel" },
  revelation: { name: "REVELATION", serial: "AQH-UAV-01", kind: "Uncrewed aerial vehicle" },
};

export type SchematicLayer = "hull" | "avionics" | "flow";
