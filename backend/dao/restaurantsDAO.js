import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;

// variable to store reference to the restaurants collection of sample_restaurants DB
let restaurants;

export default class RestaurantsDAO {
    // method to get a reference to the restaurants collection of sample_restaurants DB
    // to be called when the server starts
    static async injectDB(conn) {
        // if the reference already exists
        if (restaurants) {
            return;
        }

        try {
            restaurants = await conn
                .db(process.env.RESTREVIEWS_NS)
                .collection("restaurants");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in restaurantsDAO: ${e}`
            );
            return;
        }
    }

    // method to get the list of all the restaurants in the DB
    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        // setup the query for the DB
        let query;
        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters["name"] } };
            } else if ("cuisine" in filters) {
                query = { cuisine: { $eq: filters["cuisine"] } };
            } else if ("zipcode" in filters) {
                query = { "address.zipcode": { $eq: filters["zipcode"] } };
            }
        }

        // fetch the DB based on the query
        let cursor;
        try {
            cursor = await restaurants.find(query);
        } catch (e) {
            console.log(`Unable to issue find command: ${e}`);
            return { restaurantsList: [], totalNumRestaurants: 0 };
        }

        const displayCursor = cursor
            .limit(restaurantsPerPage)
            .skip(restaurantsPerPage * page);

        try {
            const restaurantsList = await displayCursor.toArray();
            const totalNumRestaurants = await restaurants.countDocuments(query);
            return { restaurantsList, totalNumRestaurants };
        } catch (e) {
            console.log(
                `Unable to convert cursor to array or problem counting documents: ${e}`
            );
            return { restaurantsList: [], totalNumRestaurants: 0 };
        }
    }

    // method to get a specific restaurant by its ID
    static async getRestaurantById(id) {
        try {
            const pipeline = [
                {
                    $match: { _id: new ObjectId(id) },
                },
                {
                    $lookup: {
                        from: "reviews",
                        let: { id: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$restaurant_id", "$$id"] },
                                },
                            },
                            {
                                $sort: { date: -1 },
                            },
                        ],
                        as: "reviews",
                    },
                },
                {
                    $addFields: { reviews: "$reviews" },
                },
            ];
            return await restaurants.aggregate(pipeline).next();
        } catch (e) {
            console.error(`Something went wrong in getRestaurantById: ${e}`);
        }
    }

    // method to get all the cuisines
    static async getCuisines() {
        let cuisines = [];
        try {
            cuisines = await restaurants.distinct("cuisine");
        } catch (e) {
            console.error(`Unable to get cuisines: ${e}`);
        } finally {
            return cuisines;
        }
    }
}
