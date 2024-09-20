// Función para generar el mapa del estacionamiento
function generateMapLayout() {
    const TOTAL_SPACES = 72;
    const COLUMNS = 18;  // Cantidad de columnas
    const ROWS = TOTAL_SPACES / COLUMNS;  // Cantidad de filas
    let layout = [];
    let spaceNumber = 1;

    for (let i = 0; i < TOTAL_SPACES; i++) {
        let row = Math.floor(i / COLUMNS);
        let col = i % COLUMNS;

        if (i === 0) {
            layout.push('entrada');
        } else if (col === COLUMNS - 1 && row >= ROWS - 4) {
            layout.push('space' + spaceNumber); 
            spaceNumber++;
        } else if (col === 1 || col === COLUMNS - 2 || row === 0 || row === ROWS - 1) {
            layout.push('pasillo');
        }
           else {
            layout.push('space' + spaceNumber);
            spaceNumber++;
        }
    }
    return layout;
}

// Renderización del mapa del estacionamiento
function renderParkingMap(MAP_LAYOUT, parkingSpaces) {
    const parkingMap = document.getElementById('parkingMap');
    parkingMap.innerHTML = '';

    MAP_LAYOUT.forEach((layoutType, index) => {
        const space = document.createElement('div');
        space.classList.add('parking-space');

        if (layoutType.startsWith('space')) {  // Verificar si es un espacio de estacionamiento
            space.classList.add(parkingSpaces[index]?.occupied ? 'occupied' : 'available');
            let spaceNumber = layoutType.replace('space', ''); // Extraer el número de espacio
            space.textContent = `${spaceNumber}`;
            
            if (parkingSpaces[index]?.occupied) {
                const license = document.createElement('div');
                license.classList.add('license-plate');
                license.textContent = parkingSpaces[index].licensePlate;

                // Mostrar la patente como fondo
                const licenseBackground = document.createElement('div');
                licenseBackground.classList.add('license-background');
                licenseBackground.textContent = parkingSpaces[index].licensePlate;
                space.appendChild(licenseBackground);  
                space.appendChild(license);  

                // Calcular cuánto tiempo ha estado estacionado
                const parkedTime = Math.floor((new Date().getTime() - parkingSpaces[index].startTime) / (1000 * 60 * 60)); // En horas
                const parkedTimeDisplay = parkedTime > 0 ? `${parkedTime} hrs` : 'Menos de 1 hr';

                // Mostrar patente y tiempo en el tooltip al pasar el mouse
                space.setAttribute('title', `Patente: ${parkingSpaces[index].licensePlate}\nEstacionado: ${parkedTimeDisplay}`);
            }

            space.addEventListener('click', () => {
                if (parkingSpaces[index]?.occupied) {
                    Swal.fire({
                        title: `Espacio ${spaceNumber}`,
                        text: `Patente: ${parkingSpaces[index].licensePlate}\n¿Desea liberar este espacio?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, liberar',
                        cancelButtonText: 'Cancelar'
                    }).then(result => {
                        if (result.isConfirmed) {
                            leaveParking(index);  // Asegurarse de liberar correctamente el espacio
                        }
                    });
                } else {
                    parkCar(index); // Asegurarse de estacionar correctamente
                }
            });
        } else if (layoutType === 'pasillo') {
            space.classList.add('pasillo');
        } else if (layoutType === 'entrada') {
            space.classList.add('entrada');
            space.textContent = 'Entrada';
        } else if (layoutType === 'salida') {
            space.classList.add('salida');
            space.textContent = 'Salida';
        }
        parkingMap.appendChild(space);
    });
}
