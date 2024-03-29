// Configure the Chosen Jquery plugin for the dropdown buttons. More info found here: https://harvesthq.github.io/chosen/options.html
var config = {
    '.chosen-select': {},
    '.chosen-select-deselect': {
        allow_single_deselect: true
    },
    '.chosen-select-no-single': {
        disable_search_threshold: 10
    },
    '.chosen-select-no-results': {
        no_results_text: 'Oops, nothing found!'
    },
    '.chosen-select-width': {
        width: "95%"
    }
}
for (var selector in config) {
    $(selector).chosen(config[selector]);
}

// Change link to csv here

var url = "data/Tuition-vert.csv"

// Change the margin of error text here

var moe_text = "<small>* Margin of Error is larger than 10 percent of the total value due to small sample size. Discretion is advised when interpreting data.</small>"

// Define some variables
var dropdown_county1 = $('select.chosen-select.county1'),
    // dropdown_county2 = $('select.chosen-select.county2'),
    dropdown_town1 = $('select.chosen-select.town1'),
    // dropdown_town2 = $('select.chosen-select.town2'),
    grid = $('.grid');
    // grid2 = $('.grid2');

var county1value;
// var county2value;
var town1value;
// var town2value;

// Initially hide the second county and town divs

// $('#county2').hide();
//$('#town1').hide();
// $('#town2').hide();


// Function that adds commas to string numbers

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function moe_asterisk(first_moe, second_moe) {
    if (first_moe > 10 || second_moe > 10) {
        return "*"
    } else if (first_moe == "**" || second_moe == "**") {
        return "*"
    } else if (first_moe == "-" || second_moe == "-") {
        return "*"

    }

    else {
        return ""
    }
}

function plus_minus(change) {
    if (change > 0) {
        return "+"
    } else {
        return ""
    }
}



// Fetches the csv and initiates main function that will create each card

$.ajax({
    url: url,
    dataType: 'text',
}).done(create_cards);


var entry = [];

function create_cards(data) {


    var usedNames = [];

    // Use Papa Parse to parse the csv into json

    Papa.parse(data, {
        header: true,
        dynamicTyping: true,
        step: function(row) {



            var thisrow = row.data[0]


            //Get all unique county names, put them on a list and add them to the county dropdown


            if (usedNames.indexOf(thisrow["County"]) == -1) {
                var option = $('<option value="' + thisrow["County"] + '">' + thisrow["County"] + '</option>');
                // var option2 = $('<option value="' + thisrow["County"] + '">' + thisrow["County"] + '</option>');

                dropdown_county1.append(option);
                // dropdown_county2.append(option2);
                usedNames.push(thisrow["County"]);

            }



            //Pushes all rows of data into an array that will be used later
            entry.push(thisrow)




        },
        complete: function() {

            //Update new options for all county dropdowns
            dropdown_county1.trigger("chosen:updated");
            // dropdown_county2.trigger("chosen:updated");



            //The first county dropdown on the left side
            dropdown_county1.on('change', function(e, params) {

                //Make town and right-side county options appear
                $('#town1').show();
                // $('#county2').show();

                //Empty any previous town options
                dropdown_town1.empty();
                var emptyoption = $('<option value=""></option>');
                dropdown_town1.append(emptyoption).trigger('chosen:updated')

                //Fetches the county picked from the left-side county dropdown
                county1value = e.target.value;

                //Initiates populate_cards function
                populate_cards(county1value, grid, dropdown_town1)




            });

            // //The second county dropdown on the right side
            // dropdown_county2.on('change', function(e, params) {

            //     $('#town2').show();

            //     //Empty any previous town options
            //     dropdown_town2.empty();
            //     var emptyoption = $('<option value=""></option>');
            //     dropdown_town2.append(emptyoption).trigger('chosen:updated')

            //     //Fetches the county picked from the right-side county dropdown
            //     county2value = e.target.value;

            //     //Initiates populate_cards function
            //     populate_cards(county2value, grid2, dropdown_town2)


            // });

            //The first town dropdown on the left side
            dropdown_town1.on('change', function(e, params) {

                //Fetches the town picked from the left-side town dropdown
                town1value = e.target.value;

                //Initiates populate_cards function
                populate_cards(town1value, grid, dropdown_town1)


            })

            // //The second town dropdown on the right side
            // dropdown_town2.on('change', function(e, params) {

            //     //Fetches the town picked from the right-side town dropdown
            //     town2value = e.target.value;

            //     //Initiates populate_cards function
            //     populate_cards(town2value, grid2, dropdown_town2)



            // })



            //populate_cards function with following parameters: btn_value (the county or town picked), thegrid (the left side grid or right side grid), the dropdown (the county or town dropdown menu)

            function populate_cards(btn_value, thegrid, thedropdown) {

                //A loop that goes through the entry array created earlier 
                $.each(entry, function(index, key) {

               


                    //Goes through every row and sees if the btn_value matches either the county or the town. If it matches the town, it also checks to see if the county dropdown option matches the county. This is for towns with the same names in different counties.  
                    if ((btn_value == key["County"] && btn_value + " County" == key["ledgerstyle"]) || (btn_value == key["ledgerstyle"] && county1value == key["County"])) {



                        //Initializes the variable where all of the html will be appended
                        var gridsquares = '<div class="element-item">'


                        // Name of county/town and Margin of Error text
                        gridsquares += '<p class="name">' + key["County"] + '</p>'

                        gridsquares += '<img src="img/college.svg" width="40px"<br>'



                        // First Section

                        gridsquares += '<p><span class="bolded">In ' + key["ledgerstyle"] + ", " + key["second-ref"] + '</span> will cost <span class="bolded">$' + key["cost"].toLocaleString() + '</span> per year (not including housing), if prices continue to rise at the rate they have for the last 10 years.</p><p>This would put the four-year cost at <span class="bolded">$' + key["4year"].toLocaleString() + '.</span></p>'

                        

                        // // Second Section 



                        gridsquares += '<p>This will be <span class="bolded"> ' + key["inc-100"] + "% " + '</span> of the estimated median household income of <span class="bolded">$' + key["mi"].toLocaleString() + "</span>, should income continue to rise with the price of inflation.</p>"

                        gridsquares += '<p>Spread over an 18-year period, this would require a monthly savings of <span class="bolded">$' + key["saveinterest"].toLocaleString() + '</span> into a college fund with a 5% annual interest rate to have enough for all four years.<br>'


                        // // Third Section 


                        gridsquares += '<img src="img/loans.svg" width="40px"<br>'


                        gridsquares += '<p>The average student loan debt in New Jersey in 2017 was <span class="bolded1"> $32,254.</span> Multiple studies show it takes a typical person in the United States about <span class="bolded1">20 years</span> to pay of their student loans today. In New Jersey, that would be an annual payment of approximately <span class="bolded1">$2,534</span> each year at a <span class="bolded1">5% interest rate</span>.</p><p>Since mothers in New Jersey, on average, have their first child at <span class="bolded1">29 years-old</span>, these parents could easily still be paying off <span class="bolded1">their own</span> student loans when that child <span class="bolded1">is a teenager.</span><br>'


                        // // Fourth Section 


                        

                        // // Fifth Section

                        gridsquares += '<table><thead><tr><th><img src="img/' + key["legendfront"] + '.jpg" width="30px"></th><th>' + key["County"] + '</th><th><img src="img/' + key["legendback"] + '.jpg" width="30px"></th><th>' + key["legendtext"] + '</th></tr></thead></table>'



                        // // Sixth section

                        
                       gridsquares += '<img src="img/' + key["test"] + '.svg" width="100%">'

                        // // Fifth section

                        // gridsquares += '<img src="img/home_values.svg"><p class="crit">Home Values</p><table><thead><tr><th></th><th>2011-2015</th><th>2005-2009</th><th>Change</th></tr></thead><tbody><tr><td></td><td class="bolded">$' + addCommas(key["homevalue_latest"]) + moe_asterisk(key["homevalue_moe_latest_per"]) + '</td><td class="bolded">$' + addCommas(key["homevalue_prev"]) + moe_asterisk(key["homevalue_prev_moe_per"]) + '</td><td class="bolded">' + plus_minus(key["value_change"]) + key["value_change"].toFixed(1) + '%' + moe_asterisk(key["homevalue_prev_moe_per"]) + '</td></tr><tr><td class="separate separate2">NJ</td><td class="separate2">$' + key["nj_values_latest"].toLocaleString() + '</td><td class="separate2">$' + key["nj_values_previous"].toLocaleString() + '</td><td class="separate2">' + plus_minus(key["nj_value_change"]) + key["nj_value_change"].toFixed(1) + '%</td></tr><tr><td class="separate">US</td><td>$' + key["us_values_latest"].toLocaleString() + '</td><td>$' + key["us_values_previous"].toLocaleString() + '</td><td>' + plus_minus(key["us_value_change"]) + key["us_value_change"].toFixed(1) + '%</td></tr></tbody></table>'

                        // // Sixth section

                        // gridsquares += '<img src="img/housing_costs.svg"><p class="crit">Monthly Home Costs</p><table><thead><tr><th></th><th>2011-2015</th><th>2005-2009</th><th>Change</th></tr></thead><tbody><tr><td></td><td class="bolded">$' + addCommas(key["homecosts_latest"]) + moe_asterisk(key["homecosts_latest_moe_per"]) + '</td><td class="bolded">$' + addCommas(key["homecosts_prev"]) + moe_asterisk(key["homecosts_prev_moe_per"]) + '</td><td class="bolded">' + plus_minus(key["cost_change"]) + key["cost_change"].toFixed(1) + '%' + moe_asterisk(key["homecosts_prev_moe_per"], key["homecosts_moe_latest_per"]) + '</td></tr><tr><td class="separate separate2">NJ</td><td class="separate2">$' + key["nj_costs_latest"].toLocaleString() + '</td><td class="separate2">$' + key["nj_costs_previous"].toLocaleString() + '</td><td class="separate2">' + plus_minus(key["nj_cost_change"]) + key["nj_cost_change"].toFixed(1) + '%</td></tr><tr><td class="separate">US</td><td>$' + key["us_costs_latest"].toLocaleString() + '</td><td>$' + key["us_costs_previous"].toLocaleString() + '</td><td>' + plus_minus(key["us_cost_change"]) + key["us_cost_change"].toFixed(1) + '%</td></tr></tbody></table>'

                        // // Seventh section

                        // gridsquares += '<img src="img/poverty.svg"><p class="crit">Poverty Rate</p><table><thead><tr><th></th><th>2011-2015</th><th>2005-2009</th><th>Change</th></tr></thead><tbody><tr><td></td><td class="bolded">' + key["poverty_per_latest"].toLocaleString() + '%' + moe_asterisk(key["poverty_moe_per_latest"]) + '</td><td class="bolded">' + key["poverty_per_prev"].toLocaleString() + '%' + moe_asterisk(key["poverty_moe_per_prev"]) + '</td><td class="bolded">' + plus_minus(key["poverty_change"]) + key["poverty_change"].toFixed(1) + '%' + moe_asterisk(key["poverty_moe_per_prev"], key["poverty_moe_per_latest"]) + '</td></tr><tr><td class="separate separate2">NJ</td><td class="separate2">' + key["nj_poverty_latest"].toLocaleString() + '%</td><td class="separate2">' + key["nj_poverty_prev"].toLocaleString() + '%</td><td class="separate2">' + plus_minus(key["nj_poverty_change"]) + key["nj_poverty_change"].toFixed(1) + '%</td></tr><tr><td class="separate">US</td><td>' + key["usa_poverty_latest"].toLocaleString() + '%</td><td>' + key["usa_poverty_prev"].toLocaleString() + '%</td><td>' + plus_minus(key["usa_poverty_change"]) + key["usa_poverty_change"].toFixed(1) + '%</td></tr></tbody></table>'

                        // // Eighth section

                        // gridsquares += '<img src="img/commute.svg"><p class="crit">Avg. Commute Time</p><table><thead><tr><th></th><th>2011-2015</th><th>2005-2009</th><th>Change</th></tr></thead><tbody><tr><td></td><td class="bolded">' + key["meantime_latest"].toLocaleString() + ' min.' + moe_asterisk(key["meantime_latest_moe_per"]) + '</td><td class="bolded">' + key["meantime_prev"].toLocaleString() + ' min.' + moe_asterisk(key["meantime_prev_moe_per"]) + '</td><td class="bolded">' + plus_minus(key["time_change"]) + key["time_change"].toFixed(1) + '%' + moe_asterisk(key["meantime_prev_moe_per"]) + '</td></tr><tr><td class="separate separate2">NJ</td><td class="separate2">' + key["nj_time_latest"].toLocaleString() + '</td><td class="separate2">' + key["nj_time_previous"].toLocaleString() + '</td><td class="separate2">' + plus_minus(key["nj_time_change"]) + key["nj_time_change"].toFixed(1) + '%</td></tr><tr><td class="separate">US</td><td>' + key["us_time_latest"].toLocaleString() + '</td><td>' + key["us_time_previous"].toLocaleString() + '</td><td>' + plus_minus(key["us_time_change"]) + key["us_time_change"].toFixed(1) + '%</td></tr></tbody></table>'


                        gridsquares += '</div>'

                        //Add all card sections into the grid

                        thegrid.html(gridsquares);

                        //Send the height to Pym after all images are loaded (important for Pym!)

                        thegrid.imagesLoaded(function() {
                            pymChild.sendHeight();
                        });




                    } else if (btn_value == key["County"] && btn_value + " County" !== key["ledgerstyle"]) {


                        // Add all towns in the picked county into the town dropdown



                        var townoption = $('<option value="' + key["ledgerstyle"] + '">' + key["ledgerstyle"] + '</option>');

                        thedropdown.append(townoption);



                    }


                    // Update all dropdown menus after changes

                    // dropdown_county2.trigger('chosen:updated');
                    dropdown_county1.trigger('chosen:updated');
                    dropdown_town1.trigger("chosen:updated");
                    // dropdown_town2.trigger("chosen:updated");

                })

            }


        }


    });

    //Trigger isotope
    var $grid = $('.njam-container').isotope({
        itemSelector: '.element-item',
        layoutMode: 'fitRows'
    });

    $(window).resize(function() {

        //Resize width of dropdown menus every time you resize the window
        $(".chosen-container-single").css("width", "48%")


    });

    // Initiate pym
    var pymChild = new pym.Child();



}