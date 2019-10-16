let isAppended;

export const loadGoogleMaps = () => {
  if (!isAppended) {
    const apiKey = process.env.REACT_APP_GOOGLE_ADDRESS_API_KEY;
    const script = document.createElement("script");

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    document.head.appendChild(script);

    isAppended = true;
  }
};

export default loadGoogleMaps;
