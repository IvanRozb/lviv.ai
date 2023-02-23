function animateNavUnderlines() {
    const navbar = document.querySelector(`.nav`)
    const underlines = document.querySelectorAll(`.nav_underline`)
    const items = document.querySelectorAll(`.nav > .nav_item`)
    items.forEach((item) => {
        item.addEventListener('mouseenter', () => {
            item.childNodes.forEach((item) => {
                if (item.className === 'nav_underline')
                    item.style.backgroundColor = 'var(--peachy)'
            })
        })
        item.addEventListener('mouseleave', () => {
            item.childNodes.forEach((item) => {
                if (item.className === 'nav_underline')
                    item.style.backgroundColor = 'transparent'
            })
        })
    })
    navbar?.addEventListener('mouseenter', () => {
        underlines.forEach((underline) => {
            underline.style.backgroundColor = 'transparent'
        })
    })
    navbar?.addEventListener('mouseleave', () => {
        underlines.forEach((underline) => {
            if (underline.parentNode.classList.contains('active'))
                underline.style.backgroundColor = 'var(--peachy)'
        })
    })
}

function menuBurgerAnimation() {
    const menuIcon = document.querySelector('.menu_icon')
    const navbar = document.querySelector(`header .nav`)

    menuIcon?.addEventListener('click', () => {
        menuIcon.classList.toggle('change')
        navbar.classList.toggle('expanded')
    })

    const toggleShevrons = document.querySelectorAll('.nav_link_wrapper')
    toggleShevrons.forEach((toggle) => {
        const shevron = toggle.querySelector('.nav_shevron')
        toggle.addEventListener('click', () => {
            shevron?.classList.toggle('rotate')
        })
    })

    const navItems = document.querySelectorAll('.nav_item')
    navItems.forEach((item) => {
        const subItems = item.querySelectorAll('.nav_sub_item')
        item.addEventListener('click', () => {
            subItems?.forEach((item) => {
                item.classList.toggle('expanded')
            })
        })
    })
}

function animateHeader() {
    animateNavUnderlines()
    menuBurgerAnimation()
}

animateHeader()
