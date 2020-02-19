$(function(){
  
  last_message_id = $('.message:last').data("message-id");

  function buildHTML(message){
    if (message.content && message.image) {
      //data-idが反映されるようにしている
      var html = `<div class="message" data-message-id=${message.id}>
      <div class="main-content__user">
        <div class="user-name">
          ${message.user_name}
        </div>
        <div class="date">
          ${message.date}
        </div>
      </div>
      <div class="main-content__comment">
        <p class="comment">
          ${message.content}
        </p>
      </div>
      <img src=${message.image} >
    </div>`
    } else if (message.content) {
      //同様に、data-idが反映されるようにしている
      var html = `<div class="message" data-message-id=  ${message.id} > 
        <div class="main-content__user"> 
          <div class="upper-message__user-name">
            ${message.user_name}
          </div> 
           <div class="date"> 
            ${message.created_at }
          </div> 
        </div> 
        <div class="main-content__comment"> 
          <p class="comment"> 
            ${message.content}
          </p> 
        </div> 
      </div>`
    } else if (message.image) {
      //同様に、data-idが反映されるようにしている
      var html = `<div class="message" data-message-id= ${message.id} > 
        <div class="main-content__user"> 
          <div class="upper-message__user-name">
            ${message.user_name}
          </div>
          <div class="date"> 
            ${message.created_at }
          </div> 
        </div> 
        <div class="main-content__comment"> 
          <img src=" + ${message.image} + " class="lower-message__image" > 
        </div> 
        <img src=${message.image} >
      </div>`
    };
    return html;
  };


$('#new_message').on('submit', function(e){
  e.preventDefault();
  var formData = new FormData(this);
  var url = $(this).attr('action')
  $.ajax({
    url: url,
    type: "POST",
    data: formData,
    dataType: 'json',
    processData: false,
    contentType: false
  })

  .done(function(data){
    var html = buildHTML(data);
    $('.main-content').append(html);      
    $('form')[0].reset();
    $('.main-content').animate({ scrollTop: $('.main-content')[0].scrollHeight});
    $('.send-top').prop('disabled',false);
  })

  .fail(function() {
    alert("メッセージ送信に失敗しました");
  });
 })

 var reloadMessages = function() {

  //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
  last_message_id = $('.message:last').data("message-id");
  $.ajax({
    //ルーティングで設定した通りのURLを指定
    url: "api/messages",
    //ルーティングで設定した通りhttpメソッドをgetに指定
    type: 'get',
    dataType: 'json',
    //dataオプションでリクエストに値を含める
    data: {id: last_message_id}
  })
  .done(function(messages) {
   console.log(messages)
    if (messages.length !== 0) {
      //追加するHTMLの入れ物を作る
      var insertHTML = '';
      //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
      $.each(messages, function(i, message) {
        insertHTML += buildHTML(message)
      });
      //メッセージが入ったHTMLに、入れ物ごと追加
      $('.main-content').append(insertHTML);
      $('.main-content').animate({ scrollTop: $('.main-content')[0].scrollHeight});
  }
  })
  .fail(function() {
  });
  
  
};
setInterval(reloadMessages, 5000);
})