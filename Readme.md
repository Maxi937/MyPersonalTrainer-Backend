# **Description**

Hapi/Node webApp for reviewing pubs in Ireland.

View reviews for each pub or log in to leave your own.

## **URL**

<https://pintaccountant.onrender.com/>

## **Feautures**

### User

- Signup
- Login
- Auth
- Profile Pictures
- Update Details

### Admin

- Create, Delete all resources

### Places

- Note: Places are every pub/hotel in Ireland, Places are only tracked when a review is left.
- Places automatically create when a review is left.

### Reviews

- Create, Delete Reviews

## **Known Issues**

- No functionality for beer prices implemented.
- No photos for Places.
- No Descriptions for places.
- The Reviews do not load instantly when a marker is clicked
- About page incomplete

## Sources

| Source                                                                                      | Description                                      |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| <https://developers.arcgis.com/esri-leaflet/geocode-and-search/>                            | For the map                                      |
| <https://stackoverflow.com/questions/66694654/how-to-convert-image-png-to-binary-in-nodejs> | Binary to string for the images stored in the db |


## **Tech**

### **Database**

- MongoDB

### **Backend**

- Node
- Hapi
- Mongoose

### **Logging**

- Winston

### **Frontend**

- Handlebars Templating

### **CSS**

- Fomantic UI
- Bulma

### **Utility**

- Nodemon
- eslint

### **Testing**

- Mocha
- Chai
