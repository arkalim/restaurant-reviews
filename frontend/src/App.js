import React, { useState } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// import components
import Login from "./components/Login";
import AddReview from "./components/AddReview";
import Restaurant from "./components/Restaurant";
import RestaurantsList from "./components/RestaurantsList";

function App() {
    const [user, setUser] = useState(null);

    // this function will be passed to Login.js as prop
    const login = async (user) => {
        setUser(user);
    };

    const logout = async () => {
        setUser(null);
    };

    return (
        <div classNameNameName="App">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/restaurants">
                        🍽 Restaurant Reviews
                    </a>
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={"/restaurants"} className="nav-link">
                                Restaurants
                            </Link>
                        </li>
                        <li className="nav-item">
                            {user ? (
                                <a
                                    onClick={logout}
                                    className="nav-link"
                                    style={{ cursor: "pointer" }}
                                >
                                    Logout {user.name}
                                </a>
                            ) : (
                                <Link to={"/login"} className="nav-link">
                                    Login
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="container mt-3">
                <Switch>
                    <Route
                        exact
                        path={["/", "/restaurants"]}
                        component={RestaurantsList}
                    />
                    <Route
                        path="/restaurants/:id/review"
                        render={(props) => <AddReview {...props} user={user} />}
                    />
                    <Route
                        path="/restaurants/:id"
                        render={(props) => (
                            <Restaurant {...props} user={user} />
                        )}
                    />
                    <Route
                        path="/login"
                        render={(props) => <Login {...props} login={login} />}
                    />
                </Switch>
            </div>
        </div>
    );
}

export default App;
