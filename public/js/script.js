const menuIcon = document.querySelector('.menu-bars')
const menuDisplay = document.querySelector('.menu')
const menuCloseIcon = document.querySelector('#menuClose')
const tableOrdersBox = document.querySelector('#orders')
const formDate = document.querySelector('#formDate')

const inputDate = document.querySelector('#date')

const menuToggle = () => {
  menuDisplay.classList.toggle('active')
}

if (menuIcon) {
  menuIcon.addEventListener('click', menuToggle)
  menuCloseIcon.addEventListener('click', menuToggle)
}

lucide.createIcons()

if (inputDate) {
  inputDate.addEventListener('change', async (e) => {
    const inputTarget = e.target
    const inputValue = inputTarget.value
    const inputValueIsEmpty = inputValue == ''
    const dataAction = inputTarget.getAttribute('data-action')

    if (!inputValueIsEmpty) {
      formDate.submit()

      return
    }

    window.location.href = `/${dataAction}`
  })
}
