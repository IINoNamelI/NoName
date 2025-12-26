console.log('test');

/* ===============================
   УДЕРЖАНИЕ ОКНА В ГРАНИЦАХ
   =============================== */
function keepWindowInBounds(win) {
    const headHeight = document.querySelector('.head').offsetHeight;
    const maxLeft = window.innerWidth - win.offsetWidth;
    const maxTop = window.innerHeight - win.offsetHeight;

    if (win.offsetLeft < 0) win.style.left = '0px';
    if (win.offsetTop < headHeight) win.style.top = headHeight + 'px';
    if (win.offsetLeft > maxLeft) win.style.left = maxLeft + 'px';
    if (win.offsetTop > maxTop) win.style.top = maxTop + 'px';
}

/* ===============================
   ПЕРЕТАСКИВАНИЕ ОКОН
   =============================== */
const windows = document.querySelectorAll('.window');

windows.forEach(win => {
    const header = win.querySelector('.window-header');
    let offsetX = 0, offsetY = 0, isDown = false;

    header.addEventListener('mousedown', e => {
        // только левая кнопка мыши
        if (e.button !== 0) return;

        isDown = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        win.style.zIndex = 1000;
    });

    document.addEventListener('mousemove', e => {
        // кнопка должна быть зажата (левая)
        if (!isDown || (e.buttons & 1) === 0) return;

        win.style.left = e.clientX - offsetX + 'px';
        win.style.top = e.clientY - offsetY + 'px';
        keepWindowInBounds(win);
    });

    document.addEventListener('mouseup', e => {
        if (e.button === 0) {
            isDown = false;
        }
    });
});


/* ===============================
   СВОРАЧИВАНИЕ ОКОН
   =============================== */
const buttons = document.querySelectorAll('.head-buttons .btn');

buttons.forEach(btn => {
    const windowId = btn.dataset.window; // корректная привязка через data-window
    const win = document.getElementById(windowId);
    const btnMin = win.querySelector('.minimize');

    const toggleWindow = () => {
        const isHidden = win.style.display === 'none';
        if (isHidden) {
            win.style.display = 'block';
            btn.classList.remove('active');
        } else {
            win.style.display = 'none';
            btn.classList.add('active');
        }
    };

    btn.addEventListener('click', toggleWindow);
    btnMin.addEventListener('click', toggleWindow);
});

/* ===============================
   РЕСАЙЗ ОКОН
   =============================== */
windows.forEach(win => {
    const resizeHandle = win.querySelector('.window-resize-handle');
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', e => {
        e.stopPropagation();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = win.offsetWidth;
        startHeight = win.offsetHeight;
        win.style.zIndex = 1000;
    });

    document.addEventListener('mousemove', e => {
        if (!isResizing) return;

        let newWidth = startWidth + (e.clientX - startX);
        let newHeight = startHeight + (e.clientY - startY);

        if (newWidth > 200) win.style.width = newWidth + 'px';
        if (newHeight > 120) win.style.height = newHeight + 'px';
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
});

/* ===============================
   АДАПТАЦИЯ ПРИ RESIZE
   =============================== */
window.addEventListener('resize', () => {
    windows.forEach(win => {
        if (win.offsetWidth > window.innerWidth)
            win.style.width = (window.innerWidth - 20) + 'px';

        if (win.offsetHeight > window.innerHeight)
            win.style.height = (window.innerHeight - 20) + 'px';

        keepWindowInBounds(win);
    });
});



/* ===============================
   ЗАПРЕТЫ
   =============================== 
document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', e => {
    if (e.ctrlKey) {
        const forbidden = ['c', 's', 'u', 'a'];
        if (forbidden.includes(e.key.toLowerCase())) {
            e.preventDefault();
            alert('Данное действие запрещено!');
        }
    }
});
*/


/* ===============================
   ФОН АНИМИРОВНЫЙ
   =============================== */
const canvas = document.getElementById('grid');
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const points = [];
        const gridSize = 50;
        
        // Создаем точки сетки
        for (let x = 0; x < canvas.width; x += gridSize) {
            for (let y = 0; y < canvas.height; y += gridSize) {
                points.push({
                    x: x + Math.random() * gridSize,
                    y: y + Math.random() * gridSize,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    color: Math.random() > 0.5 ? '#0ff' : '#f0f'
                });
            }
        }
        
        function animateGrid() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Рисуем линии между близкими точками
            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const dx = points[i].x - points[j].x;
                    const dy = points[i].y - points[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = points[i].color;
                        ctx.globalAlpha = 1 - distance / 100;
                        ctx.lineWidth = 1;
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.stroke();
                    }
                }
                
                // Обновляем позиции точек
                points[i].x += points[i].vx;
                points[i].y += points[i].vy;
                
                // Отскок от границ
                if (points[i].x < 0 || points[i].x > canvas.width) points[i].vx *= -1;
                if (points[i].y < 0 || points[i].y > canvas.height) points[i].vy *= -1;
                
                // Рисуем точки
                ctx.beginPath();
                ctx.fillStyle = points[i].color;
                ctx.globalAlpha = 0.6;
                ctx.arc(points[i].x, points[i].y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            requestAnimationFrame(animateGrid);
        }
        
        animateGrid();



/* ===============================
   Контекстное меню
   =============================== */
const menu = document.getElementById('context-menu');

document.addEventListener('contextmenu', e => {
    e.preventDefault();
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';
    menu.style.display = 'block';
});

document.addEventListener('click', () => {
    menu.style.display = 'none';
});

document.getElementById('close-menu').onclick = () => {
    menu.style.display = 'none';
};

document.getElementById('download-cv').onclick = () => {
    window.location.href = 'err.html';
};


