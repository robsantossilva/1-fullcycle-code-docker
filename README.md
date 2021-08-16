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
