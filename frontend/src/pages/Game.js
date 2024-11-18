import React, { useEffect, useState } from "react";
import '../App.css'
import axios from "axios";

const Game = () => {
    const [ clicks, setClicks ] = useState(0);
    const [ user_upgrades, setUser_Upgrades ] = useState({});
    const [ current_upgrades, setCurrent_Upgrades ] = useState({});
    const [ prices, setPrices ] = useState({});

    useEffect(() => {
        axios.get("/upgrades", {
        }).then((response) => {
            setUser_Upgrades(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);
    
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

    const clickhandler = () => {
        let amount = 1 + current_upgrades.clicker + (current_upgrades.oven * 5);
        setClicks(clicks + amount);
    }

    return (
        <div>
            <div>
                <h1>Clicks: {clicks}</h1>
                <button onClick={clickhandler}><img src="/Biscuit.png"></img></button>
            </div>
            <div>
                <button onClick={() => upgradehandler('clicker')}>Upgrade clicks: {prices.clicker}      amount: {current_upgrades.clicker}</button>
                <button onClick={() => upgradehandler('oven')}>Upgrade ovens: {prices.oven}      amount: {current_upgrades.oven}</button>
            </div>
        </div>
    )
}

export default Game;