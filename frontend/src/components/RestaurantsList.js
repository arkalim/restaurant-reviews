import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const RestaurantsList = (props) => {
    const [restaurants, setRestaurants] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchZip, setSearchZip] = useState("");
    const [searchCuisine, setSearchCuisine] = useState("");
    const [cuisines, setCuisines] = useState(["All Cuisines"]);
    const [page, setPage] = useState(0);

    // retreive the restraunts and cuisines after the first render
    useEffect(() => {
        retrieveRestaurants();
        retrieveCuisines();
    }, []);

    const retrieveRestaurants = (page = 0) => {
        RestaurantDataService.getAll(page)
            .then((response) => {
                setRestaurants(response.data.restaurants);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const retrieveCuisines = () => {
        RestaurantDataService.getCuisines()
            .then((response) => {
                // appending
                setCuisines(["All Cuisines"].concat(response.data));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const onChangeSearchName = (e) => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };

    const onChangeSearchZip = (e) => {
        const searchZip = e.target.value;
        setSearchZip(searchZip);
    };

    const onChangeSearchCuisine = (e) => {
        const searchCuisine = e.target.value;
        setSearchCuisine(searchCuisine);
    };

    // function to refresh the list of restaurants
    const refreshList = () => {
        retrieveRestaurants();
    };

    // function to find the restaurants based on a query
    const find = (query, by) => {
        RestaurantDataService.find(query, by)
            .then((response) => {
                setRestaurants(response.data.restaurants);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByName = () => {
        find(searchName, "name");
    };

    const findByZip = () => {
        find(searchZip, "zipcode");
    };

    const findByCuisine = () => {
        if (searchCuisine == "All Cuisines") {
            refreshList();
        } else {
            find(searchCuisine, "cuisine");
        }
    };

    const showPrevPage = () => {
        if (page === 0) {
            return;
        }
        setPage((page) => page - 1);
        retrieveRestaurants(page);
    };

    const showNextPage = () => {
        if (restaurants.length < 20) {
            return;
        }
        setPage((page) => page + 1);
        retrieveRestaurants(page);
    };

    return (
        <div>
            <div className="row pb-1">
                <div className="input-group col-lg-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchName}
                        onChange={onChangeSearchName}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByName}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="input-group col-lg-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by zip"
                        value={searchZip}
                        onChange={onChangeSearchZip}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByZip}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="input-group col-lg-4">
                    <select onChange={onChangeSearchCuisine}>
                        {cuisines.map((cuisine) => {
                            return (
                                <option value={cuisine}>
                                    {" "}
                                    {cuisine.substr(0, 20)}{" "}
                                </option>
                            );
                        })}
                    </select>
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByCuisine}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div className="row">
                {restaurants.map((restaurant) => {
                    const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
                    return (
                        <div className="col-lg-4 pb-1">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {restaurant.name}
                                    </h5>
                                    <p className="card-text">
                                        <strong>Cuisine: </strong>
                                        {restaurant.cuisine}
                                        <br />
                                        <strong>Address: </strong>
                                        {address}
                                    </p>
                                    <div className="row">
                                        <Link
                                            to={
                                                "/restaurants/" + restaurant._id
                                            }
                                            className="btn btn-primary col-lg-5 mx-1 mb-1"
                                        >
                                            View Reviews
                                        </Link>
                                        <a
                                            target="_blank"
                                            href={
                                                "https://www.google.com/maps/place/" +
                                                address
                                            }
                                            className="btn btn-primary col-lg-5 mx-1 mb-1"
                                        >
                                            View Map
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="container d-flex justify-content-center">
                <h3>Page: {page}</h3>
            </div>
            <div className="container d-flex justify-content-center">
                <button
                    className="btn btn-primary mx-4 m-3"
                    type="button"
                    onClick={showPrevPage}
                >
                    Prev Page
                </button>
                <button
                    className="btn btn-primary mx-4 m-3"
                    type="button"
                    onClick={showNextPage}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default RestaurantsList;
