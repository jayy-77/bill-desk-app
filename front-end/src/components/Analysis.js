import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import axios from 'axios'
import { useEffect, useState } from 'react'
Chart.register(...registerables)



function Analysis() {
// ok
    const [data, setData] = useState({})
    const [dates, setDates] = useState([])
    const [selectedDate, setSelectedDate] = useState("")

    function http_analysis() {
        axios.get('http://127.0.0.1:8000/analysis', {
            params:{
                data: JSON.stringify({date: selectedDate})
            }
        })
            .then(response => {
                setData({
                    labels: response.data.labels,
                    datasets: [
                        {
                            label: 'Purchase Value',
                            backgroundColor: 'rgba(219, 79, 142, 0.77)',
                            borderColor: 'rgba(219, 79, 79, 0.77)',
                            borderWidth: 2,
                            data: response.data.data,
                        },
                    ],
                })
            })
            .catch(err => console.log(err))
    }

    useEffect(() =>{
        axios.get('http://127.0.0.1:8000/sales-analysis-date', { req: null })
            .then(response => setDates(response.data.dates))
    }, [])

    useEffect(() =>{
        setSelectedDate(dates[0])
    }, [dates])

    useEffect(() => {
        http_analysis()
    }, [selectedDate])

    return (
        <>
            <div className='container'>
                <div class="dropdown mt-2">
                <h4>Select Date</h4>
                    <select class="form-select" onChange={(e) => setSelectedDate(e.target.value)}>
                        {
                            dates && dates.map((d) => (
                                <option value={d}>{d}</option>
                            ))
                        }
                    </select>
                </div>
                {
                    data.labels && <Bar
                        data={data}
                        options={{
                            title: {
                                display: true,
                                text: 'Class strength',
                                fontSize: 40,
                            },
                            legend: {
                                display: true,
                                position: 'right',
                            },
                        }}
                    />
                }
            </div>
        </>
    )
}

export default Analysis