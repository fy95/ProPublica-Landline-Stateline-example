require([
  "lib/jquery/dist/jquery.min.js",
  "lib/landline/public/javascripts/landline.js",
  "lib/landline/public/javascripts/landline.stateline.js",
  "lib/landline/public/javascripts/states/states_packaged.js",
  "lib/raphael-min.js",
  "lib/underscore-min.js"
  ], function(){
    $(function() {
      // Initialize the map
      var map = new Landline.Stateline("#landline_container", "states");
      
      // Set up the tooltip template
      var tmpl = _.template($("#landline_tooltip_tmpl").html());

      // Add tooltips, and cache the existing style
      // to put it back in place on mouseout
      map.on('mouseover', function(e, path, data) {
        data.existingStyle = (data.existingStyle || {});
        data.existingStyle["fill"]        = path.attr("fill");
        data.existingStyle["strokeWidth"] = path.attr("stroke-width");
        path.attr("fill", "#999").attr("stroke-width", 1);
      });

      map.on('mousemove', function(e, path, data) {
        $("#landline_tooltip").html(tmpl({
            n          : data.get('n'),
            med_income : commaDelimit(census[data.fips][1]),
            moe        : census[data.fips][2]
          })).css("left", e.pageX + 20).css("top", e.pageY + 20).show();
      });

      map.on('mouseout', function(e, path, data) {
        $("#landline_tooltip").hide();
        _(data.existingStyle).each(function(v, k) {
          path.attr(k, v);
        });
      });

      // Census data convenience functions
      var incomeColor = function(income) {
        if (income < 23768) return "rgb(237,248,233)";
        if (income < 27329) return "rgb(186,228,179)";
        if (income < 30891) return "rgb(116,196,118)";
        if (income < 34452) return "rgb(49,163,84)";
        return "rgb(0,109,44)";
      };

      var commaDelimit = function(a){
        return _.isNumber(a) ? a.toString().replace(/(d)(?=(ddd)+(?!d))/g,"$1,") : "";
      };

      // Color states by income level
      _(census).each(function(ary, fips) {
        map.style(fips, "fill", incomeColor(ary[1]));
      });

      // Draw the map
      map.createMap();
    });
  }
);