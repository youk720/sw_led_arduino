# 各種ライブラリ導入
import subprocess
import RPi.GPIO as GPIO
import time

#参考サイト
#https://stackoverflow.com/questions/26000336/execute-curl-command-within-a-python-script
#https://qiita.com/ktanaka117/items/596febd96a63ae1431f8
#
# スイッチピン定義
sw = 19

# LEDピン設定
led = 27
led_2 = 17

#GPIO各種設定
GPIO.setmode(GPIO.BCM)
GPIO.setup(sw, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(led, GPIO.OUT)
GPIO.setup(led_2, GPIO.OUT)

# LED初期発光防止用
GPIO.output(led, GPIO.LOW)
GPIO.output(led_2, GPIO.LOW)

# フラグ初期設定
on_status = True
off_status = True

# IPアドレス定義
ip = 'http://xxxxxxx:8000'

# 念の為正常に動作を確認するためログ出す
print('\n' + "SW Start")

cmd = "curl -X GET %s/led" % (ip)

# While無限回し
while True:
    # GPIO値を代入
    pin_status = GPIO.input(sw)
    try:
        devnull = open('/dev/null', 'w')
        # 上記で定義したコマンドをsubprocessで実行(コマンドラインで動かすのと同一のやり方)
        prog = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=devnull)

        result =  prog.stdout.decode('utf-8')

        print(result)

        if 'led_1=True' in result and 'led_2=True' in result:
            GPIO.output(led, GPIO.HIGH)
            GPIO.output(led_2, GPIO.HIGH)
            # if文入っているかのデバック用
            # print("\n" + "hoge_3")
        # LED発光のためのif文
        # if (A) in B:のような書き方で,Bの中にAが含まれているかを判定し,Trueの場合,if文以下インデントのコードを実行
        elif 'led_1=True' in result:
            GPIO.output(led, GPIO.HIGH)
            GPIO.output(led_2, GPIO.LOW)
            # if文入っているかのデバック用
            # print("\n" + "hoge_1")
        # LED発光のためのif文
        elif 'led_2=True' in result:
            GPIO.output(led, GPIO.LOW)
            GPIO.output(led_2, GPIO.HIGH)

            # if文入っているかのデバック用
            # print("\n" + "hoge_2")

        # それ以外の操作で、LEDを切る
        else:
            GPIO.output(led, GPIO.LOW)
            GPIO.output(led_2, GPIO.LOW)
            # if文入っているかのデバック用
            # print("\n" + "hoge_4")

        # 以下ONだった時の制御
        if pin_status == 1:
            # フラグがTrueの時のみ実行(重複処理防止のため)
            if on_status == True:
                #ONの反応をsubprocessでcurlをmac側へ叩く
                subprocess.Popen(['curl',
                                # 以下HTTPメソッド指定
                                 '-X',
                                 'POST',
                                 # 以下で上記で定義したIPアドレスを文字列へ代入
                                 '%s' % (ip),
                                 '-H',
                                 'Accept: application/json',
                                 # POSTフォーマットをJSONに指定
                                 '-H',
                                 'Content-type: application/json',
                                 # 以下Mac側へ送る値(データ)
                                 '-d',
                                 '{ "sw" : "True" }'])
                                 # TrueでMac側で流れるメロディを再生させる
                # フラグ管理(これにより重複を避ける)
                on_status = False
                off_status = True
        # 以下OFFの時の
        if pin_status == 0:
            # フラグがTrueの時のみ実行(重複処理防止のため)
            if off_status == True:
                #OFFの反応をsubprocessでcurlをmac側へ叩く
                subprocess.Popen(['curl',
                                # 以下HTTPメソッド指定
                                 '-X',
                                 'POST',
                                 # 以下で上記で定義したIPアドレスを文字列へ代入
                                 '%s' % (ip),
                                 '-H',
                                 'Accept: application/json',
                                 # POSTフォーマットをJSONに指定
                                 '-H',
                                 'Content-type: application/json',
                                 # 以下Mac側へ送る値(データ)
                                 '-d',
                                 '{ "sw" : "False" }'])
                                 # FalseでMac側で流れるメロディを止める
                # フラグ管理
                # これにより重複を避ける
                on_status = True
                off_status = False
    # Curl+Cで実行を止めた時に動かす処理
    except KeyboardInterrupt:
        # GPIOの終了処理
        GPIO.cleanup()
        # 終わったというログ出し(改行しないと読みにくい)
        print('\n' + "Over SW test")
