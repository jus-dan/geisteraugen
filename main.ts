
let Kette = smartfeldAktoren.createChain(DigitalPin.P0, DigitalPin.P14, 2)

// STANDARDWERTE
// Farbe 3: Violett / Türkis
// Tempo 3: Normal
let palette = 2
let tempo = 3

let r1 = 180
let g1 = 0
let b1 = 255
let r2 = 0
let g2 = 255
let b2 = 200

// Speicherung
let letzteAenderung = 0
let speichernNoetig = false
let countdownAnzeige = -1

// --------------------------------
// GESPEICHERTE EINSTELLUNGEN LADEN
// --------------------------------

let gespeicherteFarbe = flashstorage.get("farbe")
let gespeichertesTempo = flashstorage.get("tempo")

if (gespeicherteFarbe != "") {
    let wert = parseInt(gespeicherteFarbe)
    if (wert >= 0 && wert < 10) {
        palette = wert
    }
}

if (gespeichertesTempo != "") {
    let wert = parseInt(gespeichertesTempo)
    if (wert >= 1 && wert <= 5) {
        tempo = wert
    }
}

// --------------------------------
// FARBPALLETTEN
// --------------------------------

function farbenWaehlen() {
    if (palette == 0) {
        // Grün / Blau
        r1 = 0; g1 = 255; b1 = 0
        r2 = 0; g2 = 0; b2 = 255

    } else if (palette == 1) {
        // Rot / Gelb
        r1 = 255; g1 = 0; b1 = 0
        r2 = 255; g2 = 180; b2 = 0

    } else if (palette == 2) {
        // Violett / Türkis (Favorit)
        r1 = 180; g1 = 0; b1 = 255
        r2 = 0; g2 = 255; b2 = 200

    } else if (palette == 3) {
        // Pink / Giftgrün
        r1 = 255; g1 = 0; b1 = 170
        r2 = 0; g2 = 255; b2 = 136

    } else if (palette == 4) {
        // Ultraviolett / Eisblau
        r1 = 117; g1 = 0; b1 = 255
        r2 = 0; g2 = 170; b2 = 255

    } else if (palette == 5) {
        // Höllenrot / Violett
        r1 = 255; g1 = 51; b1 = 0
        r2 = 170; g2 = 0; b2 = 255

    } else if (palette == 6) {
        // Giftgrün / Pink
        r1 = 0; g1 = 255; b1 = 68
        r2 = 255; g2 = 0; b2 = 204

    } else if (palette == 7) {
        // Orange / Cyan
        r1 = 255; g1 = 136; b1 = 0
        r2 = 0; g2 = 221; b2 = 255

    } else if (palette == 8) {
        // Magenta / Gelb
        r1 = 238; g1 = 0; b1 = 255
        r2 = 255; g2 = 255; b2 = 0

    } else {
        // Blau / Hotpink
        r1 = 68; g1 = 0; b1 = 255
        r2 = 255; g2 = 0; b2 = 136
    }
}

// --------------------------------
// BEIDE AUGEN GLEICHZEITIG FADEN
// --------------------------------

function augenFade(h: number) {
    Kette.setColorJustOne(
        0,
        Math.idiv(r1 * h, 255),
        Math.idiv(g1 * h, 255),
        Math.idiv(b1 * h, 255)
    )

    Kette.setColorJustOne(
        1,
        Math.idiv(r2 * h, 255),
        Math.idiv(g2 * h, 255),
        Math.idiv(b2 * h, 255)
    )
}

// --------------------------------
// 5 GESCHWINDIGKEITEN
// --------------------------------

function fadePause(): number {
    if (tempo == 1) return 35
    if (tempo == 2) return 25
    if (tempo == 3) return 16
    if (tempo == 4) return 10
    return 5
}

// --------------------------------
// ÄNDERUNG MERKEN
// --------------------------------

function aenderungMerken() {
    letzteAenderung = input.runningTime()
    speichernNoetig = true
    countdownAnzeige = -1
}

// --------------------------------
// TASTE A: NÄCHSTE FARBE
// --------------------------------

input.onButtonPressed(Button.A, function () {
    palette = (palette + 1) % 10
    farbenWaehlen()
    aenderungMerken()
})

// --------------------------------
// TASTE B: VORHERIGE FARBE
// --------------------------------

input.onButtonPressed(Button.B, function () {
    palette = (palette + 9) % 10
    farbenWaehlen()
    aenderungMerken()
})

// --------------------------------
// TOUCH-LOGO: TEMPO WECHSELN
// --------------------------------

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    tempo = (tempo % 5) + 1
    aenderungMerken()
})

// --------------------------------
// AUTOMATISCH SPEICHERN
// COUNTDOWN 3 - 2 - 1 - HÄKCHEN
// --------------------------------

basic.forever(function () {

    if (speichernNoetig) {
        let vergangen = input.runningTime() - letzteAenderung

        if (vergangen < 3000) {

            // Countdown berechnen
            let rest = 3 - Math.idiv(vergangen, 1000)

            // Nur aktualisieren, wenn Zahl wechselt
            if (rest != countdownAnzeige) {
                countdownAnzeige = rest
                basic.showNumber(rest, 0)
            }

        } else {

            // Einstellungen dauerhaft speichern
            flashstorage.put("farbe", "" + palette)
            flashstorage.put("tempo", "" + tempo)

            speichernNoetig = false
            countdownAnzeige = -1

            // Häkchen anzeigen
            basic.showIcon(IconNames.Yes)
            basic.pause(700)
            basic.clearScreen()
        }
    }

    basic.pause(50)
})

// --------------------------------
// STARTFARBEN AKTIVIEREN
// --------------------------------

farbenWaehlen()

// --------------------------------
// GEISTERBLICK
// SCHNELLES SYNCHRONES AUFGLÜHEN
// --------------------------------

basic.forever(function () {

    // Fade IN
    for (let h = 0; h <= 255; h += 10) {
        augenFade(h)
        basic.pause(fadePause())
    }

    // Fade OUT
    for (let h = 255; h >= 0; h -= 10) {
        augenFade(h)
        basic.pause(fadePause())
    }
})
