let MAP_LAYOUT = [];
let parkingSpaces = [];
let HOURLY_RATE = 0;

document.addEventListener('DOMContentLoaded', () => {
    async function init() {
        try {
            // Cargar datos del localStorage o del archivo JSON
            const storedData = localStorage.getItem('parkingData');
            if (storedData) {
                const data = JSON.parse(storedData);
                parkingSpaces = data.spaces || Array(72).fill(null);
                HOURLY_RATE = data.hourlyRate || 50;
            } else {
                const response = await fetch('./json/parkingData.json');
                if (!response.ok) throw new Error('No se pudo cargar los datos del estacionamiento.');
                const data = await response.json();

                parkingSpaces = data.spaces || Array(72).fill(null); // Si no hay datos en JSON, llenar con espacios vacíos
                HOURLY_RATE = data.hourlyRate || 50; // Valor por defecto si no hay tarifa en el JSON
            }

            MAP_LAYOUT = generateMapLayout();
            renderParkingMap(MAP_LAYOUT, parkingSpaces);

            // Estacionar coche desde botón del header
            document.getElementById('parkCarButton').addEventListener('click', async () => {
                let availableIndex = getRandomAvailableSpace();
                if (availableIndex === null) {
                    Swal.fire('No hay espacios disponibles.');
                    return;
                }
                await parkCar(availableIndex);
                renderParkingMap(MAP_LAYOUT, parkingSpaces); // Actualizar visualmente después de estacionar
            });

// Agregar evento de teclado para escuchar "Enter"
document.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        await parkCarIfAvailable(); // Llama a la función para estacionar el coche si hay espacio
    }
});
    

            // Liberar espacio desde botón del header
            document.getElementById('leaveParkingButton').addEventListener('click', async () => {
                const result = await Swal.fire({
                    title: 'Liberar Espacio',
                    input: 'text',
                    inputLabel: 'Ingrese la patente del vehículo:',
                    inputPlaceholder: 'Ej. ABC123',
                    showCancelButton: true,
                    inputValidator: (value) => {
                        if (!value) {
                            return '¡Debe ingresar una patente válida!';
                        }
                    }
                });

                if (result.isConfirmed) {
                    let spaceIndex = parkingSpaces.findIndex(space => space?.licensePlate === result.value.toUpperCase());
                    if (spaceIndex !== -1) {
                        await leaveParking(spaceIndex); // Llamamos correctamente a la función leaveParking
                    } else {
                        await Swal.fire('Patente no encontrada.');
                    }
                }
            });

     // Reiniciar el estacionamiento
document.getElementById('resetButton').addEventListener('click', async () => {
    const result = await Swal.fire({
        title: '¿Reiniciar estacionamiento?',
        text: "Se liberarán todos los espacios.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, reiniciar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        parkingSpaces = Array(72).fill(null); 
        localStorage.removeItem('parkingData'); 
        renderParkingMap(MAP_LAYOUT, parkingSpaces); 
        Swal.fire('El estacionamiento ha sido reiniciado.');
    }
});

        } catch (error) {
            console.error('Error en la inicialización:', error);
            Swal.fire('Error', 'No se pudo cargar el estacionamiento.', 'error');
        }
    }

    init();
});

// Función para estacionar un coche
function parkCar(spaceIndex) {
    return Swal.fire({
        title: 'Estacionar Coche',
        input: 'text',
        inputLabel: 'Ingrese la patente del vehículo (XXX000):',
        inputPlaceholder: 'Ej. ABC123',
        showCancelButton: true,
        inputValidator: (value) => {
            const patenteRegex = /^[A-Z]{3}\d{3}$/; // Expresión regular para 3 letras y 3 números
            if (!value) {
                return '¡Debe ingresar una patente!';
            } else if (!patenteRegex.test(value.toUpperCase())) {
                return 'La patente debe tener el formato de 3 letras y 3 números (Ej. ABC123).';
            } else if (parkingSpaces.some(space => space?.licensePlate === value.toUpperCase())) {
                return 'Ya hay un auto con esa patente estacionado.';
            }
        }
    }).then(result => {
        if (result.isConfirmed) {
            parkingSpaces[spaceIndex] = {
                occupied: true,
                licensePlate: result.value.toUpperCase(),
                startTime: new Date().getTime()
            };
            saveToLocalStorage();
            renderParkingMap(MAP_LAYOUT, parkingSpaces);
        }
    });
}

// Función para liberar un espacio
async function leaveParking(spaceIndex) {
    let endTime = new Date().getTime();
    let duration = (endTime - parkingSpaces[spaceIndex].startTime) / (1000 * 60 * 60); // Calcular duración en horas
    let totalAmount = Math.ceil(duration) * HOURLY_RATE;

    const confirm = await Swal.fire({
        title: `Total a pagar: $${totalAmount}`,
        text: `¿Desea liberar el espacio?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, liberar',
        cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
        parkingSpaces[spaceIndex] = null; // Liberar el espacio
        saveToLocalStorage();
        await Swal.fire('El espacio fue liberado.');
        renderParkingMap(MAP_LAYOUT, parkingSpaces); // Actualizar visualmente después de liberar el espacio
    }
}

// Guardar datos en localStorage
function saveToLocalStorage() {
    const data = {
        spaces: parkingSpaces,
        hourlyRate: HOURLY_RATE
    };
    localStorage.setItem('parkingData', JSON.stringify(data));
}

function getRandomAvailableSpace() {
    
    const invalidSpaces = [
        0,    // Entrada
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,  
        19, 37, 55,   
        34, 52, 70,   
        54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71   
    ];

    // Filtrar los espacios disponibles
    let availableSpaces = parkingSpaces
        .map((space, index) => {
            // Verificar que el espacio esté vacío y que no sea inválido
            return (space === null && !invalidSpaces.includes(index)) ? index : null;
        })
        .filter(index => index !== null); // Filtrar los nulos (espacios no disponibles)

    // Devolver un espacio aleatorio disponible
    return availableSpaces.length > 0 ? availableSpaces[Math.floor(Math.random() * availableSpaces.length)] : null;
}