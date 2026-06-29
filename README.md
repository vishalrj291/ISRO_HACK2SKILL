# 🌕 Lunar Polar Subsurface Ice Detection & Safe Navigation System

A hackathon project built for **ISRO Hackathon 2026** to detect potential subsurface ice zones, analyze lunar terrain hazards, and generate safe rover navigation paths in lunar polar regions.

---

## 🚀 Overview

Lunar polar regions may contain water ice in permanently shadowed areas, but these regions are difficult to explore due to steep slopes, rough terrain, craters, and low illumination.

This project provides an interactive mission dashboard that helps analyze lunar terrain, identify possible ice-rich regions, detect hazards, and plan safer rover routes.

---

## 🎯 Problem Statement

**Subsurface Ice Detection and Navigation in Lunar Polar Regions**

The goal is to build a system that can:

- Detect potential subsurface ice-rich regions
- Analyze lunar terrain using DEM data
- Identify hazardous zones
- Suggest safe rover traversal paths
- Visualize all results through an interactive dashboard

---

## ✨ Features

- 🧊 **Ice Probability Mapping**  
  Generates probable subsurface ice zones using terrain and remote sensing inputs.

- 🏔️ **Terrain Analysis**  
  Processes DEM data to calculate elevation, slope, and surface roughness.

- ⚠️ **Hazard Detection**  
  Identifies unsafe regions such as steep slopes, rugged areas, and crater-like terrain.

- 🛣️ **Safe Route Planning**  
  Finds safer rover paths while avoiding hazardous zones.

- 📊 **Mission Dashboard**  
  Provides a clean interface to upload, analyze, and visualize lunar datasets.

---

## 🛠️ Tech Stack

### Language
- Python 3.11

### GIS & Raster Processing
- QGIS
- GDAL
- Rasterio

### Image Processing
- OpenCV
- Scikit-Image

### Data Science
- NumPy
- Pandas

### Machine Learning
- XGBoost
- Scikit-Learn

### Backend
- FastAPI

### Frontend / Dashboard
- React.js
- Leaflet
- Chart.js

---

## 🏗️ System Architecture

``` text
Lunar Dataset
      ↓
Preprocessing
      ↓
DEM Analysis
      ↓
Slope & Roughness Calculation
      ↓
Ice Probability Estimation
      ↓
Hazard Detection
      ↓
Safe Route Planning
      ↓
Mission Dashboard
```
## Project Structure
``` 
ISRO-Lunar-Mission/
│
├── backend/
│   ├── api/
│   ├── services/
│   ├── models/
│   ├── utils/
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
│
├── datasets/
│   ├── DEM/
│   ├── Hazard_Maps/
│   └── Ice_Data/
│
├── outputs/
│
├── notebooks/
│
├── requirements.txt
└── README.md
```

## Installation & Setup

git clone https://github.com/your-username/ISRO-Lunar-Mission.git
cd ISRO-Lunar-Mission
# 2. Backend setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Backend will run on:

http://localhost:8000
# 3. Frontend setup
cd frontend
npm install
npm run dev

Frontend will run on:

http://localhost:5173
## 🔄 Workflow
Upload lunar DEM / raster dataset
Preprocess the dataset
Generate slope and roughness maps
Estimate potential subsurface ice regions
Detect unsafe terrain zones
Plan a safe rover route
View results on the mission dashboard
## 📊 Output

The system can generate:

Elevation map
Slope map
Roughness map
Hazard map
Ice probability map
Safe rover navigation route
🎯 Use Cases
Lunar rover mission planning
Landing site safety analysis
Ice-rich region identification
Terrain hazard assessment
Scientific exploration support
## 👨‍💻 Team

Developed for ISRO Hackathon 2026.

Team Members
Vishal Raj
Divyanshi
Pranjal
## 📌 Status

MVP under development.

## 📜 License

This project is developed for educational and hackathon purposes.

## 🌌 Tagline

Exploring the Moon, one safe path at a time.
