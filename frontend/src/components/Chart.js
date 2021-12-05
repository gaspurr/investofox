import axios from 'axios'
import React, {useState, useEffect, } from 'react'
import { Line } from 'react-chartjs-2'


function Chart() {
    const [orderDate, setOrderDate] = useState([])
    const [TotalBalanceHistory, setTotalBalancehistory] = useState([])
    const [positionValues, setPositionValues] = useState([])
    const [totalBalance, setTotalBalance] = useState('')


    //fetch user data
    const userData = () =>{
        setTotalBalancehistory([])

        //get the logged in user from local storage then get user ID
        const getAuthUser = () =>{
            const userId = localStorage.getItem('user')
            const foo = JSON.parse(userId)
            console.log(foo)
            const id = foo.auth.user
            console.log(id)
            return id
        }

        try{
            axios.get(`http://localhost:8081/api/auth/user/${getAuthUser()}`)
            .then(res =>{
                const result = res.data
                const orders = result.orders
                //console.log(orders)

                var balanceSum = 0;
                //iterate through response and get total portfolio value
                for( var i in orders){
                    const price = orders[i]['price']
                    const amount = orders[i]['amount']
                    const date = orders[i]['date']

                    // calculate the value of a position
                    const totalValue = price * amount

                    //get the dates of orders for the chart label section
                    setOrderDate(prev => [...prev, date])

                    //set each orders total position value, needed for future comparison between real time data
                    setPositionValues(prev => [...prev, totalValue])

                    balanceSum += totalValue
                    setTotalBalancehistory(prev => [...prev, balanceSum])
                    setTotalBalance(balanceSum)
                }
            }).catch(e =>{
                console.log(e)
            })
        }catch(e){
            console.log(e)
        }
    }

    useEffect(() => {
        userData()
    }, [])


    //chart variables
    const labels = orderDate
    const values = TotalBalanceHistory

    //data that is seen in the chart
    const data = {
        labels: labels,
        datasets: [{
            label: 'Portfolio performance',
            data: values,
            borderColor: "green",
            borderWidth: 2,
            backgroundColor: ["rgba(0, 255, 0, .1)"]
        }],
    }

    //visual options
    const options = {
        maintainAspectRation: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        elements: {
            line: {
                tension: 0 // disables bezier curves
            }
        },
        legend: {
            labels: {
                fontSize: 20,
            
            }
        }


    }

    return(
        <div>
            <Line data={data}
                width={1500}
                height={400}
                options={options}
            />
            <div className="chart-chart">
                <h4>Total: {totalBalance}€</h4>
            </div>
        </div>


    )
}

export default Chart