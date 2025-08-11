const vehiculos = {
    compacto: [
        { imagen: "Compacto1.png", descripcion: "KIA PICANTO, Año 2016" },
        { imagen: "Compacto2.png", descripcion: "FORD FIESTA ST, Año 2015" },
        { imagen: "Compacto3.png", descripcion: "PEUGEOT 308, Año 2018" }
    ],
    mediano: [
        { imagen: "Mediano1.png", descripcion: "HONDA CITY CAR, Año 2017" },
        { imagen: "Mediano2.png", descripcion: "MERCEDES SLS, Año 2015" },
        { imagen: "Mediano3.png", descripcion: "FORD FIESTA ST, Año 2016" }
    ],
    todoTerreno: [
        { imagen: "TodoTerreno1.png", descripcion: "TOYOTA FJ CRUISER, Año 2016" },
        { imagen: "TodoTerreno2.png", descripcion: "TOYOTA Prado, Año 2018" },
        { imagen: "TodoTerreno3.png", descripcion: "NISSAN JUKE, Año 2017" }
    ],
    familiar: [
        { imagen: "Familiar1.png", descripcion: "TOYOTA SIENNA, Año 2018" },
        { imagen: "Familiar2.png", descripcion: "DODGE GRAND CARAVANE, Año 2015" },
        { imagen: "Familiar3.png", descripcion: "HYUNDAI ELANTRA, Año 2016" }
    ]
};

let tipoActual = 'compacto';

function mostrarTodo() {
    const selectTipo = document.getElementById('tipoVehiculo');
    const valorSeleccionado = selectTipo.options[selectTipo.selectedIndex].id;
    
    switch(valorSeleccionado) {
        case 'COM':
            tipoActual = 'compacto';
            break;
        case 'MED':
            tipoActual = 'mediano';
            break;
        case '4WD':
            tipoActual = 'todoTerreno';
            break;
        case 'FAM':
            tipoActual = 'familiar';
            break;
        default:
            tipoActual = 'compacto';
    }
    
    cargarImagenes(tipoActual);
    
    mostrarImagen(1);
}

function cargarImagenes(tipo) {
    const vehiculosTipo = vehiculos[tipo];
    
    for(let i = 0; i < 3; i++) {
        const imgElement = document.getElementById(`img${i + 1}`);
        if(imgElement && vehiculosTipo[i]) {
            imgElement.src = `images/${vehiculosTipo[i].imagen}`;
        }
    }
}

function mostrarImagen(numero) {
    const vehiculosTipo = vehiculos[tipoActual];
    const indice = numero - 1;
    
    if(vehiculosTipo[indice]) {
        const imgVista = document.getElementById('imgVista');
        imgVista.src = `images/${vehiculosTipo[indice].imagen}`;
        
        const infTCar = document.getElementById('infTCar');
        infTCar.textContent = vehiculosTipo[indice].descripcion;
    }
}