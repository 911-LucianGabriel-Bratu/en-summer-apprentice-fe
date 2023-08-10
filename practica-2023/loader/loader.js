export function removeLoader(){
    const loader = document.querySelector('#loader');
    const header = document.querySelector('#page-header');
    const content = document.querySelector('.main-content-component')
    loader.classList.add('hidden');
    header.classList.remove('opacity-25');
    header.classList.remove('z-[-1]');
    content.classList.remove('hidden');
}

export function addLoader(){
    const loader = document.querySelector('#loader');
    const header = document.querySelector('#page-header');
    const content = document.querySelector('.main-content-component')
    loader.classList.remove('hidden');
    header.classList.add('opacity-25');
    header.classList.add('z-[-1]');
    content.classList.add('hidden');
}