
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
                $(".swipe").fadeIn();
                cardDeck('index');
                $(".swipe").delay(2800).fadeOut();
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

              $('a.deal').on( 'click', function( event ) {
                event.preventDefault();
                window.plugins.socialsharing.share('Check out The Strat Pack by Pretty Pragmatic. http://bit.ly/TheStratPack');
              });

            });

          }
      }
  };



// /******************************
// ******* GET ALL CARDS *********
// ******************************/
function getCards(page) {

  $(".loading").show();

  var ppAPI = "https://www.prettypragmatic.com/wp-json/wp/v2/pp-api?per_page=50";
  var cachedData = localStorage.getItem("cardData");

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

  if (localStorage.getItem("card_name") == null) {
    var card_name = "culture";
    var cardId = convertToSlug(card_name);
  } else {
    var card_name = localStorage.getItem("card_name");
    var cardId = convertToSlug(card_name);
  }

      $(".loading").show();

      getCards('card');
      
      if (cardId != "product") {
        var nextCards = $('li#' + cardId).nextAll( "li" );
        $('li#' + cardId).insertBefore("ul#card-item li:first");
        $(nextCards).insertAfter("ul#card-item li:first");
      }


      cardDeck('card');

      $(".card-container").fadeIn();

}




function addCards(result, page) {

  $.each( result, function(result_item) {
    var cardTitle = result[result_item].title.rendered;
    var cardImage = result[result_item].acf.card_image.sizes.large;
    var cardType = result[result_item].acf.card_type;
    var cardId = convertToSlug(cardTitle);

  
    if (page == "deck") {
      $(".card-deck").append('<li id="'+cardId+'"><a href="card.html"><img src="'+cardImage+'" title="'+cardTitle+'" rel="'+cardTitle+'" class="card" /></a></li>');
    }
    if (page == "card") {
      $("#card-item").append('<li id="'+cardId+'"><img src="'+cardImage+'" title="'+cardTitle+'" rel="'+cardTitle+'" class="card" /></li>');
    }

  });
}


// /******************************
// ******* CONVERT TO SLUG *******
// ******************************/
function convertToSlug(Text) {
  return Text
      .toLowerCase()
      .replace(/ /g,'-')
      .replace(/[^\w-]+/g,'')
      ;
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
