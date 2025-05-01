const apiAddress = "http://localhost:5090";

export const getDataFromApi = async (type) => {
  const response = await fetch(`${apiAddress}/${type}`, {
    method: "GET",
  });
  return response.json();
};

export const getProductFromApi = async (id) => {
  const response = await fetch(`${apiAddress}/product/${id}`, {
    method: "GET",
  });
  return response.json();
};
export const deleteProductFromApi = async (id) => {
  const response = await fetch(`${apiAddress}/delete-product/${id}`, {
    method: "POST",
  });
  return response;
};

export const loginUserToApi = async (user) => {
  const response = await fetch(`${apiAddress}/user-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response;
};


export const sendUserToApi = async (user) => {
  const response = await fetch(`${apiAddress}/user-signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response;
};

export const sendProductToApi = async (product) => {
  const response = await fetch(`${apiAddress}/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  return response;
};
export const sendSaleToApi = async (sale) => {
  const response = await fetch(`${apiAddress}/sale`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sale),
  });
  return response;
};
export const sendPurchaseToApi = async (purchase) => {
  const response = await fetch(`${apiAddress}/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(purchase),
  });
  return response;
};
export const sendCategoryToApi = async (cat) => {
  const response = await fetch(`${apiAddress}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cat),
  });
  return response;
};

export const sendSupplierToApi = async (supplier) => {
  const response = await fetch(`${apiAddress}/supplier`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(supplier),
  });
  return response;
};

export const sendCustomerToApi = async (customer) => {
  const response = await fetch(`${apiAddress}/customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });
  return response;
};


