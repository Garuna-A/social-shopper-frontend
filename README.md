# 🛒 SocialShopper – AI Powered Collaborative Shopping Room Web App 
> Bringing people closer, one cart at a time.

SocialShopper is a full-stack collaborative shopping web application that enables multiple users to create shared shopping rooms, discover products in real time, discuss purchases, vote on suggestions, and build shopping lists together.

The platform integrates the **eBay Browse API** for live product discovery and **Groq Llama 3.3** to power an AI Shopping Planner that converts natural language requests into structured, multi-category shopping recommendations. The application features JWT-based authentication, role-based moderation, collaborative decision-making, and a scalable RESTful backend built with Express, Prisma ORM, and PostgreSQL.


### Live Demo: [Social Shopper Live ](https://social-shopper.vercel.app/)
> The first request may take a few seconds as the backend is hosted on Render's free tier.
---
## 📁 Repository Structure

This project is split into **two repositories**:

- [`social-shopper-frontend`](https://github.com/Garuna-A/social-shopper-frontend)
- [`social-shopper-backend`](https://github.com/Garuna-A/social-shopper-backend)

---
## ⭐ Features

### Authentication
 - Secure user registration and login with JWT-based authentication.
 - Role-based access: Room creators can moderate items, others can suggest.
### Room-Based Shopping Collaboration
 - Create and join collaborative shopping "rooms" using unique room codes.
 - Members can view all room items and participants.
### Smart Product Search
 - Integrated with eBay API for live product search.
 - Search results include name, price, image, and direct eBay links.
### AI Shopping Planner
 - Instead of relying on keyword-based search, users can describe their shopping needs using natural language.
 - Example :
   
   > "Winter essentials for a trip to Norway"
    - The AI understands user intent
    - Breaks the request into multiple shopping categories
    - Performs optimized eBay searches for each category
    - Returns structured shopping recommendations
### Item Management
 - Users can propose items to be added to the shared cart.
 - Only room creators can approve/reject items to maintain cart quality.
 - Items display price, added-by info, and approval status.
### Checkout Overview
 - View a dedicated section of only approved items for quick review before checkout.
 - Pricing and moderation-ready display for room creators.

--- 

## 🔧 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **AI & external APIs**: Groq Llama 3.3 70B, eBay Buy Browse API
- **Deployment**: Vercel (frontend), Render (backend), NeonDB (PostgreSQL)

---
## 📸 Screenshots

![Screenshot_12-7-2025_14247_social-shopper vercel app](https://github.com/user-attachments/assets/4223bd9e-acc9-437f-a923-439562719aab)

<img width="1731" height="5305" alt="image" src="https://github.com/user-attachments/assets/e7ed9d24-6e6f-4815-a596-57dfaa55a449" />

---

# 🎨 social-shopper-frontend

### Getting Started

1. Clone the repo

```bash
git clone https://github.com/Garuna-A/social-shopper-frontend.git
cd social-shopper-frontend
```

2. Install dependencies

```bash
npm install
```

3. **Configure API Base URL**
   
   *Open src/api/axiosInstance.js and change the baseURL to your local backend address if you're testing locally:*
  
    ```bash
    const instance = axios.create({
      baseURL: "http://localhost:5000/api",
    });
    ```

4. Run the app

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

# 📦 social-shopper-backend

Please refer to [social-shopper-backend](https://github.com/Garuna-A/social-shopper-backend) for backend Installation

---
## Built with 💙 for a Social World
_SocialShopper - Bringing people closer, one cart at a time._
