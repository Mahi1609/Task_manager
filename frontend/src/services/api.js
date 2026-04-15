const BASE_URL = process.env.NEXT_PUBLIC_API_URL;




export const getTasks = async () => {
  const res = await fetch(`${BASE_URL}/tasks`);
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