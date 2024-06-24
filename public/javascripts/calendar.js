document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");

    function generateCalendar(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const today = new Date();

        // Adjust the first day of the week to be Monday (0 is Sunday, 1 is Monday, ..., 6 is Saturday)
        const firstDayOffset = firstDay === 0 ? 6 : firstDay - 1;

        let table = "<table><tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr><tr>";

        for (let i = 0; i < firstDayOffset; i++) {
            table += "<td></td>";
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);

            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                table += `<td class="selected">${day}</td>`;
            } else {
                table += "<td>" + day + "</td>";
            }

            if ((day + firstDayOffset) % 7 === 0) {
                table += "</tr><tr>";
            }
        }

        table += "</tr></table>";
        calendar.innerHTML = table;
    }

    const today = new Date();
    generateCalendar(today.getFullYear(), today.getMonth());

    calendar.addEventListener("click", function (e) {
        const selected = document.querySelector(".selected");
        if (selected) {
            selected.classList.remove("selected");
        }
        if (e.target.tagName === "TD") {
            e.target.classList.add("selected");
        }
    });
});
