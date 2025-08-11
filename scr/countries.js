async function getCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca3');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const countries = await response.json();
        
        return countries.map(country => ({
            name: country.name.common,
            code: country.cca3
        })).sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
}

async function populateNacionalidadSelect() {
    const countries = await getCountries();
    const selectElement = document.getElementById('nacionalidad');
    
    if (!selectElement) {
        console.error('Select element with id "nacionalidad" not found');
        return;
    }
    
    selectElement.innerHTML = '';
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        
        if (country.code === 'CRI') {
            option.selected = true;
        }
        
        selectElement.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    populateNacionalidadSelect();
});
