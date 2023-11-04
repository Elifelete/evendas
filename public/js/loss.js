const amountInput = document.querySelector('#qt')
const product = document.querySelector('#product')
const description = document.querySelector('#description')

const productListDiv = document.querySelector('.products--list')
const totalElement = document.querySelector('#total')
const commissionTotalElement = document.querySelector('#commissiontotal')

const alertAddProductElement = document.querySelector('#alert--addProduct')
const alertSuccessElement = document.querySelector('.alert-success')

const addProductButton = document.querySelector('#addProductButton')
const btnCloseModal = document.querySelector('.btn-close')
const submitOrderButton = document.querySelector('#addOrderButton')

const cart = []

const pushProductToCartList = () => {
  const { productId, name, qt, total, commission } = getDataOfProducts()

  cart.push({
    productId,
    name,
    qt,
    total,
    commission
  })
}

const getDataOfProducts = () => {
  const amountValue = amountInput.value

  const productId = product.value
  const productName = product.options[product.selectedIndex].text
  const productPrice =
    product.options[product.selectedIndex].getAttribute('data-price')
  const productCommission =
    product.options[product.selectedIndex].getAttribute('data-comi')

  const total = amountValue * productPrice
  const commission = (total * productCommission) / 100

  return {
    productId,
    name: productName,
    qt: amountValue,
    total,
    commission
  }
}

const updateCart = () => {
  let total = 0

  productListDiv.innerHTML = ''

  cart.forEach((item) => {
    const productElementHtml = document.createElement('div')

    productElementHtml.classList.add(
      'border-bottom',
      'position-relative',
      'mb-3'
    )

    productElementHtml.innerHTML = `
    <h3 class="fs-6 fw-bold">${item.name} - <span>${item.qt}x</span></h3>
    <div class="d-flex">
      <p class="mb-1 pe-2">Total: R$<span>${item.total}</span></p>
    </div>
    <button
      class="text-secondary border border-0 bg-transparent position-absolute top-0 end-0"
      data-id="${item.productId}"
      onClick="removeProductCartAndElement(this)"
    >
      <i class="fa-solid fa-trash"></i>
    </button>`

    productListDiv.appendChild(productElementHtml)

    total += item.total
  })

  updateTotalValuesElement(total)
}

const updateTotalValuesElement = (total) => {
  totalElement.innerHTML = total
}

const removeProductCartAndElement = (e) => {
  const divElement = e.parentElement
  const productId = e.getAttribute('data-id')

  const findIndexProduct = cart.findIndex(
    (item) => item.productId === productId
  )

  if (findIndexProduct == -1) return

  cart.splice(findIndexProduct, 1)
  divElement.remove()

  updateCart()
}

const clearAndExitModal = () => {
  btnCloseModal.click()
  alertAddProductElement.classList.add('d-none')

  amountInput.value = 1
}

const alertNotSold = () => {
  alertAddProductElement.classList.remove('d-none')
  alertAddProductElement.classList.add('d-flex')
}

const addProductButtonHandler = () => {
  const qt = amountInput.value
  const qtIsEmptyOrZero = qt <= 0

  if (qtIsEmptyOrZero) {
    alertNotSold()
    return
  }

  pushProductToCartList()
  clearAndExitModal()
  updateCart()
}

const submitOrderHandler = () => {
  const cartIsEmpty = cart.length <= 0

  if (cartIsEmpty) return

  const descriptionValue = description.value

  const lossList = {
    description: descriptionValue,
    losses: cart
  }

  fetch('/perdas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(lossList)
  })
    .then((response) => {
      const data = response.json()

      return data
    })
    .then((data) => {
      alertSuccessElement.classList.toggle('show')

      setTimeout(() => {
        window.location.replace('/perdas')
      }, 3000)
    })
    .catch((error) => {
      console.log(error)
    })
}

addProductButton.addEventListener('click', addProductButtonHandler)
btnCloseModal.addEventListener('click', clearAndExitModal)
submitOrderButton.addEventListener('click', submitOrderHandler)
