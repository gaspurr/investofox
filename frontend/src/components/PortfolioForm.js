import axios from "axios"
import React, { useState } from 'react'
import { STOCK_API, TOKEN } from "./Utils/StockApi"

export function PortfolioForm() {

    const [symbol, setSymbol] = useState('')
    const [stockChartXValues, setStockChartXValues] = useState([])
    const [stockChartYValues, setStockChartYValues] = useState([])
    const [stockChartZValues, setStockChartZValues] = useState([])
    const [loading, setLoading]= useState(true)

    const handleSubmit = async(value) =>{
        value.preventDefault()
        const tickers = symbol

        try{
            axios.get(`${STOCK_API}&symbol=${tickers}&apikey=${TOKEN}`)
            .then(res =>{
                if(res){
                    console.log(res.data)
                    setLoading(false)
                }

                const data = res.data

                for( var key in data['Time Series (Daily)']) {
                    setStockChartXValues(key)
                    setStockChartYValues(data[`Time Series (Daily)`]
                    [key]['4. close'])
                    console.log("key "+ key)
                    setStockChartZValues(data[`Meta Data`]['2. Symbol'])
                    console.log("Price: " + stockChartYValues)
                    console.log("symbol: " + stockChartZValues)
                }

                if(loading){
                    return(
                        <div className={"login-container"}>
                            Loading data...
                        </div>
                    )
                }
            }).catch(e =>{
                console.error(e)
            })


        }catch(error){
            console.log(error)
        }
        } //end of handleSubmit



        return (
            <div className="login-container">
                <h1>Stock portfolio</h1>
                <form onSubmit={handleSubmit} className="login-content">
                    <label>Symbol</label>
                            <input 
                                type="text" 
                                name="stockSymbol"
                                placeholder="TSLA...." 
                                onChange={(e) => setSymbol(e.target.value)}
                                required
                            />
    
                    <button className="login-loginButton">Fetch</button>
                </form>
                <ul className="login-container">
                    <li>
                            <div>
                                <h4>Symbol: {stockChartZValues}</h4>
                                <p>Date: {stockChartXValues}</p>
                                <p>Price: {stockChartYValues}</p>
                            </div>
                        
                    </li>
                </ul>
            </div>
        )
    }
    
    export default PortfolioForm
