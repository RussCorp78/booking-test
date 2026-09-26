/* --------------------------------
SETTINGS
-------------------------------- */
const openingTime = 9;
const closingTime = 17;
const slotLength = 30;
/* --------------------------------
VARIABLES
-------------------------------- */
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let appointments = [];
/* --------------------------------
HTML ELEMENTS
-------------------------------- */
const monthYear =
document.getElementById("monthYear");
const calendarDays =
document.getElementById("calendarDays");
const previousMonth =
document.getElementById("previousMonth");
const nextMonth =
document.getElementById("nextMonth");
const appointmentsSection =
document.getElementById("appointmentsSection");
const selectedDateText =
document.getElementById("selectedDate");
const appointmentSlots =
document.getElementById("appointmentSlots");
const bookingSection =
document.getElementById("bookingSection");
const bookingDate =
document.getElementById("bookingDate");
const bookingTime =
document.getElementById("bookingTime");
const nameInput =
document.getElementById("name");
const emailInput =
document.getElementById("email");
const confirmBooking =
document.getElementById("confirmBooking");
const cancelBooking =
document.getElementById("cancelBooking");
const bookingMessage =
document.getElementById("bookingMessage");
/* --------------------------------
LOAD JSON
-------------------------------- */
async function loadAppointments() {
try {
const response =
await fetch("appointments.json");
if (!response.ok) {
throw new Error(
"Could not load appointments.json"
);
}
const data =
await response.json();
appointments =
data.appointments || [];
createCalendar();
} catch (error) {
console.error(error);
appointments = [];
createCalendar();
}
}
/* --------------------------------
CREATE CALENDAR
-------------------------------- */
function createCalendar() {
calendarDays.innerHTML = "";
const year =
currentDate.getFullYear();
const month =
currentDate.getMonth();
const monthName =
currentDate.toLocaleString(
"default",
{
month: "long"
}
);
monthYear.textContent =
`${monthName} ${year}`;
/* First day of month */
let firstDay =
new Date(year, month, 1)
.getDay();
/*
JavaScript uses:
Sunday = 0
Monday = 1
We want Monday to be
the first column.
*/
firstDay =
firstDay === 0
? 6
: firstDay - 1;
/* Number of days */
const daysInMonth =
new Date(
year,
month + 1,
0
).getDate();
/* Empty spaces before day 1 */
for (
let i = 0;
i < firstDay;
i++
) {
const emptyDay =
document.createElement("div");
emptyDay.classList.add(
"calendar-day",
"empty"
);
calendarDays.appendChild(
emptyDay
);
}
/* Actual days */
for (
let day = 1;
day <= daysInMonth;
day++
) {
const dayElement =
document.createElement("div");
dayElement.classList.add(
"calendar-day"
);
dayElement.textContent =
day;
/* Date string */
const dateString =
`${year}-${String(month + 1)
.padStart(2, "0")}-${String(day)
.padStart(2, "0")}`;
dayElement.dataset.date =
dateString;
/* Today */
const today =
new Date();
const todayString =
`${today.getFullYear()}-${String(today.getMonth() + 1)
.padStart(2, "0")}-${String(today.getDate())
.padStart(2, "0")}`;
if (dateString === todayString) {
dayElement.classList.add(
"today"
);
}
/* Click */
dayElement.addEventListener(
"click",
function () {
selectDate(
dateString,
dayElement
);
}
);
calendarDays.appendChild(
dayElement
);
}
}
/* --------------------------------
SELECT DATE
-------------------------------- */
function selectDate(
dateString,
element
) {
selectedDate =
dateString;
selectedTime =
null;
/* Remove previous selection */
document
.querySelectorAll(
".calendar-day.selected"
)
.forEach(day => {
day.classList.remove(
"selected"
);
});
element.classList.add(
"selected"
);
/* Hide booking form */
bookingSection.classList.add(
"hidden"
);
/* Display selected date */
const date =
new Date(
dateString + "T00:00:00"
);
selectedDateText.textContent =
date.toLocaleDateString(
"en-GB",
{
weekday: "long",
day: "numeric",
month: "long",
year: "numeric"
}
);
appointmentsSection.classList.remove(
"hidden"
);
createAppointmentSlots();
}
/* --------------------------------
CREATE APPOINTMENT SLOTS
-------------------------------- */
function createAppointmentSlots() {
appointmentSlots.innerHTML = "";
for (
let minutes =
openingTime * 60;
minutes <
closingTime * 60;
minutes += slotLength
) {
const hours =
Math.floor(minutes / 60);
const mins =
minutes % 60;
const time =
`${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
const slot =
document.createElement("button");
slot.classList.add(
"slot"
);
slot.textContent =
time;
/* Check whether booked */
const booked =
appointments.some(
appointment =>
appointment.date ===
selectedDate &&
appointment.time ===
time
);
if (booked) {
slot.classList.add(
"booked"
);
slot.textContent =
`${time} - Booked`;
slot.disabled = true;
} else {
slot.classList.add(
"available"
);
slot.textContent =
`${time} - Available`;
slot.addEventListener(
"click",
function () {
selectTime(time);
}
);
}
appointmentSlots.appendChild(
slot
);
}
}
/* --------------------------------
SELECT TIME
-------------------------------- */
function selectTime(time) {
selectedTime =
time;
bookingDate.textContent =
new Date(
selectedDate + "T00:00:00"
).toLocaleDateString(
"en-GB",
{
weekday: "long",
day: "numeric",
month: "long",
year: "numeric"
}
);
bookingTime.textContent =
time;
bookingMessage.textContent =
"";
bookingSection.classList.remove(
"hidden"
);
bookingSection.scrollIntoView({
behavior: "smooth"
});
}
/* --------------------------------
CONFIRM BOOKING
-------------------------------- */
confirmBooking.addEventListener(
"click",
function () {
const name =
nameInput.value.trim();
const email =
emailInput.value.trim();
if (!name || !email) {
bookingMessage.textContent =
"Please enter your name and email.";
return;
}
/*
TEMPORARY BOOKING
This does NOT write to GitHub.
It simply adds the booking
to the current browser session.
*/
appointments.push({
date: selectedDate,
time: selectedTime,
name: name,
email: email
});
bookingMessage.textContent =
"Booking created successfully.";
/* Refresh slots */
createAppointmentSlots();
/* Clear form */
nameInput.value = "";
emailInput.value = "";
selectedTime = null;
}
);
/* --------------------------------
CANCEL BOOKING
-------------------------------- */
cancelBooking.addEventListener(
"click",
function () {
bookingSection.classList.add(
"hidden"
);
selectedTime = null;
}
);
/* --------------------------------
CHANGE MONTH
-------------------------------- */
previousMonth.addEventListener(
"click",
function () {
currentDate.setMonth(
currentDate.getMonth() - 1
);
bookingSection.classList.add(
"hidden"
);
appointmentsSection.classList.add(
"hidden"
);
createCalendar();
}
);
nextMonth.addEventListener(
"click",
function () {
currentDate.setMonth(
currentDate.getMonth() + 1
);
bookingSection.classList.add(
"hidden"
);
appointmentsSection.classList.add(
"hidden"
);
createCalendar();
}
);
/* --------------------------------
START APP
-------------------------------- */
loadAppointments();
