# Carpool Management System

## Overview

The **Carpool Management System** is a smart ride-sharing platform built for employees and daily commuters.  
Users can register as drivers or passengers, discover available carpools on an interactive map, request rides, accept or reject ride requests, and update travel routes dynamically when passengers are picked up.

The goal is to reduce traffic congestion, cut travel costs, utilize car seats efficiently, and promote eco-friendly commuting.

---

## Problem We Are Solving

Daily office commuters often face these issues:

- High fuel expenses
- Heavy traffic congestion
- Increased pollution
- Underutilized car seats
- No easy way to find people traveling on the same route
- Lack of a simple and safe platform for coordinated ride-sharing

This system bridges that gap by connecting commuters with similar routes and timings.

---

## Key Features

1. **Smart Ride Discovery**
2. **Daily Office Commute Automation**
3. **Ride Offering for Drivers**
4. **Passenger Ride Requests**
5. **Driver Controls (Accept / Reject Requests)**
6. **Smart Seat & Ride Management**
7. **Dynamic Route Updating (pickup/drop logic)**

---

## Tech Used

- **React**
- **Express**
- **Leaflet (Maps & Routing)**

---

## How to Run This Locally

### 1. Clone the repository

```bash
git clone https://github.com/Yashrajpatil22/Carpool_Management.git
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Fronend Dependencies

```bash
cd ..
cd Carpool_frontend
npm install
```

### 4. Set Up Environment Variables

Create a .env file in both Backend and Frontend folders  
and use .env.example as a reference for required keys.

### 5. Start the servers

open terminal 1 and start Backend

```bash
cd Backend
npm npm run dev
```

open terminal 2 and start Fronend

```bash
cd Carpool_fronend
npm npm run dev
```

### 6. Servers started running

Open Browser

```bash
http://localhost:5173/
```

# API Guide

---

## 1. Auth

**Base URL:** `/api/auth`

### Endpoints

| Method | Endpoint    | Description         |
| ------ | ----------- | ------------------- |
| POST   | `/login`    | User login          |
| POST   | `/register` | Register a new user |

---

## 2. Car

**Base URL:** `/api/car`

### Endpoints

| Method | Endpoint  | Description               |
| ------ | --------- | ------------------------- |
| POST   | `/add`    | Add a new car             |
| GET    | `/my`     | Get logged-in user’s cars |
| PUT    | `/:carId` | Update car details        |
| DELETE | `/:carId` | Delete a car              |

---

## 3. Ride Offerings

**Base URL:** `/api/rides`

### Endpoints

| Method | Endpoint               | Description                              |
| ------ | ---------------------- | ---------------------------------------- |
| POST   | `/createride`          | Driver creates a ride                    |
| GET    | `/getrides/my/:userId` | Get all rides created by the driver      |
| PUT    | `/updateride/:rideId`  | Update ride details                      |
| PATCH  | `/:rideId/status`      | Update ride status (completed/cancelled) |

---

## 4. Ride Requests

**Base URL:** `/api/riderequest`

### Endpoints

| Method | Endpoint             | Description                                   |
| ------ | -------------------- | --------------------------------------------- |
| POST   | `/createrequest`     | Passenger requests for a ride                 |
| GET    | `/viewrequest`       | Passenger views their requests                |
| GET    | `/ride/:rideId`      | Driver views all requests for a specific ride |
| POST   | `/:requestId/accept` | Driver accepts a request                      |
| POST   | `/:requestId/reject` | Driver rejects a request                      |
| DELETE | `/:requestId`        | Passenger cancels their request               |

---

## 5. Ride Assignment

**Base URL:** `/api/rideassignment`

### Endpoints

| Method | Endpoint                | Description                              |
| ------ | ----------------------- | ---------------------------------------- |
| GET    | `/ride/:rideId`         | Driver views assigned passengers         |
| PATCH  | `/:assignmentId/status` | Update passenger status (picked/dropped) |
| PATCH  | `/:assignmentId/route`  | Update passenger route                   |

---

## 6. Ride Discovery

**Base URL:** `/api/ridediscovery`

### Endpoints

| Method | Endpoint   | Description                              |
| ------ | ---------- | ---------------------------------------- |
| POST   | `/search`  | Search rides by start/destination & time |
| GET    | `/active`  | Get active rides in the area             |
| GET    | `/:rideId` | Get detailed information about a ride    |

---

## 7. Route Points

**Base URL:** `/api/routepoints`

### Endpoints

| Method | Endpoint   | Description                                        |
| ------ | ---------- | -------------------------------------------------- |
| POST   | `/:rideId` | Save or replace ordered route waypoints for a ride |
| GET    | `/:rideId` | Retrieve route points for a ride                   |

---
