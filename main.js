HashMap = function() {
    this.map = [];
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

function MenuBoard() {
   this.menu_name = [];
   this.menu_cnt = [];
   this.total = 0;
}

function makeMenuBoardResponse(mb, response) {
   let newLine = "";
   let sum = 0;
   for(let i = 0; i < mb.total; i++){
      if(mb.menu_cnt[i] > 0) {
         response += newLine;
         response += mb.menu_name[i];
         response += " ";
         response += mb.menu_cnt[i];
         newLine = "\n";
         sum += mb.menu_cnt[i];
      }
   }
   response += "\n-----";
   response += "\n합계 " + sum;
   return response
}

let map = new HashMap();

function response(room, msg, sender, isGroupChat, replier, ImageDB) {
   if(msg.startsWith("주문봇")){
      msg = msg.substring(3).trim().replace(/( |\n)/gi, "");

      let response;
      let mb, order_menu, order_cnt, cnt_index;
      switch (true) {
         case msg.startsWith("시작"):
            response =
             "주문 받기를 시작합니다.\n" +
             "1. 주문봇 주문 _메뉴 (_개수)\n" +
             "2. 주문봇 취소 _메뉴 (_개수)";
            map.put(room, new MenuBoard());
            break;
         case msg.startsWith("주문"):
            mb = map.get(room);

            if(mb == null) {
               response = "주문이 시작되지 않았습니다.";
            } else {
               msg = msg.substring(2);
               order_menu = msg

               cnt_index = Number(msg.search(/[0-9]/));
               order_cnt = -1;
               if(cnt_index > 0) {
                  order_cnt = Number(msg.substring(cnt_index));
                  order_menu = msg.substring(0, cnt_index);
               }

               let i = 0;
               for(; i < mb.total; i++){
                  if(mb.menu_name[i] === order_menu){
                     if(order_cnt >= 0) mb.menu_cnt[i] += order_cnt;
                     else mb.menu_cnt[i]++;
                     break;
                  }
               }
               if(i >= mb.total) {
                  mb.menu_name[i] = order_menu;
                  if(order_cnt >= 0) mb.menu_cnt[i] = order_cnt;
                  else mb.menu_cnt[i] = 1;
                  mb.total++;
               }

               response = "<주문 리스트>\n";
               response = makeMenuBoardResponse(mb, response)
            }
            break;
         case msg.startsWith("취소"):
            mb = map.get(room);

            if(mb == null){
               response = "주문이 시작되지 않았습니다.";
            } else {
               msg = msg.substring(2);
               order_menu = msg

               cnt_index = Number(msg.search(/[0-9]/));
               order_cnt = -1;
               if(cnt_index > 0) {
                  order_cnt = Number(msg.substring(cnt_index));
                  order_menu = msg.substring(0, cnt_index);
               }

               let i = 0;
               for(; i < mb.total; i++){
                  if(mb.menu_name[i] === order_menu){
                     if(order_cnt >= 0) {
                        if(mb.menu_cnt[i] < order_cnt) mb.menu_cnt[i] = 0;
                        else mb.menu_cnt[i] -= order_cnt;
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

               response = makeMenuBoardResponse(mb, response)
            }
            break;
         case msg.startsWith("완료"):
            mb = map.get(room);

            response = "주문 받기를 완료합니다.\n\n" +
                "<최종 주문 리스트>\n";
            response = makeMenuBoardResponse(mb, response)

            map.remove(room);
            break;
         case msg.startsWith("패치노트"):
            let patchNote = "";
            patchNote += "ver3.0 2021.11.21\n";
            patchNote += " 합계 기능 추가\n";
            patchNote += " 코드 리팩토링\n";

            patchNote += "ver2.0 2020.10.11\n";
            patchNote += " 여러 카톡방에서 동시 주문 가능\n";
            patchNote += " 개행문자 무시\n";

            patchNote += "ver1.1 2020.06.10\n";
            patchNote += " 개수 입력 추가\n";

            patchNote += "ver1.0 2020.06.10\n";
            patchNote += " 주문봇 출시";

            response = patchNote;
            break;
         default:
            response =
                "사용법\n" +
                "1. 주문봇 시작\n" +
                "주문 받기를 시작합니다.\n" +
                "2. 주문봇 주문 _메뉴 (_개수)\n" +
                "주문 리스트에 해당 메뉴가 (개수만큼) 추가됩니다.\n" +
                "3. 주문봇 취소 _메뉴 (_개수)\n" +
                "주문 리스트에서 해당 메뉴가 (개수만큼) 삭제됩니다.\n" +
                "4. 주문봇 완료\n" +
                "주문 받기를 완료합니다.";
            break;
      }

      replier.reply(response);
   }
}
