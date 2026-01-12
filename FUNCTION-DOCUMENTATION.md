# EVENTIFY - FUNCTION DOCUMENTATION

## Overview
This document lists all functions across the Eventify website and how they are linked through the centralized Function Manager.

## Function Manager Structure

### Core Functions Registry

#### 1. COMMON FUNCTIONS
- **toggleMobileMenu(mobileMenu, navLinks)** - Toggles mobile navigation menu
- **closeMobileMenu(mobileMenu, navLinks)** - Closes mobile navigation menu
- **toggleFAQ(item, faqItems)** - Handles FAQ accordion functionality

#### 2. NAVIGATION FUNCTIONS
- **smoothScrollTo(targetId)** - Smooth scrolls to specific page sections
- **setupNavigation()** - Initializes all navigation event listeners

#### 3. EVENT MANAGEMENT FUNCTIONS
- **loadEvents()** - Retrieves events from localStorage
- **saveEvents(events)** - Saves events to localStorage
- **createEvent(eventData)** - Creates new event with validation
- **filterEvents(searchTerm, category)** - Filters events by search/category
- **renderEvents(events, containerId)** - Renders event cards to DOM

#### 4. UI FUNCTIONS
- **setupSlider()** - Initializes image slider functionality
- **setupModal(modalId, openBtnId, closeBtnClass)** - Sets up modal dialogs
- **setupImageZoom()** - Handles image zoom functionality
- **setupFAQ()** - Initializes FAQ accordion

## File-Specific Functions

### script.js (Index.html)
```javascript
// Mobile Menu Toggle
mobileMenu.addEventListener('click', (e) => {
    EventifyManager.execute('toggleMobileMenu', mobileMenu, navLinks);
});

// Slider Functions
showSlide(index) - Shows specific slide
nextSlide() - Advances to next slide
prevSlide() - Goes to previous slide

// FAQ Accordion
EventifyManager.execute('toggleFAQ', item, faqItems);
```

### create-event.js (create-event.html)
```javascript
// Event Creation
EventifyManager.execute('createEvent', eventData);

// Event Rendering
EventifyManager.execute('renderEvents', events, 'createdEventsGrid');

// Modal Management
EventifyManager.execute('setupModal', 'eventModal', 'openModalBtn', '.close-btn');

// Form Handling
form.addEventListener('submit', (e) => {
    // Creates new event using centralized function
    const newEvent = EventifyManager.execute('createEvent', eventData);
});
```

### Find-event.js (Find-events.html)
```javascript
// Event Filtering
EventifyManager.execute('filterEvents', searchTerm, category);

// Image Zoom
EventifyManager.execute('setupImageZoom');

// Search Functionality
searchInput.addEventListener('input', () => {
    EventifyManager.execute('filterEvents', searchInput.value);
});

// Category Filtering
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        EventifyManager.execute('filterEvents', '', button.dataset.category);
    });
});
```

## Function Linking Benefits

### 1. Code Reusability
- Common functions like mobile menu toggle are shared across all pages
- FAQ functionality is consistent throughout the site
- Event management functions are centralized

### 2. Maintainability
- Single point of modification for shared functionality
- Consistent behavior across all pages
- Easier debugging and testing

### 3. Performance
- Reduced code duplication
- Faster loading times
- Better memory management

## Usage Examples

### Execute a Function
```javascript
// Toggle mobile menu
EventifyManager.execute('toggleMobileMenu', mobileMenu, navLinks);

// Filter events
EventifyManager.execute('filterEvents', 'hackathon', 'Students');

// Create new event
const newEvent = EventifyManager.execute('createEvent', {
    title: 'Tech Conference',
    org: 'Tech Corp',
    category: 'Education',
    date: '2025-12-01',
    location: 'Pune'
});
```

### Register Custom Function
```javascript
// Add new function to manager
EventifyManager.register('customFunction', (param1, param2) => {
    // Custom functionality
    return result;
});

// Execute custom function
EventifyManager.execute('customFunction', arg1, arg2);
```

## Integration Status

### ✅ Integrated Files
- **Index.html** - Main landing page with slider, FAQ, navigation
- **create-event.html** - Event creation page with form handling
- **Find-events.html** - Event discovery page with filtering
- **functions-manager.js** - Central function registry

### 🔄 Function Connections
- All navigation functions linked across pages
- Event management functions shared between create/find pages
- UI components (modals, accordions) standardized
- Search and filter functionality centralized

## Future Enhancements

### Planned Functions
- **validateEventData(data)** - Form validation
- **exportEvents()** - Export events to CSV/JSON
- **importEvents(data)** - Import events from external sources
- **notifyUsers(eventId)** - Send notifications for events
- **generateEventReport()** - Analytics and reporting

### Performance Optimizations
- Lazy loading for event images
- Pagination for large event lists
- Caching for frequently accessed data
- Debounced search functionality

## Error Handling

The Function Manager includes built-in error handling:
- Warns when functions don't exist
- Graceful fallbacks for missing DOM elements
- Console logging for debugging
- Safe execution with try-catch blocks

## Browser Compatibility

All functions are compatible with:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Conclusion

The centralized Function Manager successfully links all website functions, providing:
- Consistent user experience across pages
- Maintainable and scalable code architecture
- Efficient resource utilization
- Easy debugging and testing capabilities