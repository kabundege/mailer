const canvas = document.querySelector('.parent')

const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

const mouse = {
    x:null,
    y:null,
    radius: (canvas.height/80) * (canvas.width/80)
}

canvas.addEventListener('mouseover', event => {
    mouse.x = event.x;
    mouse.y = event.y;
})

