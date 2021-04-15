function TempTracker() {
    let temps = [],
        max = null,
        min = null,
        avg = 0,
        count = 0,
        sum = 0;
  
    this.insert = function(temperature) {
      temps.push(temperature);

      this.setMax(temperature);
      this.setMin(temperature);
      this.setAvg(temperature);

      this.updateView();
    };

    this.updateView = function() {
      var source = document.getElementById("temperature-template").innerHTML;
      var template = Handlebars.compile(source);
      var context = { tempratures: temps.join(', '), min: min, max: max, avg: avg.toFixed(2) }
      var html = template(context);

      document.getElementById('results-container').innerHTML = html;
    };

    this.setMax = function(temp) {
        // if not saving each temp value then use this
        // if (max === null || temp > max) {
        //   max = temp;
        // }
        max = Math.max(...temps);
    };
    
    this.getMax = function() {
      return max;
    };

    this.setMin = function(temp) {
      // if not saving each temp value then use this
      // if (min === null || temp < min) {
      //   min = temp;
      // }

      min = Math.min(...temps);
    }
    
    this.getMin = function() {
      return min;
    };

    this.setAvg = function(temp) {
        count = count + 1;
        sum = sum + temp

        avg = sum / count;
    }
    
    this.getAvg = function() {    
      return avg;
    };
}

function addTemps(temps) {
    for (let i in temps) {
        tracker.insert(parseInt(temps[i]));
    }
}

var tracker = new TempTracker();

addTemps([6, 7, 8, 9, 10, 15, 8, 6]);

// add custom temerature values
function addCustomTemperatures() {
  let input = document.getElementById('temperature-input'),
    values = input.value,
    temperatures = [];  

  if (values !== '') {
    temperatures = values.split(',')
          .map(item => item.trim())
          .filter(val => val !== '');

    addTemps(temperatures);
  }

  // clear input value
  input.value = '';
}