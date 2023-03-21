# **Description**

Hapi/Node webApp for reviewing pubs in Ireland.
View reviews for each pub or log in to leave your own.


## **URL**

<https://pintaccountant.onrender.com/>

## **Usage**

### No Account

- The map will load on first entry, pick a category from the top right of the map.
- Some markere will populate on the map (based around your viewpoint).
- click a marker - If there are reviews, they will load in eventually.

### Account

- The map is on the dashboard page.
- Click a marker to load a place.
- Click "Review" to leave a review.
- You can also access your profile page to update your picture or see all your reviews.

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
