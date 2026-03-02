// Hedef kelime
const hedefKelime = "SIRA";
const kutular = document.querySelectorAll(".cell");
const kutular1 = document.querySelectorAll(".cell1");

let currentRow = 0; // kaçıncı denemedeyiz
let tempCurrentRow = 0;
let maxRow = 4;

// Kontrol fonksiyonu (renkleri üretir)
function kontrolEt(hedef, girilen) {
    let hedefArr = hedef.split("");
    let girilenArr = girilen.split("");
    let sonuc = ["", "", "", ""];

    // 🟩 doğru harf + doğru yer
    for (let i = 0; i < 4; i++) {
        if (girilenArr[i] === hedefArr[i]) {
            sonuc[i] = "green";
            hedefArr[i] = null;
            girilenArr[i] = null;
        }
    }

    // 🟨 doğru harf + yanlış yer
    for (let i = 0; i < 4; i++) {
        if (girilenArr[i] !== null) {
            let index = hedefArr.indexOf(girilenArr[i]);
            if (index !== -1) {
                sonuc[i] = "gold";
                hedefArr[index] = null;
            }
        }
    }

    // ⬛ yanlış harf
    for (let i = 0; i < 4; i++) {
        if (sonuc[i] === "") {
            sonuc[i] = "gray";
        }
    }

    return sonuc;
}

function kontrolButon() {
    const input = document.getElementById("kelimeInput");
    const girilen = input.value.toUpperCase();

    if (girilen.length !== 4) {
        alert("4 harfli bir kelime girmeniz gerekiyordu. Kaybettiniz!");
        input.disabled = true;   // 🔒 input kilitle
        return;
    }

    if (currentRow > 3) {
        alert("Oyun bitti!");

    }

    if (girilen[0] !== hedefKelime[0]) {
        alert("İlk harf yanlış! Bu sorudan puan alamadınız.");


        for (let i = 0; i < 4; i++) {
            const index = currentRow * 4 + i;
            kutular[index].textContent = girilen[i];
            kutular[index].style.backgroundColor = "red";
            kutular[index].style.color = "white";
        }
        currentRow = maxRow; // kilitle
        tempCurrentRow++;
        input.disabled = true;   // 🔒 input kilitle
        return;
    }

    const renkler = kontrolEt(hedefKelime, girilen);

    // 🔑 BURASI ÇOK ÖNEMLİ
    for (let i = 0; i < 4; i++) {
        const index = currentRow * 4 + i;
        kutular[index].textContent = girilen[i];
        kutular[index].style.backgroundColor = renkler[i];
        kutular[index].style.color = "white";
    }
    if (girilen === hedefKelime) {
        alert("Tebrikler 🎉");
        currentRow = maxRow;
        input.disabled = true;   // 🔒 input kilitle
    }


    currentRow++;        // bir alt satıra geç
    tempCurrentRow++;
    input.value = "";    // input temizle
    if (currentRow === maxRow) { // kilitle
        input.disabled = true;   // 🔒 input kilitle
    }
}


// Kutulara harf ve renk basar
function kutulariBoya(kelime, renkler) {
    const kutular = document.querySelectorAll(".cell");

    for (let i = 0; i < 4; i++) {
        kutular[i].textContent = kelime[i];
        kutular[i].style.backgroundColor = renkler[i];
        kutular[i].style.color = "white";
    }
}

const board = document.getElementById("board");

function dogruyuGoster() {
    // bir alt satıra yaz
    let cevapSatiri = tempCurrentRow;


    if (cevapSatiri >= maxRow) {
        
        kutular1.backgroundColor = "green";
        for (let i = 0; i < 4; i++) {
            kutular1[i].textContent = hedefKelime[i];
            kutular1[i].style.backgroundColor = "green";
            kutular1[i].style.color = "white";
        }

        // oyunu kilitle
        document.getElementById("kelimeInput").disabled = true;
    }

    for (let i = 0; i < 4; i++) {
        const index = cevapSatiri * 4 + i;
        kutular[index].textContent = hedefKelime[i];
        kutular[index].style.backgroundColor = "green";
        kutular[index].style.color = "white";
    }
    document.getElementById("kelimeInput").disabled = true;
}



