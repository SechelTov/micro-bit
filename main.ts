function follow_hand () {
    if (Tinybit.Ultrasonic_CarV2() <= min_dist) {
        Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Back, follow_speed)
    } else {
        Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Run, follow_speed)
    }
    control.waitMicros(100)
}
function turn (direction: number) {
    for (let index = 0; index < 500; index++) {
        if (hand_found == 0) {
            if (direction == 1) {
                Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_SpinRight, search_speed)
            } else {
                Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_SpinLeft, search_speed)
            }
            control.waitMicros(100)
        }
    }
}
let hand_found = 0
let search_speed = 0
let follow_speed = 0
let min_dist = 0
let max_dist = 30
min_dist = 15
follow_speed = 80
search_speed = 80
basic.forever(function () {
    // Follow Hand mode
    // Come closer to the hand if it's far (but not too far to "loose sight" on it)
    // Go further from the hand if it's too close
    while (hand_found == 1) {
        follow_hand()
    }
    Tinybit.CarCtrl(Tinybit.CarState.Car_Stop)
    // Search Hand mode
    // Turn intermittently left and right to identify a hand
    // Once identified, stop turning, and return to Follow Hand mode
    while (hand_found == 0) {
        Tinybit.CarCtrl(Tinybit.CarState.Car_Stop)
        turn(1)
        turn(-1)
        turn(-1)
        turn(1)
    }
})
basic.forever(function () {
    if (Tinybit.Ultrasonic_CarV2() <= max_dist) {
        hand_found = 1
        basic.showIcon(IconNames.Yes)
    } else {
        hand_found = 0
        basic.showIcon(IconNames.Square)
    }
})
