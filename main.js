HashMap = function() {
    this.map = new Array();
};

HashMap.prototype = {
    put : function(key, value){
        this.map[key] = value;
    },
    get : function(key){
        return this.map[key];
    },
    remove : function(key){
         delete this.map[key];
    }
}

function menuBoard() {
   var menu_name, menu_cnt, total;
}

var map = new HashMap();

function response(room, msg, sender, isGroupChat, replier, ImageDB) {
   if(msg.startsWith("주문봇")){
      msg = msg.substring(3).trim().replace(/( |\n)/gi, "");
      var response = "사용법\n1. 주문봇 시작\n주문 받기를 시작합니다.\n2. 주문봇 주문 _메뉴 (_개수)>>\n주문 리스트에 해당 메뉴가 (개수만큼) 추가됩니다.\n3. 주문봇 취소 _메뉴 (_개수)\n주문 리스트에서 해당 메뉴가 (개수만큼) 삭제됩니다.\n4. 주문봇 완료\n주문 받기를 완료합니다.";

      if(msg.startsWith("시작")) {
         response = "주문 받기를 시작합니다.\n1. 주문봇 주문 _메뉴 (_개수)\n2. 주문봇 취소 _메뉴 (_개수)";
         var mb = new menuBoard();
         mb.menu_name = [];
         mb.menu_cnt = [];
         mb.total = 0;
         map.put(room, mb);
      } else if(msg.startsWith("주문")) {
         var mb = map.get(room);

         if(mb == null) {
            response = "주문이 시작되지 않았습니다.";
         } else {
            msg = msg.substring(2);

            var numIndex = Number(msg.search(/[0-9]/));
            var num = -1;
            if(numIndex > 0) {
               num = Number(msg.substring(numIndex));
               msg = msg.substring(0, numIndex);
            }

            var i = 0;
            for(i = 0; i < mb.total; i++){
               if(mb.menu_name[i] == msg){
                  if(num >= 0) mb.menu_cnt[i] += num;
                  else mb.menu_cnt[i]++;
                  break;
               }
            }
            if(i >= mb.total) {
               mb.menu_name[i] = msg;
               if(num >= 0) mb.menu_cnt[i] = num;
               else mb.menu_cnt[i] = 1;
               mb.total++;
            }

            response = "<주문 리스트>\n";
            var newLine = "";
            for(var i = 0; i < mb.total; i++){
               if(mb.menu_cnt[i] > 0) {
                  response += newLine;
                  response += mb.menu_name[i];
                  response += " ";
                  response += mb.menu_cnt[i];
                  newLine = "\n";
               }
            }
         }
      } else if(msg.startsWith("취소")) {
         var mb = map.get(room);

         if(mb == null){
            response = "주문이 시작되지 않았습니다.";
         } else {
            msg = msg.substring(2);

            var numIndex = Number(msg.search(/[0-9]/));
            var num = -1;
            if(numIndex > 0) {
               num = Number(msg.substring(numIndex));
               msg = msg.substring(0, numIndex);
            }

            var i = 0;
            for(i = 0; i < mb.total; i++){
               if(mb.menu_name[i] == msg){
                  if(num >= 0) {
                     if((mb.menu_cnt[i] - num) < 0) mb.menu_cnt[i] = 0;
                     else mb.menu_cnt[i] -= num;
                  }
                  else mb.menu_cnt[i]--;
                  break;
               }
            }

            if(i >= mb.total) {
               response = "주문되지 않은 메뉴입니다.\n\n<주문 리스트>\n";
            } else {
               response = "<주문 리스트>\n";
            }

            var newLine = "";
            for(var i = 0; i < mb.total; i++){
               if(mb.menu_cnt[i] > 0) {
                  response += newLine;
                  response += mb.menu_name[i];
                  response += " ";
                  response += mb.menu_cnt[i];
                  newLine = "\n";
               }
            }
         }
      } else if(msg.startsWith("완료")) {
         var mb = map.get(room);

         response = "주문 받기를 완료합니다.\n\n<최종 주문 리스트>\n";
         var newLine = "";
         for(var i = 0; i < mb.total; i++){
            if(mb.menu_cnt[i] > 0) {
               response += newLine;
               response += mb.menu_name[i];
               response += " ";
               response += mb.menu_cnt[i];
               newLine = "\n";
            }
         }

         map.remove(room);
      } else if(msg.startsWith("패치노트")) {
         var patchNote = "";
         patchNote += "ver2.0 2020.10.11\n";
         patchNote += " 여러 카톡방에서 동시 주문 가능\n";
         patchNote += " 개행문자 무시\n";
         patchNote += "ver1.1 2020.06.10\n";
         patchNote += " 개수 입력 추가\n";
         patchNote += "ver1.0 2020.06.10\n";
         patchNote += " 주문봇 출시";

         response = patchNote;
      }

      replier.reply(response);
   }
}
