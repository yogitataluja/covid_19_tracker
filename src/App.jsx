import React, { useState, useEffect } from 'react'
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle"
import Map from './Map'
import Table from './Table'
import { sortData } from './util'
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css"




const App = () => {
    // code to get country in dropedown button
    const [countries, setcountries] = useState(["Worldwide"])
    // eslint-disable-next-lin
    const [country, setcountry] = useState("Worldwide")

    const [countryInfo, setcountryInfo] = useState({})

    const [tableData, setTableData] = useState([])
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
    const [mapZoom, setMapZoom] = useState(3);


    useEffect(() => {
        // Asynch->send a request, wait for it, do something with

        const getcountrydata = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries") // send request to server and  wait until it respond
                .then((response) => response.json()) // after it come back with the response . I want to first get the entire response and just take the json from it
                .then((data) => {  //once i got that response which is basically resemble as our data essentially then i want to go and set countary 
                    const countries = data.map((val) => (  //I am going through every country and return slightly different shape or i want only some of the stuff  
                        {                                     // returning an object)                   // once i got that tree i want to restucture it
                            name: val.country,
                            value: val.countryInfo.iso2
                        }))
                    const sortedData = sortData(data)
                    setTableData(sortedData)
                    setcountries(countries)
                })
        }
        getcountrydata()
    }, [])//Run only when component load(refresh)

    // code start for info box update

    // code to implement worldwide
    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then((response) => response.json())
            .then((data) => {
                setcountryInfo(data)

            })
    }, [])

    const onCountryChange = async (event) => {
        const countryCode = event.target.value //  which value(country) we select is now store in countryCode or at placeof worldwide
        setcountry(countryCode)
        const url = 
        countryCode === "Worlwide" ? 
        "https://disease.sh/v3/covid-19/all" : 
        `https://disease.sh/v3/covid-19/countries/${countryCode}`

        // if select worldwide show all https://disease.sh/v3/covid-19/all
        // if select any country  https://disease.sh/v3/covid-19/country_code
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setcountry(countryCode)
                setcountryInfo(data)
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
            })

    }
    console.log("Country Info", countryInfo)


    return (
        <div className="app  d-flex justify-content-evenly">
            <div className="app_left">
                <div className="app_header">
                    {/* Title+ select input drop down button */}
                    <h1>COVID-19 Tracker</h1>
                    <FormControl className="app_control">
                        <Select onChange={onCountryChange} variant="outlined" value={country}>
                            <MenuItem value="Worldwide">Worldwide</MenuItem>
                            {/* loop through all the countary  and show dropdown with option */}
                            {countries.map((country) => {
                                return (
                                    <MenuItem value={country.value}>{country.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </div>
                <div className="app_status d-flex justify-content-between">
                    <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
                    <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
                    <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
                </div>
                {/* Map */}
                <Map center={mapCenter}
                zoom={mapZoom} />
            </div>

            <Card className="app_right ">
                <CardContent>    {/*Cardcontent give us nice white background area   */}
                    <h3>Live Cases by Country</h3>
                    {/* table */}
                    <Table className="table table-striped" countries={tableData} />
                    <h3>Worldwide new Cases</h3>
                    {/* Graph */}
                    <LineGraph />
                </CardContent>
            </Card>
        </div>

    )
}

export default App
