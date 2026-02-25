# 🦟 Aedes POS System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

> **A Next-Generation Dynamic Pricing & Inventory Management System** powered by Oracle Database and AI.

The **Aedes POS System** is a cutting-edge Point of Sale solution that goes beyond simple transaction processing. It features the **Aedes Engine**, a proprietary dynamic pricing algorithm that adjusts product prices in real-time based on **Expiry Risk**, **Stock Scarcity**, and **Market Trends**.

---

## 🚀 Key Features

### 🧠 Aedes Engine (Dynamic Pricing)

- **Expiry-Based Decay**: Automatically reduces prices for products nearing their expiry date to minimize waste.
- **Scarcity Surges**: Intelligently increases prices for high-demand, low-stock items.
- **Trend Analysis**: AI-driven trend scores adjust prices based on simulated market popularity.
- **Real-Time Adjustments**: Pricing logic is executed directly within the Oracle Database via robust PL/SQL procedures.

### 🛒 Point of Sale (POS)

- **Fast Checkout**: Streamlined interface for rapid transaction processing.
- **Stock Protection**: Real-time inventory checks prevent overselling.
- **Smart Cart**: Automatic total calculation with dynamic pricing applied.

### 📦 Inventory Management

- **Live Tracking**: Monitor stock levels, expiry dates, and pricing changes.
- **CRUD Operations**: Seamlessly add, update, and remove products.
- **Visual Indicators**: Color-coded alerts for low stock and expiring items.

### 📊 System Intelligence

- **AI Training**: Self-learning module to update product trend scores based on sales velocity.
- **Event Logging**: Comprehensive audit logs for every trigger, procedure execution, and system event.

---

## 🛠️ Tech Stack

| Component     | Technology                 | Description                                                   |
| ------------- | -------------------------- | ------------------------------------------------------------- |
| **Frontend**  | React 19, TypeScript, Vite | Modern, responsive UI with `framer-motion` animations.        |
| **Styling**   | Tailwind CSS               | Sleek, dark-themed aesthetic with glassmorphism effects.      |
| **Backend**   | Node.js, Express           | RESTful API handling business logic and DB communication.     |
| **Database**  | Oracle Database 21c XE     | Core engine using PL/SQL Stored Procedures & Triggers.        |
| **Container** | Docker                     | Containerized database and backend for consistent deployment. |

---

## 🏁 Getting Started

### Prerequisites

- **Docker Desktop** (for running the Oracle Database & Backend)
- **Node.js 18+** (for local frontend development)

### Installation

1.  **Start the Infrastructure**

    ```bash
    cd database
    docker-compose up -d
    ```

    _This starts the Oracle Database and the Node.js Backend server._

2.  **Initialize the Database**
    The system automatically initializes with the `init.sql` script. To seed demo data:

    ```bash
    docker exec aedes-server node seed.js
    ```

3.  **Start the Frontend**

    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Access the Application**
    Open your browser and navigate to:
    `http://localhost:5173`

---

## 🏗️ Architecture

1.  **Frontend**: Sends API requests to the Node.js server.
2.  **Backend**: Validates requests and calls Oracle Stored Procedures.
3.  **Database**:
    - `PRC_AEDES_PRICING`: The heart of the system. Calculates new prices based on logic.
    - `TRG_UPDATE_STOCK`: Automatically manages inventory levels after transactions.
    - `LOGS` Table: Captures all system activities for auditing.

---

## 📸 Screenshots

_(Add screenshots of the POS Dashboard, Inventory Grid, and Aedes Engine here)_

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by the **Aedes Team**

---

Note on Node versions:

- The project builds with Node LTS (18 or 20). Avoid using Node 25 in CI or local development — several dependencies (including Vite and some plugins) may not be compatible. If you updated Node to v25 and saw build failures, switch back to Node 18 or 20.