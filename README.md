# Event App 📅

## Overview
This is a event management application built using **React Native (Expo) for the frontend** and **Django with Django REST Framework (DRF) for the backend**. The application allows users to view, create, and manage events.

## Setup Instructions

### 1. Clone the repository
```sh
git clone https://github.com/Himanshigupta1624/event-app.git
```
### Backend Setup (Django)
1. Navigate to the backend folder
```
 cd event-django
```
2. Create and activate a virtual environment

```
python -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate  # On Windows
```

3. Install dependencies
```
pip install -r requirements.txt
```
4. Run migrations and start the server
```
python manage.py migrate
python manage.py runserver
```

The Django API will now be running at: http://127.0.0.1:8000/api/events/

### Frontend Setup (Expo - React Native)
1. Navigate to the frontend folder
```
cd event-app
```
2. Install dependencies
```
npm install
```
3. Start the Expo development server
```
npx expo start
```
Run on http://localhost:8081/ and add details to see the events at Home page.

## 📸 Screenshots

###  Home Page
![Home](screenshots\Home.png)

###  Drawer
![Drawer](screenshots\Drawer.png)

###  Events Details
![Events details](screenshots\events-details.png)

###  Add Events Page
![Add events](screenshots\Add-events.png)


<div align="center">
    <h3>========Thank You=========</h3>
</div>


