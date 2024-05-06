# Access Key Manager

Access Key Manager is a web application designed  for Micro-Focus Inc to help schools to generate access key to activate their school account It provides features such as user registration, login, key search,email verification and password reset functionality.

## Features

- **User Registration**: Allows new users to create an account by providing their email and password.
- **Email verification**:User gets a link to verify the account
- **Login**: Existing users can log in to their account using their email and password.
- **Password Reset**: Users can reset their password if they forget it by providing their email address
- **Logout**:Users can logout 
- **Robust security**:The application is implemented using json web token for robust security

## School Specific Features
- **Create key**: School admin can create an access key to manage their school platform
- **View their keys**:" School admin can view all keys generated by themselves only



## Admin Specific Features
- **View all keys** :Admin can view all keys generated on the platform
- **Search key**: Admin can search an active access key by providing an email
- **Revoke key**:Admin have the ability to revoke a key
- **View all schools**:Admin can see all schools who have account on the platorm
- **Filter keys**:Admin can filter the keys based on statues (active, revoked and expired

## Integration testing
- **Auth routes**:Implement testing to handle all possible cases authentication
- **Key routes**: Tested all key routes, creat key, get key search key ...
- **Testing tools**:Jest and Supertest

## Technologies Used

- **Frontend**: React.js, React Router, Axios, Vite, Redux toolkit
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Environment Setup(.env)
### Backend folder(.env)
- PORT=5000
- MONGO_URI ="Your_mongoDb Url"

- JWT_SECRET="Your jwt secret key"
- JWT_LIFE_TIME = "Jwt life time"

- APP_PASSWORD="Your google app password"
- EMAIL="Your real email account"
### Frontend folder(.env)
- VITE_API_URL ="http://localhost:5000"
- ##VITE_API_URL ="https://accesskeymanagerbackend.onrender.com"


# Frontend Demo
## Admin Page

- ![Screenshot from 2024-05-06 08-49-18](https://github.com/mwayandau1/accessKeyManager/assets/105015464/95bd3b8e-efd8-4fb3-b22d-4fc9023ab8a0)

- ![Screenshot from 2024-05-06 08-49-37](https://github.com/mwayandau1/accessKeyManager/assets/105015464/ca343ab7-349e-4c53-9962-072a2376ee9e)

- ![Screenshot from 2024-05-06 08-49-46](https://github.com/mwayandau1/accessKeyManager/assets/105015464/e084cafb-c6e7-4677-a5c5-b8f339a47a88)
- ## Customer (School Admin) Page

- ![Screenshot from 2024-05-06 08-50-20](https://github.com/mwayandau1/accessKeyManager/assets/105015464/0f85abc0-5383-4a20-bce5-cb3e12a35daa)

## API Documentation
- https://documenter.getpostman.com/view/28559837/2sA3JDh5Xv
## Link to the deployed app
- https://accesskeymanager.onrender.com
- Deployed version be very slow due to render free tier


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





