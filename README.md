# Access Key Manager

Access Key Manager is a web application designed to help users manage their access keys securely. It provides features such as user registration, login, key search, and password reset functionality.

## Features

- User Registration: Allows new users to create an account by providing their email and password.
- Login: Existing users can log in to their account using their email and password.
- Key Search: Users can search for access keys using various search criteria.
- Password Reset: Users can reset their password if they forget it by providing their email address.

## Technologies Used

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/username/access-key-manager.git
cd access-key-manager/frontend
npm install
cd ../backend
npm install
PORT=3000
MONGODB_URI=mongodb://localhost:27017/access-key-manager
JWT_SECRET=your_jwt_secret_key
cd backend
npm start
