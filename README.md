# Access Key Manager

Access Key Manager is a web application designed to help users manage their access keys securely. It provides features such as user registration, login, key search, and password reset functionality.

## Features

- User Registration: Allows new users to create an account by providing their email and password.
- Login: Existing users can log in to their account using their email and password.
- Key Search: Admin can search for access keys using various search criteria.
- Password Reset: Users can reset their password if they forget it by providing their email address.
- Admin can login, manage keys created on the platform
- Admin can revoke keys created

## Technologies Used

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Environment Setup(.env)
PORT=3000
MONGO_URI ="Your_mongoDb Url"

JWT_SECRET="Your jwt secret key"
JWT_LIFE_TIME = "Jwt life time"

APP_PASSWORD="Your google app password"
EMAIL="Your real email account"



##API Documentation
https://documenter.getpostman.com/view/28559837/2sA3JDh5Xv


## Installation

1. Clone the repository:

```bash
git clone https://github.com/username/access-key-manager.git](https://github.com/mwayandau1/accessKeyManager.git
cd accessKeyManager/frontend
npm install
cd ../backend
npm install
npm start





