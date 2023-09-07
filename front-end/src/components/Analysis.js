import { Chart, registerables } from 'chart.js'
import { Pie, Line, Bar, Doughnut, Radar} from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faChartColumn, faChartLine, faSatelliteDish, faCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { useEffect, useState } from 'react'
Chart.register(...registerables)



function Analysis() {

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const [data, setData] = useState({})
    const [dates, setDates] = useState([])
    const [selectedDate, setSelectedDate] = useState("")
    const [chart, setChart] = useState("radar")

    function http_analysis() {
        axios.get('http://127.0.0.1:8000/analysis', {
            params: {
                data: JSON.stringify({ date: selectedDate })
            }
        })
            .then(response => {
                const colors = response.data.labels.map(() => getRandomColor())
                setData({
                    labels: response.data.labels,
                    datasets: [
                        {
                            label: 'Purchase Value',
                            backgroundColor: colors,
                            borderColor: 'rgba(219, 79, 79, 0.77)',
                            borderWidth: 2,
                            data: response.data.data,
                        },
                    ],
                })
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (localStorage.getItem("auth_token")) {
            axios.get('http://127.0.0.1:8000/sales-analysis-date', { req: null })
                .then(response => setDates(response.data.dates))
        }
        else window.location.href = '/'
    }, [])

    useEffect(() => {
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
                    <div className="btn-group w-100 mt-1" role="group" aria-label="FontAwesome Icon Button Group">
                        <button type="button" className="btn btn-secondary" onClick={() => setChart("radar")}>
                            <FontAwesomeIcon icon={faChartPie} /> Radar chart
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setChart("bar")}>
                            <FontAwesomeIcon icon={faChartColumn} /> Bar chart
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setChart("line")}>
                            <FontAwesomeIcon icon={faChartLine} /> Line Chart
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setChart("doughnut")}>
                            <FontAwesomeIcon icon={faSatelliteDish} />  Doughnut chart
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setChart("pie")}>
                            <FontAwesomeIcon icon={faCircle} /> Pie chart
                        </button>
                    </div>
                </div>
                <div style={{height: "690px"}} className='d-flex justify-content-center'>
                    {(data.labels && chart === "radar") && (<Radar data = {data}/>)}
                    {(data.labels && chart === "bar") && (<Bar data = {data}/>)}
                    {(data.labels && chart === "line") && (<Line data = {data}/>)}
                    {(data.labels && chart === "doughnut") && (<Doughnut data = {data}/>)}
                    {(data.labels && chart === "pie") && (<Pie data = {data}/>)}
                </div>
            </div>
        </>
    )
}

export default Analysis