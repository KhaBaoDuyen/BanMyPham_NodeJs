var APIurl = 'http://localhost:3000/';
var list = "list";
var datalist = [];

async function getValue() {
    // .get() = select*
    await axios.get(APIurl + list).then(res => {
        console.log(res.data);
        datalist = res.data;
    }).catch(err => console.error(err));
    let html = '';

    datalist.forEach((item, index) => {
        html += `
                  <div class="col-4 mt-3">
                <div class="card">
                    <div class="height-3">
                        <img src="./img/${item.image}" class="card-img-top" alt="">
                    </div>
                    <div class="card-body">
                        <p class="card-text multi-line-truncate text-body">${item.note}</p>
                        <h5 class="card-title text-black-50">${item.title}</h5>
                        <a href="./edit.html?id=${item.id}" class="btn btn-warning">Update</a>
                        <button onclick="deletes('${item.id}')" class="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
`;
    });
    // goị ra
    document.getElementById('showData').innerHTML = html;
}

getValue();