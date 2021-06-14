import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./dao/restaurantsDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";

// load the environment variables
dotenv.config();

// create a mongodb client
const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8000;

// connect to the DB
MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
    // max 50 people can connect and request timeout after 2500 ms
    poolSize: 50,
    wtimeout: 5000,
    useNewUrlParser: true,
})
    // check for errors
    .catch((err) => {
        console.log(err.stack);
        process.exit(1);
    })

    // if the connection is successful, start the server
    .then(async (client) => {
        // connect to the DB
        await RestaurantsDAO.injectDB(client);

        // connect to the reviews DB
        await ReviewsDAO.injectDB(client);

        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    });
