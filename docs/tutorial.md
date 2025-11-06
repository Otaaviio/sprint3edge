# 📦 Guia Completo de Instalação

## Índice

1. [Requisitos](#requisitos)
2. [Configuração AWS EC2](#1️⃣-configuração-aws-ec2)
3. [Instalação FIWARE](#2️⃣-instalação-fiware)
4. [Configuração Postman](#3️⃣-configuração-postman)
5. [Setup ESP32](#4️⃣-setup-esp32)
6. [Dashboard React](#5️⃣-dashboard-react)
7. [App Mobile (Opcional)](#6️⃣-app-mobile-opcional)

---

## Requisitos

### Hardware

- ESP32 (ou acesso ao Wokwi)
- Sensor DHT22
- Sensor LDR
- LED + Resistores (330Ω e 10kΩ)
- Protoboard e jumpers

### Software

- Arduino IDE (para ESP32 físico)
- Node.js v18+ e npm
- Postman
- Conta AWS (free tier suficiente)

---

## 1️⃣ Configuração AWS EC2

### Criar Instância

1. Acesse o [AWS Console](https://console.aws.amazon.com/)
2. Navegue para **EC2 > Launch Instance**
3. Configure:
   - **Nome**: `fiware-iot-server`
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Tipo**: `t2.medium` (recomendado) ou `t2.small` (mínimo)
   - **Key pair**: Crie/selecione uma chave SSH

### Configurar Security Group

Adicione as seguintes regras de **Inbound**:

| Tipo       | Protocolo | Porta | Origem    | Descrição            |
| ---------- | --------- | ----- | --------- | -------------------- |
| SSH        | TCP       | 22    | My IP     | Acesso SSH           |
| Custom TCP | TCP       | 1883  | 0.0.0.0/0 | MQTT Broker          |
| Custom TCP | TCP       | 1026  | 0.0.0.0/0 | Orion Context Broker |
| Custom TCP | TCP       | 4041  | 0.0.0.0/0 | IoT Agent MQTT       |
| Custom TCP | TCP       | 8666  | 0.0.0.0/0 | STH-Comet            |
| Custom TCP | TCP       | 5173  | 0.0.0.0/0 | Dashboard (dev)      |

### Conectar via SSH

```bash
# Baixe sua chave .pem e ajuste permissões
chmod 400 sua-chave.pem

# Conecte à instância
ssh -i sua-chave.pem ubuntu@SEU_IP_PUBLICO_AWS
```

---

## 2️⃣ Instalação FIWARE

### Atualizar Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### Instalar Docker

```bash
# Baixar script de instalação
curl -fsSL https://get.docker.com -o get-docker.sh

# Executar instalação
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Aplicar mudanças
newgrp docker
```

### Instalar Docker Compose

```bash
sudo apt install docker-compose -y
```

### Instalar Git

```bash
sudo apt install git -y
```

### Clonar e Executar FIWARE

```bash
# Clonar repositório
git clone https://github.com/fabiocabrini/fiware.git
cd fiware

# Iniciar containers
docker compose up -d

# Verificar status
docker ps
```

**Saída esperada:**

```
CONTAINER ID   IMAGE                          STATUS
xxx            fiware/orion                   Up 30 seconds
xxx            fiware/iotagent-ul             Up 30 seconds
xxx            fiware/sth-comet               Up 30 seconds
xxx            mongo                          Up 30 seconds
xxx            eclipse-mosquitto              Up 30 seconds
```

### Testar Instalação

```bash
# Verificar Orion
curl http://localhost:1026/version

# Ou do seu computador local
curl http://SEU_IP_AWS:1026/version
```

**Resposta esperada:**

```json
{
  "orion": {
    "version": "3.x.x",
    "uptime": "0 d, 0 h, 5 m, 30 s",
    "git_hash": "...",
    "compile_time": "...",
    "compiled_by": "...",
    "compiled_in": "..."
  }
}
```

---

## 3️⃣ Configuração Postman

### Importar Collection

1. Baixe a collection do [FIWARE Descomplicado](https://github.com/fabiocabrini/fiware)
2. Abra o Postman
3. Clique em **Import** > **Upload Files**
4. Selecione o arquivo `.json` da collection

### Configurar Variáveis de Ambiente

Crie um Environment no Postman:

- `base_url`: `http://SEU_IP_AWS:1026`
- `iota_url`: `http://SEU_IP_AWS:4041`
- `sth_url`: `http://SEU_IP_AWS:8666`

### Provisionar Dispositivo

Execute a requisição **"Provisionar Dispositivo"** com este payload:

```json
{
  "devices": [
    {
      "device_id": "device001",
      "entity_name": "urn:ngsi-ld:Device:001",
      "entity_type": "Device",
      "protocol": "PDI-IoTA-UltraLight",
      "transport": "MQTT",
      "attributes": [
        { "object_id": "t", "name": "temperature", "type": "Float" },
        { "object_id": "h", "name": "humidity", "type": "Float" },
        { "object_id": "l", "name": "luminosity", "type": "Float" },
        { "object_id": "s", "name": "status", "type": "Text" }
      ],
      "commands": [
        { "name": "on", "type": "command" },
        { "name": "off", "type": "command" }
      ]
    }
  ]
}
```

### Registrar Comandos

Execute as requisições:

1. **Registrar Comando ON**
2. **Registrar Comando OFF**
3. **Criar Subscription** (para STH-Comet)

---

## 4️⃣ Setup ESP32

Ver guia detalhado: **[ESP32-SETUP.md](./ESP32-SETUP.md)**

**Resumo rápido:**

```cpp
const char* SSID = "SEU_WIFI";
const char* PASSWORD = "SUA_SENHA";
const char* BROKER_MQTT = "SEU_IP_AWS";
const int BROKER_PORT = 1883;
```

---

## 5️⃣ Dashboard React

### Instalar Dependências

```bash
cd dashboard
npm install
```

### Configurar API

Edite `dashboard/src/config.js`:

```javascript
export const API_CONFIG = {
  ORION_URL: "http://SEU_IP_AWS:1026",
  ENTITY_ID: "urn:ngsi-ld:Device:001",
};
```

### Executar Dashboard

```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 6️⃣ App Mobile (Opcional)

### Instalar MyMQTT

- **Android**: [Play Store](https://play.google.com/store/apps/details?id=at.tripwire.mqtt.client)
- **iOS**: [App Store](https://apps.apple.com/app/mymqtt/id1529660475)

### Configurar Conexão

1. Abra o MyMQTT
2. Adicione novo broker:
   - **Host**: `SEU_IP_AWS`
   - **Porta**: `1883`
   - **Client ID**: Deixe em branco (automático)
3. Conecte

### Subscrever aos Dados

Adicione subscriptions:

- `/TEF/device001/attrs/t` (Temperatura)
- `/TEF/device001/attrs/h` (Umidade)
- `/TEF/device001/attrs/l` (Luminosidade)

### Enviar Comandos

Publique mensagens:

- **Tópico**: `/TEF/device001/cmd`
- **Payload**: `device001@on|` ou `device001@off|`

---

## ✅ Checklist de Instalação

- [ ] AWS EC2 criada e configurada
- [ ] Docker e Docker Compose instalados
- [ ] FIWARE rodando (todos os containers UP)
- [ ] Postman configurado e dispositivo provisionado
- [ ] ESP32 conectado e publicando dados
- [ ] Dashboard React funcionando
- [ ] (Opcional) MyMQTT configurado

