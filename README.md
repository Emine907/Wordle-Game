# Wordle Game — Docker Kurulum Talimatları

Bu proje HTML, CSS ve JavaScript kullanılarak geliştirilmiş statik bir Wordle oyunudur.

Proje, Docker kullanılarak Nginx web sunucusu üzerinde çalıştırılmıştır. Uygulama sunucunun `8083` portundan erişilebilir durumdadır.

## Kullanılan Teknolojiler

* HTML
* CSS
* JavaScript
* Docker
* Nginx
* Linux sunucu

## Docker Yapısı

Projeyi Docker içerisinde çalıştırmak için aşağıdaki dosyalar eklenmiştir:

* `Dockerfile`: Docker image oluşturma talimatlarını içerir.
* `nginx.conf`: Nginx web sunucusunun yapılandırmasını içerir.
* `.dockerignore`: Docker image içerisine eklenmemesi gereken dosyaları belirtir.

## Gereksinimler

Projeyi çalıştıracak sistemde Git ve Docker kurulu olmalıdır.

Kurulumları kontrol etmek için:

```bash
git --version
docker --version
```

## Projenin İndirilmesi

Projeyi GitHub üzerinden klonlayın:

```bash
git clone https://github.com/Emine907/Wordle-Game.git
cd Wordle-Game
```

## Dockerfile Açıklaması

Projede kullanılan Dockerfile:

```dockerfile
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

EXPOSE 80
```

Bu yapılandırmada:

1. Hafif bir Nginx image’ı olan `nginx:alpine` kullanılır.
2. Özel Nginx yapılandırması container içerisine kopyalanır.
3. Projedeki HTML, CSS ve JavaScript dosyaları Nginx’in yayın klasörüne aktarılır.
4. Container içerisinde Nginx’in kullandığı `80` portu açılır.

## Docker Image Oluşturma

Proje dizininde aşağıdaki komutu çalıştırın:

```bash
docker build -t wordle-game-image:1.0 .
```

Bu komut:

* Projedeki `Dockerfile` dosyasını okur.
* Nginx tabanlı bir Docker image oluşturur.
* Oluşturulan image’a `wordle-game-image:1.0` adını verir.

Oluşturulan image’ı kontrol etmek için:

```bash
docker images
```

## Container Oluşturma ve Çalıştırma

Image oluşturulduktan sonra container aşağıdaki komutla başlatılır:

```bash
docker run -d \
  --name wordle-game \
  --restart unless-stopped \
  -p 8083:80 \
  wordle-game-image:1.0
```

Parametrelerin açıklamaları:

* `-d`: Container’ı arka planda çalıştırır.
* `--name wordle-game`: Container’a `wordle-game` adını verir.
* `--restart unless-stopped`: Sunucu yeniden başlatıldığında container’ın otomatik olarak başlamasını sağlar.
* `-p 8083:80`: Sunucunun `8083` portunu container içerisindeki Nginx’in `80` portuna yönlendirir.
* `wordle-game-image:1.0`: Kullanılacak Docker image’ını belirtir.

## Port Eşleştirmesi

Projede kullanılan port eşleştirmesi:

```text
Sunucu 8083 portu → Container 80 portu
```

Docker üzerinde bu eşleşme aşağıdaki şekilde görünür:

```text
0.0.0.0:8083->80/tcp
```

## Container Durumunu Kontrol Etme

Çalışan container’ları görüntülemek için:

```bash
docker ps
```

Yalnızca Wordle container’ını kontrol etmek için:

```bash
docker ps --filter name=wordle-game
```

## Uygulamaya Erişim

Uygulama tarayıcı üzerinden aşağıdaki adresle açılabilir:

```text
http://SUNUCU_IP:8083
```

Sunucu içerisinden test etmek için:

```bash
curl http://localhost:8083
```

## Container Loglarını Görüntüleme

Container loglarını görüntülemek için:

```bash
docker logs wordle-game
```

Logları canlı olarak takip etmek için:

```bash
docker logs -f wordle-game
```

Canlı log ekranından çıkmak için `Ctrl + C` kullanılabilir. Bu işlem container’ı durdurmaz.

## Container’ı Durdurma

```bash
docker stop wordle-game
```

## Container’ı Yeniden Başlatma

```bash
docker start wordle-game
```

## Container’ı Yeniden Başlatma

Çalışan container’ı yeniden başlatmak için:

```bash
docker restart wordle-game
```

## Container’ı Silme

Önce container’ı durdurun:

```bash
docker stop wordle-game
```

Ardından container’ı silin:

```bash
docker rm wordle-game
```

Tek komutla durdurup silmek için:

```bash
docker rm -f wordle-game
```

## Proje Güncellendiğinde Yeniden Yayınlama

GitHub üzerindeki değişiklikleri alın:

```bash
git pull
```

Mevcut container’ı kaldırın:

```bash
docker rm -f wordle-game
```

Docker image’ını yeniden oluşturun:

```bash
docker build -t wordle-game-image:1.0 .
```

Yeni container’ı başlatın:

```bash
docker run -d \
  --name wordle-game \
  --restart unless-stopped \
  -p 8083:80 \
  wordle-game-image:1.0
```

## Yapılan İşlemler

Projenin sunucuda çalıştırılması sırasında aşağıdaki işlemler gerçekleştirilmiştir:

1. GitHub deposu Linux sunucuya klonlandı.
2. Projenin HTML, CSS ve JavaScript dosyalarından oluşan statik bir web uygulaması olduğu belirlendi.
3. Statik dosyaları yayınlamak için Nginx web sunucusu tercih edildi.
4. Nginx Alpine tabanlı bir `Dockerfile` oluşturuldu.
5. Proje için özel `nginx.conf` yapılandırması hazırlandı.
6. Gereksiz dosyaların Docker image içerisine alınmaması için `.dockerignore` oluşturuldu.
7. `wordle-game-image:1.0` isimli Docker image oluşturuldu.
8. `wordle-game` isimli container başlatıldı.
9. Sunucunun `8083` portu container içerisindeki Nginx’in `80` portuna yönlendirildi.
10. Container durumu ve port eşleştirmesi `docker ps` komutuyla kontrol edildi.
11. Uygulamanın `8083` portundan erişilebilir olduğu doğrulandı.

## Çalışan Yapı

```text
İnternet/Tarayıcı
        |
        | Sunucu IP adresi:8083
        v
Linux sunucunun 8083 portu
        |
        | Docker port yönlendirmesi
        v
Wordle container'ının 80 portu
        |
        v
Nginx
        |
        v
HTML, CSS ve JavaScript dosyaları
```
