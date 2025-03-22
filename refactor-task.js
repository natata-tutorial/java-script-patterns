const cityData = `city,population,area,density,country
Shanghai,24256800,6340,3826,China
Delhi,16787941,1484,11313,India
Lagos,16060303,1171,13712,Nigeria
Istanbul,14160467,5461,2593,Turkey
Tokyo,13513734,2191,6168,Japan
Sao Paulo,12038175,1521,7914,Brazil
Mexico City,8874724,1486,5974,Mexico
London,8673713,1572,5431,United Kingdom
New York City,8537673,784,10892,United States
Bangkok,8280925,1569,5279,Thailand`;

// Constants for table formatting
const COLUMN_WIDTHS = {
    city: 18,
    population: 10,
    area: 8,
    density: 8,
    country: 18,
    relativeDensity: 6
};

// Expected headers for validation
const EXPECTED_HEADERS = ['city', 'population', 'area', 'density', 'country'];

function validateNumber(value, fieldName) {
    const num = parseInt(value);
    if (isNaN(num) || num < 0) {
        throw new Error(`Invalid ${fieldName}: ${value}`);
    }
    return num;
}

function parseCSVData(data) {
    if (!data || typeof data !== 'string') {
        throw new Error('Invalid input: data must be a non-empty string');
    }
    
    const lines = data.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
        throw new Error('Invalid input: data must contain at least a header and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const missingHeaders = EXPECTED_HEADERS.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }
    
    return lines.slice(1).map((line, index) => {
        const cells = line.split(',').map(cell => cell.trim());
        if (cells.length !== EXPECTED_HEADERS.length) {
            throw new Error(`Invalid data in row ${index + 1}: incorrect number of columns`);
        }

        return {
            city: cells[0],
            population: validateNumber(cells[1], 'population'),
            area: validateNumber(cells[2], 'area'),
            density: validateNumber(cells[3], 'density'),
            country: cells[4]
        };
    });
}

function calculateRelativeDensity(cities) {
    if (!cities.length) {
        throw new Error('No cities data provided for density calculation');
    }

    const maxDensity = Math.max(...cities.map(city => city.density));
    if (maxDensity === 0) {
        throw new Error('Invalid data: maximum density cannot be zero');
    }
    
    return cities.map(city => ({
        ...city,
        relativeDensity: Math.round((city.density * 100) / maxDensity)
    }));
}

function formatCityRow(city) {
    return [
        city.city.padEnd(COLUMN_WIDTHS.city),
        city.population.toLocaleString().padStart(COLUMN_WIDTHS.population),
        city.area.toLocaleString().padStart(COLUMN_WIDTHS.area),
        city.density.toLocaleString().padStart(COLUMN_WIDTHS.density),
        city.country.padStart(COLUMN_WIDTHS.country),
        city.relativeDensity.toString().padStart(COLUMN_WIDTHS.relativeDensity)
    ].join('');
}

function displayCityTable(cities) {
    if (!cities.length) {
        console.log('No data to display');
        return;
    }

    const header = [
        'City'.padEnd(COLUMN_WIDTHS.city),
        'Population'.padStart(COLUMN_WIDTHS.population),
        'Area'.padStart(COLUMN_WIDTHS.area),
        'Density'.padStart(COLUMN_WIDTHS.density),
        'Country'.padStart(COLUMN_WIDTHS.country),
        'Rel%'.padStart(COLUMN_WIDTHS.relativeDensity)
    ].join('');
    
    const separator = '-'.repeat(header.length);
    
    console.log(header);
    console.log(separator);
    
    cities.forEach(city => console.log(formatCityRow(city)));
}

function main() {
    try {
        const cities = parseCSVData(cityData);
        const citiesWithRelativeDensity = calculateRelativeDensity(cities);
        const sortedCities = [...citiesWithRelativeDensity].sort((a, b) => b.relativeDensity - a.relativeDensity);
        displayCityTable(sortedCities);
    } catch (error) {
        console.error('Error processing city data:', error.message);
        process.exit(1);
    }
}

main();