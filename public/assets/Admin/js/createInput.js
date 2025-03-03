const dropArea = document.querySelector('.drop-area');
const input = document.getElementById('images');
const gallery = document.getElementById('gallery');

input.addEventListener('change', function () {
  showFiles(this.files);
});


// Kéo ảnh vào vùng drop
dropArea.addEventListener('dragover', function (e) {
  e.preventDefault();
  dropArea.classList.add('border-success', 'bg-light');
});

dropArea.addEventListener('dragleave', function () {
  dropArea.classList.remove('border-success', 'bg-light');
});

dropArea.addEventListener('drop', function (e) {
  e.preventDefault();
  dropArea.classList.remove('border-success', 'bg-light');

  // Cập nhật input file để gửi lên server
  input.files = e.dataTransfer.files;
  showFiles(e.dataTransfer.files);
});

function showFiles(files) {
  const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
  gallery.innerHTML = ""; 

  Array.from(files).forEach(file => {
    if (validExtensions.includes(file.type)) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileUrl = fileReader.result;
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('position-relative', 'd-inline-block', 'm-2');

        const imgTag = document.createElement('img');
        imgTag.src = fileUrl;
        imgTag.classList.add('rounded', 'border', 'shadow-sm', 'img-thumbnail', 'me-2');
        imgTag.style.width = '80px';
        imgTag.style.height = '80px';
        imgTag.style.objectFit = 'cover';

        // Nút xoá ảnh
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = `X`;
        removeBtn.classList.add(
          'btn', 'btn-danger', 'btn-sm', 'position-absolute', 'top-0', 'end-0',
          'translate-middle', 'rounded-circle', 'p-0', 'opacity-75'
        );
        removeBtn.style.width = '22px';
        removeBtn.style.height = '22px';
        removeBtn.style.fontSize = '12px';
        removeBtn.style.zIndex = '10';
        removeBtn.addEventListener('click', () => {
          imgContainer.remove();
        });

        imgContainer.appendChild(imgTag);
        imgContainer.appendChild(removeBtn);
        gallery.appendChild(imgContainer);
      };
      fileReader.readAsDataURL(file);
    } else {
      alert('Chỉ hỗ trợ định dạng JPG, JPEG, PNG');
    }
  });
}

// thong baof
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        let flashMessage = document.getElementById("flash-message");
        if (flashMessage) {
            flashMessage.style.opacity = "0";
            setTimeout(() => flashMessage.remove(), 500); 
        }
    }, 2000); 
});

