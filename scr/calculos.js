// Función para mostrar mensaje del tipo de seguro
function MensajeTipoSeguro() {
    const seguroSelect = document.getElementById('seguro');
    const selectedOption = seguroSelect.options[seguroSelect.selectedIndex];
    
    let mensaje = '';
    
    switch(selectedOption.id) {
        case 'PBO':
            mensaje = "Protección Básica Obligatoria (PBO)\n\n" +
                     "Cubre daños al vehículo rentado y daños a vehículos terceros involucrados en un accidente de tránsito.\n\n" +
                     "Costo de alquiler diario: $ 5.45 por día.";
            break;
        case 'PED':
            mensaje = "Protección Extendida de Daños (PED)\n\n" +
                     "Cubre la Protección Básica Obligatoria (PBO) más daños a propiedades de terceros, incendio e inundaciones.\n\n" +
                     "Costo de alquiler diario: $ 9.50 por día.";
            break;
        case 'PGM':
            mensaje = "Protección Gasto Médicos (PGM)\n\n" +
                     "Cubre la Protección Extendida de Daños (PED) más gastos médicos para los ocupantes del vehículo.\n\n" +
                     "Costo de alquiler diario: $ 11.25 por día.";
            break;
    }
    
    alert(mensaje);
}

async function getCountryRegion(cca3) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${cca3}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const countries = await response.json();
        
        if (countries && countries.length > 0) {
            return countries[0].region;
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching country region:', error);
        return null;
    }
}

function calcularDias(fechaRetiro, fechaDevolucion) {
    const fecha1 = new Date(fechaRetiro);
    const fecha2 = new Date(fechaDevolucion);
    
    const diferenciaTiempo = fecha2.getTime() - fecha1.getTime();
    
    const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
    
    return diferenciaDias;
}

function obtenerDescuentoPorRegion(region) {
    switch(region) {
        case 'Americas':
        case 'Europe':
            return 0.10;
        case 'Africa':
            return 0.05;
        default:
            return 0;
    }
}

async function calcular() {
    try {
        const fechaRetiro = document.querySelector('input[name="fechaRetiro"]').value;
        const fechaDevolucion = document.querySelector('input[name="fechadevolucion"]').value;
        const nacionalidadSelect = document.getElementById('nacionalidad');
        const tipoVehiculoSelect = document.getElementById('tipoVehiculo');
        const seguroSelect = document.getElementById('seguro');
        
        if (!fechaRetiro || !fechaDevolucion) {
            alert('Por favor seleccione las fechas de retiro y devolución.');
            return;
        }
        
        const dias = calcularDias(fechaRetiro, fechaDevolucion);
        
        if (dias < 3 || dias > 365) {
            alert('Los días no son correctos. El período de alquiler debe estar entre 3 y 365 días.');
            return;
        }
        
        const tarifaVehiculo = parseFloat(tipoVehiculoSelect.value);
        
        let tarifaSeguro = 0;
        const selectedSeguro = seguroSelect.options[seguroSelect.selectedIndex];
        switch(selectedSeguro.id) {
            case 'PBO':
                tarifaSeguro = 5.45;
                break;
            case 'PED':
                tarifaSeguro = 9.50;
                break;
            case 'PGM':
                tarifaSeguro = 11.25;
                break;
        }
        
        let tarifaDiaria = tarifaVehiculo + tarifaSeguro;
        
        if (dias > 30 && dias < 120) {
            tarifaDiaria = tarifaDiaria * 0.85;
        } else if (dias >= 120 && dias <= 365) {
            tarifaDiaria = tarifaDiaria * 0.75;
        }
        
        const paisCodigo = nacionalidadSelect.value;
        const region = await getCountryRegion(paisCodigo);
        const descuentoRegion = obtenerDescuentoPorRegion(region);
        
        const subtotal = tarifaDiaria * dias;
        const totalPagar = subtotal - (subtotal * descuentoRegion);
        
        document.querySelector('input[name="dias"]').value = dias;
        document.querySelector('input[name="td"]').value = `$ ${tarifaDiaria.toFixed(2)}`;
        document.querySelector('input[name="totalPagar"]').value = `$ ${totalPagar.toFixed(2)}`;
        
    } catch (error) {
        console.error('Error en el cálculo:', error);
        alert('Ocurrió un error al realizar el cálculo. Por favor intente nuevamente.');
    }
}

function guardarCotizacion() {
    try {
        const fechaRetiro = document.querySelector('input[name="fechaRetiro"]').value;
        const fechaDevolucion = document.querySelector('input[name="fechadevolucion"]').value;
        const nacionalidadSelect = document.getElementById('nacionalidad');
        const tipoVehiculoSelect = document.getElementById('tipoVehiculo');
        const seguroSelect = document.getElementById('seguro');
        const dias = document.querySelector('input[name="dias"]').value;
        const tarifaDiaria = document.querySelector('input[name="td"]').value;
        const totalPagar = document.querySelector('input[name="totalPagar"]').value;
        
        if (!dias || !tarifaDiaria || !totalPagar) {
            alert('Por favor realice el cálculo antes de guardar la cotización.');
            return;
        }
        
        const cotizacion = {
            fechaRetiro: fechaRetiro,
            fechaDevolucion: fechaDevolucion,
            nacionalidad: {
                codigo: nacionalidadSelect.value,
                nombre: nacionalidadSelect.options[nacionalidadSelect.selectedIndex].text
            },
            tipoVehiculo: {
                codigo: tipoVehiculoSelect.options[tipoVehiculoSelect.selectedIndex].id,
                nombre: tipoVehiculoSelect.options[tipoVehiculoSelect.selectedIndex].text,
                valor: tipoVehiculoSelect.value
            },
            seguro: {
                codigo: seguroSelect.options[seguroSelect.selectedIndex].id,
                nombre: seguroSelect.options[seguroSelect.selectedIndex].text,
                valor: seguroSelect.value
            },
            resultados: {
                dias: dias,
                tarifaDiaria: tarifaDiaria,
                totalPagar: totalPagar
            },
            fechaGuardado: new Date().toISOString()
        };
        
        localStorage.setItem('ultimaCotizacion', JSON.stringify(cotizacion));
        
        alert('Cotización guardada exitosamente.');
        
    } catch (error) {
        console.error('Error al guardar cotización:', error);
        alert('Error al guardar la cotización. Por favor intente nuevamente.');
    }
}

function cargarUltimaCotizacion() {
    try {
        const ultimaCotizacion = localStorage.getItem('ultimaCotizacion');
        
        if (ultimaCotizacion) {
            const cotizacion = JSON.parse(ultimaCotizacion);
            
            document.querySelector('input[name="fechaRetiro"]').value = cotizacion.fechaRetiro || '';
            document.querySelector('input[name="fechadevolucion"]').value = cotizacion.fechaDevolucion || '';
            
            const nacionalidadSelect = document.getElementById('nacionalidad');
            if (nacionalidadSelect && cotizacion.nacionalidad) {
                nacionalidadSelect.value = cotizacion.nacionalidad.codigo;
            }
            
            const tipoVehiculoSelect = document.getElementById('tipoVehiculo');
            if (tipoVehiculoSelect && cotizacion.tipoVehiculo) {
                tipoVehiculoSelect.value = cotizacion.tipoVehiculo.valor;
            }
            
            const seguroSelect = document.getElementById('seguro');
            if (seguroSelect && cotizacion.seguro) {
                seguroSelect.value = cotizacion.seguro.valor;
            }
            
            if (cotizacion.resultados) {
                document.querySelector('input[name="dias"]').value = cotizacion.resultados.dias || '';
                document.querySelector('input[name="td"]').value = cotizacion.resultados.tarifaDiaria || '';
                document.querySelector('input[name="totalPagar"]').value = cotizacion.resultados.totalPagar || '';
            }
            
            console.log('Última cotización cargada exitosamente.');
        }
        
    } catch (error) {
        console.error('Error al cargar última cotización:', error);
    }
}

function limpiarCotizacion() {
    try {
        localStorage.removeItem('ultimaCotizacion');
        
        document.querySelector('input[name="fechaRetiro"]').value = '';
        document.querySelector('input[name="fechadevolucion"]').value = '';
        document.querySelector('input[name="dias"]').value = '';
        document.querySelector('input[name="td"]').value = '';
        document.querySelector('input[name="totalPagar"]').value = '';
        
        document.getElementById('tipoVehiculo').selectedIndex = 0;
        document.getElementById('seguro').selectedIndex = 0;
        
        alert('Cotización limpiada exitosamente.');
        
    } catch (error) {
        console.error('Error al limpiar cotización:', error);
        alert('Error al limpiar la cotización.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const calcularBtn = document.querySelector('input[type="button"][value="Calcular"]');
    if (calcularBtn) {
        calcularBtn.addEventListener('click', calcular);
    }
    
    const guardarBtn = document.querySelector('input[type="button"][value="Guardar"]');
    if (guardarBtn) {
        guardarBtn.addEventListener('click', guardarCotizacion);
    }
    
    cargarUltimaCotizacion();
});