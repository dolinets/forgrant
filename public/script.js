$(document).ready(function(e) {

    var apis = {
        data: {
            BTC: null
        },
        url: {
            BTC: {
                USD: "https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCUSD",
                EUR: "https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCEUR",
                RUB: "https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCRUB",
                GBP: "https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCGBP"
            }
        },
        currencies: {
            USD: "$",
            EUR: "E",
            RUB: "R",
            GBP: "P"
        },
        /**
         * @param object data
         * @param string units price or percent
         * @returns object
         */
        parseData: function(data, units) {
            return {
                price: Math.round(data.volume * 100) / 100,
                hour: Math.round(data.changes[units].hour),
                day: Math.round(data.changes[units].day),
                week: Math.round(data.changes[units].week),
                month: Math.round(data.changes[units].month)
            };
        }
    };

    $(".dropdown-item").click(function() {
        $("[data-currency = " + $('#selectItem').text() + "]").show();

        $("#selectItem").text($(this).text());
        $(this).hide();

        var currency = $(this).data("currency");

        dataRequest("BTC", currency);
    });

    $("[data-currency = " + $('#selectItem').text() + "]").click();

    $(".switch-units").change(function() {
        var card = $(this).closest(".card-crypto").attr("data-card");
        var currency = $("#selectItem").text();
        var units = $("#card-" + card).find(".switch-units input").is(":checked") ? "percent" : "price";
        var data = apis.parseData(apis.data[card], units);

        entryDOM(card, data, currency, units == "percent" ? "%" : apis.currencies[currency]);
    });



    function dataRequest(card, currency) {
        apis.data[card] = null;
        
        var units = $("#card-" + card).find(".switch-units input").is(":checked") ? "percent" : "price";
        
        $.ajax({
            url: apis.url[card][currency]
        }).done(function(data) {
            apis.data[card] = data;
            var parsedData = apis.parseData(apis.data[card], units);

            entryDOM(card, parsedData, currency, units == "percent" ? "%" : apis.currencies[currency]);
        });
    }

    function entryDOM(card, data, currency, units) {

        var card = $("#card-" + card);
        
        $(card).find(".value-price .text-value").text(apis.currencies[currency] + data.price.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 "));

        entryValues($(card).find(".value-hour .text-value"), data.hour, units);
        entryValues($(card).find(".value-day .text-value"), data.day, units);
        entryValues($(card).find(".value-week .text-value"), data.week, units);
        entryValues($(card).find(".value-month .text-value"), data.month, units);
    }

    function entryValues(elem, value, units) {
        if (value <= 0) {
            $(elem).text(value + units).removeClass("text-success").addClass("text-danger");
        } else {
            $(elem).text("+" + value + units).removeClass("text-danger").addClass("text-success");
        }
    }

});