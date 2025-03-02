document.getElementById('searchInput').addEventListener('input', async function (e) {
    const searchTerm = e.target.value.trim();
    const searchResults = document.getElementById('searchResults');

    if (searchTerm.length === 0) {
        searchResults.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`/api/search?term=${encodeURIComponent(searchTerm)}`);
        const products = await response.json();

        if (products.length > 0) {
            searchResults.innerHTML = products.map(product => {
                const imageUrl = product.images && product.images[1] ? `/assets/uploads/Products/${product.images[1]}` : '/path/to/default/image.jpg';
                return `
                 <a href="/productDetail/${product.id}" class="productSearch m-2 p-1">
                  <img class="image" src="${imageUrl}" alt="${product.name}">
                  <p>${product.name}</p>
                  <p>${product.price.toLocaleString('vi-VN')} vnd</p>
               </a>
            `;
            }).join('');

            searchResults.addEventListener('mouseleave', () => {
                searchResults.innerHTML = '';
            });
        } else {
            searchResults.innerHTML = '<div>Không tìm thấy sản phẩm nào.</div>';
        }
    } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        searchResults.innerHTML = '<div>Đã xảy ra lỗi khi tìm kiếm.</div>';
    }
});