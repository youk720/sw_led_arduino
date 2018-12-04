// ピン指定
#define led_1 10
#define led_2 11
#define sw 8
String sw_status = "";
String serial_result = "";


// ピン&シリアル各種設定
void setup() {
  pinMode(led_1, OUTPUT);
  pinMode(led_2, OUTPUT);
  pinMode(sw, INPUT_PULLUP);
  Serial.begin(9600);
}



void loop(){

  // スイッチ状態出力
  if(digitalRead(sw) == LOW){
    sw_status = "{\"sw\":\"False\"}";
    Serial.println(sw_status);
  }else if(digitalRead(sw) == HIGH){
    sw_status = "{\"sw\":\"True\"}";
    Serial.println(sw_status);
  }

  // LEDの入力
  // 今の所できていない
  serial_result = Serial.read();
  if(sw_status == "[ 'led_1=True', 'led_2=True' ]"){
    digitalWrite(led_1, HIGH);
    digitalWrite(led_2, HIGH);
  }else if(serial_result == "led_2=False,led_1=True"){
    digitalWrite(led_1, HIGH);
    digitalWrite(led_2, LOW);
    }else if(serial_result == "led_1=False,led_2=True"){
    digitalWrite(led_1, LOW);
    digitalWrite(led_2, HIGH);
  }else if(serial_result == "led_2=False"){
    digitalWrite(led_2, LOW);
  }else if(serial_result == "led_2=False,led_1=False"){
    digitalWrite(led_1, LOW);
    digitalWrite(led_2, LOW);
  }
}
