document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del DOM
    const mainView = document.getElementById('main-view');
    const configView = document.getElementById('config-view');
    const toggleConfigBtn = document.getElementById('toggle-config-btn');
    const countdownTitle = document.getElementById('countdown-title');
    const countdownDays = document.getElementById('countdown-days');
    const countdownInfo = document.getElementById('countdown-info');

    const inputTitle = document.getElementById('input-title');
    const inputDate = document.getElementById('input-date');
    const saveConfigBtn = document.getElementById('save-config-btn');

    // Valores por defecto
    const DEFAULT_TITLE = "Nuevo Evento Importante";
    // Formato YYYY-MM-DD
    const DEFAULT_DATE = new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

    // 2. Gestión de Persistencia (localStorage)
    function loadConfig() {
        const title = localStorage.getItem('countdownTitle') || DEFAULT_TITLE;
        const date = localStorage.getItem('countdownDate') || DEFAULT_DATE;
        return { title, date };
    }

    function saveConfig(title, date) {
        localStorage.setItem('countdownTitle', title);
        localStorage.setItem('countdownDate', date);
    }

    // 3. Lógica del Contador
    function updateCountdown() {
        const { title, date } = loadConfig();

        // Actualizar el título en la vista principal
        countdownTitle.textContent = title;

        // Calcular los días restantes
        const targetDate = new Date(date + 'T00:00:00'); // Añadir T00:00:00 para asegurar la hora de inicio
        const today = new Date();
        
        // Ajustar la hora de hoy para evitar problemas de zona horaria en el cálculo de días completos
        today.setHours(0, 0, 0, 0);

        const timeDifference = targetDate.getTime() - today.getTime();
        
        // La fórmula para días, redondeando hacia arriba para contar el día de hoy si aún no ha pasado
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        
        if (daysRemaining > 0) {
            countdownDays.textContent = `${daysRemaining} ${daysRemaining === 1 ? 'Día' : 'Días'}`;
            countdownInfo.textContent = 'restantes';
        } else if (daysRemaining === 0) {
            countdownDays.textContent = `¡Hoy!`;
            countdownInfo.textContent = title; // Muestra el título como info
        } else {
            // Evento ya pasado
            countdownDays.textContent = `Evento Pasado`;
            countdownInfo.textContent = `${Math.abs(daysRemaining)} días desde`;
        }
    }

    // 4. Gestión de Vistas (Main y Config)
    let isConfigView = false;

    function toggleView() {
        isConfigView = !isConfigView;

        if (isConfigView) {
            // Mostrar Config, Ocultar Main
            mainView.style.display = 'none';
            configView.style.display = 'block';
            setTimeout(() => {
                mainView.classList.add('hidden');
                configView.classList.remove('hidden');
                toggleConfigBtn.textContent = '❌'; // Icono para cerrar config
            }, 10); // Pequeño retraso para asegurar el 'display' antes de la transición
        } else {
            // Mostrar Main, Ocultar Config
            configView.classList.add('hidden');
            mainView.classList.remove('hidden');
            toggleConfigBtn.textContent = '⚙️'; // Icono para abrir config
            setTimeout(() => {
                configView.style.display = 'none';
                mainView.style.display = 'block';
            }, 300); // Esperar la transición CSS (0.3s)
        }
        
        // Cargar los valores actuales en los inputs de configuración
        const { title, date } = loadConfig();
        inputTitle.value = title;
        inputDate.value = date;
    }
    
    // 5. Event Listeners
    
    // Botón para cambiar de vista (Main <-> Config)
    toggleConfigBtn.addEventListener('click', toggleView);

    // Botón para guardar la configuración
    saveConfigBtn.addEventListener('click', () => {
        const newTitle = inputTitle.value.trim() || DEFAULT_TITLE;
        const newDate = inputDate.value;
        
        if (!newDate) {
            alert('Por favor, selecciona una fecha válida.');
            return;
        }

        saveConfig(newTitle, newDate);
        updateCountdown(); // Actualizar inmediatamente el contador
        toggleView();      // Volver a la vista principal
    });


    // Inicialización: Cargar configuración inicial y poner en marcha el contador
    updateCountdown();

    // Actualizar el contador cada hora (suficiente para la precisión en días)
    setInterval(updateCountdown, 1000 * 60 * 60); 
    
    // Si la página se recarga en la vista de config, asegurarse de que se carga correctamente
    if (isConfigView) {
        // Forzar la carga de la vista principal si no se manejó la sesión
        // En este diseño, siempre iniciamos en la vista principal para el incrustado.
        configView.style.display = 'none';
        configView.classList.add('hidden');
        mainView.style.display = 'block';
        mainView.classList.remove('hidden');
    }
});
