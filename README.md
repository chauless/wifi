# Wifi map

## Description
The application provides users with an interactive map interface where they can view and interact with Wi-Fi network markers. Users will be able to add new Wi-Fi network markers by providing information such as the network name (SSID), description, and location coordinates. Additionally, users can view details of each Wi-Fi network marker by clicking on them, including the network name, description, latitude, and longitude.



## Procedure
I worked with React and TypeScript with Firebase (as a database) and Leaflet (library for working with maps and markers), Geolocation API (for displaying user's location).
I started by adding the map itself, the ability to add markers, then Firebase, validation and on down the list from the requirements.

## Functional Requirements
https://docs.google.com/spreadsheets/d/1W28eQlSWIuLf7h5u8ekX3n3sGgNZk4A4JYtHu_QXiFA/edit?usp=sharing

## Functionality description
The app has one page that has a map on it. When you tap on the map, a window appears where you can add data for the label. The marks of all users appear on the map through Firebase. If a user allows access to geo-location, their location will be shown in blue on the map and will not be saved to the database.

![image](https://github.com/chauless/wifi-map/assets/93679962/a415c377-f09e-4eec-9dad-448fb4364ca6)
![image](https://github.com/chauless/wifi-map/assets/93679962/ce886ad7-56ca-4773-bd9b-213b9bddd8c2)
![image](https://github.com/chauless/wifi-map/assets/93679962/10fb4892-25e9-48e3-b0e6-651ff7077655)
![image](https://github.com/chauless/wifi-map/assets/93679962/f0787896-f18b-4cb5-9068-bcb24d7c01c1)
![image](https://github.com/chauless/wifi-map/assets/93679962/f16140c3-47f2-4d3f-96fc-6d1dc064467b)


