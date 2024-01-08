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
            item.style.zIndex = index === currentIndex ? 2 : 1;

            const isVisible = Math.abs(distance) <= 1 || (index === 0 && currentIndex === totalItems - 1) || (index === totalItems - 1 && currentIndex === 0);
            item.classList.toggle('hidden', !isVisible);
            item.classList.toggle('active', index === currentIndex);

            item.classList.remove('left-slide', 'right-slide');
            if (distance === 1 || (currentIndex === totalItems - 1 && index === 0)) {
                item.classList.add('right-slide');
            } else if (distance === -1 || (currentIndex === 0 && index === totalItems - 1)) {
                item.classList.add('left-slide');
            }
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

    updateSlider();
});


/********************************ANIMATION******************************/

const animItems = document.querySelectorAll('._anim-items');

if(animItems.length > 0) {
    window.addEventListener('scroll' , animOnScroll)

    function animOnScroll(params){
        for(let index=0; index<animItems.length; index++){
            const animItem = animItems[index];
            const animItemHight = animItem.offsetHeight;
            const animItemOffSet = offset(animItem).top;
            const animStart = 4;

            let animItemPoint = window.innerHeight - animItemHight / animStart;

            if(animItemHight > window.innerHeight){
                animItemPoint = window.innerHeight - window.innerHeight / animStart;
            }

            if((pageYOffset > animItemOffSet-animItemPoint) && pageYOffset < (animItemOffSet + animItemHight)){
                animItem.classList.add('_view');
            }  else {
                if(!animItem.classList.contains('_anim-no-hide')){
                    animItem.classList.remove('_view');
                }
            }
        }

        function offset(el) {
            var rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
        }
    }
    setTimeout(() => {
        animOnScroll();
    }, 300);

}
