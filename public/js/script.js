// Example starter JavaScript for disabling form submissions if there are invalid fields
$(document).ready(function(){
  $('#apply').on('click', function(){
    var title = $.trim($('#title').val());
    var address = $.trim($('#address').val());
    var mobile =  $.trim($('#mobile').val());
    var city =   $.trim($('#city').val());
    var area =    $.trim($('#area').val());
    var school=   $.trim($('#school').val());
    var level =   $.trim($('#level').val());
    var years =    $.trim($('#years').val());
    var emailReg = $.trim($('#emailReg').val());

    var isValid = true;

    if(title == ''){
      isValid = false;
      $('#errorMsg1').html('<div class="alert alert-danger">Title field is empty</div>');

    } else {
      $('#errorMsg1').html('');
    }
    if(address == ''){
      isValid = false;
      $('#errorMsg2').html('<div class="alert alert-danger">Address field is empty</div>');

    } else {
      $('#errorMsg2').html('');
    }
    if(emailReg == ''){
      isValid = false;
      $('#errorMsgR').html('<div class="alert alert-danger">Email field is empty</div>');

    } else {
      $('#errorMsgR').html('');
    }
    if(mobile == ''){
      isValid = false;
      $('#errorMsg3').html('<div class="alert alert-danger">Phone field is empty</div>');

    } else {
      $('#errorMsg3').html('');
    }
    if(city == 'c'){
      isValid = false;
      $('#errorMsg4').html('<div class="alert alert-danger">City field is empty</div>');

    } else {
      $('#errorMsg4').html('');
    }
    if(area == ''){
      isValid = false;
      $('#errorMsg5').html('<div class="alert alert-danger">Area field is empty</div>');

    } else {
      $('#errorMsg5').html('');
    }
    if(school == ''){
      isValid = false;
      $('#errorMsg6').html('<div class="alert alert-danger">School field is empty</div>');

    } else {
      $('#errorMsg6').html('');
    }
    if(level == ''){
      isValid = false;
      $('#errorMsg7').html('<div class="alert alert-danger">Level field is empty</div>');

    } else {
      $('#errorMsg7').html('');
    }
    if(years == ''){
      isValid = false;
      $('#errorMsg8').html('<div class="alert alert-danger">Level field is empty</div>');

    } else {
      $('#errorMsg8').html('');
    }


//make an ajax call for form validation
    if(isValid == true){
      var applicationData = {
        title: title,
        address: address,
        email: email,
        mobile: mobile,
        city: city,
        area: area,
        school: school,
        level: level,
        years: years

      };
      $.ajax({
        url: '/become-an-instructor',
        type: 'POST',
        data: applicationData,
        success: function(data){
              $('#title').val('');
              $('#address').val('');
              $('#email').val('');
              $('#mobile').val('');
              $('#city').val('');
              $('#area').val('');
              $('#school').val('');
              $('#level').val('');
              $('#years').val('');
        }
      })

    } else {
      return false;
    }
  })
})