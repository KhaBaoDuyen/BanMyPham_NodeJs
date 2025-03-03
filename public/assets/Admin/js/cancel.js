  function openCancelModal(orderId) {
    document.getElementById("orderIdInput").value = orderId;
    document.getElementById("cancelForm").action = "/admin/order/update/" + orderId + "?_method=PATCH";
    var modal = new bootstrap.Modal(document.getElementById("cancelModal"));
    modal.show();
  }

  // Hiển thị textarea khi chọn "Khác..."
  document.addEventListener("DOMContentLoaded", function () {
    const reasonOther = document.getElementById("reason5");
    const customReason = document.getElementById("customReason");

    reasonOther.addEventListener("change", function () {
      if (reasonOther.checked) {
        customReason.style.display = "block";
      } else {
        customReason.style.display = "none";
      }
    });
  });
