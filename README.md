# Access Key Manager

Access Key Manager is a web application designed Micro-Focus Inc to help schools to generate access key to activate their school account It provides features such as user registration, login, key search,email verification and password reset functionality.

## Features

- User Registration: Allows new users to create an account by providing their email and password.
- Email verification:User gets a link to verify the account
- Login: Existing users can log in to their account using their email and password.
- Admin can login, manage keys created on the platform
- Key Search: Admin can search for access keys using various search criteria.
- Admin can revoke keys created
- Password Reset: Users can reset their password if they forget it by providing their email address.

## Technologies Used

- **Frontend**: React.js, React Router, Axios, Vite, Redux toolkit
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

##Frontend Demo
![Screenshot from 2024-04-30 10-33-01](https://github.com/mwayandau1/accessKeyManager/assets/105015464/dbd93740-000a-447e-ae8f-a3da96d4019d)

![Screenshot from 2024-04-30 10-32-22](https://github.com/mwayandau1/accessKeyManager/assets/105015464/3e3372a7-f5a7-49bd-9c4c-aeb2e28890df)

<hr>
##API Documentation
https://documenter.getpostman.com/view/28559837/2sA3JDh5Xv
<hr>
##Link to the deployed app
https://accesskeymanager.onrender.com
<hr>


## Installation

1. Clone the repository:

```bash
git clone https://github.com/username/access-key-manager.git](https://github.com/mwayandau1/accessKeyManager.git
cd accessKeyManager/frontend
npm install
cd ..
cd backend
npm install
npm start





