document.addEventListener('DOMContentLoaded', function () {
    let currentIndex = 1;
    let startX = 0;
    let isDragging = false;

    const slider = document.querySelector('.prize__slider');
    const items = document.querySelectorAll('.prize__item');
    const totalItems = items.length;

    function updateSlider() {
        items.forEach((item, index) => {
            const distance = index - currentIndex;
            let newPosition = distance * 33.33;

            if (distance > totalItems / 2) {
                newPosition -= totalItems * 33.33;
            } else if (distance < -totalItems / 2) {
                newPosition += totalItems * 33.33;
            }

            const scale = index === currentIndex ? 1 : 0.8;

            item.style.transform = `translateX(${newPosition}%) scale(${scale})`;
            //item.style.margin = `0 -500px`;
            item.style.zIndex = index === currentIndex ? 2 : 1;

            const isVisible = Math.abs(distance) <= 1 || (index === 0 && currentIndex === totalItems - 1) || (index === totalItems - 1 && currentIndex === 0);
            item.classList.toggle('hidden', !isVisible);
            item.classList.toggle('active', index === currentIndex);
        });
    }

    function moveSlider(offset) {
        currentIndex = (currentIndex + offset + totalItems) % totalItems;
        updateSlider();
    }

    function handleStart(event) {
        isDragging = true;
        startX = event.clientX || event.touches[0].clientX;
    }

    function handleMove(event) {
        if (!isDragging) return;

        const currentX = event.clientX || event.touches[0].clientX;
        const diffX = currentX - startX;

        if (Math.abs(diffX) > 50) {
            moveSlider(diffX > 0 ? -1 : 1);
            isDragging = false;
        }
    }

    function handleEnd() {
        isDragging = false;
    }

    const buttonsLeft = document.querySelectorAll('.button-slider-left')
    const buttonsRight = document.querySelectorAll('.button-slider-right')
    buttonsLeft.forEach(btn  => {
        btn.addEventListener('click', () => {
            moveSlider(-1);
        })
    })
    buttonsRight.forEach(btn  => {
        btn.addEventListener('click', () => {
            moveSlider(1);
        })
    })

    slider.addEventListener('mousedown', handleStart);
    slider.addEventListener('touchstart', handleStart);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);

    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    updateSlider(); // Инициализация слайдера
});
