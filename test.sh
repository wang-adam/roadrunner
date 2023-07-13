curl -X POST -d '{
  "origin": {
    "address": "1 Infinite Loop, Cupertino, CA 95014"
  },
  "destination": {
    "address": "1600 Amphitheatre Parkway, Mountain View, CA 94043"
  },
  "travelMode": "DRIVE",
  "routingPreference": "TRAFFIC_AWARE",
  "computeAlternativeRoutes": true,
  "routeModifiers": {
    "avoidTolls": true,
    "avoidHighways": false,
    "avoidFerries": false
  },
  "languageCode": "en-US",
  "units": "IMPERIAL"
}' \
-H 'Content-Type: application/json' \
-H 'X-Goog-Api-Key: {GOOGLE API KEY}' \
-H 'X-Goog-FieldMask: routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline' \
'https://routes.googleapis.com/directions/v2:computeRoutes' > results.txt