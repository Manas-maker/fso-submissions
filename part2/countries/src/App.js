import { useState, useEffect} from 'react'
import axios from 'axios'

const Filter = ({value, onChange}) => <input value={value} onChange={onChange} />
const ShowData = ({countries, viewCountry, onShowClick, api_key}) => {
  const [weatherData, setWeatherData] = useState([])
  useEffect(() => {
    if (countries.length === 1 || viewCountry !== -1) {
      axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${countries[viewCountry===-1?0:viewCountry].capitalInfo.latlng[0]}&lon=${countries[viewCountry===-1?0:viewCountry].capitalInfo.latlng[1]}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeatherData([response.data.main.temp, response.data.weather[0].icon, response.data.wind.speed])
      })}
  }, [api_key, countries, viewCountry])
    
    
  if (countries.length === 1 || viewCountry !== -1) {
    return (
      <div>
        <h1>name {countries[viewCountry===-1?0:viewCountry].name.common}</h1>
        <p>capital {countries[viewCountry===-1?0:viewCountry].capital.join(', ')}</p>
        <p>area {countries[viewCountry===-1?0:viewCountry].area}</p>
        <h3>languages:</h3>
        <ul>
          {Object.keys(countries[viewCountry===-1?0:viewCountry].languages).map((language,count) => <li key={count}>{countries[viewCountry===-1?0:viewCountry].languages[language]}</li>)}
        </ul>
        <img src={countries[viewCountry===-1?0:viewCountry].flags.png} alt={"flag of "+countries[viewCountry===-1?0:viewCountry].name.common}/>
        <h2>Weather in {countries[viewCountry===-1?0:viewCountry].capital[0]}</h2>
        <p>{weatherData[0]}°C</p>
        <img src={`http://openweathermap.org/img/wn/${weatherData[1]}@2x.png`} alt="icon for weather"/>
        <p>wind {weatherData[2]}m/s</p>
      </div>
    )
  } 
  else {
    return (
    <ul>
      {countries.map((count, index) => <li key={index}>{count.name.common}<button onClick={onShowClick} className={index}>show</button></li>)}
    </ul>)
  }
}
function App() {
  const api_key = process.env.REACT_APP_API_KEY
  const[viewCountry, setViewCountry] = useState(-1)
  const [nameSearch, setNameSearch] = useState('')
  const [data, setData] = useState([])
  const onShowClick = (country) => setViewCountry(country.target.className)
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setData(response.data)
      } )
  }, [])
  const handleNameSearchChange = (event) => {
    setNameSearch(event.target.value)
    setViewCountry(-1)
  }

  const countriesToShow = data.filter(country => country.name.common.toLowerCase().includes(nameSearch.toLowerCase()))
  return (
    <div className="App">
      <Filter value={nameSearch} onChange={handleNameSearchChange} />
      <ShowData countries={countriesToShow} viewCountry={viewCountry} onShowClick={onShowClick} api_key={api_key} />
    </div>
  );
}

export default App;
