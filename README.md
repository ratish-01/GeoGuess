# GeoGuess
GeoGuess is a thrilling India-level-exploration game where you hunt a real street using only an image and your brain! Use satellite maps, hot–cold feedback , distance rings, compass hints, and race against time ⏱️ to pin the exact spot. Every guess draws your path. The Earth is your puzzle 🧩

Features

    Real street images from around the world (Mapillary)
   
    Satellite map with place labels (Esri + Carto)
   
    Hot–Cold color feedback on guesses
   
    Distance calculation & distance rings (1km, 10km, 50km)
   
    Direction compass hints (unlocks after 3 attempts)
   
    Time-based scoring system
   
    Replay path visualization (see all your guesses)
   
    Best score saved in browser (localStorage)
   
    Fully free map stack (no Google Maps)

How to Run the Project (Step-by-Step)
 ✅ 1. Clone the Repository
 
      git clone https://github.com/ratish-01/GeoGuess.git
      cd GeoGuess

✅ 2. Setup Backend

    cd backend
    npm install

 Create a .env file inside backend:
 
 MAPILLARY_TOKEN=your_mapillary_access_token_here

✅ 3. Start game

 Then start the server:

    node server.js

 
 You should see:
 
 Server running on http://localhost:3000


✅ 4. Test Backend API (Optional)

  Open in browser:
    
    http://localhost:3000/api/random-street

  You should see JSON with an image URL and coordinates.

Disclaimer:
  
  This project uses free map and imagery services intended for educational and demo purposes only.

Author:
    
    Built as a learning project to explore:
    
    Maps
    
    Geospatial reasoning
    
    Web APIs
    
    Game logic
    
    UI/UX
