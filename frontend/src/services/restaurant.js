import http from "../http-common";

class RestaurantDataService {
    getAll = (page = 0) => http.get(`?page=${page}`);

    get = (id) => http.get(`/id/${id}`);

    find = (query, by = "name", page = 0) =>
        http.get(`?${by}=${query}&page=${page}`);

    createReview = (data) => http.post("/review", data);

    updateReview = (data) => http.put("/review", data);

    deleteReview = (id, userId) =>
        // userId is sent as body
        http.delete(`/review?id=${id}`, { data: { user_id: userId } });

    getCuisines = () => http.get("/cuisines");
}

// export an object of this class
export default new RestaurantDataService();
