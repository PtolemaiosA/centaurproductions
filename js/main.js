/* =====================================================
   CENTAUR PRODUCTIONS
   Main JavaScript
===================================================== */


document.addEventListener("DOMContentLoaded", function () {


    const menu = document.querySelector(".menu");

    const logo = document.querySelector(".nav-logo");


    /*
        Navigation behaviour:

        0px:
        - Logo visible
        - Menu hidden

        80px:
        - Menu fades in

        350px:
        - Logo fades out
    */


    window.addEventListener("scroll", function () {


        const scrollPosition = window.scrollY;



        // Fade menu in early

        if (scrollPosition > 80) {

            menu.classList.add("visible");

        } else {

            menu.classList.remove("visible");

        }



        // Keep logo longer, fade near second section

        if (scrollPosition > 350) {

            logo.classList.add("hidden");

        } else {

            logo.classList.remove("hidden");

        }



    });


});