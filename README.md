
# 🛒 SocialShopper – Walmart Sparkathon Submission
> Bringing people closer, one cart at a time.

This is the official submission for the **Walmart Sparkathon**, consisting of a collaborative shopping application where users can create or join "rooms" to discuss, suggest, vote, and approve products to buy collectively.

### Live Demo: [Social Shopper Live ](https://social-shopper.vercel.app/)
#### _⏳ Heads up! It might take a few seconds to load the first time as the backend server wakes up._
---
## 🎯 Motive behind the project

In an era where digital convenience has often led to social isolation, we built SocialShopper to bring people back together through collaborative shopping. 

Our submission for Walmart Sparkathon, SocialShopper enables groups to create shared shopping rooms, suggest items, vote, and finalize purchases collectively. By blending practicality with a social layer, we aim to make shopping more interactive, democratic, and fun.


## 📁 Repository Structure

This submission is split into **two repositories**:

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
- **Product Search**: eBay Buy Browse API
- **Deployment**: Vercel (frontend), Render (backend), NeonDB (PostgreSQL)

---
## 📸 Screenshots

![Screenshot_12-7-2025_1436_social-shopper vercel app](https://github.com/user-attachments/assets/3bdbaaf7-145e-4af4-94e2-550fc8c4ba07)

![Screenshot_12-7-2025_14247_social-shopper vercel app](https://github.com/user-attachments/assets/4223bd9e-acc9-437f-a923-439562719aab)

---
## 📽️ Demo Video

https://github.com/user-attachments/assets/65aeb8a1-fccd-4c9c-b591-4d184b4cfe55

▶️ [Watch on Youtube](https://youtu.be/jop8YXJSnrk)

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


# Contributors

 - [Anurag Mishra](https://github.com/Garuna-A/)

 - [Sidharth Sharma](https://github.com/Sidd0770)

 - [Kartik Dixit](https://github.com/SMOKESCRE3N)

 - [Gitank Rana](https://github.com/GitankRana)

---
## Built with 💙 for a Social World
_SocialShopper - Bringing people closer, one cart at a time._
