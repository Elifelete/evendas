const seller = document.querySelector('#seller')
const qtOutInput = document.querySelector('#qtOut')
const qtLeftInput = document.querySelector('#qtLeft')
const product = document.querySelector('#product')
const productListDiv = document.querySelector('.products--list')
const totalElement = document.querySelector('#total')
const commissionTotalElement = document.querySelector('#commissiontotal')
const alertAddProductElement = document.querySelector('#alert--addProduct')
const alertSuccessElement = document.querySelector('.alert-success')
const addProductButton = document.querySelector('#addProductButton')
const btnCloseModal = document.querySelector('.btn-close')
const submitOrderButton = document.querySelector('#addOrderButton')

const cart = []

const getDataOfProducts = () => {
  const outValue = qtOutInput.value
  const leftValue = qtLeftInput.value
  const productId = product.value
  const productName = product.options[product.selectedIndex].text
  const productPrice =
    product.options[product.selectedIndex].getAttribute('data-price')
  const productCommission =
    product.options[product.selectedIndex].getAttribute('data-comi')

  const qt = outValue - leftValue

  const total = qt * productPrice
  const commission = (total * productCommission) / 100

  return {
    productId,
    productName,
    qt,
    total,
    commission
  }
}

const updateCart = () => {
  let total = 0
  let commission = 0

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
      <p class="mb-1">Comissão: R$<span>${item.commission}</span></p>
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
    commission += item.commission
  })

  updateTotalValuesElement(total, commission)
}

const updateTotalValuesElement = (total, commission) => {
  totalElement.innerHTML = total
  commissionTotalElement.innerHTML = commission
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

  qtOutInput.value = ''
  qtLeftInput.value = ''
}

const alertNotSold = () => {
  const outValue = qtOutInput.value
  const leftValue = qtLeftInput.value

  const qt = outValue - leftValue
  const qtIsEmpty = qt > 0

  if (qtIsEmpty) return false

  alertAddProductElement.classList.remove('d-none')
  alertAddProductElement.classList.add('d-flex')

  return true
}

const pushProductToCartList = () => {
  const productData = getDataOfProducts()

  cart.push({
    productId: productData.productId,
    name: productData.productName,
    qt: productData.qt,
    total: productData.total,
    commission: productData.commission
  })

  console.log(cart)
}

const addProductButtonHandler = () => {
  if (alertNotSold()) {
    return
  }

  pushProductToCartList()
  clearAndExitModal()
  updateCart()
}

const submitOrderHandler = () => {
  const sellerSelected = seller.value

  const cartIsEmpty = cart.length <= 0

  const sellerSelectedIsEmpty = seller.value == 'Selecione o vendedor'

  if (cartIsEmpty || sellerSelectedIsEmpty) return

  const cartList = {
    seller: sellerSelected,
    orders: cart
  }

  console.log(cartList)

  fetch('/vendas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cartList)
  })
    .then((response) => {
      const data = response.json()

      return data
    })
    .then((data) => {
      alertSuccessElement.classList.toggle('show')

      setTimeout(() => {
        window.location.replace('/vendas')
      }, 3000)
    })
    .catch((error) => {
      console.log(error)
    })
}

addProductButton.addEventListener('click', addProductButtonHandler)
btnCloseModal.addEventListener('click', clearAndExitModal)
submitOrderButton.addEventListener('click', submitOrderHandler)
