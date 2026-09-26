/* --------------------------------

   SUPABASE

-------------------------------- */



// Replace these two values with your own

const SUPABASE_URL = "https://ghvkjlhnmdhmlwtmushh.supabase.co";

const SUPABASE_KEY = "sb_publishable__18dLc0O4aGcVc_695NVkg_CSQCvZhY";





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

   LOAD APPOINTMENTS FROM SUPABASE

-------------------------------- */



async function loadAppointments() {



    try {



        const response = await fetch(

            `${SUPABASE_URL}/rest/v1/appointments?select=*`,

            {

                headers: {

                    "apikey": SUPABASE_KEY,

                    "Authorization":

                        `Bearer ${SUPABASE_KEY}`

                }

            }

        );





        if (!response.ok) {



            throw new Error(

                `Supabase error: ${response.status}`

            );



        }





        appointments =

            await response.json();





        console.log(

            "Appointments loaded:",

            appointments

        );





        createCalendar();





    } catch (error) {



        console.error(

            "Could not load appointments:",

            error

        );



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





    let firstDay =

        new Date(

            year,

            month,

            1

        ).getDay();





    /*

       JavaScript uses:



       Sunday = 0

       Monday = 1



       We want Monday first.

    */



    firstDay =

        firstDay === 0

            ? 6

            : firstDay - 1;





    const daysInMonth =

        new Date(

            year,

            month + 1,

            0

        ).getDate();





    /* Empty spaces */



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





    /* Days */



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





        const dateString =

            `${year}-${String(month + 1)

                .padStart(2, "0")}-${String(day)

                .padStart(2, "0")}`;





        dayElement.dataset.date =

            dateString;





        /* Today's date */



        const today =

            new Date();



        const todayString =

            `${today.getFullYear()}-${String(today.getMonth() + 1)

                .padStart(2, "0")}-${String(today.getDate())

                .padStart(2, "0")}`;





        if (

            dateString === todayString

        ) {



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





    bookingSection.classList.add(

        "hidden"

    );





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





        /*

           Check Supabase data

        */



        const booked =

            appointments.some(

                appointment => {



                    const appointmentTime =

                        appointment.time

                            .substring(0, 5);



                    return (

                        appointment.date ===

                            selectedDate &&

                        appointmentTime ===

                            time

                    );



                }

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

    async function () {



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

           Prevent duplicate booking

        */



        const alreadyBooked =

            appointments.some(

                appointment => {



                    const appointmentTime =

                        appointment.time

                            .substring(0, 5);



                    return (

                        appointment.date ===

                            selectedDate &&

                        appointmentTime ===

                            selectedTime

                    );



                }

            );





        if (alreadyBooked) {



            bookingMessage.textContent =

                "Sorry, that appointment has just been booked.";



            await loadAppointments();



            return;

        }





        /*

           Send booking to Supabase

        */



        try {



            const response =

                await fetch(

                    `${SUPABASE_URL}/rest/v1/appointments`,

                    {

                        method: "POST",



                        headers: {

                            "Content-Type":

                                "application/json",



                            "apikey":

                                SUPABASE_KEY,



                            "Authorization":

                                `Bearer ${SUPABASE_KEY}`,



                            "Prefer":

                                "return=representation"

                        },



                        body: JSON.stringify({



                            date:

                                selectedDate,



                            time:

                                selectedTime,



                            name:

                                name,



                            email:

                                email



                        })

                    }

                );





            if (!response.ok) {



                const errorText =

                    await response.text();



                throw new Error(

                    errorText

                );

            }





            bookingMessage.textContent =

                "Booking created successfully.";





            /*

               Reload bookings from Supabase

            */


            // Reload appointments from Supabase
            await loadAppointments();

            // Refresh the displayed slots
            showAppointments(selectedDate);



            nameInput.value = "";

            emailInput.value = "";



            selectedTime = null;





        } catch (error) {



            console.error(

                "Booking error:",

                error

            );



            bookingMessage.textContent =

                "There was a problem creating the booking.";



        }



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

   PREVIOUS MONTH

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





/* --------------------------------

   NEXT MONTH

-------------------------------- */



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

