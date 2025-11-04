document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del DOM
    const mainView = document.getElementById('main-view');
    const configView = document.getElementById('config-view');
    const toggleConfigBtn = document.getElementById('toggle-config-btn');
    const countdownTitle = document.getElementById('countdown-title');
    const countdownDays = document.getElementById('countdown-days');
    
    const inputTitle = document.getElementById('input-title');
    const inputDate = document.getElementById('input-date');
    const saveConfigBtn = document.getElementById('save-config-btn');

    // Valores por defecto
    const DEFAULT_TITLE = "Nuevo Evento Importante";
    const DEFAULT_DATE = new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

    // Variables de control
    let isConfigView = false;
    const transitionDuration = 300; // Debe coincidir con el CSS

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
        countdownTitle.textContent = title;

        const targetDate = new Date(date + 'T00:00:00'); 
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const timeDifference = targetDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        
        if (daysRemaining > 0) {
            countdownDays.textContent = `${daysRemaining} ${daysRemaining === 1 ? 'Día' : 'Días'}`;
        } else if (daysRemaining === 0) {
            countdownDays.textContent = `¡Hoy!`;
        } else {
            const daysSince = Math.abs(daysRemaining);
            countdownDays.textContent = `Pasó hace ${daysSince} ${daysSince === 1 ? 'Día' : 'Días'}`;
        }
    }

    // 4. Gestión de Vistas (Main y Config) - LÓGICA CORREGIDA
    function toggleView() {
        isConfigView = !isConfigView;

        if (isConfigView) {
            // TRANSICIÓN A VISTA DE CONFIGURACIÓN (Main -> Config)

            // 1. Mostrar estructura de Config inmediatamente (opacidad 0)
            configView.style.display = 'block';
            
            // 2. Ocultar Main (iniciar fade out)
            mainView.classList.add('hidden'); 
            
            // 3. Mostrar Config (iniciar fade in) después de un pequeño retraso
            setTimeout(() => {
                configView.classList.remove('hidden');
            }, 10);
            
            // 4. Ocultar Main completamente después de que su fade out termine
            setTimeout(() => {
                mainView.style.display = 'none';
                // Cambiar botón a 'X' para cerrar
                toggleConfigBtn.textContent = '❌'; 
                toggleConfigBtn.style.fontSize = '1.2em';
                toggleConfigBtn.style.lineHeight = '1';
            }, transitionDuration + 10); // 310ms

        } else {
            // TRANSICIÓN A VISTA PRINCIPAL (Config -> Main)

            // 1. Mostrar estructura de Main inmediatamente (opacidad 0)
            mainView.style.display = 'block';

            // 2. Ocultar Config (iniciar fade out)
            configView.classList.add('hidden');
            
            // 3. Mostrar Main (iniciar fade in) después de un pequeño retraso
            setTimeout(() => {
                mainView.classList.remove('hidden');
            }, 10);
            
            // 4. Ocultar Config completamente después de que su fade out termine
            setTimeout(() => {
                configView.style.display = 'none';
                // Cambiar botón a '•' para abrir config
                toggleConfigBtn.textContent = '•'; 
                toggleConfigBtn.style.fontSize = '2em';
                toggleConfigBtn.style.lineHeight = '0.5';
            }, transitionDuration + 10); // 310ms
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


    // Inicialización: Cargar configuración inicial y asegurar el estado visual
    updateCountdown();
    setInterval(updateCountdown, 1000 * 60 * 60); 
    
    // Asegurar el estado inicial: Principal visible, Config oculta
    mainView.style.display = 'block';
    configView.style.display = 'none';
    mainView.classList.remove('hidden');
    configView.classList.add('hidden');

});
