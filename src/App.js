import React, { Component } from 'react';
import {
    HashRouter as Router,
    Routes,
    Route,
    Link,
    Outlet
} from 'react-router-dom';
import { ReactP5Wrapper } from '@p5-wrapper/react';
import blackjack from './sketches/blackjack';
import platformer from './sketches/platformer';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="container">
                <div className="App">
                    {/* <ReactP5Wrapper sketch={sketch} /> */}
                    <Router>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index path="p5-demos" element={<Home />} />
                                <Route
                                    path="blackjack"
                                    element={<Blackjack />}
                                />
                                <Route
                                    path="platformer"
                                    element={<Platformer />}
                                />

                                {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
                                <Route path="*" element={<NoMatch />} />
                            </Route>
                        </Routes>
                    </Router>
                </div>
            </div>
        );
    }
}

function Layout() {
    return (
        <div>
            {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
            <nav>
                <ul>
                    <li>
                        <Link to="/p5-demos">Home</Link>
                    </li>
                    <li>
                        <Link to="/blackjack">Blackjack</Link>
                    </li>
                    <li>
                        <Link to="/platformer">Platformer</Link>
                    </li>
                </ul>
            </nav>

            <hr />

            {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
            <Outlet />
        </div>
    );
}

function Home() {
    return (
        <div>
            <h2>Home</h2>
            Some P5 demos
        </div>
    );
}

function Blackjack() {
    return (
        <div>
            <h2>Blackjack</h2>
            <ReactP5Wrapper sketch={blackjack} />
        </div>
    );
}

function Platformer() {
    return (
        <div>
            <h2>Platformer</h2>
            <ReactP5Wrapper sketch={platformer} />
            <>WASD to move. Space to jump.</>
        </div>
    );
}

function NoMatch() {
    return (
        <div>
            <h2>Nothing to see here!</h2>
            <p>
                <Link to="/">Go to the home page</Link>
            </p>
        </div>
    );
}

export default App;
