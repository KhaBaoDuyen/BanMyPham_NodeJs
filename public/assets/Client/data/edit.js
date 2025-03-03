var APIurl = 'http://localhost:3000/';
var list = "list";


let id = new URLSearchParams(location.search).get("id");
    axios.get(APIurl + list + '/' + id).then(res => {
        if (res.data) {
            document.getElementById('title').value = res.data.title;
            document.getElementById('note').value = res.data.note;
        } else {
            console.error("Không tìm thấy dữ liệu với ID này.");
        }
    }).catch(err => console.error(err));

function getData() {
    let dataFrom = document.getElementById('contact-form').elements;
    let obj = {
        "title": dataFrom['title'].value,
        "note": dataFrom['note'].value,
        "image": dataFrom['image'].value.split('\\')[2]
    };
    return obj;
}

function validation() {
    const title = document.getElementById('title');
    const note = document.getElementById('note');
    const errors_title = document.getElementById('errors_title');
    const errors_note = document.getElementById('errors_note');
    let isValid = true;

    if (!getData().title) {
        errors_title.textContent = "Title không được bỏ trống";
        title.style.border = "1px solid red";
        isValid = false;
    } else {
        errors_title.textContent = "";
        title.style.border = "none";
    }

    if (!getData().note) {
        errors_note.textContent = "Note không được bỏ trống";
        note.style.border = "1px solid red";
        isValid = false;
    } else {
        errors_note.textContent = "";
        note.style.border = "none";
    }
return isValid;
}


function edit(event) {
    event.preventDefault();
    if (validation()) {
    axios.patch(APIurl + list + '/' + id, getData()).then(res => {
        console.log(res); 
        if (res.status == 200 || res.status == 201) {
            console.log("Sửa dữ liệu thành công. Chuyển trang...");
            location.href = '../index.html'; 
        }
    }).catch(err => console.error(err));
}
}

// -------- XÓA --------
function deletes(id){
    axios.delete(APIurl + list + '/' + id).then(res=>{
        if(res.status==200 || res.status==201){
            alert('Xóa thành công :))')
            location.href='/index.html';
        }
    }).catch(err=> {
        console.error(err);
        alert(' Xóa thất bại :((');
    });
}
