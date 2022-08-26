function confirmation() {
    const idConfirm = document.getElementById("orderId");

    let confirm_url_id = window.location.search;
    let urlParams = new URLSearchParams(confirm_url_id);
    let orderId = urlParams.get("order");
    
    idConfirm.textContent = orderId;
    
    localStorage.clear();
  
    // console.log('coucou');
  }
  confirmation();