(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var cfg = window.METANOUS || {};
  function say(msg) { status.hidden = false; status.textContent = msg; status.focus(); }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.website.value) return; // honeypot: bots fill this, people never see it
    if (!form.reportValidity()) return;
    var data = {
      name: form.name.value.trim(), email: form.email.value.trim(),
      company: form.company.value.trim(), topic: form.topic.value,
      message: form.message.value.trim()
    };
    if (cfg.FORM_ENDPOINT) {
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      fetch(cfg.FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        say("Message sent. We reply within two business days.");
      }).catch(function () {
        say("The message could not be sent. Email " + cfg.CONTACT_EMAIL + " directly and we will pick it up.");
      }).finally(function () { btn.disabled = false; });
    } else {
      var body = "Name: " + data.name + "\nCompany: " + data.company + "\nEmail: " + data.email +
        "\nTopic: " + data.topic + "\n\n" + data.message;
      var href = "mailto:" + cfg.CONTACT_EMAIL + "?subject=" +
        encodeURIComponent("Project enquiry: " + data.topic) + "&body=" + encodeURIComponent(body);
      window.location.href = href;
      say("Your email app should now open with the message ready to send. If it does not, write to " +
        cfg.CONTACT_EMAIL + ".");
    }
  });
})();
