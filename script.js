document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos del DOM
    const body = document.body; // Referencia al body
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

    // 4. Gestión de Vistas (Main y Config) - LÓGICA DE SCROLL AÑADIDA
    function toggleView() {
        isConfigView = !isConfigView;

        if (isConfigView) {
            // TRANSICIÓN A VISTA DE CONFIGURACIÓN (Main -> Config)
            body.classList.add('scrollable-config'); // HABILITAR SCROLL

            configView.style.display = 'block';
            mainView.classList.add('hidden'); 
            
            setTimeout(() => {
                configView.classList.remove('hidden');
            }, 10);
            
            setTimeout(() => {
                mainView.style.display = 'none';
                toggleConfigBtn.textContent = '❌'; 
                toggleConfigBtn.style.fontSize = '1.2em';
                toggleConfigBtn.style.lineHeight = '1';
            }, transitionDuration + 10); 

        } else {
            // TRANSICIÓN A VISTA PRINCIPAL (Config -> Main)
            body.classList.remove('scrollable-config'); // DESHABILITAR SCROLL

            mainView.style.display = 'block';
            configView.classList.add('hidden');
            
            setTimeout(() => {
                mainView.classList.remove('hidden');
            }, 10);
            
            setTimeout(() => {
                configView.style.display = 'none';
                toggleConfigBtn.textContent = '•'; 
                toggleConfigBtn.style.fontSize = '2em';
                toggleConfigBtn.style.lineHeight = '0.5';
            }, transitionDuration + 10); 
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
    // Aseguramos que el scroll esté deshabilitado por defecto
    body.classList.remove('scrollable-config');

});
