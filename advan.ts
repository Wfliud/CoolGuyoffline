enum exter_ports2 {
    //% block="IO13/14"
    J5,
    //% block="IO15/16"
    J6
}

enum exter_ports3 {
    //% block="AD0"
    J1,
    //% block="IO1"
    J2,
    //% block="IO2"
    J3,
    //% block="IO16"
    J4,
    //% block="IO13/14"
    J5,
    //% block="IO15/16"
    J6
}

enum SoundSensor_Mode {
    //% block=语音识别
    MODE_ASR = 1,
    //% block=语音合成
    MODE_TTS = 2,
    //% block=文字对话
    MODE_WORD = 4,
    //% block=语音对话
    MODE_DIA = 8
}

enum VisionSensor_Mode {
    //% block=卡片检测
    CARD = 7,
    //% block=特定人脸检测
    FACERCG = 6,
    //% block=移动物体检测
    MOVINGOBJECT = 5,
    //% block=人脸检测
    FACE = 4,
    //% block=人体检测
    BODY = 3,
    //% block=线条检测
    LINE = 2,
    //% block=球体检测
    BALL = 1
}

enum VisionDetect_Card {
    //% block=正方形卡
    Card_Squar = 3,
    //% block=三角形卡
    Card_Trian = 2,
    //% block=圆形卡
    Card_Round = 1
}

enum VisionDetect_Others {
    //% block=特定人脸
    FACERCG = 6,
    //% block=移动物体
    MOVINGOBJECT = 5,
    //% block=人脸
    FACE = 4,
    //% block=人体
    BODY = 3,
    //% block=线条
    LINE = 2,
    //% block=球体
    BALL = 1
}

/**
 * 酷哥进阶
 */
//% weight=104 color=#ffc500 icon="\uf17b"
//% groups=['多路语音模块', '人工智能模块', 'WIFI模块']
//% block=酷哥进阶
namespace Coolguy_advan {

    //----------------------WIFI-------------------------------------
    let RevBuf = ["-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1"];
    let WIFI_Tx: SerialPin;
    let WIFI_Rx: SerialPin;

    /**
     * WIFI 初始化
     */
    //% blockId=coolguy_iCloudMemory_Serial_Init
    //% block="WIFI模块初始化%exterpin|"
    //% group=WIFI模块
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    export function iCloudMemory_Serial_Init(exterpin: exter_ports2) {
        switch (exterpin) {
            case exter_ports2.J5:
                WIFI_Tx = SerialPin.P14;
                WIFI_Rx = SerialPin.P13;
                break;
            case exter_ports2.J6:
                WIFI_Tx = SerialPin.P16;
                WIFI_Rx = SerialPin.P15;
                break;
            default:
                break;
        }
        serial.redirect(WIFI_Tx, WIFI_Rx, 9600);
        basic.pause(100);
        iCloudMemory_iCloud_Read_String("000000000000", 1);
    }

    /**
    * WIFI 设置
    * @param SSID 账号, 例如: "CoolGuyRobot"
    * @param PASSWORD 密码, 例如: robotrobot
    */
    //% blockId=coolguy_iCloudMemory_WiFi_SSIDPWD_Config
    //% block="设置WIFI帐号%SSID|密码%PASSWORD|"
    //% group=WIFI模块
    export function iCloudMemory_WiFi_SSIDPWD_Config(SSID: string, PASSWORD: string) {
        let Rcv = "";
        let buf = control.createBuffer(1);
        buf[0] = 0;
        let i: number;

        do {
            do {
                serial.writeString("#");
                serial.writeString("#");
                serial.writeString("#");

                serial.writeString(SSID);
                for (i = 0; i < 20 - SSID.length; i++) {
                    serial.writeBuffer(buf);
                }
                serial.writeString(PASSWORD);
                for (i = 0; i < 20 - PASSWORD.length; i++) {
                    serial.writeBuffer(buf);
                }
                serial.writeString("\r\n");
                basic.pause(500);

                Rcv = serial.readString();
            } while (Rcv === ""); //Serial.available() <= 0
        } while (Rcv.indexOf("OK") < 0);
    }

    /**
     * WIFI模块读取字符串
     * @param MACaddr WIFI地址, 例如: "2C3AE81ED2C1"
     * @param addr 云地址, 例如: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloud_Read_String
    //% block="从WIFI地址%MACaddr|和云地址%addr|读取字符串"
    //% addr.min=1
    //% group=WIFI模块
    export function iCloudMemory_iCloud_Read_String(MACaddr: string, addr: number): string {
        let rev = "";
        let revtmp = "";
        let Timeout = 0;

        while (serial.readString() !== "");
        //判断是否是公共云，如果是公共云则不限定其云地址，不是公共云则限定云地址为0~20之间
        if (MACaddr === "000000000000") {
            serial.writeString(MACaddr);
            serial.writeString("&R");
            serial.writeString(addr.toString() + '\r\n');
            // delay(100);

            Timeout = 0;
            do {
                revtmp = serial.readString();
                rev += revtmp;
                Timeout++;
                if (Timeout >= 30) {
                    return RevBuf[addr];
                }
                basic.pause(10);
            } while (revtmp === "");
            RevBuf[addr] = rev;
        }
        else {
            if (addr > 0 && addr < 21) {
                serial.writeString(MACaddr);
                serial.writeString("&R");
                serial.writeString(addr.toString())
                serial.writeString('\r\n');
                //basic.pause(100);

                Timeout = 0;
                do {
                    revtmp = serial.readString();
                    rev += revtmp;
                    Timeout++;
                    if (Timeout >= 30) {
                        return RevBuf[addr];
                    }
                    basic.pause(100);
                } while (revtmp === "");
                RevBuf[addr] = rev;
            }
            else {
                basic.showNumber(2);
                RevBuf[addr] = "-1";
            }
        }
        return RevBuf[addr];
    }

    /**
     * WIFI模块读取数字
     * @param MACaddr WIFI地址, 例如: "2C3AE81ED2C1"
     * @param addr 云地址, 例如: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloud_Read_Float
    //% block="从WIFI地址%MACaddr|和云地址%addr|读取数字"
    //% addr.min=1
    //% group=WIFI模块
    export function iCloudMemory_iCloud_Read_Float(MACaddr: string, addr: number): number {
        let rev = "";
        let revtmp = "";
        let Time_out = 0;

        while (serial.readString() !== "");

        //判断是否是公共云，如果是公共云则不限定其云地址，不是公共云则限定云地址为0~20之间
        if (MACaddr == "000000000000") {
            serial.writeString(MACaddr);
            serial.writeString("&R");
            serial.writeString(addr.toString() + '\r\n');
            // delay(100);

            Time_out = 0;
            do {
                revtmp = serial.readString();
                rev += revtmp;
                Time_out++;
                if (Time_out >= 30) {
                    return parseFloat(RevBuf[addr]);
                }
                basic.pause(10);
            } while (revtmp == "");
            RevBuf[addr] = rev;
        }
        else {
            if (addr > 0 && addr < 21) {
                serial.writeString(MACaddr);
                serial.writeString("&R");
                serial.writeString(addr.toString() + '\r\n');
                // delay(100);

                Time_out = 0;
                do {
                    revtmp = serial.readString();
                    rev += revtmp;
                    Time_out++;
                    if (Time_out >= 30) {
                        return parseFloat(RevBuf[addr]);
                    }
                    basic.pause(10);
                } while (revtmp == "");
                RevBuf[addr] = rev;
            } else {
                return parseFloat(RevBuf[addr]);
            }
        }
        return parseFloat(RevBuf[addr]);
    }

    /**
     * WIFI模块写字符串到云端
     * @param addr 云地址, 例如: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloud_Write_String
    //% block="写字符串%data|存到云地址%addr|"
    //% addr.min=1
    //% group=WIFI模块
    export function iCloudMemory_iCloud_Write_str(data: string, addr: number) {
        if (addr > 0 && addr < 21) {
            while (serial.readString() != "");
            serial.writeString("&W");
            serial.writeString(addr.toString());
            serial.writeString(" ");
            serial.writeString(data + '\r\n');
        }
    }

    /**
     * WIFI模块写数字到云端
     * @param addr 云地址, 例如: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloud_Write_Number
    //% block="写数字%data|存到云地址%addr|"
    //% addr.min=1
    //% group=WIFI模块
    export function iCloudMemory_iCloud_Write_num(data: number, addr: number) {
        if (addr > 0 && addr < 21) {
            while (serial.readString() != "");
            serial.writeString("&W");
            serial.writeString(addr.toString());
            serial.writeString(" ");
            serial.writeString(data.toString() + '\r\n');
        }
    }

    /**
     * WIFI模块写字符串到公共云地址
     * @param addr 云地址, 例如: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloudShare_Write_String
    //% block="写字符串%data|存到公共云地址%addr|"
    //% addr.min=1
    //% group=WIFI模块
    export function iCloudMemory_iCloudShare_Write_str(data: string, addr: number) {
        while (serial.readString() != "");
        serial.writeString("&S");
        serial.writeString("000000000000");
        serial.writeString(" ");
        serial.writeString(addr.toString());
        serial.writeString(" ");
        serial.writeString(data + '\r\n');
    }

    /**
     * WIFI模块写数字到公共云地址
     * @param addr 云地址, 例如: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloudShare_Write_Number
    //% block="写数字%data|存到公共云地址%addr|"
    //% addr.min=1
    //% group=WIFI模块
    export function iCloudMemory_iCloudShare_Write_num(data: number, addr: number) {
        while (serial.readString() != "");
        serial.writeString("&S");
        serial.writeString("000000000000");
        serial.writeString(" ");
        serial.writeString(addr.toString());
        serial.writeString(" ");
        serial.writeString(data.toString() + '\r\n');
    }

    /**
     * WIFI模块从公共云地址读取字符串
     * @param addr 云地址, 例如: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloudCommon_Read_String
    //% block="从公共云地址%addr|读取字符串"
    //% addr.min=1
    //% group=WIFI模块
    export function iCloudMemory_iCloudCommon_Read_Str(addr: number): string {
        return iCloudMemory_iCloud_Read_String("000000000000", addr);
    }

    /**
     * 从公共云地址%addr|读取数字
     * @param addr 云地址, 例如: 1
     */
    //% blockId=coolguy_iCloudMemory_iCloudCommon_Read_Number
    //% block="从公共云地址%addr|读取字符串"
    //% addr.min=1
    //% group=WIFI模块
    export function iCloudMemory_iCloudCommon_Read_Num(addr: number): number {
        return iCloudMemory_iCloud_Read_Float("000000000000", addr);
    }

    //----------------------人工智能模块------------------------------
    let SS_TX = SerialPin.P14;
    let SS_RX = SerialPin.P13;
    let i = 0, j = 0;
    let SS_valid: boolean;
    let asr_result: string;
    let buf = control.createBuffer(4);

    function SoundSensor_Search() {
        SS_valid = false;
        asr_result = "";
        let Rcvtmp = "";

        Rcvtmp = serial.readString();
        while (Rcvtmp !== "") {
            SS_valid = true;
            asr_result += Rcvtmp;
            Rcvtmp = serial.readString();
            basic.pause(2);
        }
    }

    /**
     * 模块端口选择
     */
    //% blockId=SoundSensor_SetPort
    //% block="设置人工智能语音模块端口%exterpin|"
    //% group=人工智能模块
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    export function SoundSensor_SetPort(exterpin: exter_ports2) {
        switch (exterpin) {
            case exter_ports2.J5:
                SS_TX = SerialPin.P14;
                SS_RX = SerialPin.P13;
                break;
            case exter_ports2.J6:
                SS_TX = SerialPin.P16;
                SS_RX = SerialPin.P15;
                break;
            default: break;
        }
        serial.redirect(SS_TX, SS_RX, 115200);
    }

    /**
     * 模块初始化
     */
    //% blockId=SoundSensor_WaitInit
    //% block="等待模块正常工作"
    //% group=人工智能模块
    export function SoundSensor_WaitInit(): void {
        let Rcv = "";

        do {
            do {
                buf.setNumber(NumberFormat.UInt8LE, 0, 0xff);
                buf.setNumber(NumberFormat.UInt8LE, 1, 0xfd);
                buf.setNumber(NumberFormat.UInt8LE, 2, 0x0a);
                buf.setNumber(NumberFormat.UInt8LE, 3, 0xed);
                serial.writeBuffer(buf);
                basic.pause(100);

                Rcv = serial.readString();
            } while (Rcv === "");
        } while (Rcv.indexOf("OK") < 0);
        basic.pause(100);
    }

    /**
     * 模块采集语音
     */
    //% blockId=SoundSensor_Start_conversation
    //% block="开始采集语音"
    //% group=人工智能模块
    export function SoundSensor_Start_conversation(): void {
        if (i == 0)//为了按键一直按下，只发一次数据，而不是一直发送数据。
        {
            i = 1;
            basic.pause(500);
            buf.setNumber(NumberFormat.UInt8LE, 0, 0xff);
            buf.setNumber(NumberFormat.UInt8LE, 1, 0xf7);
            buf.setNumber(NumberFormat.UInt8LE, 2, 0x01);
            buf.setNumber(NumberFormat.UInt8LE, 3, 0xed);
            serial.writeBuffer(buf);
            basic.pause(500);
        }
    }

    /**
     * 模块停止采集语音
     */
    //% blockId=SoundSensor_End_conversation
    //% block="停止采集语音"
    //% group=人工智能模块
    export function SoundSensor_End_conversation(): void {
        if (i == 1) {
            i = 0;
            basic.pause(500);
            buf.setNumber(NumberFormat.UInt8LE, 0, 0xff);
            buf.setNumber(NumberFormat.UInt8LE, 1, 0xf7);
            buf.setNumber(NumberFormat.UInt8LE, 2, 0x02);
            buf.setNumber(NumberFormat.UInt8LE, 3, 0xed);
            serial.writeBuffer(buf);
            basic.pause(500);
        }
    }

    /**
     * 按键对话
     */
    //% blockId=SoundSensor_Vocice_conversation
    //% block="按键语音对话%num|"
    //% group=人工智能模块
    export function SoundSensor_Vocice_conversation(num: number) {
        if (j == 0 && num == 1)//为了按键一直按下，只发一次数据，而不是一直发送数据。
        {
            j = 1;
            basic.pause(500);
            buf.setNumber(NumberFormat.UInt8LE, 0, 0xff);
            buf.setNumber(NumberFormat.UInt8LE, 1, 0xf7);
            buf.setNumber(NumberFormat.UInt8LE, 2, 0x01);
            buf.setNumber(NumberFormat.UInt8LE, 3, 0xed);
            serial.writeBuffer(buf);
            basic.pause(500);
        }
        if (j == 1 && num == 0) {
            j = 0;
            basic.pause(500);
            buf.setNumber(NumberFormat.UInt8LE, 0, 0xff);
            buf.setNumber(NumberFormat.UInt8LE, 1, 0xf7);
            buf.setNumber(NumberFormat.UInt8LE, 2, 0x02);
            buf.setNumber(NumberFormat.UInt8LE, 3, 0xed);
            serial.writeBuffer(buf);
            basic.pause(500);
        }
    }

    /**
     * 模块帐号密码设置
     * @param SSID 账号, 例如: "CoolGuyRobot"
     * @param PASSWORD 密码, 例如: robotrobot
     */
    //% blockId=SoundSensor_SetWiFi
    //% block="设置人工智能 帐号%SSID|密码%PASSWORD|"
    //% group=人工智能模块
    export function SoundSensor_SetWiFi(SSID: string, PASSWORD: string) {
        let Temp = control.createBuffer(1);
        Temp[0] = 0;
        let Rcv: string;

        do {
            do {
                buf.setNumber(NumberFormat.UInt8LE, 0, 0xff);
                buf.setNumber(NumberFormat.UInt8LE, 1, 0xfb);
                buf.setNumber(NumberFormat.UInt8LE, 2, 0x0a);
                buf.setNumber(NumberFormat.UInt8LE, 3, 0xed);
                serial.writeBuffer(buf);

                serial.writeString(SSID);
                for (let i = 0; i < 20 - SSID.length; i++)
                    serial.writeBuffer(Temp);
                serial.writeString(PASSWORD);
                for (let i = 0; i < 20 - PASSWORD.length; i++)
                    serial.writeBuffer(Temp);
                serial.writeString('\r\n');
                basic.pause(500);

                Rcv = serial.readString();
            } while (Rcv === "");
        } while (Rcv.indexOf("OK") < 0);
    }

    /**
     * 模块模式设置
     */
    //% blockId=SoundSensor_Setmode
    //% block="设置人工智能模式%mode|"
    //% group=人工智能模块
    export function SoundSensor_SetMode(mode: SoundSensor_Mode) {
        let modebuf = control.createBuffer(4);
        switch (mode) {
            case SoundSensor_Mode.MODE_ASR:
                modebuf[0] = 0xff;
                modebuf[1] = 0xfe;
                modebuf[2] = 0x01;
                modebuf[3] = 0xed;
                serial.writeBuffer(modebuf);
                break;
            case SoundSensor_Mode.MODE_TTS:
                modebuf[0] = 0xff;
                modebuf[1] = 0xfe;
                modebuf[2] = 0x02;
                modebuf[3] = 0xed;
                serial.writeBuffer(modebuf);
                break;
            case SoundSensor_Mode.MODE_WORD:
                modebuf[0] = 0xff;
                modebuf[1] = 0xfe;
                modebuf[2] = 0x04;
                modebuf[3] = 0xed;
                serial.writeBuffer(modebuf);
                break;
            case SoundSensor_Mode.MODE_DIA:
                modebuf[0] = 0xff;
                modebuf[1] = 0xfe;
                modebuf[2] = 0x08;
                modebuf[3] = 0xed;
                serial.writeBuffer(modebuf);
                break;
        }
        basic.pause(2000);
    }

    /**
     * 语音识别(文字对话)内容结果
     */
    //% blockId=SoundSensor_Result_flag
    //% block="有语音识别(文字对话)内容吗？"
    //% group=人工智能模块
    export function SoundSensor_Result_flag(): boolean {
        SoundSensor_Search();
        return SS_valid;
    }

    /**
     * 语音识别(文字对话)内容
     */
    //% blockId=SoundSensor_AsrResult
    //% block="读取语音识别(文字对话)内容"
    //% group=人工智能模块
    export function SoundSensor_AsrResult(): string {
        return asr_result;
    }

    /**
     * 模块发送内容
     */
    //% blockId=SoundSensor_TtsContent
    //% block="发送语音合成(文字对话)内容%str|"
    //% group=人工智能模块
    export function SoundSensor_TtsContent(str: string) {
        serial.writeString(str);
        basic.pause(2000);
    }

    //----------------------多路语音----------------------------------
    let wtr050_pin: DigitalPin;
    let tstime: number;
    function wtr050_sendbyte(val: number): void {
        let i: number;

        pins.digitalWritePin(wtr050_pin, 0);
        control.waitMicros(104);
        for (i = 0; i < 8; i++) {
            if (val & 0x01)
                pins.digitalWritePin(wtr050_pin, 1);
            else
                pins.digitalWritePin(wtr050_pin, 0);
            control.waitMicros(tstime);
            val >>= 1;
        }
        pins.digitalWritePin(wtr050_pin, 1);
        control.waitMicros(104);
    }

    /**
     * 多路语音初始化
     */
    //% blockId=coolguy_wtr050_Init
    //% block="主板%bversion|设定多路语音端口在%pin|"
    //% group=多路语音模块
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    export function wtr050_Init(bversion: BoardType, exterpin: exter_ports3) {
        if (bversion) {
            tstime = 106;
        }
        else {
            tstime = 74;
        }
        switch (exterpin) {
            case exter_ports3.J1:
                wtr050_pin = DigitalPin.P0;
                break;
            case exter_ports3.J2:
                wtr050_pin = DigitalPin.P1;
                break;
            case exter_ports3.J3:
                wtr050_pin = DigitalPin.P2;
                break;
            case exter_ports3.J4:
                wtr050_pin = DigitalPin.P16;
                break;
            case exter_ports3.J5:
                wtr050_pin = DigitalPin.P13;
                break;
            case exter_ports3.J6:
                wtr050_pin = DigitalPin.P15;
                break;
        }

        pins.digitalWritePin(wtr050_pin, 1);
        basic.pause(1000);  //wait init
    }

    /**
     * 多路语音开始记录
     * @param chan the channel of voice, eg: 1
     */
    //% blockId=coolguy_wtr050_recordstart
    //% block="开始录音在通道%chan|"
    //% chan.min=1  chan.max=6
    //% group=多路语音模块
    export function wtr050_recordstart(chan: number): void {
        wtr050_sendbyte(0xff); //1111 1111 255
        basic.pause(10);
        wtr050_sendbyte(0x55); //0101 0101 85
        basic.pause(10);
        wtr050_sendbyte(0x01); //0000 0001 1
        basic.pause(10);
        wtr050_sendbyte(chan);
        basic.pause(10);
    }

    /**
     * 多路语音停止记录
     */
    //% blockId=coolguy_wtr050_recordstop
    //% block="停止录音"
    //% chan.min=1  chan.max=6
    //% group=多路语音模块
    export function wtr050_recordstop(): void {
        wtr050_sendbyte(0xff); //1111 1111
        basic.pause(10);
        wtr050_sendbyte(0x55); //0101 0101
        basic.pause(10);
        wtr050_sendbyte(0x02); //0000 0010
        basic.pause(10);
        basic.pause(200);
    }

    /**
     * 多路语音播放记录
     * @param chan the channel of voice, eg: 1
     */
    //% blockId=coolguy_wtr050_playvoice
    //% block="播放录音在通道%chan|"
    //% chan.min=1  chan.max=6
    //% group=多路语音模块
    export function wtr050_playvoice(chan: number): void {
        wtr050_sendbyte(0xff);
        basic.pause(10);
        wtr050_sendbyte(0x55);
        basic.pause(10);
        wtr050_sendbyte(0x03);
        basic.pause(10);
        wtr050_sendbyte(chan);
        basic.pause(10);
    }

    /**
     * 多路语音停止播放
     */
    //% blockId=coolguy_wtr050_stopvoice
    //% block="停止播放"
    //% chan.min=1  chan.max=6
    //% group=多路语音模块
    export function wtr050_stopvoice(): void {
        wtr050_sendbyte(0xff);
        basic.pause(10);
        wtr050_sendbyte(0x55);
        basic.pause(10);
        wtr050_sendbyte(0x04);
        basic.pause(10);
        basic.pause(100);
    }
}