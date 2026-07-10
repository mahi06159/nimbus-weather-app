# Nimbus — Django Weather App

A clean, glassmorphism-styled weather app built with Django + OpenWeatherMap API.

## Features
- Real-time weather for any city worldwide
- 5-day forecast with daily high/low temperatures
- Celsius / Fahrenheit toggle
- Sunrise & sunset display
- Wind, humidity, pressure, visibility stats
- Dynamic sky backgrounds that change per weather condition
- Fully responsive (mobile-first)

## Setup

### 1. Install dependencies
```bash
pip install django requests python-dotenv
```

### 2. Get a free API key
Sign up at https://openweathermap.org/api and get a free API key.
(Free tier supports 60 calls/minute — more than enough.)

### 3. Set your API key

**Option A — Environment variable (recommended):**
```bash
export OPENWEATHER_API_KEY=your_key_here
python manage.py runserver
```

**Option B — Edit settings.py directly:**
Open `config/settings.py` and replace `YOUR_API_KEY_HERE`:
```python
OPENWEATHER_API_KEY = 'your_actual_api_key'
```

### 4. Run the server
```bash
python manage.py runserver
```

Open http://127.0.0.1:8000 in your browser.

## Project Structure
```
weather_app/
├── config/
│   ├── settings.py       # Django config + API key
│   ├── urls.py           # Root URL routing
│   └── wsgi.py
├── weather/
│   ├── templates/weather/
│   │   └── index.html    # Main template
│   ├── static/weather/
│   │   ├── css/style.css # All styles
│   │   └── js/app.js     # Animations & interactions
│   ├── templatetags/
│   │   └── weather_extras.py  # Custom template filters
│   ├── views.py          # Weather fetch logic
│   └── urls.py           # App URL routing
└── manage.py
```

## Keyboard Shortcuts
- Press `/` anywhere to focus the search bar
- Press `Escape` to unfocus

## Design
- **Typefaces:** DM Sans (UI) + DM Mono (temperature/data)
- **Style:** Glassmorphism cards floating over atmospheric sky gradients
- **Colors:** Dynamically adapt to weather condition (sunny, cloudy, rainy, snowy, stormy)
