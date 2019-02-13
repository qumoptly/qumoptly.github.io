function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}
prefix = new Array();
prefix[-18] = 'a';
prefix[-15] = 'f';
prefix[-12] = 'p';
prefix[-9] = 'n';
prefix[-6] = 'u';
prefix[-3] = 'm';
prefix[-2] = 'c';
prefix[-1] = 'd';
prefix[0] = '';
prefix[3] = 'k';
prefix[6] = 'M';
prefix[9] = 'G';
prefix[12] = 'T';
prefix[15] = 'P';

function log10(val) {
  return Math.log(val) / Math.LN10;
}

function format_u(r, units) {
  if (units.substr(0, 1) == '~')
    return toFixed(r) + ' ' + units.substr(1, 99);
  else {
    nopr = (units.substr(0, 1) == '&');
    if (nopr) units = units.substr(1, 99);
    if(units == "") nopr = true;
    var e = 0;
    if (Math.abs(r) >= 1e-30) {
      e = 3 * Math.floor((log10(Math.abs(r)) + 1e-6) / 3);
      if(nopr && (e == -3) && (Math.abs(r) > 0.1))
        e = 0;
      }
    if ((e >= -18) && (e <= 15) && !nopr)
      pr = ' ' + prefix[e];
    else if (e != 0)
      pr = 'e' + e.toString() + ' ';
    else
      pr = ' ';
    if (e != 0) r = r / Math.pow(10, e);
    var s = r.toPrecision(3);
    if (s.indexOf('.') >= 0) {
      while(s.substr(s.length - 1) == '0')
        s = s.substr(0, s.length - 1);
      if(s.substr(s.length - 1) == '.')
        s = s.substr(0, s.length - 1);
      }
    s = s.replace('NaN', '???');
    s = s + pr + units;
    if (s.substr(s.length - 1, 1) == ' ') s = s.substr(0, s.length - 1);
    return s;
    }
  }

function fval(s, units) {
  // alert('fval(' + s + ', ' + units + '):');
  if (s.indexOf(',') >= 0)
    alert('Commas not allowed in inputs - use decimal points (".")!');
  units = units.replace('&', '');
  s = s.replace(units, '').replace(/ /g, '').replace('\u00B5', 'u');
  // alert('s = ' + s);
  var e = 0;
  for(var j = -18; j <= 15; j++) {
    // var p = prefix[Math.round(j)];
    // if (!p && (j == -6)) alert('j = ' + j + ', p = ' + p + ', prefix[j] = ' + prefix[j]);
    // if(p && (p != '') && (s.substr(s.length - 1) == p)) {
    if(s.substr(s.length - 1) == prefix[j]) {
      e = e + j;
      s = s.substr(0, s.length - 1);
      }
    }
  if (units.substr(1, 1) == '^') // e.g. 'mm^2' = 1E-6 m^2, not 1E-3 m^2
    if (units.substr(2, 1) == '-')
      e = parseInt(units.substr(2, 2)) * e;
    else
      e = parseInt(units.substr(2, 1)) * e;
  return parseFloat(s) * Math.pow(10, e);
  }

// alert(fval('5 µm', 'm'));
// alert(fval('5 µm', 'm'));

function GetFieldValues(not_field, calculatorname) {
  inp = $('input.cf_' + calculatorname);
  for(var j = 0; j < inp.length; j++) {
    if(inp[j].name != not_field) eval(inp[j].name + '=' + fval(inp[j].value, funits[inp[j].name]));
    }
  }

function inv(x) {
  if(Math.abs(x) >= 1e-30)
    return 1 / x;
  else
    return 0;
  }

function sqr(x) { return x*x; }
function sin(x) { return Math.sin(x); }
function cos(x) { return Math.cos(x); }
function tan(x) { return Math.tan(x); }

pi = Math.PI;
c0 = 2.9979e8;
