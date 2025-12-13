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
        isDown = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        win.style.zIndex = 1000;
    });

    document.addEventListener('mousemove', e => {
        if (!isDown) return;
        win.style.left = e.clientX - offsetX + 'px';
        win.style.top = e.clientY - offsetY + 'px';
        keepWindowInBounds(win);
    });

    document.addEventListener('mouseup', () => {
        isDown = false;
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
   =============================== */
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
