# Disk / Uygulama Yedekleme Raporu

**Wordle Game (8083) - Docker Container Yedekleme İşlemi**

---

## 1. Amaç

Staj kapsamında, sunucuda 8083 portu üzerinden yayın yapan `wordle-game` adlı projenin olası bir arıza, veri kaybı veya hatalı güncelleme durumuna karşı geri yüklenebilir bir yedeğinin alınması ve bu işlemin belgelenmesi amaçlanmıştır.

## 2. Genel Bilgiler

| Alan | Değer |
|---|---|
| Görev | 8083 portunda çalışan "wordle-game" adlı Docker container'ının yedeğinin alınması |
| Tarih | 17 Temmuz 2026 |
| Sunucu Ortamı | Bulut sunucu (Ubuntu, Docker ile servis barındırılıyor) |
| Container Adı | wordle-game |
| Image Adı | wordle-game-image:1.0 |
| Port Eşleşmesi | 0.0.0.0:8083 → 80/tcp (container içi nginx) |

## 3. Ortam Tespiti

İlk olarak sunucunun disk yapısı incelenmiştir. Sunucuda tek bir disk (`vda`, 20G) bulunduğu ve bu diskin 13G'sinin dolu, sadece 6.5G'sinin boş olduğu görülmüştür. Bu nedenle tüm diskin bit-bit (`dd` ile) imajının aynı disk üzerinde alınmasının fiziksel olarak mümkün olmadığı tespit edilmiştir.

Bunun üzerine yedekleme kapsamı, sunucunun tamamı yerine 8083 portunda çalışan projeyle sınırlandırılmıştır.

```bash
$ lsblk
vda     253:0   0  20G  0 disk
├─vda1  253:1   0   1M  0 part
└─vda2  253:2   0  20G  0 part /

$ df -h
/dev/vda2   20G   13G  6.5G  66%  /
```

## 4. Projenin Tespiti

8083 portunu dinleyen sürecin bir Docker container'ı olduğu belirlenmiş, ardından çalışan container'lar listelenerek ilgili proje tespit edilmiştir:

```bash
$ sudo lsof -i :8083
docker-pr 1788359 root  8u  IPv4  ...  TCP *:8083 (LISTEN)

$ docker ps
CONTAINER ID   IMAGE                   ...  PORTS                   NAMES
6c5f3e353b37   wordle-game-image:1.0  ...  0.0.0.0:8083->80/tcp    wordle-game
```

**Sonuç:** 8083 portundaki proje, `wordle-game-image:1.0` imajından çalışan `wordle-game` adlı container'dır.

## 5. Veri / Mount Kontrolü

Container'a host sunucudan bağlanan (bind mount / volume) bir veri klasörü olup olmadığı kontrol edilmiştir:

```bash
$ docker inspect -f '{{json .Mounts}}' wordle-game
[]
```

Sonuç boş döndüğü için container'ın hiçbir harici veri klasörüne bağlı olmadığı, tüm proje verisinin (kod, bağımlılıklar, statik dosyalar) Docker image'ının içinde bulunduğu doğrulanmıştır. Bu nedenle yedekleme işlemi, yalnızca Docker image'ının dışa aktarılması ile tamamlanabilmektedir.

## 6. Yedekleme İşlemi

### 6.1 Yedek klasörünün oluşturulması

```bash
$ mkdir -p ~/yedekler
```

### 6.2 Docker image'ının dosya olarak dışa aktarılması

```bash
$ docker save -o ~/yedekler/wordle-game-image_20260717_1413.tar wordle-game-image:1.0
```

Bu komut, image'ın tamamını (uygulama kodu, bağımlılıklar, çalışma ortamı dahil) tek bir `.tar` dosyası olarak dışa aktarır. Oluşan dosya boyutu **25 MB**'dır.

### 6.3 Container'ın çalışma parametrelerinin kaydedilmesi

Geri yükleme sırasında container'ın aynı ayarlarla tekrar başlatılabilmesi için çalışma komutu ve port eşleşmesi kayıt altına alınmıştır:

```bash
$ docker inspect wordle-game --format '{{.Config.Cmd}} {{.HostConfig.PortBindings}}'
[nginx -g daemon off;] map[80/tcp:[{invalid IP 8083}]]
```

### 6.4 Bütünlük doğrulaması (checksum)

Yedek dosyasının bozulmadığını doğrulamak ve ileride referans olması için SHA-256 checksum değeri hesaplanmıştır:

```bash
$ sha256sum ~/yedekler/wordle-game-image_*.tar > ~/yedekler/wordle-game.sha256
$ sha256sum -c ~/yedekler/wordle-game.sha256
wordle-game-image_20260717_1413.tar: OK
```

## 7. Sonuç Doğrulaması

```bash
$ ls -lh ~/yedekler/
-rw------- 1 root root 25M Jul 17 14:13 wordle-game-image_20260717_1413.tar
```

Yedek dosyası başarıyla oluşturulmuş, boyutu ve checksum değeri ile doğrulanmıştır.

## 8. Geri Yükleme Adımları (İhtiyaç Halinde)

Bir arıza durumunda aşağıdaki adımlarla proje aynı haliyle tekrar ayağa kaldırılabilir:

```bash
$ docker load -i ~/yedekler/wordle-game-image_20260717_1413.tar
$ docker run -d --name wordle-game -p 8083:80 wordle-game-image:1.0
```

## 9. Özet

- Sunucuda tek disk bulunduğu ve boş alan yetersizliği nedeniyle tüm disk yerine ilgili proje/container'ın yedeklenmesine karar verilmiştir.
- 8083 portunda çalışan proje, Docker container'ı olarak tespit edilmiştir (`wordle-game`).
- Container'da harici veri klasörü olmadığı doğrulanmış, tüm veri image içinde bulunmuştur.
- Docker image'ı `docker save` komutuyla `.tar` dosyası olarak dışa aktarılmış ve checksum ile doğrulanmıştır.
- Geri yükleme adımları test edilebilir şekilde belgelenmiştir.

---

*Hazırlayan:HASAN ŞEKER*
*Tarih: 17.07.2026*
