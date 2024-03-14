(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };
    
    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

  $("#createRoomBtn").on('click', function(event) {
    event.preventDefault();
    var createRoomForm = $('.create-room-form-needs-validation');

    if (createRoomForm[0].checkValidity() === false) {
        createRoomForm.addClass('was-validated');
    } else {
        try {          
          const roomNumber = $(".create-room-form").find("input[name='room-number']").val();
          const roomName = $(".create-room-form").find("input[name='room-name']").val();
          const buildingName = $(".create-room-form").find("input[name='building-name']").val();

          const payload = {
            "room_number": roomNumber,
            "room_name": roomName,
            "building_name": buildingName
          }

          fetch('/rooms', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload), // Set the body of the request as the FormData object
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json(); // Assuming the response is JSON, parse it
          })
          .then(data => {
            // Handle the response data heres
            console.log(data);
          })
          .catch(error => {
            // Handle errors here
            console.error('There was a problem with your fetch operation:', error);
          });

        } catch (error) {
          // window.location.search = '?error=true';
        }
    }
  });
})(jQuery); // End of use strict
