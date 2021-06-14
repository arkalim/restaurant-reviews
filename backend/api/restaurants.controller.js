import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {
    static async apiGetRestaurants(req, res, next) {
        // query string parameters (URL params)
        const restaurantsPerPage = req.query.restaurantsPerPage
            ? parseInt(req.query.restaurantsPerPage, 10)
            : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine;
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode;
        } else if (req.query.name) {
            filters.name = req.query.name;
        }

        // get the list of restaurants
        const { restaurantsList, totalNumRestaurants } =
            await RestaurantsDAO.getRestaurants({
                filters,
                page,
                restaurantsPerPage,
            });

        // send the response
        res.json({
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        });
    }

    static async apiGetRestaurantById(req, res, next) {
        try {
            let id = req.params.id || {};
            let restaurant = await RestaurantsDAO.getRestaurantById(id);
            if (!restaurant) {
                res.status(404).json({ error: "Restaurant not found" });
                return;
            }
            res.json(restaurant);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetRestaurantCuisines(req, res, next) {
        try {
            let cuisines = await RestaurantsDAO.getCuisines();
            res.json(cuisines);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}
