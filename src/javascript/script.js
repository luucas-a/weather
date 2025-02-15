document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value.trimEnd();

    if (!cityName) {
        document.querySelector("#weather").classList.remove('show');
        showAlert('Por favor, digitar uma cidade...');
        return;
    }

    const apiKey = "367816c965e5bbc822d54f1bd668f957";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const results = await fetch(apiUrl);
        const json = await results.json();

        if (json.cod === "200") {
            // Pegamos a previsão do primeiro registro (mais recente)
            const forecastToday = json.list[0];

            // Filtra os valores do dia atual para calcular máxima e mínima
            const today = new Date().getDate();
            const tempsToday = json.list.filter(item => new Date(item.dt_txt).getDate() === today);

            // Calcula a temperatura máxima e mínima do dia
            const tempMax = Math.max(...tempsToday.map(item => item.main.temp_max));
            const tempMin = Math.min(...tempsToday.map(item => item.main.temp_min));

            showInfo({
                city: json.city.name,
                country: json.city.country,
                temp: forecastToday.main.temp,
                tempMax: tempMax,
                tempMin: tempMin,
                description: forecastToday.weather[0].description,
                tempIcon: forecastToday.weather[0].icon,
                windSpeed: forecastToday.wind.speed,
                humidity: forecastToday.main.humidity,
            });
        } else {
            document.querySelector("#weather").classList.remove('show');
            showAlert(`
                Não foi possível localizar...

                <img src="src/images/404.svg"/>
            `);
        }
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        showAlert("Erro ao obter os dados. Tente novamente.");
    }
});

function showInfo(json) {
    showAlert('');

    document.querySelector("#weather").classList.add('show');

    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;
    document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_description').innerHTML = `${json.description}`;
    document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);

    // Exibe a temperatura máxima e mínima corretamente
    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>C°</sup>`;
    document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('#wind').innerHTML = `${json.windSpeed.toFixed(1)} km/h`;
}

function clearSearch() {
    document.getElementById('city_name').value = '';
    document.getElementById('city_name').focus();
}

function showAlert(msg) {
    document.querySelector('#alert').innerHTML = msg;
}
