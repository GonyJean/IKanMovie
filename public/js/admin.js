$(function() {
  $('.del').click(function(e) {
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-' + id)
    $.ajax({
      url: '/admin/movie/list?id=' + id,
      type: 'delete'
    }).done(function(res, req, xhr) {
      console.log(xhr.responseJSON.success);
      console.log("success");
      if (xhr.responseJSON.success == 1) {
        if (tr.length > 0) {
          tr.remove();
        }
      }
    }).fail(function() {
      console.log("error");
    }).always(function() {
      console.log("complete");
    });
  })
  $('#douban').blur(function(){
    var douban=$(this);
    var id  = douban.val();
    if (id) {
      $.ajax({
        url: 'https://api.douban.com/v2/movie/subject/'+id,
        cache:true,
        type:'get',
        dataType:'jsonp',
        crossDomain:true,
        success:function (data) {
          $('#inputTitle').val(data.title)
          $('#inputDoctor').val(data.directors[0].name)
          $('#inputCountry').val(data.countries[0])
          $('#inputPoster').val(data.images['large'])
          $('#inputYear').val(data.year)
          $('#inputSummary').val(data.summary)

        }
      })


    }

  })
})
