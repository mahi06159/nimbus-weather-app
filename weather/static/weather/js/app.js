// Nimbus Weather — App JS

// Auto-submit search on Enter (already handled by form, this adds enhancements)
document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.search-input');
  const form = document.querySelector('.search-form');

  // --- Autocomplete City Suggestions ---
  if (input && form) {
    const cities = [
      { name: "Goa", country: "India" },
      { name: "Gurgaon", country: "India" },
      { name: "Gangtok", country: "India" },
      { name: "Gwalior", country: "India" },
      { name: "Gandhinagar", country: "India" },
      { name: "Ghaziabad", country: "India" },
      { name: "Geneva", country: "Switzerland" },
      { name: "Guangzhou", country: "China" },
      { name: "Glasgow", country: "United Kingdom" },
      { name: "Gold Coast", country: "Australia" },
      { name: "Georgetown", country: "Guyana" },
      { name: "Mumbai", country: "India" },
      { name: "Delhi", country: "India" },
      { name: "Bangalore", country: "India" },
      { name: "Kolkata", country: "India" },
      { name: "Chennai", country: "India" },
      { name: "Hyderabad", country: "India" },
      { name: "Pune", country: "India" },
      { name: "Ahmedabad", country: "India" },
      { name: "Jaipur", country: "India" },
      { name: "Surat", country: "India" },
      { name: "Lucknow", country: "India" },
      { name: "Patna", country: "India" },
      { name: "Bhopal", country: "India" },
      { name: "Indore", country: "India" },
      { name: "Agra", country: "India" },
      { name: "Varanasi", country: "India" },
      { name: "Amritsar", country: "India" },
      { name: "Shimla", country: "India" },
      { name: "Manali", country: "India" },
      { name: "Srinagar", country: "India" },
      { name: "Dehradun", country: "India" },
      { name: "Haridwar", country: "India" },
      { name: "Rishikesh", country: "India" },
      { name: "Nainital", country: "India" },
      { name: "Guwahati", country: "India" },
      { name: "Ranchi", country: "India" },
      { name: "Bhubaneswar", country: "India" },
      { name: "Jamshedpur", country: "India" },
      { name: "London", country: "United Kingdom" },
      { name: "New York", country: "United States" },
      { name: "Tokyo", country: "Japan" },
      { name: "Paris", country: "France" },
      { name: "Sydney", country: "Australia" },
      { name: "Berlin", country: "Germany" },
      { name: "Rome", country: "Italy" },
      { name: "Madrid", country: "Spain" },
      { name: "Moscow", country: "Russia" },
      { name: "Beijing", country: "China" },
      { name: "Seoul", country: "South Korea" },
      { name: "Singapore", country: "Singapore" },
      { name: "Bangkok", country: "Thailand" },
      { name: "Dubai", country: "United Arab Emirates" },
      { name: "Cairo", country: "Egypt" },
      { name: "Cape Town", country: "South Africa" },
      { name: "Toronto", country: "Canada" },
      { name: "Vancouver", country: "Canada" },
      { name: "Los Angeles", country: "United States" },
      { name: "Chicago", country: "United States" },
      { name: "San Francisco", country: "United States" },
      { name: "Seattle", country: "United States" },
      { name: "Miami", country: "United States" },
      { name: "Boston", country: "United States" },
      { name: "Washington D.C.", country: "United States" },
      { name: "Rio de Janeiro", country: "Brazil" },
      { name: "Buenos Aires", country: "Argentina" },
      { name: "Istanbul", country: "Turkey" },
      { name: "Athens", country: "Greece" },
      { name: "Vienna", country: "Austria" },
      { name: "Zurich", country: "Switzerland" },
      { name: "Amsterdam", country: "Netherlands" },
      { name: "Brussels", country: "Belgium" },
      { name: "Stockholm", country: "Sweden" },
      { name: "Oslo", country: "Norway" },
      { name: "Copenhagen", country: "Denmark" },
      { name: "Helsinki", country: "Finland" },
      { name: "Warsaw", country: "Poland" },
      { name: "Prague", country: "Czech Republic" },
      { name: "Budapest", country: "Hungary" },
      { name: "Dublin", country: "Ireland" },
      { name: "Edinburgh", country: "United Kingdom" },
      { name: "Lisbon", country: "Portugal" },
      { name: "Auckland", country: "New Zealand" },
      { name: "Wellington", country: "New Zealand" },
      { name: "Osaka", country: "Japan" },
      { name: "Kyoto", country: "Japan" },
      { name: "Hong Kong", country: "Hong Kong" },
      { name: "Taipei", country: "Taiwan" },
      { name: "Hanoi", country: "Vietnam" },
      { name: "Ho Chi Minh City", country: "Vietnam" },
      { name: "Manila", country: "Philippines" },
      { name: "Jakarta", country: "Indonesia" },
      { name: "Kuala Lumpur", country: "Malaysia" },
      { name: "Colombo", country: "Sri Lanka" },
      { name: "Kathmandu", country: "Nepal" },
      { name: "Male", country: "Maldives" },
      { name: "Dhaka", country: "Bangladesh" }
    ];

    // Dynamic creation of suggestions element
    const searchWrap = document.querySelector('.search-wrap');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'suggestions-container';
    if (searchWrap) {
      searchWrap.appendChild(suggestionsContainer);
    }

    let activeIndex = -1;
    let matches = [];

    const updateSuggestions = () => {
      const query = input.value.trim().toLowerCase();
      suggestionsContainer.innerHTML = '';
      activeIndex = -1;

      if (!query) {
        suggestionsContainer.style.display = 'none';
        return;
      }

      // Filter cities matching prefix first, then general substring matches
      const prefixMatches = [];
      const substringMatches = [];

      cities.forEach(city => {
        const cityNameLower = city.name.toLowerCase();
        if (cityNameLower.startsWith(query)) {
          prefixMatches.push(city);
        } else if (cityNameLower.includes(query)) {
          substringMatches.push(city);
        }
      });

      matches = [...prefixMatches, ...substringMatches].slice(0, 8); // Limit to 8 suggestions

      if (matches.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
      }

      matches.forEach((city, index) => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.setAttribute('data-index', index);

        // Highlight the matched substring
        const idx = city.name.toLowerCase().indexOf(query);
        let nameHTML = city.name;
        if (idx !== -1) {
          nameHTML = city.name.substring(0, idx) + 
                     '<span class="match-highlight">' + city.name.substring(idx, idx + query.length) + '</span>' + 
                     city.name.substring(idx + query.length);
        }

        item.innerHTML = `
          <span class="suggestion-icon">🌸</span>
          <span class="suggestion-city">${nameHTML}</span>
          <span class="suggestion-country">${city.country}</span>
        `;

        item.addEventListener('click', () => {
          input.value = city.name;
          suggestionsContainer.style.display = 'none';
          form.submit();
        });

        suggestionsContainer.appendChild(item);
      });

      suggestionsContainer.style.display = 'block';
    };

    input.addEventListener('input', updateSuggestions);

    // Key navigation logic
    input.addEventListener('keydown', (e) => {
      const items = suggestionsContainer.querySelectorAll('.suggestion-item');
      if (suggestionsContainer.style.display === 'block' && items.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIndex = (activeIndex + 1) % items.length;
          highlightItem(items);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIndex = (activeIndex - 1 + items.length) % items.length;
          highlightItem(items);
        } else if (e.key === 'Enter') {
          if (activeIndex >= 0 && activeIndex < matches.length) {
            e.preventDefault();
            input.value = matches[activeIndex].name;
            suggestionsContainer.style.display = 'none';
            form.submit();
          }
        }
      }
    });

    const highlightItem = (items) => {
      items.forEach((item, index) => {
        if (index === activeIndex) {
          item.classList.add('active');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('active');
        }
      });
    };

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.style.display = 'none';
      }
    });
  }

  // Keyboard shortcut: '/' focuses search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input?.focus();
      input?.select();
    }
    if (e.key === 'Escape') {
      input?.blur();
    }
  });

  // Animate stat cards on load
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(12px)';
    setTimeout(() => {
      card.style.transition = '0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + i * 60);
  });

  // Animate forecast days on load
  const forecastDays = document.querySelectorAll('.forecast-day');
  forecastDays.forEach((day, i) => {
    day.style.opacity = '0';
    day.style.transform = 'translateY(8px)';
    setTimeout(() => {
      day.style.transition = '0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      day.style.opacity = '1';
      day.style.transform = 'translateY(0)';
    }, 350 + i * 70);
  });

  // Animate temperature counter
  const tempEl = document.querySelector('.temp-main');
  if (tempEl) {
    const target = parseInt(tempEl.textContent, 10);
    if (!isNaN(target)) {
      let current = target - 10;
      tempEl.textContent = current;
      const step = () => {
        if (current < target) {
          current = Math.min(current + 1, target);
          tempEl.textContent = current;
          requestAnimationFrame(step);
        }
      };
      setTimeout(() => requestAnimationFrame(step), 200);
    }
  }

  // Forecast bar widths based on temp range context
  const forecastDayEls = document.querySelectorAll('.forecast-day');
  const hiTemps = [];
  const loTemps = [];
  forecastDayEls.forEach(day => {
    const hi = parseInt(day.querySelector('.fday-hi')?.textContent);
    const lo = parseInt(day.querySelector('.fday-lo')?.textContent);
    if (!isNaN(hi)) hiTemps.push(hi);
    if (!isNaN(lo)) loTemps.push(lo);
  });
  const globalMax = Math.max(...hiTemps);
  const globalMin = Math.min(...loTemps);
  const range = globalMax - globalMin || 1;

  forecastDayEls.forEach(day => {
    const hi = parseInt(day.querySelector('.fday-hi')?.textContent);
    const lo = parseInt(day.querySelector('.fday-lo')?.textContent);
    const bar = day.querySelector('.fday-bar-fill');
    if (bar && !isNaN(hi) && !isNaN(lo)) {
      const left = ((lo - globalMin) / range) * 100;
      const width = ((hi - lo) / range) * 100;
      bar.style.marginLeft = left + '%';
      bar.style.width = Math.max(width, 8) + '%';
    }
  });
});
