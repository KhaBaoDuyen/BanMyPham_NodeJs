function TinhTien(button, change) {
    const quantityInput = button.parentElement.querySelector('input[type="number"]');
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity += change;

    if (currentQuantity < 1) {
        currentQuantity = 1;
    }

    quantityInput.value = currentQuantity;

    const pricePerUnit = 10000; // Giá 
    const totalPrice = currentQuantity * pricePerUnit;
    const totalPriceCell = button.closest('tr').querySelector('.item-total');
    totalPriceCell.innerText = totalPrice.toLocaleString() + ' VNĐ';

    updateGrandTotal();
}

function updateGrandTotal() {
    const itemTotals = document.querySelectorAll('.item-total');
    let grandTotal = 0;

    itemTotals.forEach(item => {
        const price = parseInt(item.innerText.replace(/[^0-9]/g, ''));
        grandTotal += price;
    });

    document.getElementById('grandTotal').innerText = grandTotal.toLocaleString() + ' VNĐ';
}


function increaseQuantity(button) {
    const quantityInput = button.parentElement.querySelector('input[type="number"]');
    quantityInput.value = parseInt(quantityInput.value) + 1;
}

function decreaseQuantity(button) {
    const quantityInput = button.parentElement.querySelector('input[type="number"]');
    if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
}