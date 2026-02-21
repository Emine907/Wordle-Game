// Hedef kelime
const hedefKelime = "SEVGİ";
const kutular = document.querySelectorAll(".cell");

let currentRow = 0; // kaçıncı denemedeyiz
let tempCurrentRow = 0;
let maxRow = 5;

// Kontrol fonksiyonu (renkleri üretir)
function kontrolEt(hedef, girilen) {
    let hedefArr = hedef.split("");
    let girilenArr = girilen.split("");
    let sonuc = ["", "", "", "", ""];

    // 🟩 doğru harf + doğru yer
    for (let i = 0; i < 5; i++) {
        if (girilenArr[i] === hedefArr[i]) {
            sonuc[i] = "green";
            hedefArr[i] = null;
            girilenArr[i] = null;
        }
    }

    // 🟨 doğru harf + yanlış yer
    for (let i = 0; i < 5; i++) {
        if (girilenArr[i] !== null) {
            let index = hedefArr.indexOf(girilenArr[i]);
            if (index !== -1) {
                sonuc[i] = "gold";
                hedefArr[index] = null;
            }
        }
    }

    // ⬛ yanlış harf
    for (let i = 0; i < 5; i++) {
        if (sonuc[i] === "") {
            sonuc[i] = "gray";
        }
    }

    return sonuc;
}

function kontrolButon() {
    const input = document.getElementById("kelimeInput");
    const girilen = input.value.toUpperCase();

    if (girilen.length !== 5) {
        alert("5 harfli bir kelime girmeniz gerekiyordu. Kaybettiniz!");
        input.disabled = true;   // 🔒 input kilitle
        return;
    }

    if (currentRow > 4) {
        alert("Oyun bitti!");

    }

    if (girilen[0] !== hedefKelime[0]) {
        alert("İlk harf yanlış! Bu sorudan puan alamadınız.");


        for (let i = 0; i < 5; i++) {
            const index = currentRow * 5 + i;
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
    for (let i = 0; i < 5; i++) {
        const index = currentRow * 5 + i;
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

    for (let i = 0; i < 5; i++) {
        kutular[i].textContent = kelime[i];
        kutular[i].style.backgroundColor = renkler[i];
        kutular[i].style.color = "white";
    }
}

const board = document.getElementById("board");

// yeni satır oluşturur
function yeniSatirOlustur() {
    const row = document.createElement("div");
    row.className = "row";

    for (let i = 0; i < 5; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        row.appendChild(cell);
    }

    board.appendChild(row);
    return row;
}


function dogruyuGoster() {
    // bir alt satıra yaz
    let cevapSatiri = tempCurrentRow;


    if (cevapSatiri >= maxRow) {
        // 🆕 ALTTA YENİ SATIR OLUŞTUR
        const row = yeniSatirOlustur();
        const cells = row.querySelectorAll(".cell");

        for (let i = 0; i < 5; i++) {
            cells[i].textContent = hedefKelime[i];
            cells[i].style.backgroundColor = "green";
            cells[i].style.color = "white";
        }

        // oyunu kilitle
        document.getElementById("kelimeInput").disabled = true;
    }

    for (let i = 0; i < 5; i++) {
        const index = cevapSatiri * 5 + i;
        kutular[index].textContent = hedefKelime[i];
        kutular[index].style.backgroundColor = "green";
        kutular[index].style.color = "white";
    }
    document.getElementById("kelimeInput").disabled = true;
}



