import { navigationListBehavior } from './utils'

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
    const navbar = document.querySelector('header .nav')
    const overlapper = document.querySelector('.overlapper')
    const toggleShevrons = document.querySelectorAll('.nav_link_wrapper')
    const navItems = document.querySelectorAll('.nav_item')

    function toggleAnimation() {
        menuIcon.classList.toggle('change')
        navbar.classList.toggle('expanded')
        document.body.classList.toggle('unscrollable')
        overlapper.classList.toggle('active')
    }

    function toggleShevronRotation() {
        const shevron = this.querySelector('.nav_shevron')
        shevron?.classList.toggle('rotate')
    }

    function toggleSubItems() {
        const subLinks = this.querySelectorAll('.nav_sub > a')
        subLinks?.forEach((item) => item.classList.toggle('active'))

        const subItems = this.querySelectorAll('.nav_sub_item')
        subItems?.forEach((item) => item.classList.toggle('expanded'))
    }

    overlapper.addEventListener('click', toggleAnimation)
    menuIcon?.addEventListener('click', toggleAnimation)
    toggleShevrons.forEach((toggle) =>
        toggle.addEventListener('click', toggleShevronRotation)
    )
    navItems.forEach((item) => item.addEventListener('click', toggleSubItems))
}

function animateHeader() {
    animateNavUnderlines()
    menuBurgerAnimation()
}

animateHeader()
navigationListBehavior('.nav', ['section'], '.nav_sub_item')
