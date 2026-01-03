# 🤫 CampusZen: JNU Quiet Finder
> **A Real-Time Crowdsourced Map for Finding Study Spots on Campus.**

![Project Status](https://img.shields.io/badge/Status-Prototype-green)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Firebase_|_Leaflet-blue)

## 📖 The Problem
During exam weeks at **Jawaharlal Nehru University (JNU)**, the Central Library and Reading Halls are packed to capacity. Students waste 20-30 minutes wandering from the Ad Block to the hostels just looking for an empty chair or a quiet corner to study.

## 💡 The Solution
**CampusZen** is a real-time, location-based web app that allows students to:
1.  **Check Status:** View a live map of the campus showing "Quiet" (Green) vs "Crowded" (Red) zones.
2.  **Report Spots:** Instantly drop a pin to alert others about available seats or noisy areas.
3.  **Stay Updated:** Data is live-synced. If a spot gets crowded, the status updates instantly for everyone.

---

## ✨ Key Features
*   **📍 JNU-Locked Map:** Custom map bounds restricted specifically to the JNU campus (Munirka to Vasant Kunj borders).
*   **⚡ Real-Time Sync:** Powered by **Firebase Firestore**. When one student adds a pin, it appears on everyone's screen in milliseconds (No refresh needed).
*   **⏳ Auto-Expiry Logic:** To prevent outdated information, pins automatically vanish after **1 Hour**.
    *   *(Note: For Demo purposes, this is currently set to 10 seconds)*.
*   **🎨 Visual Cues:** 
    *   🟢 **Green Pin:** Empty / Quiet Area.
    *   🔴 **Red Pin:** Crowded / Noisy Area.
    *   ⏳ **Countdown Timer:** Popups show exactly when a pin will expire.

---

## 🛠️ Tech Stack
| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite) |
| **Mapping Engine** | React Leaflet + OpenStreetMap |
| **Backend / DB** | Firebase Firestore (NoSQL) |
| **Styling** | Tailwind CSS + Glassmorphism UI |
| **Icons** | Leaflet Color Markers |

---

