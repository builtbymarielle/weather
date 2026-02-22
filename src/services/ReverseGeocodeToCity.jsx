export async function reverseGeocodeToCity(lat, lon) {
  if (lat == null || lon == null) return null;
  try {
    const res = await fetch(
      `/api-osm/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data?.address;
    if (!addr) return null;
    return (
      addr.city ||
      addr.town ||
      addr.village ||
      addr.municipality ||
      addr.county ||
      null
    );
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}
