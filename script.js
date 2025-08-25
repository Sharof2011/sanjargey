const date = new Date ()
// const hour = date.getDate
// const minuts = 
const secunt = date.getSeconds
  // Global variables
        let is24Hour = true;
        let stopwatchInterval;
        let stopwatchTime = 0;
        let isStopwatchRunning = false;
        
        // Uzbek month and day names
        const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
        const weekdays = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
        
        // Update clock function
        function updateClock() {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            let period = '';
            
            if (!is24Hour) {
                period = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
            }
            
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            document.getElementById('time').textContent = timeString;
            document.getElementById('period').textContent = period;
            
            // Update date
            const day = now.getDate();
            const month = months[now.getMonth()];
            const year = now.getFullYear();
            const weekday = weekdays[now.getDay()];
            
            document.getElementById('date').textContent = `${weekday}, ${day} ${month} ${year}`;
            document.getElementById('weekday').textContent = weekday;
            document.getElementById('year').textContent = year;
            
            // Calculate day of year
            const start = new Date(year, 0, 0);
            const diff = now - start;
            const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
            document.getElementById('dayOfYear').textContent = dayOfYear;
            
            // Update footer stats
            document.getElementById('currentHour').textContent = now.getHours().toString().padStart(2, '0');
            document.getElementById('currentDay').textContent = day;
            
            // Calculate week number
            const weekNumber = Math.ceil(dayOfYear / 7);
            document.getElementById('weekNumber').textContent = weekNumber;
            
            // Update progress ring (percentage of day completed)
            const totalMinutesInDay = 24 * 60;
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const percentage = Math.round((currentMinutes / totalMinutesInDay) * 100);
            
            const progressRing = document.getElementById('timeProgress');
            progressRing.style.setProperty('--value', percentage);
            document.getElementById('progressPercent').textContent = `${percentage}%`;
        }
        
        // Format toggle
        document.getElementById('formatToggle').addEventListener('click', function() {
            is24Hour = !is24Hour;
            const icon = is24Hour ? '🕐' : '🕕';
            const text = is24Hour ? '24 Soatlik Format' : '12 Soatlik Format';
            this.innerHTML = `<span class="text-lg">${icon}</span> ${text}`;
            updateClock();
        });
        
        // Alarm functionality
        document.getElementById('alarmBtn').addEventListener('click', function() {
            const alarmTime = prompt('Signal vaqtini kiriting (HH:MM formatida):');
            if (alarmTime) {
                // Visual feedback
                this.innerHTML = '<span class="text-lg">✅</span> Signal o\'rnatildi';
                this.classList.remove('btn-success');
                this.classList.add('btn-info');
                
                setTimeout(() => {
                    this.innerHTML = '<span class="text-lg">🔔</span> Signal';
                    this.classList.remove('btn-info');
                    this.classList.add('btn-success');
                }, 3000);
                
                // Show toast notification
                showToast(`Signal ${alarmTime} da o'rnatildi!`, 'success');
            }
        });
        
        // Stopwatch functionality
        document.getElementById('stopwatchBtn').addEventListener('click', function() {
            const panel = document.getElementById('stopwatchPanel');
            panel.classList.toggle('hidden');
            
            if (!panel.classList.contains('hidden')) {
                this.innerHTML = '<span class="text-lg">❌</span> Yopish';
                this.classList.remove('btn-warning');
                this.classList.add('btn-error');
            } else {
                this.innerHTML = '<span class="text-lg">⏱️</span> Sekundomer';
                this.classList.remove('btn-error');
                this.classList.add('btn-warning');
            }
        });
        
        // Stopwatch controls
        document.getElementById('startStopwatch').addEventListener('click', function() {
            if (!isStopwatchRunning) {
                isStopwatchRunning = true;
                this.innerHTML = '<span class="text-lg">⏸️</span> To\'xtatish';
                this.classList.remove('btn-success');
                this.classList.add('btn-warning');
                
                stopwatchInterval = setInterval(function() {
                    stopwatchTime++;
                    updateStopwatchDisplay();
                }, 10);
            } else {
                isStopwatchRunning = false;
                clearInterval(stopwatchInterval);
                this.innerHTML = '<span class="text-lg">▶️</span> Davom ettirish';
                this.classList.remove('btn-warning');
                this.classList.add('btn-success');
            }
        });
        
        document.getElementById('pauseStopwatch').addEventListener('click', function() {
            if (isStopwatchRunning) {
                isStopwatchRunning = false;
                clearInterval(stopwatchInterval);
                
                const startBtn = document.getElementById('startStopwatch');
                startBtn.innerHTML = '<span class="text-lg">▶️</span> Davom ettirish';
                startBtn.classList.remove('btn-warning');
                startBtn.classList.add('btn-success');
            }
        });
        
        document.getElementById('resetStopwatch').addEventListener('click', function() {
            isStopwatchRunning = false;
            clearInterval(stopwatchInterval);
            stopwatchTime = 0;
            updateStopwatchDisplay();
            
            const startBtn = document.getElementById('startStopwatch');
            startBtn.innerHTML = '<span class="text-lg">▶️</span> Boshlash';
            startBtn.classList.remove('btn-warning');
            startBtn.classList.add('btn-success');
            
            showToast('Sekundomer reset qilindi', 'info');
        });
        
        function updateStopwatchDisplay() {
            const centiseconds = stopwatchTime % 100;
            const seconds = Math.floor(stopwatchTime / 100) % 60;
            const minutes = Math.floor(stopwatchTime / 6000) % 60;
            const hours = Math.floor(stopwatchTime / 360000);
            
            const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
            document.getElementById('stopwatchDisplay').textContent = display;
        }
        
        // Theme switching
        document.querySelectorAll('[data-theme]').forEach(btn => {
            btn.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                document.documentElement.setAttribute('data-theme', theme);
                
                // Visual feedback
                this.classList.add('btn-active');
                setTimeout(() => {
                    this.classList.remove('btn-active');
                }, 500);
                
                showToast(`${theme} temasiga o'tkazildi`, 'success');
            });
        });
        
        // Toast notification function
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast toast-top toast-center`;
            toast.innerHTML = `
                <div class="alert alert-${type}">
                    <span>${message}</span>
                </div>
            `;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
        
        // Initialize everything
        function init() {
            updateClock();
            setInterval(updateClock, 1000);
            showToast('Premium soat ishga tushdi!', 'success');
        }
        
        // Start when page loads
        document.addEventListener('DOMContentLoaded', init);