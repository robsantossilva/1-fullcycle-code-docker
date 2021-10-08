# Docker

#### Curso Full Cycle - Módulo Docker

#### Objetivos
- O que são Containers
- Como funcionam os Containers
- Como o Docker funciona
- Principais comandos utilizando Docker
- Dockerfile
- Trabalhando com imagens Docker

##### O que são containers?
Um container é um padrão de unidade de software que empacota código e todas as dependências de uma aplicação fazendo que a mesma seja executada repidamente de forma confiavel de um ambiente computacional.

<b>Namespaces:</b> Sistemas operacionais trabalhando com base em processos, processos utilizam de Namespaces com o objetivo de isolar esse conjunto de processos (Processo pai e seus processos filhos);

Container é um processo isolado com subprocessos emulando um sistema operacional

<b>Cgroups</b>: É uma descoberta do Google que facilitou a utilização de container, resumindo: Containers não existem sem o Cgroups. 
Cgroups tem como objetivo controlar os recursos computacionais do container: Memória, CPU

<b>File System - OFS (Overlay File System)</b>: Feito para evitar a duplicidade de dependências. O Container reaproveita todo o Kernel do SO evitando ter um SO para cada container.

##### Imagens
Images Docker são compostas por sistemas de arquivos de camadas que ficam uma sobre as outras. Ela é a nossa base para construção de uma aplicação, ela pode ser desde o base do CentOS como também um CentOS com Apache, PHP e MySQL. <b>Cada arquivo torna-se reutilizavel na construção de outras imagens.</b> Cada pedaço de dessa imagem é independente. Imagem é um conjunto de dependencias encadeadas.

##### Dockerfile
Arquivo declarativos para a **construir** imagens. A criação de uma nova imagem sempre deve partir de uma imagem já existente.

``` dockerfile
FROM: ImageName
RUN: Comando ex: apt-get install
EXPOSE: 8000
```

Dockerfile --> **build** --> Image
Container --> **commit** --> Image
Dockerfile <-- **pull** <-- Image Registry
Image --> **push** --> Image Registry

![Alt text](.github/docker-1.png "Title")

#### Instalando o Docker
Docker foi feito para rodar no linux, por isso, se deseja ter alta performance use linux.
Para Windows existe o WSL que é um subsistema linux no windows.

#### Instalando WSL2
https://github.com/codeedu/wsl2-docker-quickstart

#### Comandos Docker
```bash
docker ps #Lista containers
docker run hello-world #Rodando uma imagem docker
docker run -it ubuntu bash #Modo iterativo
```

#### Publicando portas com nginx
Webserver/Proxy reverso
```bash
docker run nginx #executa o nginx
docker run -p 8080:80 nginx #(-p --detach)executa o nginx deixando a porta 80 do container disponivel na porta 8080
docker run -d -p 8080:80 nginx #(-d --detach)executa o nginx e deixa o terminal disponivel
```
#### Removendo containers
```bash
docker stop b2df619d6acf #Parar um container
docker start b2df619d6acf #Reiniciar um container
docker rm 43156aaf0cd0 #remover containers parados
docker rm b2df619d6acf -f #forçar a remoção de um container que esta em execução
docker rm $(docker ps -a -q) -f #remove todos os container
```

#### Acessando e alterando arquivos de um container
```bash
docker run -d -p 8080:80 --name nginx_01 nginx #Atribuindo um nome ao containers
docker exec nginx_01 ls # Executa o comando "ls" no container
docker exec -it nginx_01 bash # Executa comando no container e permanece no container no modo iterativo

cd /usr/share/nginx/html/
apt-get update
apt-get install vim
vim index.html
```
Container é imutavel, ao parar o container as alterações são perdidas

#### Iniciando com bind mounts
```bash
docker run -d --name nginx -p 8080:80 -v "$(pwd)"/html:/usr/share/nginx/html nginx
docker run -d --name nginx -p 8080:80 --mount type=bind,source="$(pwd)"/html,target=/usr/share/nginx/html nginx
```

#### Trabalhando com volumes
```bash
docker volume
docker volume create meuvolume
docker volume inspect meuvolume
[
    {
        "CreatedAt": "2021-08-30T14:20:50-03:00",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/meuvolume/_data",
        "Name": "meuvolume",
        "Options": {},
        "Scope": "local"
    }
]
docker run -d --name nginx -p 8080:80 --mount type=volume,source=meuvolume,target=/usr/share/nginx/html nginx
docker run -d --name nginx -p 8080:80 -v meuvolume:/usr/share/nginx/html nginx
```

#### Entendendo imagens e DockerHub
https://hub.docker.com/
``` bash
#Baixar imagem do docker hub
docker pull ubuntu 

#Lista imagens local
docker images

#Removendo imagens local
docker rmi ubuntu
```

#### Criando primeira imagem com Dockerfile
[./Dockerfile](./Dockerfile)
```bash
docker build -t robsantossilva/nginx-com-vim:latest .
docker run -it robsantossilva/nginx-com-vim bash
```

##### ENTRYPOINT vs CMD
``` Dockerfile
FROM ubuntu:latest
CMD ["echo", "Hello World"]
```

``` bash
docker build -t robsantossilva/hello:latest ./cmd
docker run robsantossilva/hello

#É possivel substituir o comando da imagem colocando outro comando após a imagem
docker run robsantossilva/hello echo "oi"
```

``` Dockerfile
FROM ubuntu:latest
ENTRYPOINT ["echo", "Hello "]
CMD ["World"]
```

``` bash
docker build -t robsantossilva/hello-2:latest ./entrypoint
docker run robsantossilva/hello-2

#É possivel substituir o comando da imagem colocando outro comando após a imagem
#Mas o entrypoint não é substituido
docker run robsantossilva/hello-2 oi
```

##### Publicando imagem no DockerHub
``` bash
docker push robsantossilva/nginx-com-vim
docker run -d -p 8080:80 robsantossilva/nginx-com-vim
```

##### Tipos de Network
- bridge
- host
- overlay
- macvlan
- none

Trabalhando com Bridge

``` bash
#lista network
docker network ls

#remove networks
docker network prune

docker run -d -it --name ubuntu1 bash
docker run -d -it --name ubuntu2 bash

docker network inspect bridge

# "Containers": {
#     "0082b32bdbd439434119e75561097a00a56a6d93cf3e9e41b69b34a3f1b72c63": {
#         "Name": "ubuntu2",
#         "EndpointID": "e285f168fc4efd3792cef3bba148c54fcc0eeb9a0e3add946c9c55804bc76c78",
#         "MacAddress": "02:42:ac:11:00:03",
#         "IPv4Address": "172.17.0.3/16",
#         "IPv6Address": ""
#     },
#     "7a6701347c469e8f36fa9a9e46bf429cb1de7aee92dc8ab0f9cefca7c26502dc": {
#         "Name": "ubuntu1",
#         "EndpointID": "0182a2f29ff11fc088ae19c784cf1ce939ad24a16479dc4ad671aea7c037ed4f",
#         "MacAddress": "02:42:ac:11:00:02",
#         "IPv4Address": "172.17.0.2/16",
#         "IPv6Address": ""
#     }
# },

docker attach ubuntu1
ip addr show
#inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0

ping 172.17.0.3
# PING 172.17.0.3 (172.17.0.3): 56 data bytes
# 64 bytes from 172.17.0.3: seq=0 ttl=64 time=0.112 ms
# 64 bytes from 172.17.0.3: seq=1 ttl=64 time=0.092 ms
# 64 bytes from 172.17.0.3: seq=2 ttl=64 time=0.136 ms
```

Criando uma nova rede
```bash
docker network create --driver bridge minharede
docker network ls
# NETWORK ID     NAME        DRIVER    SCOPE
# e39436acb50d   minharede   bridge    local

docker run -dit --name ubuntu1 --network minharede bash
docker run -dit --name ubuntu2 --network minharede bash
docker network inspect minharede
# "Containers": {
#     "50c1ffaa1b3ebfb83d72b569c2b5f5b3828898064addbf4ab2ca0ded97537b6f": {
#         "Name": "ubuntu2",
#         "EndpointID": "89bdb42568f30c8a70b2a3cc8b2f2796e797ee0455b909d1d23e5e3550ad46f9",
#         "MacAddress": "02:42:ac:14:00:03",
#         "IPv4Address": "172.20.0.3/16",
#         "IPv6Address": ""
#     },
#     "7ec8796d3df0e9cd3784aa3ef979ca2ad24c7ac6416732284cc808813088a330": {
#         "Name": "ubuntu1",
#         "EndpointID": "346924e875d64bcc5a917f0e2a08bfe06a1b429a8d7e05e9bb1d7f62ba181044",
#         "MacAddress": "02:42:ac:14:00:02",
#         "IPv4Address": "172.20.0.2/16",
#         "IPv6Address": ""
#     }
# }

docker exec -it ubuntu1 bash
ping ubuntu2
# PING ubuntu2 (172.20.0.3): 56 data bytes
# 64 bytes from 172.20.0.3: seq=0 ttl=64 time=0.486 ms
# 64 bytes from 172.20.0.3: seq=1 ttl=64 time=0.221 ms
# 64 bytes from 172.20.0.3: seq=2 ttl=64 time=0.151 ms

docker run -dit --name ubuntu3 bash
docker network connect minharede ubuntu3
```
Trabalhando com Host

```bash
# Bind da rede local com a rede do container
docker run --rm -d --name nginx --network host nginx
#http://localhost:80 -> Nginx
```

Container acessando nossa maquina
```bash
#Subindo servidor php sem docker
php -S localhost:8080

docker run --rm -it --name ubuntu --network host ubuntu bash
apt-get update
apt-get install curl -y
curl localhost:8080
# <!DOCTYPE html>
# <html lang="en">
# <head>
#     <meta charset="UTF-8">
#     <meta http-equiv="X-UA-Compatible" content="IE=edge">
#     <meta name="viewport" content="width=device-width, initial-scale=1.0">
#     <title>Docker Volume</title>
# </head>
# <body>
#     <h1>Docker volume!!!</h1>
# </body>
```

#### Colocando em prática

##### Instalando framework em um container

Gerando uma imagem docker com Laravel instalado.
```bash
docker run -it --name php php:7.4-cli bash

apt-get update
cd /var/www

php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === '756890a4488ce9024fc62c56153228907f1545c228516cbf63f885e036d37e9a59d27d63f46af1d4d07ee0f76181c7d3') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"

apt-get install libzip-dev -y
docker-php-ext-install zip

php composer.phar create-project --prefer-dist laravel/laravel laravel
```

Dockerfile criado de acordo com as etapas anteriores:
[./laravel/Dockerfile](./laravel/Dockerfile])

Executando o Dockerfile
``` bash
cd laravel
docker build -t robsantossilva/laravel:latest .
docker run --rm -d --name laravel -p 8000:8000 robsantossilva/laravel
docker logs laravel
```

Usando outra porta:
```bash
docker run --rm -d --name laravel -p 8001:8001 robsantossilva/laravel --host=0.0.0.0 --port=8001
```

Subindo no dockerhub:
``` bash
docker push robsantossilva/laravel
```

##### Criando aplicação Node.js sem o Node
``` bash
docker run --rm -it -v $(pwd)/:/usr/src/app -p 3000:3000 node:15 bash
npm init
npm install express --save
node index.js
```

##### Gerando imagem da aplicação Node.js
[./node/Dockerfile](./node/Dockerfile)

``` bash
docker build -t robsantossilva/hello-express .
docker run -p 3000:3000 robsantossilva/hello-express
docker push robsantossilva/hello-express
```

##### Multi-stage builds - Otimizando imagens
[./laravel/Dockerfile.prod](./laravel/Dockerfile.prod)
``` bash
docker build -t robsantossilva/laravel:prod . -f Dockerfile.prod
docker run -p 9000:9000 robsantossilva/laravel:prod
docker push robsantossilva/laravel
```

Colocando o Nginx para acessar o laravel
[./nginx/nginx.conf](./nginx/nginx.conf)
```bash
docker build -t robsantossilva/nginx:prod . -f Dockerfile.prod
docker network create laranet
docker run -d --network laranet --name laravel robsantossilva/laravel:prod
docker run -d --network laranet --name nginx -p 8080:80 robsantossilva/nginx:prod
```