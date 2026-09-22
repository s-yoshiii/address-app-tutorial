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
  });
}

loadContacts();
