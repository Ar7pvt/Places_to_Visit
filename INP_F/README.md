# BHRAMAN Architecture Diagrams

This folder contains all workflow and architecture diagrams for the BHRAMAN travel discovery webapp.

## 📊 Diagram Files

1. **01-system-architecture.md** - High-level system architecture showing client, server, storage, and external services
2. **02-user-flow-sequence.md** - Complete user interaction flow from app launch to location details
3. **03-data-models-classes.md** - Pydantic models, relationships, and data structure
4. **04-react-component-hierarchy.md** - React component tree with state management
5. **05-technology-stack-deployment.md** - Complete technology stack and deployment architecture

## 🎨 Viewing the Diagrams

These diagrams use [Mermaid](https://mermaid.js.org/) syntax and can be viewed in:

- **GitHub** - Automatically renders Mermaid diagrams in `.md` files
- **VS Code** - Install "Markdown Preview Mermaid Support" extension
- **Mermaid Live Editor** - Copy the code to https://mermaid.live/
- **Any Markdown viewer** with Mermaid support

## 🏗️ System Overview

**Frontend**: React 18.2.0 running on localhost:3000  
**Backend**: FastAPI 0.109.0 running on localhost:8000  
**Data Source**: CSV file with 500 locations  
**Coverage**: 18 countries, 30 cities, 16 categories  
**Features**: Cascading filters, custom map pins, glassmorphism UI, dual-layer caching  
**Performance**: Set-based indexing, 98.3% faster cached queries  

## 📅 Generated & Updated

**Initial Version**: February 20, 2026  
**Latest Update**: February 24, 2026  
**Version**: 2.0 - Performance Optimized
