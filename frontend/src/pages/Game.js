import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css'
import axios from "axios";
import useAuth from "../hooks/useAuth";


const Game = () => {
    const { data, setData } = useAuth();
    const navigate = useNavigate();
    const [ shouldSave, setShouldSave] = useState(false);
    const [ clicks, setClicks ] = useState(0);
    const [ user_upgrades, setUser_Upgrades ] = useState({});
    const [ current_upgrades, setCurrent_Upgrades ] = useState({});
    const [ prices, setPrices ] = useState({});
    const [ leaderboard, setLeaderboard ] = useState([]);

    //gets upgrades from database

    useEffect(() => {
        if (data.ready === true) {
            axios.get(`/upgrades/${data.user_id}`).then((response) => {
                setUser_Upgrades(response.data.upgrades);
                setClicks(response.data.click_amount);
            }).catch((error) => {
                console.log(error);
            });

            axios.get(`/leaderboard`).then((response) => {
                console.log(response.data.leaderboard);
                setLeaderboard(response.data.leaderboard.map((entry, index) => {
                    return (
                        <div key={index}>
                            <h1>{index + 1}. {entry.username} - {entry.click_amount}</h1>
                        </div>
                    )
                }));
            }).catch((error) => {
                console.log(error);
            })
        } else {
            console.log("data not ready");
        }
    }, [data]);
    
    //sets upgrades to current upgrades and sets prices during first load

    useEffect(() => {
        setCurrent_Upgrades(user_upgrades);
        for (const [key, value] of Object.entries(user_upgrades)) {
            setPrices(prevPrices => {
                return {
                    ...prevPrices,
                    [key]: value * 10
                }
            })
        }
    }, [ user_upgrades ]);

    //function that handles upgrades

    const upgradehandler = (which) => {
        if (which === 'clicker') {
            if (clicks >= prices.clicker) {
                setClicks(clicks - prices.clicker);
                setCurrent_Upgrades(prevCurrent_Upgrades => {
                    return {
                        ...prevCurrent_Upgrades,
                        clicker: prevCurrent_Upgrades.clicker + 1
                    }
                })
            }
        } else if (which === 'oven') {
            if (clicks >= prices.oven) {
                setClicks(clicks - prices.oven);
                setCurrent_Upgrades(prevCurrent_Upgrades => {
                    return {
                        ...prevCurrent_Upgrades,
                        oven: prevCurrent_Upgrades.oven + 1
                    }
                })
            }
        }
    }

    //next two save upgrades

    const savehandler = () => {
        setUser_Upgrades(current_upgrades);
        setShouldSave(true);
    };
    
    useEffect(() => {
        if (shouldSave && user_upgrades !== null) {
            axios
                .post(`/save/${data.user_id}`, { user_upgrades: user_upgrades, clicks: clicks })
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setShouldSave(false);
                });
        }
    }, [shouldSave, user_upgrades, data.user_id]);

    //sets prices for upgrades during game

    useEffect(() => {
        for (const [key, value] of Object.entries(current_upgrades)) {
            if ( current_upgrades[key] <= 0 ) {
                setPrices(prevPrices => {
                    return {
                        ...prevPrices,
                        [key]: 1
                    }
                })
            } else {
                setPrices(prevPrices => {
                    return {
                        ...prevPrices,
                        [key]: value * 10
                    }
                })
            }
        }
    }, [ current_upgrades]);

    useEffect(() => {
        const added = current_upgrades.oven || 0;
        const interval = setInterval(() => {
            setClicks(prevClicks => prevClicks += added);
        }, 1000);

        return () => clearInterval(interval);
    }, [current_upgrades.oven]);

    //resets upgrades temp for testing

    const resethandler = () => {
        setClicks(0);
        setUser_Upgrades({ user_id: data.user_id, clicker: 0, oven: 0 });
        setCurrent_Upgrades({ user_id: data.user_id, clicker: 0, oven: 0 });
    }

    //handles the click gain for manual presses

    const clickhandler = () => {
        let amount = 1 + current_upgrades.clicker + (current_upgrades.oven * 5);
        setClicks(clicks + amount);
    }

    //logout function

    const logout = () => {
        setData({});
        localStorage.removeItem('token');
        navigate("/");
    }

    return (
        <div className="game">
            <div className="click_area">
                <div className="title">
                    <h1>Biscuit Tapper</h1>
                </div>
                <div className="click_info">
                    <h1>Clicks: {clicks}</h1>
                    <h1>Clicks per second: {current_upgrades.oven}</h1>
                </div>
                <div className="click_button">
                    <button onClick={clickhandler}>
                        <img src="/Biscuit.png" alt=""></img>
                    </button>
                </div>
            </div>

            <div className="upgrades_area">
                <div className="title">
                    <h1>Upgrades</h1>
                </div>
                <button className="button" onClick={() => upgradehandler('clicker')}>Upgrade clicks: {prices.clicker}      amount: {current_upgrades.clicker}</button>
                <button className="button" onClick={() => upgradehandler('oven')}>Upgrade ovens: {prices.oven}      amount: {current_upgrades.oven}</button>
            </div>
                
            <div className="stats_area">
                <div className="Navbar">
                    <button className="button" onClick={() => resethandler()}>Reset</button>
                    <button className="button" onClick={() => savehandler()}>Save upgrades</button>
                    <button className="button" onClick={logout}>Log out</button>
                </div>
                <div className="Leaderboard">
                    <div className="title">
                        <h1>Leaderboard</h1>
                    </div>
                    <div className="leaderboard_area">
                        {leaderboard}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game;