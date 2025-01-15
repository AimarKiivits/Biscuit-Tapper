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

    //gets upgrades from database

    useEffect(() => {
        axios.get(`/upgrades/${data.user_id}`).then((response) => {
            setUser_Upgrades(response.data);
        }).catch((error) => {
            console.log(error);
        });
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
                .post(`/save/${data.user_id}`, user_upgrades)
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
            setClicks(prevClicks => prevClicks + added);
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
        <div>
            <div>
                <button onClick={() => resethandler()}>Reset</button>
                <button onClick={() => savehandler()}>Save upgrades</button>
            </div>
            <div>
                <h1>Clicks: {clicks}</h1>
                <h2>Clicks per second: {current_upgrades.oven}</h2>
                <button onClick={clickhandler}><img src="/Biscuit.png"></img></button>
            </div>
            <div>
                <button onClick={() => upgradehandler('clicker')}>Upgrade clicks: {prices.clicker}      amount: {current_upgrades.clicker}</button>
                <button onClick={() => upgradehandler('oven')}>Upgrade ovens: {prices.oven}      amount: {current_upgrades.oven}</button>
            </div>
            <div>
                <button onClick={logout}>Log out</button>
            </div>
        </div>
    )
}

export default Game;