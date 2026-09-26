async function loadContacts() {
  const response = await fetch("/api/contacts");
  const contacts = await response.json();

  const list = document.getElementById("contact-list");
  list.innerHTML = "";

  contacts.forEach((contact) => {
    const li = document.createElement("li");
    const { name, email, phone } = contact;
    li.textContent = `${name} | ${email ?? "-"} | ${phone ?? "-"}`;
    list.appendChild(li);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.addEventListener("click", async () => {
      if (!confirm("削除しますか？")) return;
      await fetch(`/api/contacts/${contact.id}`, { method: "DELETE" });
      loadContacts();
    });

    const editButton = document.createElement("button");
    editButton.textContent = "編集";
    editButton.addEventListener("click", () => {
      document.getElementById("edit-section").style.display = "block";
      document.getElementById("edit-id").value = contact.id;
      document.getElementById("edit-name").value = contact.name;
      document.getElementById("edit-email").value = contact.email ?? "";
      document.getElementById("edit-phone").value = contact.phone ?? "";
    });

    li.appendChild(editButton);

    li.appendChild(deleteButton);
    list.appendChild(li);
  });
}

loadContacts();

document
  .getElementById("contact-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("登録に失敗しました", response.status, error);
      alert(`登録に失敗しました（${response.status}）`);
      return;
    }

    document.getElementById("contact-form").reset();
    loadContacts();
  });
document
  .getElementById("edit-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("edit-id").value;

    await fetch(`/api/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("edit-name").value,
        email: document.getElementById("edit-email").value,
        phone: document.getElementById("edit-phone").value,
      }),
    });

    document.getElementById("edit-section").style.display = "none";
    loadContacts();
  });

document.getElementById("cancel-edit").addEventListener("click", () => {
  document.getElementById("edit-section").style.display = "none";
});
