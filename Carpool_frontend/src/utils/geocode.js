export async function getAddressFromCoords(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    // Extract readable location name
    const address = data.address || {};
    const parts = [];
    
    // Add relevant parts in order of priority
    if (address.road || address.suburb || address.neighbourhood) {
      parts.push(address.road || address.suburb || address.neighbourhood);
    }
    if (address.city || address.town || address.village) {
      parts.push(address.city || address.town || address.village);
    }
    if (address.state) {
      parts.push(address.state);
    }
    
    return parts.length > 0 ? parts.join(', ') : data.display_name || "Unknown location";
  } catch (err) {
    console.error("Geocoding error:", err);
    return "Unknown location";
  }
}

// Helper function to get short address (just area and city)
export async function getShortAddress(lat, lng) {
  console.log('getShortAddress called with:', lat, lng);
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Geocoding response:', data);
    
    const address = data.address || {};
    const parts = [];
    
    // Prioritize: neighbourhood/suburb, then city
    if (address.neighbourhood || address.suburb) {
      parts.push(address.neighbourhood || address.suburb);
    }
    if (address.city || address.town) {
      parts.push(address.city || address.town);
    }
    
    const result = parts.length > 0 ? parts.join(', ') : "Unknown location";
    console.log('Geocoding result:', result);
    return result;
  } catch (err) {
    console.error("Geocoding error:", err);
    return "Unknown location";
  }
}

