FullStack Intern Coding Challenge – Roxiler Systems
Candidate: Arya Manohar Hulwan

RateMyStore
A full-stack web application designed to manage stores, users, and store ratings. The system supports multiple roles including Admin, Store Owner, and User, each with dedicated dashboards and role-specific functionalities.

Features by Role
Admin
Login securely as an administrator.
Access an admin dashboard displaying:
Total number of Users
Total number of Stores
Total number of Ratings
Create and manage:
New Users
New Admin accounts
New Stores
View complete list of users and stores:
Users: Name, Email, Address, Role
Stores: Name, Email, Address, Average Rating
Sort data by clicking on column headers (ascending or descending).
Search and filter users or stores using name, email, address, or role.
Logout securely.

Store Owner
Login using store owner credentials.
View store performance including:
Average store rating
Total number of ratings received
Update store account password.
Logout securely.

User
Register and login as a regular user.
Browse all available stores with:
Store Name
Email
Address
Rating information
Submit ratings between 1 and 5 stars and provide feedback.
Update account password.
Logout securely.

Tech Stack
Backend:
Node.js
Express.js
MySQL Database
JWT Authentication
Role-based Access Control

Frontend:
React.js
Vite + TailwindCSS
React Router
Context API for authentication state
Axios for API communication
Setup Instructions

Clone this repository:
git clone https://github.com/your-username/RateMyStore.git
cd RateMyStore

After cloning the repository:
# Navigate to Backend
cd backend

# Install dependencies and start backend server
npm install
node server.js

# Navigate to Frontend
cd ../frontend

# Install dependencies and start frontend server
npm install
npm run dev
