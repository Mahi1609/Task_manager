const BASE_URL = "/api";




export const getTasks = async (status = "", assignedTo = "") => {
  let url = `${BASE_URL}/tasks?`;

  if (status) url += `status=${status}&`;
  if (assignedTo) url += `assigned_to=${assignedTo}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed API response");
  }

  return res.json();
};

export const createTask = async (data) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}/status?status=${status}`, {
    method: "PATCH",  
  });
  return res.json();
};


export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  return res.json();
};


export const updateTask = async (id, data) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};