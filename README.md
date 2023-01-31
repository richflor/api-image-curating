- Description
Small API that uses Unsplash and Google-cloud Vision APIs.

- How it works
It only accept a single POST request with two parameters.
It first requests Unsplash for images, then it uses the Vision API to identify labels on those images, finally it returns an array of images links with their labels depending on what parameter we set in our POST request.
The "keyword" parameter is a string used as searching term to find images on the Unsplash API.
The "labels" parameter is an array of strings, it is the labels to look for among the labels returned by the Google.
The API will only return images that have labels that corresponds to those in the "labels" parameter.

A third optionnal parameter is called limit, it is the number of images to submit to the Vision API. By default it is set on 16. It is the maximum I could send in one request, it may be higher for you.

- Example

Here is an example of request:
route : http://localhost:3000/api/v1/analyze
header : post 
body : {
    "keyword": "guadeloupe",
    "labels": ["beach", "tree"]
} 

- Configuration

You should set the api access key and the server port in en .env file.
Template .env :
    API_ACCESS_KEY=HERE_GOES_THE_KEY
    PORT=3000

You also need the service account key for the Vision API in the APIKey.json file.

Both .env and APIKey.json should be at the root.

To start the server use npm start.

Check the APIs :
- https://unsplash.com/developers
- https://cloud.google.com/vision/