document.addEventListener("DOMContentLoaded", function () {
  var headers = [];
  $("tr th").each(function (i) {
    headers.push($(this).text());
  });
  var Flight = [];
  $("tr").each(function (i) {
    var rowObj;
    $(this)
      .find("td")
      .each(function (i) {
        if (!rowObj) rowObj = {};
        rowObj[headers[i]] = $(this).text();
      });
    if (rowObj) Flight.push(rowObj);
  });
  $("table").remove();
  const { useState } = React;
  const rootElement = document.getElementById("root");
  const Cell = (props) => {
    const { index } = props;
    const [active, handleActive] = useState(false);

    return React.createElement(
      "div",
      {
        id: "cardContainer",
        style: {
          height: active ? `300px` : `100px`,
          transition: "0.9s",
        },

        onClick: () => {
          handleActive(!active);
        },
      },
      React.createElement(
        "div",
        { id: "firstDisplay" },
        React.createElement(
          "div",
          { id: "flightDetail" },
          React.createElement(
            "div",
            {
              id: "detailLabel",
              style: { fontWeight: "bold" },
            },
            "From"
          ),
          Flight[index].dep_short,
          React.createElement("div", { id: "detailLabel" }, Flight[index].dep_name + ", " + Flight[index].dep_state)
        ),

        React.createElement(
          "div",
          {
            id: "flightDetail",
            style: {
              marginTop: "15px",
            },
          },

          React.createElement("img", {
            style: { width: "30px" },
            src: "https://github.com/pizza3/asset/blob/master/airplane2.png?raw=true",
          })
        ),

        React.createElement(
          "div",
          { id: "flightDetail" },
          React.createElement(
            "div",
            {
              id: "detailLabel",
              style: { fontWeight: "bold", color: Flight[index].label },
            },
            "To"
          ),
          Flight[index].des_short,

          React.createElement("div", { id: "detailLabel" }, Flight[index].des_name + ", " + Flight[index].des_state)
        )
      ),

      React.createElement(
        "div",
        {
          id: "first",
          style: {
            transform: active ? `rotate3d(1, 0, 0, -180deg)` : `rotate3d(1, 0, 0, 0deg)`,
            transitionDelay: active ? "0s" : "0.3s",
          },
        },

        React.createElement(
          "div",
          { id: "firstTop" },
          // React.createElement("img", { style: Flight[index].style, src: "../images/FullLogo.png" }),
          React.createElement(
            "div",
            { id: "timecontainer" },
            React.createElement("div", { id: "detailDate" }, Flight[index].dep_city, React.createElement("div", { id: "detailTime" }, Flight[index].departure_time.slice(0, 5)), Flight[index].departure_date.slice(0, 15)),
            React.createElement("img", {
              style: {
                width: "30px",
                height: "26px",
                marginTop: "22px",
                marginLeft: "16px",
                marginRight: "16px",
              },

              src: "https://github.com/pizza3/asset/blob/master/airplane2.png?raw=true",
            }),

            React.createElement("div", { id: "detailDate" }, Flight[index].des_city, React.createElement("div", { id: "detailTime" }, Flight[index].arrival_time.slice(0, 5)), Flight[index].arrival_date.slice(0, 15))
          )
        ),
        React.createElement(
          "div",
          { id: "firstBehind" },
          React.createElement(
            "div",
            { id: "firstBehindDisplay" },
            React.createElement("div", { id: "firstBehindRow" }, React.createElement("div", { id: "detail" }, Flight[index].departure_time.slice(0, 5) + " - " + Flight[index].arrival_time.slice(0, 5), React.createElement("div", { id: "detailLabel" }, "Flight Time")), React.createElement("div", { id: "detail" }, Flight[index].userid, React.createElement("div", { id: "detailLabel" }, "UserID"))),

            React.createElement(
              "div",
              { id: "firstBehindRow" },
              React.createElement("div", { id: "detail" }, Flight[index].duration.slice(0, 5), React.createElement("div", { id: "detailLabel" }, "Duration")),

              React.createElement("div", { id: "detail" }, Flight[index].flight_number, React.createElement("div", { id: "detailLabel" }, "Flight Number"))
            ),

            React.createElement(
              "div",
              { id: "firstBehindRow" },
              React.createElement("div", { id: "detail" }, parseInt(Flight[index].departure_time.slice(0, 2)) - 1 + Flight[index].departure_time.slice(2, 5), React.createElement("div", { id: "detailLabel" }, "Boarding")),

              React.createElement("div", { id: "detail" }, Flight[index].seat_number, React.createElement("div", { id: "detailLabel" }, "Seat"))
            )
          ),

          React.createElement(
            "div",
            {
              id: "second",
              style: {
                transform: active ? `rotate3d(1, 0, 0, -180deg)` : `rotate3d(1, 0, 0, 0deg)`,
                transitionDelay: active ? "0.2s" : "0.2s",
              },
            },
            React.createElement("div", { id: "secondTop" }),
            React.createElement(
              "div",
              { id: "secondBehind" },
              React.createElement(
                "div",
                { id: "secondBehindDisplay" },
                React.createElement("div", { id: "price" }, "₹" + Flight[index].price, React.createElement("div", { id: "priceLabel" }, "Price")),

                React.createElement("div", { id: "price" }, Flight[index].username, React.createElement("div", { id: "priceLabel" }, "Name")),
                React.createElement("img", { id: "barCode", src: "https://github.com/pizza3/asset/blob/master/barcode.png?raw=true" })
              ),
              React.createElement(
                "div",
                {
                  id: "third",
                  style: { transform: active ? `rotate3d(1, 0, 0, -180deg)` : `rotate3d(1, 0, 0, 0deg)`, transitionDelay: active ? "0.4s" : "0s" },
                },
                React.createElement("div", { id: "thirdTop" }),
                React.createElement("div", { id: "secondBehindBottom" }, React.createElement("div", { id: "boardmessage" }, "Please reach airport well in advance to avoid last minute rush"))
              )
            )
          )
        )
      )
    );
  };
  const Header = React.createElement("div", null, React.createElement("div", { id: "headerText" }, "Your Booked Flights"));
  const DataArr = Array(Flight.length).fill(0).map(Number.call, Number);
  const App = () => {
    return React.createElement(
      "div",
      { className: "App" },
      Header,
      DataArr.map((val, i) => React.createElement(Cell, { key: i, index: i }))
    );
  };
  ReactDOM.render(React.createElement("div", null, React.createElement(App, null)), rootElement);
});
