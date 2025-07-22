# SatTrack Pro - Enhanced Satellite Tracking System

## Overview

SatTrack Pro is a modern full-stack web application designed to provide high-precision satellite tracking capabilities, aiming for sub-300 meter accuracy. The system enhances traditional TLE (Two-Line Element) data with advanced physics modeling, real-time space weather integration, and machine learning techniques to achieve unprecedented tracking precision.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom space-themed design system
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **Real-time Updates**: Periodic data fetching with configurable intervals

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Serverless-optimized with connection pooling

## Key Components

### Enhanced Orbital Propagation
- **High-Fidelity Physics**: Numerical orbit propagator replacing SGP4
- **Advanced Force Modeling**: Earth gravity models, atmospheric drag, solar radiation pressure
- **Real-time Environmental Data**: NRLMSISE-00 atmospheric density models

### Space Weather Integration
- **NOAA Space Weather Service**: Real-time solar flux, Kp index, and geomagnetic data
- **Atmospheric Modeling**: Dynamic density calculations based on space weather conditions
- **Accuracy Enhancement**: Environmental corrections for improved position predictions

### Data Fusion and Filtering
- **Kalman Filtering**: Advanced state estimation for optimal satellite tracking
- **Multi-source TLE Integration**: Combining data from Space-Track, CelesTrak, and SatNOGS
- **Outlier Detection**: Intelligent filtering of inconsistent TLE data

### Validation System
- **Accuracy Monitoring**: Continuous validation against precise ephemerides
- **Performance Metrics**: Real-time accuracy statistics and error analysis
- **Quality Assurance**: Automated validation of tracking predictions

## Data Flow

1. **Data Ingestion**: Automated fetching of TLE data from multiple sources every 30 minutes
2. **Space Weather Updates**: Real-time collection of environmental data from NOAA services
3. **Enhanced Propagation**: Physics-based orbit calculations with environmental corrections
4. **State Estimation**: Kalman filtering for optimal position and velocity estimates
5. **Position Storage**: Timestamped satellite positions stored in PostgreSQL
6. **Real-time Updates**: Frontend receives live tracking data via periodic API calls
7. **Validation Pipeline**: Continuous accuracy monitoring and performance analysis

## External Dependencies

### Data Sources
- **Space-Track.org**: Official TLE data from NORAD
- **NOAA Space Weather Prediction Center**: Real-time space weather data
- **CelesTrak**: Supplementary TLE data and solar flux information
- **SatNOGS**: Community-contributed satellite tracking data

### Third-party Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit Platform**: Development and deployment environment

### Key Libraries
- **Orbital Mechanics**: Custom enhanced propagator implementation
- **UI Components**: Radix UI primitives with Shadcn/ui styling
- **Data Validation**: Zod for runtime type checking
- **Date Handling**: date-fns for temporal calculations

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite development server with HMR
- **Type Checking**: Continuous TypeScript validation
- **Database Migrations**: Development schema synchronization

### Production Build
- **Frontend**: Static asset generation with Vite
- **Backend**: ESBuild bundling for Node.js deployment
- **Database**: Production migrations via Drizzle Kit
- **Environment**: Containerized deployment on Replit

### Configuration Management
- **Environment Variables**: Secure credential management
- **API Keys**: Space-Track and NOAA service authentication
- **Database Connection**: Serverless-optimized connection strings
- **Feature Flags**: Configurable system parameters

### Monitoring and Maintenance
- **Health Checks**: Automated system status monitoring
- **Data Quality**: Continuous validation of tracking accuracy
- **Performance Metrics**: Real-time system performance tracking
- **Update Scheduling**: Automated TLE and space weather data refresh