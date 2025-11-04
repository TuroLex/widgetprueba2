document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del DOM
    const mainView = document.getElementById('main-view');
    const configView = document.getElementById('config-view');
    const toggleConfigBtn = document.getElementById('toggle-config-btn');
    const countdownTitle = document.getElementById('countdown-title');
    const countdownDays = document.getElementById('countdown-days');
    
    // Eliminado: const countdownInfo = document.getElementById('countdown-info');

    const inputTitle = document.getElementById('input-title');
    const inputDate = document.getElementById('input-date');
    const saveConfigBtn = document.getElementById('save-config-btn');

    // Valores por defecto
    const DEFAULT_TITLE = "Nuevo Evento Importante";
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
        const targetDate = new Date(date + 'T00:00:00'); 
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const timeDifference = targetDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        
        if (daysRemaining > 0) {
            // Caso normal: Días restantes
            countdownDays.textContent = `${daysRemaining} ${daysRemaining === 1 ? 'Día' : 'Días'}`;
            
        } else if (daysRemaining === 0) {
            // Caso especial: Hoy es el día
            countdownDays.textContent = `¡Hoy!`;
            
        } else {
            // Caso pasado: Evento ya pasado
            const daysSince = Math.abs(daysRemaining);
            countdownDays.textContent = `Pasó hace ${daysSince} ${daysSince === 1 ? 'Día' : 'Días'}`;
        }
        
        // El elemento 'countdown-info' ha sido eliminado, por lo que no se hace referencia aquí.
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
                toggleConfigBtn.textContent = '❌'; // Se usa una 'X' simple para cerrar config
                toggleConfigBtn.style.fontSize = '1.2em'; // Ajuste de tamaño para la 'X'
                toggleConfigBtn.style.lineHeight = '1';
            }, 10); 
        } else {
            // Mostrar Main, Ocultar Config
            configView.classList.add('hidden');
            mainView.classList.remove('hidden');
            toggleConfigBtn.textContent = '•'; // Vuelve al punto
            toggleConfigBtn.style.fontSize = '2em'; // Ajuste de tamaño para el punto
            toggleConfigBtn.style.lineHeight = '0.5';
            setTimeout(() => {
                configView.style.display = 'none';
                mainView.style.display = 'block';
            }, 300); 
        }
        
        // Cargar los valores actuales en los inputs de configuración
        const { title, date } = loadConfig();
        inputTitle.value = title;
        inputDate.value = date;
    }
    
    // 5. Event Listeners
    toggleConfigBtn.addEventListener('click', toggleView);

    saveConfigBtn.addEventListener('click', () => {
        const newTitle = inputTitle.value.trim() || DEFAULT_TITLE;
        const newDate = inputDate.value;
        
        if (!newDate) {
            alert('Por favor, selecciona una fecha válida.');
            return;
        }

        saveConfig(newTitle, newDate);
        updateCountdown(); 
        toggleView();      
    });


    // Inicialización: Cargar configuración inicial y poner en marcha el contador
    updateCountdown();
    setInterval(updateCountdown, 1000 * 60 * 60); 
});
