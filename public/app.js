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
