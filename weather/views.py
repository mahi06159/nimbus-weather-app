import requests
from django.shortcuts import render
from django.conf import settings
from datetime import datetime


def get_weather_icon_class(condition):
    """Map OpenWeatherMap condition codes to icon classes."""
    condition = condition.lower()
    if 'clear' in condition:
        return 'clear'
    elif 'cloud' in condition:
        return 'cloudy'
    elif 'rain' in condition or 'drizzle' in condition:
        return 'rainy'
    elif 'snow' in condition:
        return 'snowy'
    elif 'thunder' in condition or 'storm' in condition:
        return 'stormy'
    elif 'mist' in condition or 'fog' in condition or 'haze' in condition:
        return 'foggy'
    elif 'wind' in condition:
        return 'windy'
    return 'default'


def get_bg_gradient(condition):
    """Return background gradient class based on weather."""
    condition = condition.lower()
    if 'clear' in condition:
        return 'bg-clear'
    elif 'cloud' in condition:
        return 'bg-cloudy'
    elif 'rain' in condition or 'drizzle' in condition:
        return 'bg-rainy'
    elif 'snow' in condition:
        return 'bg-snowy'
    elif 'thunder' in condition or 'storm' in condition:
        return 'bg-stormy'
    return 'bg-default'


def parse_forecast(forecast_data):
    """Group 3-hourly forecast into daily summaries."""
    days = {}
    for item in forecast_data.get('list', []):
        dt = datetime.fromtimestamp(item['dt'])
        date_str = dt.strftime('%A, %b %d')
        date_key = dt.strftime('%Y-%m-%d')
        if date_key not in days:
            days[date_key] = {
                'date': date_str,
                'day_short': dt.strftime('%a'),
                'temps': [],
                'conditions': [],
                'icons': [],
                'humidity': [],
            }
        days[date_key]['temps'].append(item['main']['temp'])
        days[date_key]['conditions'].append(item['weather'][0]['description'])
        days[date_key]['icons'].append(item['weather'][0]['icon'])
        days[date_key]['humidity'].append(item['main']['humidity'])

    result = []
    for key, day in list(days.items())[:5]:
        temps = day['temps']
        result.append({
            'date': day['date'],
            'day_short': day['day_short'],
            'temp_max': round(max(temps)),
            'temp_min': round(min(temps)),
            'condition': day['conditions'][len(day['conditions']) // 2].title(),
            'icon': day['icons'][len(day['icons']) // 2],
            'humidity': round(sum(day['humidity']) / len(day['humidity'])),
            'icon_class': get_weather_icon_class(day['conditions'][0]),
        })
    return result


def index(request):
    context = {'page': 'home'}

    city = request.GET.get('city', '').strip()
    unit = request.GET.get('unit', 'metric')
    unit_symbol = '°C' if unit == 'metric' else '°F'

    if city:
        api_key = settings.OPENWEATHER_API_KEY
        base_url = 'https://api.openweathermap.org/data/2.5'

        try:
            # Current weather
            weather_url = f'{base_url}/weather?q={city}&appid={api_key}&units={unit}'
            weather_resp = requests.get(weather_url, timeout=5)

            if weather_resp.status_code == 404:
                context['error'] = f'City "{city}" not found. Please check the spelling and try again.'
            elif weather_resp.status_code == 401:
                context['error'] = 'Invalid API key. Please set a valid OpenWeatherMap API key.'
            elif weather_resp.status_code != 200:
                context['error'] = 'Unable to fetch weather data. Please try again later.'
            else:
                weather = weather_resp.json()
                condition = weather['weather'][0]['description']

                current = {
                    'city': weather['name'],
                    'country': weather['sys']['country'],
                    'temp': round(weather['main']['temp']),
                    'feels_like': round(weather['main']['feels_like']),
                    'temp_min': round(weather['main']['temp_min']),
                    'temp_max': round(weather['main']['temp_max']),
                    'humidity': weather['main']['humidity'],
                    'pressure': weather['main']['pressure'],
                    'wind_speed': round(weather['wind']['speed']),
                    'wind_deg': weather['wind'].get('deg', 0),
                    'visibility': round(weather.get('visibility', 0) / 1000, 1),
                    'condition': condition.title(),
                    'icon': weather['weather'][0]['icon'],
                    'icon_url': f"https://openweathermap.org/img/wn/{weather['weather'][0]['icon']}@2x.png",
                    'icon_class': get_weather_icon_class(condition),
                    'bg_class': get_bg_gradient(condition),
                    'sunrise': datetime.fromtimestamp(weather['sys']['sunrise']).strftime('%I:%M %p'),
                    'sunset': datetime.fromtimestamp(weather['sys']['sunset']).strftime('%I:%M %p'),
                    'unit_symbol': unit_symbol,
                    'unit': unit,
                    'local_time': datetime.now().strftime('%A, %B %d · %I:%M %p'),
                }

                # 5-day forecast
                forecast_url = f'{base_url}/forecast?q={city}&appid={api_key}&units={unit}'
                forecast_resp = requests.get(forecast_url, timeout=5)
                forecast = []
                if forecast_resp.status_code == 200:
                    forecast = parse_forecast(forecast_resp.json())

                context.update({
                    'current': current,
                    'forecast': forecast,
                    'city_query': city,
                    'unit': unit,
                    'unit_symbol': unit_symbol,
                })

        except requests.exceptions.ConnectionError:
            context['error'] = 'Network error. Please check your internet connection.'
        except requests.exceptions.Timeout:
            context['error'] = 'Request timed out. Please try again.'
        except Exception as e:
            context['error'] = f'An unexpected error occurred: {str(e)}'

    return render(request, 'weather/index.html', context)
