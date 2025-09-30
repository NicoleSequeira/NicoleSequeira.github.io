let previous = document.getElementById('previous');
let next = document.getElementById('next');
let images = document.querySelectorAll('.carousel-images img');
console.log(images);
let index = 0;
let carousel = document.querySelector('.carousel-images')
console.log(carousel);

previous.addEventListener('click', () => {
    console.log("Previous clicked")
    if (index === 0) {
        index = images.length - 1;
    } else {
        index = index - 1;
    }
    carousel.style.transform = `translateX(-${index * 600}px)`;
    console.log(index);
})

next.addEventListener('click', () => {
    console.log("Next clicked")
    if (index === images.length - 1) {
        index = 0;
    } else {
        index = index + 1;
    }
    carousel.style.transform = `translateX(-${index * 600}px)`;
    console.log(index);

})

// Lightbox functionality for grid gallery
const gridImages = document.querySelectorAll('.grid-img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');

gridImages.forEach(img => {
    img.addEventListener('click', () => {
        lightbox.classList.add('active');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
    }
});