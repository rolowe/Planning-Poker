
  var app = {
      // Application Constructor
      initialize: function() {
          this.bindEvents();
      },
      // Bind Event Listeners
      // Common events are: 'load', 'deviceready', 'offline', and 'online'.
      bindEvents: function() {
          document.addEventListener('deviceready', this.onDeviceReady, false);
      },
      // deviceready Event Handler
      onDeviceReady: function() {
          app.receivedEvent('deviceready');
      },
      // Update DOM on a Received Event
      receivedEvent: function(id) {
          var parentElement = document.getElementById(id);

          if (id == "deviceready") {

            $(document).ready(function() {

              var pageID;
              $('body[id]').each(function(){
                  pageID = this.id;
              });

              if (pageID == "index") {
                $(".card-container").fadeIn();
                cardDeck('index');
                $(".swipe").delay(2200).fadeOut();
              }
              if (pageID == "card") {
                getCardItem();
              }
              if (pageID == "deck") {
                getCards('deck');
              }

              $('.card-deck img').on( 'click', function( event ) {
                var cardName = $(this).attr('rel');
                setCardName(cardName);
                return
              });

            });

          }
      }
  };



// /******************************
// ******* GET ALL CARDS *********
// ******************************/
function getCards(page) {
  var ppAPI = "https://www.prettypragmatic.com/wp-json/wp/v2/pp-api?per_page=50";
  var cachedData = localStorage.getItem("cardData");

  $(".loading").show();

  // Ajax get
  if (cachedData == null) {
        $.ajax({
            url: ppAPI,
            dataType: 'json',
            success: function(result){

              localStorage.setItem('cardData', JSON.stringify(result));
              cachedData = localStorage.getItem("cardData");

              $(".loading").hide();
              addCards(result, page);

            },
            error: function() {
                alert("Oh shoot! Somethings gone wrong!");
            }
        });
  }
  else {
      // Show cached results
      $(".loading").hide();
      cachedData = JSON.parse(cachedData);
      addCards(cachedData, page);
  }

}


// /******************************
// *** GET INDIVIDUAL CARDS ******
// ******************************/
function setCardName(cardName) {
 localStorage.setItem('card_name', cardName);
}

function getCardItem() {

  if (localStorage.getItem("card_name") == "") {
    var card_name = "product"
  } else {
    var card_name = localStorage.getItem("card_name");
  }

  $(".loading").show();

  $.ajax({
      url: "https://www.prettypragmatic.com/wp-json/wp/v2/pp-api?search="+card_name+"&per_page=1",
      dataType: 'json',
      success: function(result) {

        $(".loading").hide();

        var cardTitle = result[0].slug;
        var cardImage = result[0].acf.card_image.sizes.large;
        $("#card-item").prepend('<li><img src="'+cardImage+'" title="'+cardTitle+'" rel="'+cardTitle+'" class="card" /></li>');
        $(".card-container").fadeIn();

        getCards('card');
        cardDeck('card');

      },
      error: function() {
          alert("Ooops! Somethings gone wrong!");
      }
  });
}




function addCards(result, page) {

  $.each( result, function(result_item) {
    var cardTitle = result[result_item].title.rendered;
    var cardImage = result[result_item].acf.card_image.sizes.large;
    var cardType = result[result_item].acf.card_type;

    if (page == "deck") {
      $(".card-deck").append('<li><a href="card.html"><img src="'+cardImage+'" title="'+cardTitle+'" rel="'+cardTitle+'" class="card" /></a></li>');
    }
    if (page == "card") {
      $("#card-item").append('<li><img src="'+cardImage+'" title="'+cardTitle+'" rel="'+cardTitle+'" class="card" /></li>');
    }

  });
}



// /******************************
// ******* INDEX PAGE CARDS ******
// ******************************/
function cardDeck(page) {

    if (page == "index") {
      var $el = $( '#card-deck' );
    }
    if (page == "card") {
      var $el = $( '#card-item' );
    }
    var baraja = $el.baraja();

    // Binding swipe event to left and right buttons
    $("li").on("swiperight", function() {
        baraja.next();
    });
    $("li").on("swipeleft", function() {
        baraja.previous();
    });


    // Single card new card button
    $('#new-card').on( 'click', function( event ) {
      baraja.next();
    });

}
