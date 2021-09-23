# Coolguy_basic_extension

Coolguy basic extension for Makecode. It's micro:bit extension board, which include basic and advanced functionalities like battery module, two DC motor drivers and 5V IO interfaces. What's more the inteface is RJ11 based, it's easy to connect by students and teachers. It can plug Ultrasonic distance module, RGB module and etc, see below for detail. 

## Feature

- Onboard battery source (powered by 3.7V rechargeable battery)
- Drive two motors simultaneously (motor interface A and B)
- Two IIC communication interfaces (serial interface A and B)
- Three dual IO interfaces（interface P1, P2, and P16）
- A multiplexing IO interface（interface P0）

## Link to product page

http://www.coolguymaker.com/uploads/download/20201208/1318331361b0545.pdf

## Hardware Preview

- ### front

![Product](https://user-images.githubusercontent.com/34023728/99958245-007d8c80-2dc4-11eb-9b37-dc60b6a1a5b9.png)

- ### back

![back view](https://user-images.githubusercontent.com/34023728/99958253-02dfe680-2dc4-11eb-87b9-5b9311b31110.png)

## Software Preview

### Motor

Using the blocks under ‘Motors’ in Coolguy_basic is the simplest way to drive a motor. In that case, you may specify the port forward or reversal separately. You may also control the little car to move forward, move backward, or turn in the speed level from 0 to 255. The two motors will both drive according to the selected speed level and direction. 

```typescript
// Move forward at speed 60 forever
basic.forever(function () {						
    Coolguy_basic.exter_motor_go(60)				
})
```

```typescript
// Move backward at speed 100 forever
basic.forever(function () {						
    Coolguy_basic.exter_motor_back(100)	
})
```

#### Stopping

The motor will stop when its speed is set to zero. However, we can also use the motor itself to generate reverse current to brake faster, which helps to perform more precise operations. Use the command `exter_motor_stop(...)` to stop braking or coast to stop.

```typescript
// rapidly brake
basic.forever(function () {		
	Coolguy_basic.exter_motor_stop()
})
```

#### Drive motors separately

If you want to perform finer control on a single motor, please use to drive each motor forward or backward. You may specify the speed level from 0 to 255, and you can select forward and reverse. If the rotation speed of the left motor is slower than the rotation speed of the right motor, the robot will rotate to the left.

```typescript
// Drive one motors forward at speed 60
basic.forever(function () {	
	Coolguy_basic.exter_motor_drive(motor_ports.J7, 60, motor_dir.FWD)
})
```

```typescript
// Drive left motor in reverse at speed 30
basic.forever(function () {	
	Coolguy_basic.exter_motor_drive(motor_ports.J7, 30, motor_dir.REV)
})
```

```typescript
// Drive forward in a leftward curve
basic.forever(function () {	
	Coolguy_basic.exter_motor_drive(motor_ports.J7, 100, motor_dir.REV)	
	Coolguy_basic.exter_motor_drive(motor_ports.J8, 130, motor_dir.FWD)
})
```

### Beeper

Connect the beeper with analog interface P0, and then the beeper module is available.

```typescript
// Buzz for 100 ms
basic.forever(function () {
	music.playTone(262, music.beat(BeatFraction.Whole))			
	basic.pause(100)
})
```

### Display digits using the digital tube

A digital tube is provided, which can be used to display expected digits using function `Segment_Init(...)`.

```typescript
// The digital tube shows the number 8
Coolguy_basic.Segment_Init(exter_ports1.J5)				
basic.forever(function () {						
    Coolguy_basic.coolguy_Set_Segment(8)					
})
```

### Ultrasonic distance measure

The extension board provides an ultrasonic sensor so that the distance between the sensor and the barrier can be measured using the function `ultrasonic_get(..)`. 

```typescript
// Read Ultrasonic values
Coolguy_basic.ultrasonic_Init(exter_ports1.J5)				
basic.forever(function () {						
    basic.showNumber(Coolguy_basic.ultrasonic_get())			
})
```

### RGB module

RGB module makes it possible to select color and brightness via RGB value. The brightness level is up to 255 with a default value of 120. Do not look directly when the brightness level is high, otherwise, eyes would be damaged. 

```typescript
// Set brightness of RGB to 100 set color blue
Coolguy_basic.coolguy_WS2812_Init(servo_ports.J2)
basic.forever(function () {
    Coolguy_basic.coolguy_WS2812_SetRGB(120, 0, 0, 255)
})
```

### Infrared remote control

The infrared remote-control module should have cooperated with the Coolguy remote controller and the infrared receiver. There are 8 channels to be selected, which can prevent channel conflicts. You may use the infrared remote controller to control the little car to move forward or backward.

```typescript
//Control the little car to move using a remote controller
Coolguy_basic.coolguy_IR_Init(exter_ports.J1)
basic.forever(function () {
    Coolguy_basic.coolguy_IR_check()
})
basic.forever(function () {
    if (Coolguy_basic.coolguy_IR_KeyValueCmp(1, remote_key.Up) == 1) {
        Coolguy_basic.exter_motor_go(255)
    } else {
        Coolguy_basic.exter_motor_stop()
    }
})
```

## License

MIT

## Supported targets

* for PXT/microbit (The metadata above is needed for package search.)

