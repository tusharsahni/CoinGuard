// Fetch countries and populate the dropdown
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const countryDropdown = document.getElementById('country');
                const countryCodeDropdown = document.getElementById('country-code');

                // Sort countries alphabetically
                data.sort((a, b) => a.name.common.localeCompare(b.name.common));

                data.forEach(country => {
                    // Add countries to the country dropdown
                    const countryOption = document.createElement('option');
                    countryOption.value = country.name.common;
                    countryOption.textContent = country.name.common;
                    countryDropdown.appendChild(countryOption);

                    // Add country codes to the country code dropdown
                    if (country.idd.root && country.idd.suffixes) {
                        country.idd.suffixes.forEach(suffix => {
                            const codeOption = document.createElement('option');
                            codeOption.value = `${country.idd.root}${suffix}`;
                            codeOption.textContent = `${country.name.common} (${country.idd.root}${suffix})`;
                            countryCodeDropdown.appendChild(codeOption);
                        });
                    }
                });
            })
            .catch(error => console.error('Error fetching countries:', error));